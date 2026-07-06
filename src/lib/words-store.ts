import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";

type StoredWord = Omit<Word, "source"> & {
  source?: string;
  sourceTitle?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const wordsFilePath = path.join(dataDirectory, "words.json");

function normalizeStoredWord({ sourceTitle, ...word }: StoredWord): Word {
  return {
    ...word,
    source: word.source ?? sourceTitle,
  };
}

function sortByCollectedAt(words: Word[]) {
  return [...words].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
}

async function ensureWordsFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(wordsFilePath);
  } catch {
    await fs.writeFile(wordsFilePath, "[]", "utf8");
  }
}

async function readWords(): Promise<Word[]> {
  await ensureWordsFile();
  const file = await fs.readFile(wordsFilePath, "utf8");
  const words = JSON.parse(file) as StoredWord[];

  return words.map(normalizeStoredWord);
}

async function writeWords(words: Word[]) {
  await fs.writeFile(wordsFilePath, JSON.stringify(words, null, 2), "utf8");
}

export async function getWords() {
  const words = await readWords();
  return sortByCollectedAt(words);
}

export async function getWord(id: string) {
  const words = await readWords();
  return words.find((word) => word.id === id) ?? null;
}

export async function createWord(input: WordInput) {
  const word: Word = {
    id: randomUUID(),
    ...input,
    relatedWords: [],
    collectedAt: new Date().toISOString().slice(0, 10),
  };
  const words = await readWords();

  await writeWords([word, ...words]);
  return word;
}

export async function updateWord(id: string, input: WordInput) {
  const words = await readWords();
  const index = words.findIndex((word) => word.id === id);

  if (index === -1) {
    return null;
  }

  const updatedWord: Word = {
    ...words[index],
    ...input,
  };

  words[index] = updatedWord;
  await writeWords(words);
  return updatedWord;
}
