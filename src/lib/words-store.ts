import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/users-store";

type PrismaWord = {
  id: string;
  text: string;
  reading: string | null;
  source: string | null;
  meaning: string | null;
  impression: string | null;
  relatedWords: string;
  collectedAt: string;
};

function parseRelatedWords(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((word): word is string => typeof word === "string")
      : [];
  } catch {
    return [];
  }
}

function toWord(word: PrismaWord): Word {
  return {
    id: word.id,
    text: word.text,
    reading: word.reading ?? undefined,
    source: word.source ?? undefined,
    meaning: word.meaning ?? undefined,
    impression: word.impression ?? undefined,
    relatedWords: parseRelatedWords(word.relatedWords),
    collectedAt: word.collectedAt,
  };
}

function toNullable(value: string | undefined) {
  return value ?? null;
}

export const wordsPageSize = 10;

export async function getWords(): Promise<Word[]> {
  const user = await getCurrentUser();
  const words = await prisma.word.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      collectedAt: "desc",
    },
  });

  return words.map(toWord);
}

export async function getWordsPage(page: number): Promise<{
  words: Word[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const user = await getCurrentUser();
  const totalCount = await prisma.word.count({
    where: {
      userId: user.id,
    },
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / wordsPageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const words = await prisma.word.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      collectedAt: "desc",
    },
    skip: (currentPage - 1) * wordsPageSize,
    take: wordsPageSize,
  });

  return {
    words: words.map(toWord),
    totalCount,
    currentPage,
    totalPages,
  };
}

export async function getWord(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const word = await prisma.word.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  return word ? toWord(word) : null;
}

export async function createWord(input: WordInput): Promise<Word> {
  const user = await getCurrentUser();
  const word = await prisma.word.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      text: input.text,
      reading: toNullable(input.reading),
      source: toNullable(input.source),
      meaning: toNullable(input.meaning),
      impression: toNullable(input.impression),
      relatedWords: JSON.stringify([]),
      collectedAt: new Date().toISOString().slice(0, 10),
    },
  });

  return toWord(word);
}

export async function updateWord(
  id: string,
  input: WordInput,
): Promise<Word | null> {
  const user = await getCurrentUser();
  const currentWord = await prisma.word.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!currentWord) {
    return null;
  }

  const word = await prisma.word.update({
    where: { id },
    data: {
      text: input.text,
      reading: toNullable(input.reading),
      source: toNullable(input.source),
      meaning: toNullable(input.meaning),
      impression: toNullable(input.impression),
    },
  });

  return toWord(word);
}
