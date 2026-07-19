import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";
import { getKanaReading } from "@/lib/kana-reading-store";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/users-store";
import { formatWordNetMeanings, searchWordNet } from "@/lib/wordnet-store";

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

function getTodayKey() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getStableIndex(seed: string, size: number) {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash % size;
}

async function getWordNetFields(
  text: string,
  currentReading?: string | null,
  currentMeaning?: string | null,
) {
  const wordNetResult = await searchWordNet(text);
  const reading = currentReading ?? (await getKanaReading(text));

  return {
    reading,
    meaning:
      currentMeaning ??
      (wordNetResult ? formatWordNetMeanings(wordNetResult.meanings) : undefined),
    relatedWords: wordNetResult?.relatedWords ?? [],
  };
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

export async function getWordsPageByUserId(
  userId: string,
  page: number,
): Promise<{
  words: Word[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const totalCount = await prisma.word.count({
    where: {
      userId,
    },
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / wordsPageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const words = await prisma.word.findMany({
    where: {
      userId,
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

export async function getTodaysWord(): Promise<Word | null> {
  const user = await getCurrentUser();
  const totalCount = await prisma.word.count({
    where: {
      userId: user.id,
    },
  });

  if (totalCount === 0) {
    return null;
  }

  const skip = getStableIndex(`${user.id}:${getTodayKey()}`, totalCount);
  const word = await prisma.word.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: [{ collectedAt: "desc" }, { id: "asc" }],
    skip,
  });

  return word ? toWord(word) : null;
}

async function addMissingDictionaryFields(word: PrismaWord): Promise<Word> {
  const parsedRelatedWords = parseRelatedWords(word.relatedWords);

  if (word.reading && (word.meaning || parsedRelatedWords.length > 0)) {
    return toWord(word);
  }

  const wordNetFields = await getWordNetFields(
    word.text,
    word.reading,
    word.meaning,
  );

  if (
    !wordNetFields.reading &&
    !wordNetFields.meaning &&
    wordNetFields.relatedWords.length === 0
  ) {
    return toWord(word);
  }

  const updatedWord = await prisma.word.update({
    where: { id: word.id },
    data: {
      reading: toNullable(wordNetFields.reading),
      meaning: toNullable(wordNetFields.meaning),
      relatedWords: JSON.stringify(wordNetFields.relatedWords),
    },
  });

  return toWord(updatedWord);
}

export async function getOwnWord(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const word = await prisma.word.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!word) {
    return null;
  }

  return addMissingDictionaryFields(word);
}

export async function getWord(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const word = await prisma.word.findFirst({
    where: {
      id,
      OR: [
        {
          userId: user.id,
        },
        {
          user: {
            isPublic: true,
          },
        },
      ],
    },
  });

  if (!word) {
    return null;
  }

  return addMissingDictionaryFields(word);
}

export async function canEditWord(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  const word = await prisma.word.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  return Boolean(word);
}

export async function createWord(input: WordInput): Promise<{
  word: Word;
  created: boolean;
}> {
  const user = await getCurrentUser();
  const existingWord = await prisma.word.findFirst({
    where: {
      userId: user.id,
      text: input.text,
    },
  });

  if (existingWord) {
    return {
      word: toWord(existingWord),
      created: false,
    };
  }

  const wordNetFields = await getWordNetFields(
    input.text,
    input.reading,
    input.meaning,
  );
  const word = await prisma.word.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      text: input.text,
      reading: toNullable(wordNetFields.reading),
      source: toNullable(input.source),
      meaning: toNullable(wordNetFields.meaning),
      impression: toNullable(input.impression),
      relatedWords: JSON.stringify(wordNetFields.relatedWords),
      collectedAt: new Date().toISOString().slice(0, 10),
    },
  });

  return {
    word: toWord(word),
    created: true,
  };
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

export async function updateWordReflection(
  id: string,
  input: Pick<WordInput, "source" | "impression">,
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
      source: toNullable(input.source),
      impression: toNullable(input.impression),
    },
  });

  return toWord(word);
}

export async function deleteWord(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  const currentWord = await prisma.word.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!currentWord) {
    return false;
  }

  await prisma.word.delete({
    where: { id },
  });

  return true;
}
