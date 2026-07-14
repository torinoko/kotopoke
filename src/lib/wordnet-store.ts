import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const wordNetDbPath = path.join(process.cwd(), "prisma/wnjpn.db");

type WordNetDefinitionRow = {
  synset: string;
  pos: string | null;
  def: string;
};

type WordNetRelatedWordRow = {
  lemma: string;
};

export type WordNetSearchResult = {
  meanings: string[];
  relatedWords: string[];
};

function quoteSqlText(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function queryWordNet<T>(sql: string): Promise<T[]> {
  const { stdout } = await execFileAsync("sqlite3", [
    "-json",
    wordNetDbPath,
    sql,
  ]);

  if (!stdout.trim()) {
    return [];
  }

  return JSON.parse(stdout) as T[];
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()))).filter(
    Boolean,
  );
}

export async function searchWordNet(
  text: string,
): Promise<WordNetSearchResult | null> {
  const lemma = text.trim();

  if (!lemma) {
    return null;
  }

  try {
    const escapedLemma = quoteSqlText(lemma);
    const definitionRows = await queryWordNet<WordNetDefinitionRow>(`
      select distinct
        sense.synset as synset,
        word.pos as pos,
        synset_def.def as def
      from word
      join sense on sense.wordid = word.wordid
      join synset_def on synset_def.synset = sense.synset
      where word.lang = 'jpn'
        and word.lemma = ${escapedLemma}
        and synset_def.lang = 'jpn'
      order by sense.synset
      limit 8;
    `);

    if (definitionRows.length === 0) {
      return null;
    }

    const relatedRows = await queryWordNet<WordNetRelatedWordRow>(`
      select distinct
        related_word.lemma as lemma
      from word
      join sense on sense.wordid = word.wordid
      join sense as related_sense on related_sense.synset = sense.synset
      join word as related_word on related_word.wordid = related_sense.wordid
      where word.lang = 'jpn'
        and word.lemma = ${escapedLemma}
        and related_sense.lang = 'jpn'
        and related_word.lang = 'jpn'
        and related_word.lemma <> ${escapedLemma}
      order by related_word.lemma
      limit 12;
    `);

    return {
      meanings: uniqueValues(definitionRows.map((row) => row.def)).slice(0, 5),
      relatedWords: uniqueValues(relatedRows.map((row) => row.lemma)).slice(
        0,
        12,
      ),
    };
  } catch (error) {
    console.error("Failed to search Japanese WordNet.", error);
    return null;
  }
}

export function formatWordNetMeanings(meanings: string[]) {
  return meanings.map((meaning) => `・${meaning}`).join("\n");
}
