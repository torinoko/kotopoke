import { Word } from "@/types/word";

type WordDetailProps = {
  word: Word;
};

export function WordDetail({ word }: WordDetailProps) {
  return (
    <section className="mt-8 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-stone-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mt-2 break-words text-4xl font-medium text-stone-600">
            {word.text}
          </h2>
          {word.reading && (
            <p className="mt-2 text-lg text-stone-500">{word.reading}</p>
          )}
        </div>
        <time className="shrink-0 text-sm text-stone-500">
          {word.collectedAt}
        </time>
      </div>

      {word.source && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-500">ひろった場所</p>
          <p className="mt-2 leading-7 text-stone-700">{word.source}</p>
        </div>
      )}

      {word.meaning && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-500">ことばの意味</p>
          <p className="mt-2 whitespace-pre-wrap break-words leading-8 text-stone-700">
            {word.meaning}
          </p>
        </div>
      )}

      {word.impression && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-500">ことばの印象</p>
          <p className="mt-2 whitespace-pre-wrap rounded-md bg-[#f4efe4] p-4 leading-7 text-stone-700">
            {word.impression}
          </p>
        </div>
      )}

      {word.relatedWords.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-500">関連することば</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {word.relatedWords.map((relatedWord) => (
              <span
                key={relatedWord}
                className="rounded-md bg-[#e8f1ed] px-2.5 py-1 text-sm font-medium text-[#4f7d75]"
              >
                {relatedWord}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
