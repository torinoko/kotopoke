import path from "node:path";
import { createRequire } from "node:module";
import type { IpadicFeatures, Tokenizer } from "kuromoji";

type KuromojiModule = typeof import("kuromoji");

const kuromojiDictionaryPath = path.join(
  process.cwd(),
  "node_modules/kuromoji/dict",
);
const require = createRequire(import.meta.url);

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

function getTokenizer() {
  tokenizerPromise ??= new Promise((resolve, reject) => {
    const kuromoji = require("kuromoji") as KuromojiModule;

    kuromoji
      .builder({ dicPath: kuromojiDictionaryPath })
      .build((error, tokenizer) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(tokenizer);
      });
  });

  return tokenizerPromise.catch((error) => {
    tokenizerPromise = null;
    throw error;
  });
}

function katakanaToHiragana(value: string) {
  return value.replace(/[\u30a1-\u30f6]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60),
  );
}

function isReadableToken(token: IpadicFeatures) {
  return token.reading && token.reading !== "*" && token.reading.trim();
}

export async function getKanaReading(text: string): Promise<string | undefined> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return undefined;
  }

  try {
    const tokenizer = await getTokenizer();
    const tokens = tokenizer.tokenize(normalizedText);
    const readings = tokens
      .filter(isReadableToken)
      .map((token) => token.reading?.trim())
      .filter((reading): reading is string => Boolean(reading));

    if (readings.length === 0) {
      return undefined;
    }

    return katakanaToHiragana(readings.join(""));
  } catch {
    return undefined;
  }
}
