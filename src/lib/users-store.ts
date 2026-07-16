import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { prisma } from "@/lib/prisma";

export const defaultUserId = "local-user";
export const currentUserIdCookieName = "kotopoke_current_user_id";
const passwordMinLength = 8;

type StoredUser = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

function toUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    createdAt: user.createdAt,
  };
}

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]{2,29}$/.test(slug);
}

function generateRecoveryCode() {
  return randomBytes(24).toString("base64url");
}

function hashRecoveryCode(recoveryCode: string) {
  return createHash("sha256").update(recoveryCode).digest("hex");
}

function isValidPassword(password: string) {
  return password.length >= passwordMinLength && password.length <= 128;
}

export async function setCurrentUserCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(currentUserIdCookieName, userId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function getCurrentUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(currentUserIdCookieName)?.value ?? defaultUserId;
}

async function getDefaultUser() {
  const user = await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {
      name: "名無しさん",
      slug: "default-user",
    },
    create: {
      id: defaultUserId,
      name: "名無しさん",
      slug: "default-user",
    },
  });

  return toUser(user);
}

export async function getCurrentUser(): Promise<User> {
  const currentUserId = await getCurrentUserId();
  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
  });

  return user ? toUser(user) : getDefaultUser();
}

export async function createUser(input: {
  name: string;
  slug: string;
  password: string;
}): Promise<{
  user: User;
  recoveryCode: string;
} | null> {
  const name = input.name.trim();
  const slug = normalizeSlug(input.slug);
  const password = input.password;

  if (
    !name ||
    name.length > 40 ||
    !isValidSlug(slug) ||
    !isValidPassword(password)
  ) {
    return null;
  }

  const recoveryCode = generateRecoveryCode();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      slug,
      passwordHash,
      recoveryCodeHash: hashRecoveryCode(recoveryCode),
    },
  });

  return {
    user: toUser(user),
    recoveryCode,
  };
}

export async function getUserBySlug(slug: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      slug: normalizeSlug(slug),
    },
  });

  return user ? toUser(user) : null;
}

export async function authenticateUser(input: {
  slug: string;
  password: string;
}): Promise<User | null> {
  const slug = normalizeSlug(input.slug);
  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
  });

  if (!user?.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);

  return isValid ? toUser(user) : null;
}

export async function resetPasswordWithRecoveryCode(input: {
  slug: string;
  recoveryCode: string;
  password: string;
}): Promise<User | null> {
  const slug = normalizeSlug(input.slug);

  if (!input.recoveryCode || !isValidPassword(input.password)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
  });

  if (!user?.recoveryCodeHash) {
    return null;
  }

  if (hashRecoveryCode(input.recoveryCode) !== user.recoveryCodeHash) {
    return null;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash,
    },
  });

  return toUser(updatedUser);
}
