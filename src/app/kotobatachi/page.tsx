import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getWords } from "@/lib/words-store";

export default async function WordsPage() {
  const words = await getWords();

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばの一覧"
          description="ポケットにしまったことばを見返します。"
          className="pb-6"
        />

        <section className="mt-8 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">{words.length}件のことば</p>
            <Link
              href="/kotoba/new"
              className="rounded-md bg-[#5f8f86] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[#4f7d75]"
            >
              ことばを残す
            </Link>
          </div>

          {words.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-[#fffdf8] p-6">
              <h2 className="text-2xl font-medium text-stone-600">
                まだことばがありません
              </h2>
              <p className="mt-3 leading-7 text-stone-700">
                最初のことばを拾って、ポケットにしまってみてください。
              </p>
              <Link
                href="/kotoba/new"
                className="mt-5 inline-block rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75]"
              >
                ことばを残す
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {words.map((word) => (
                <Link
                  key={word.id}
                  href={`/kotoba/${word.id}`}
                  className="block rounded-lg border border-stone-200 bg-[#fffdf8] p-5 shadow-sm transition hover:border-[#bfd5cf] hover:bg-white"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="break-words text-3xl font-medium text-stone-600">
                        {word.text}
                      </h2>
                      {word.reading && (
                        <p className="mt-1 text-stone-500">{word.reading}</p>
                      )}
                    </div>
                    <time className="shrink-0 text-sm text-stone-500">
                      {word.collectedAt}
                    </time>
                  </div>

                  {word.source && (
                    <p className="mt-4 text-sm text-stone-500">
                      ひろった場所: {word.source}
                    </p>
                  )}

                  {word.impression && (
                    <p className="mt-3 line-clamp-2 leading-7 text-stone-700">
                      {word.impression}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
