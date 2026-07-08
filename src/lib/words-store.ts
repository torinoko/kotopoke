import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";
import { prisma } from "@/lib/prisma";

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

export async function getWords(): Promise<Word[]> {
  const words = await prisma.word.findMany({
    orderBy: {
      collectedAt: "desc",
    },
  });

  return words.map(toWord);
}

export async function getWord(id: string): Promise<Word | null> {
  const word = await prisma.word.findUnique({
    where: { id },
  });

  return word ? toWord(word) : null;
}

export async function createWord(input: WordInput): Promise<Word> {
  const word = await prisma.word.create({
    data: {
      id: randomUUID(),
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
  const currentWord = await prisma.word.findUnique({
    where: { id },
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
