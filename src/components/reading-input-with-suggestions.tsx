"use client";

import { useState } from "react";

type ReadingInputWithSuggestionsProps = {
  defaultValue: string;
  suggestions: string[];
  maxLength: number;
  inputClassName: string;
};

export function ReadingInputWithSuggestions({
  defaultValue,
  suggestions,
  maxLength,
  inputClassName,
}: ReadingInputWithSuggestionsProps) {
  const [reading, setReading] = useState(defaultValue);
  const showSuggestions = suggestions.length > 1;

  return (
    <>
      <input
        id="reading"
        name="reading"
        type="text"
        value={reading}
        onChange={(event) => setReading(event.target.value)}
        maxLength={maxLength}
        className={inputClassName}
      />

      {showSuggestions && (
        <select
          aria-label="読み候補"
          value=""
          onChange={(event) => {
            setReading(event.target.value);
          }}
          className="mt-2 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 outline-none transition focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]"
        >
          <option value="" disabled>
            読み候補を選ぶ
          </option>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion}>
              {suggestion}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
