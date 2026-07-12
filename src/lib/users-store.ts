import { createHash, randomBytes, randomUUID } from "node:crypto";
import { User } from "@/types/user";
import { prisma } from "@/lib/prisma";

export const defaultUserId = "local-user";

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

export async function getCurrentUser(): Promise<User> {
  const user = await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {
      name: "ローカルユーザー",
      slug: "local-user",
    },
    create: {
      id: defaultUserId,
      name: "ローカルユーザー",
      slug: "local-user",
    },
  });

  return toUser(user);
}

export async function createUser(input: {
  name: string;
  slug: string;
}): Promise<{
  user: User;
  recoveryCode: string;
} | null> {
  const name = input.name.trim();
  const slug = normalizeSlug(input.slug);

  if (!name || name.length > 40 || !isValidSlug(slug)) {
    return null;
  }

  const recoveryCode = generateRecoveryCode();
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      slug,
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
