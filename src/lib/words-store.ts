import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";
import { getKanaReading } from "@/lib/kana-reading-store";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/users-store";
import { formatWordNetMeanings, searchWordNet } from "@/lib/wordnet-store";

type PrismaUserKotoba = {
  id: string;
  reading: string | null;
  source: string | null;
  meaning: string | null;
  impression: string | null;
  collectedAt: string;
  kotoba: {
    id: string;
    text: string;
    defaultReading: string | null;
    defaultMeaning: string | null;
  };
};

function toWord(userKotoba: PrismaUserKotoba, relatedWords: string[] = []): Word {
  return {
    id: userKotoba.id,
    text: userKotoba.kotoba.text,
    reading: userKotoba.reading ?? userKotoba.kotoba.defaultReading ?? undefined,
    source: userKotoba.source ?? undefined,
    meaning: userKotoba.meaning ?? userKotoba.kotoba.defaultMeaning ?? undefined,
    impression: userKotoba.impression ?? undefined,
    relatedWords,
    collectedAt: userKotoba.collectedAt,
  };
}

function toNullable(value: string | undefined) {
  return value ?? null;
}

function normalizeOptionalText(value: string | null | undefined) {
  return value?.trim() || undefined;
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

async function getDictionaryFields(
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

async function getOrCreateKotoba(input: {
  text: string;
  reading?: string;
  meaning?: string;
}) {
  const dictionaryFields = await getDictionaryFields(
    input.text,
    input.reading,
    input.meaning,
  );
  const existingKotoba = await prisma.kotoba.findUnique({
    where: {
      text: input.text,
    },
  });

  if (!existingKotoba) {
    return prisma.kotoba.create({
      data: {
        id: randomUUID(),
        text: input.text,
        defaultReading: toNullable(dictionaryFields.reading),
        defaultMeaning: toNullable(dictionaryFields.meaning),
      },
    });
  }

  if (
    (!existingKotoba.defaultReading && dictionaryFields.reading) ||
    (!existingKotoba.defaultMeaning && dictionaryFields.meaning)
  ) {
    return prisma.kotoba.update({
      where: {
        id: existingKotoba.id,
      },
      data: {
        defaultReading:
          existingKotoba.defaultReading ?? toNullable(dictionaryFields.reading),
        defaultMeaning:
          existingKotoba.defaultMeaning ?? toNullable(dictionaryFields.meaning),
      },
    });
  }

  return existingKotoba;
}

async function getOrCreateKotobaSense(input: {
  kotobaId: string;
  reading?: string | null;
}) {
  const reading = normalizeOptionalText(input.reading);

  if (!reading) {
    return null;
  }

  const existingSense = await prisma.kotobaSense.findFirst({
    where: {
      kotobaId: input.kotobaId,
      reading,
    },
  });

  if (existingSense) {
    return existingSense;
  }

  return prisma.kotobaSense.create({
    data: {
      id: randomUUID(),
      kotobaId: input.kotobaId,
      reading,
    },
  });
}

const userKotobaInclude = {
  kotoba: true,
} as const;

export const wordsPageSize = 10;

export async function getWords(): Promise<Word[]> {
  const user = await getCurrentUser();
  const words = await prisma.userKotoba.findMany({
    where: {
      userId: user.id,
    },
    include: userKotobaInclude,
    orderBy: {
      collectedAt: "desc",
    },
  });

  return words.map((word) => toWord(word));
}

export async function getWordsPage(page: number): Promise<{
  words: Word[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const user = await getCurrentUser();
  const totalCount = await prisma.userKotoba.count({
    where: {
      userId: user.id,
    },
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / wordsPageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const words = await prisma.userKotoba.findMany({
    where: {
      userId: user.id,
    },
    include: userKotobaInclude,
    orderBy: [{ collectedAt: "desc" }, { id: "asc" }],
    skip: (currentPage - 1) * wordsPageSize,
    take: wordsPageSize,
  });

  return {
    words: words.map((word) => toWord(word)),
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
  const totalCount = await prisma.userKotoba.count({
    where: {
      userId,
    },
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / wordsPageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const words = await prisma.userKotoba.findMany({
    where: {
      userId,
    },
    include: userKotobaInclude,
    orderBy: [{ collectedAt: "desc" }, { id: "asc" }],
    skip: (currentPage - 1) * wordsPageSize,
    take: wordsPageSize,
  });

  return {
    words: words.map((word) => toWord(word)),
    totalCount,
    currentPage,
    totalPages,
  };
}

export async function getTodaysWord(): Promise<Word | null> {
  const where = {
    user: {
      isPublic: true,
    },
  };
  const totalCount = await prisma.userKotoba.count({
    where,
  });

  if (totalCount === 0) {
    return null;
  }

  const skip = getStableIndex(getTodayKey(), totalCount);
  const word = await prisma.userKotoba.findFirst({
    where,
    include: userKotobaInclude,
    orderBy: [{ collectedAt: "desc" }, { id: "asc" }],
    skip,
  });

  return word ? toWord(word) : null;
}

async function addMissingDictionaryFields(
  userKotoba: PrismaUserKotoba,
): Promise<Word> {
  const word = toWord(userKotoba);
  const dictionaryFields = await getDictionaryFields(
    word.text,
    word.reading,
    word.meaning,
  );

  if (
    (!userKotoba.kotoba.defaultReading && dictionaryFields.reading) ||
    (!userKotoba.kotoba.defaultMeaning && dictionaryFields.meaning)
  ) {
    await prisma.kotoba.update({
      where: {
        id: userKotoba.kotoba.id,
      },
      data: {
        defaultReading:
          userKotoba.kotoba.defaultReading ??
          toNullable(dictionaryFields.reading),
        defaultMeaning:
          userKotoba.kotoba.defaultMeaning ?? toNullable(dictionaryFields.meaning),
      },
    });
  }

  if (
    (!userKotoba.reading && dictionaryFields.reading) ||
    (!userKotoba.meaning && dictionaryFields.meaning)
  ) {
    const sense = await getOrCreateKotobaSense({
      kotobaId: userKotoba.kotoba.id,
      reading: dictionaryFields.reading,
    });

    const updatedWord = await prisma.userKotoba.update({
      where: {
        id: userKotoba.id,
      },
      include: userKotobaInclude,
      data: {
        senseId: sense?.id ?? undefined,
        reading: userKotoba.reading ?? toNullable(dictionaryFields.reading),
        meaning: userKotoba.meaning ?? toNullable(dictionaryFields.meaning),
      },
    });

    return toWord(updatedWord, dictionaryFields.relatedWords);
  }

  return toWord(userKotoba, dictionaryFields.relatedWords);
}

export async function getOwnWord(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const word = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: userKotobaInclude,
  });

  if (!word) {
    return null;
  }

  return addMissingDictionaryFields(word);
}

export async function getWord(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const word = await prisma.userKotoba.findFirst({
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
    include: userKotobaInclude,
  });

  if (!word) {
    return null;
  }

  return addMissingDictionaryFields(word);
}

export async function canEditWord(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  const word = await prisma.userKotoba.findFirst({
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

export async function getReadingSuggestions(id: string): Promise<string[]> {
  const user = await getCurrentUser();
  const word = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      kotobaId: true,
    },
  });

  if (!word) {
    return [];
  }

  const senses = await prisma.kotobaSense.findMany({
    where: {
      kotobaId: word.kotobaId,
    },
    orderBy: {
      reading: "asc",
    },
    select: {
      reading: true,
    },
  });

  return senses.map((sense) => sense.reading);
}

export async function createWord(input: WordInput): Promise<{
  word: Word;
  created: boolean;
}> {
  const user = await getCurrentUser();
  const kotoba = await getOrCreateKotoba(input);
  const reading = input.reading ?? kotoba.defaultReading ?? undefined;
  const meaning = input.meaning ?? kotoba.defaultMeaning ?? undefined;
  const sense = await getOrCreateKotobaSense({
    kotobaId: kotoba.id,
    reading,
  });
  const existingWord = await prisma.userKotoba.findFirst({
    where: {
      userId: user.id,
      kotobaId: kotoba.id,
      reading: toNullable(reading),
    },
    include: userKotobaInclude,
  });

  if (existingWord) {
    return {
      word: toWord(existingWord),
      created: false,
    };
  }

  const word = await prisma.userKotoba.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      kotobaId: kotoba.id,
      senseId: sense?.id,
      reading: toNullable(reading),
      source: toNullable(input.source),
      meaning: toNullable(meaning),
      impression: toNullable(input.impression),
      collectedAt: new Date().toISOString(),
    },
    include: userKotobaInclude,
  });

  return {
    word: toWord(word),
    created: true,
  };
}

export async function createAnotherWordEncounter(id: string): Promise<Word | null> {
  const user = await getCurrentUser();
  const currentWord = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: userKotobaInclude,
  });

  if (!currentWord) {
    return null;
  }

  const reading =
    currentWord.reading ?? currentWord.kotoba.defaultReading ?? undefined;
  const meaning =
    currentWord.meaning ?? currentWord.kotoba.defaultMeaning ?? undefined;
  const sense = await getOrCreateKotobaSense({
    kotobaId: currentWord.kotoba.id,
    reading,
  });
  const word = await prisma.userKotoba.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      kotobaId: currentWord.kotoba.id,
      senseId: sense?.id,
      reading: toNullable(reading),
      meaning: toNullable(meaning),
      collectedAt: new Date().toISOString(),
    },
    include: userKotobaInclude,
  });

  return toWord(word);
}

