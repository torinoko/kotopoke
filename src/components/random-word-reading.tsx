"use client";

import { useEffect, useState } from "react";

type RandomWordReadingProps = {
  formId: string;
  text: string;
};

export function RandomWordReading({ formId, text }: RandomWordReadingProps) {
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchReading() {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/kana-reading?text=${encodeURIComponent(text)}`,
          {
            signal: abortController.signal,
          },
        );
        const data = (await response.json()) as { reading?: string | null };

        setReading(data.reading ?? null);
      } catch {
        if (!abortController.signal.aborted) {
          setReading(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchReading();

    return () => {
      abortController.abort();
    };
  }, [text]);

  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-stone-500">読み方</p>
      {isLoading ? (
        <p className="mt-2 text-stone-500">読み方を探しています。</p>
      ) : reading ? (
        <p className="mt-2 text-lg text-stone-600">{reading}</p>
      ) : (
        <p className="mt-2 text-stone-500">読み方を取得できませんでした。</p>
      )}
      <input
        form={formId}
        type="hidden"
        name="reading"
        value={reading ?? ""}
      />
    </div>
  );
}
