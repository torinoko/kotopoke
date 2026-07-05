import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Word, WordInput } from "@/types/word";

type StoredWord = Word & {
  sourceTitle?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const wordsFilePath = path.join(dataDirectory, "words.json");

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

  return words.map(({ sourceTitle, ...word }) => ({
    ...word,
    source: word.source ?? sourceTitle,
  }));
}

async function writeWords(words: Word[]) {
  await fs.writeFile(wordsFilePath, JSON.stringify(words, null, 2), "utf8");
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