export async function updateWord(
  id: string,
  input: WordInput,
): Promise<Word | null> {
  const user = await getCurrentUser();
  const currentWord = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!currentWord) {
    return null;
  }

  const kotoba = await getOrCreateKotoba(input);
  const duplicateWord = await prisma.userKotoba.findFirst({
    where: {
      id: {
        not: id,
      },
      userId: user.id,
      kotobaId: kotoba.id,
      reading: toNullable(input.reading),
    },
    include: userKotobaInclude,
  });

  if (duplicateWord) {
    return toWord(duplicateWord);
  }

  const sense = await getOrCreateKotobaSense({
    kotobaId: kotoba.id,
    reading: input.reading,
  });

  const word = await prisma.userKotoba.update({
    where: { id },
    include: userKotobaInclude,
    data: {
      kotobaId: kotoba.id,
      senseId: sense?.id ?? null,
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
  input: Pick<WordInput, "reading" | "source" | "meaning" | "impression">,
): Promise<Word | null> {
  const user = await getCurrentUser();
  const currentWord = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!currentWord) {
    return null;
  }

  const sense = await getOrCreateKotobaSense({
    kotobaId: currentWord.kotobaId,
    reading: input.reading,
  });

  const word = await prisma.userKotoba.update({
    where: { id },
    include: userKotobaInclude,
    data: {
      senseId: sense?.id ?? null,
      reading: toNullable(input.reading),
      source: toNullable(input.source),
      meaning: toNullable(input.meaning),
      impression: toNullable(input.impression),
    },
  });

  return toWord(word);
}

export async function deleteWord(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  const currentWord = await prisma.userKotoba.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!currentWord) {
    return false;
  }

  await prisma.userKotoba.delete({
    where: { id },
  });

  return true;
}
