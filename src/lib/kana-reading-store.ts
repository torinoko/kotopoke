import path from "node:path";
import { createRequire } from "node:module";
import type { IpadicFeatures, Tokenizer } from "kuromoji";

type KuromojiModule = typeof import("kuromoji");

const require = createRequire(import.meta.url);

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

function getKuromojiDictionaryPath() {
  if (process.env.KUROMOJI_DICTIONARY_PATH) {
    return path.resolve(process.env.KUROMOJI_DICTIONARY_PATH);
  }

  return path.join(path.dirname(require.resolve("kuromoji")), "../dict");
}

function getTokenizer() {
  tokenizerPromise ??= new Promise((resolve, reject) => {
    const kuromoji = require("kuromoji") as KuromojiModule;

    kuromoji
      .builder({ dicPath: getKuromojiDictionaryPath() })
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

function isHiraganaText(value: string) {
  return /^[\u3041-\u3096\u30fc・\s]+$/.test(value);
}

function isKanaText(value: string) {
  return /^[\u3041-\u3096\u30a1-\u30f6\u30fc・\s]+$/.test(value);
}

function hasKanji(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function getTokenReading(token: IpadicFeatures) {
  const reading =
    token.reading && token.reading !== "*"
      ? token.reading.trim()
      : token.pronunciation && token.pronunciation !== "*"
        ? token.pronunciation.trim()
        : "";

  if (reading) {
    return reading;
  }

  if (isKanaText(token.surface_form)) {
    return token.surface_form;
  }

  return undefined;
}

export async function getKanaReading(text: string): Promise<string | undefined> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return undefined;
  }

  if (isHiraganaText(normalizedText)) {
    return normalizedText;
  }

  if (isKanaText(normalizedText)) {
    return katakanaToHiragana(normalizedText);
  }

  try {
    const tokenizer = await getTokenizer();
    const tokens = tokenizer.tokenize(normalizedText);
    const readings = tokens.map(getTokenReading);

    if (
      readings.length === 0 ||
      readings.some((reading) => !reading) ||
      tokens.some((token) => hasKanji(token.surface_form) && !getTokenReading(token))
    ) {
      return undefined;
    }

    return katakanaToHiragana(readings.join(""));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const normalizedError =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error;

      console.warn("Failed to get kana reading with kuromoji.", {
        dictionaryPath: getKuromojiDictionaryPath(),
        text: normalizedText,
        error: normalizedError,
      });
    }

    return undefined;
  }
}
