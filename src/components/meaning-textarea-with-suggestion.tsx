"use client";

import { useState } from "react";

type MeaningTextareaWithSuggestionProps = {
  defaultValue: string;
  suggestion: string | null;
  rows: number;
  maxLength: number;
  className: string;
  placeholder?: string;
};

const suggestionPreviewLength = 160;

function truncateSuggestion(value: string) {
  if (value.length <= suggestionPreviewLength) {
    return value;
  }

  return `${value.slice(0, suggestionPreviewLength)}...`;
}

export function MeaningTextareaWithSuggestion({
  defaultValue,
  suggestion,
  rows,
  maxLength,
  className,
  placeholder,
}: MeaningTextareaWithSuggestionProps) {
  const [meaning, setMeaning] = useState(defaultValue);
  const normalizedSuggestion = suggestion?.trim();
  const showSuggestion = !meaning.trim() && Boolean(normalizedSuggestion);

  return (
    <>
      <textarea
        id="meaning"
        name="meaning"
        placeholder={placeholder}
        value={meaning}
        onChange={(event) => setMeaning(event.target.value)}
        rows={rows}
        maxLength={maxLength}
        className={className}
      />

      {showSuggestion && normalizedSuggestion && (
        <div className="mt-3 rounded-md border border-[#dfeae6] bg-[#f7fbf8] p-3">
          <p className="text-xs font-medium text-stone-500">
            参考にできる意味があります
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">
            {truncateSuggestion(normalizedSuggestion)}
          </p>
          <button
            type="button"
            onClick={() => setMeaning(normalizedSuggestion)}
            className="mt-3 rounded-md border border-[#bfd3cc] bg-white px-3 py-2 text-sm font-medium text-[#4f7d75] transition hover:bg-[#eef6f2]"
          >
            この意味を使う
          </button>
        </div>
      )}
    </>
  );
}
