import { WordInput } from "@/types/word";

export const wordFieldLimits = {
  text: 80,
  reading: 80,
  source: 120,
  impression: 600,
  meaning: 600,
};

type WordField = keyof typeof wordFieldLimits;

function getText(formData: FormData, key: WordField) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: string) {
  return value ? value : undefined;
}

function isTooLong(key: WordField, value: string) {
  return value.length > wordFieldLimits[key];
}

export function parseWordInput(formData: FormData): WordInput | null {
  const text = getText(formData, "text");
  const reading = getText(formData, "reading");
  const source = getText(formData, "source");
  const meaning = getText(formData, "meaning");
  const impression = getText(formData, "impression");

  if (
    !text ||
    isTooLong("text", text) ||
    isTooLong("reading", reading) ||
    isTooLong("source", source) ||
    isTooLong("meaning", meaning) ||
    isTooLong("impression", impression)
  ) {
    return null;
  }

  return {
    text,
    reading: optionalText(reading),
    source: optionalText(source),
    meaning: optionalText(meaning),
    impression: optionalText(impression),
  };
}
