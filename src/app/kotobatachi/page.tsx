import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getWordsPage } from "@/lib/words-store";

type WordsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function pageHref(page: number) {
  return `/kotobatachi?page=${page}`;
}

export default async function WordsPage({ searchParams }: WordsPageProps) {
  const { page } = await searchParams;
  const { words, totalCount, currentPage, totalPages } = await getWordsPage(
    parsePage(page),
  );
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

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
            <p className="text-sm text-stone-500">
              {totalCount}件のことば
              {totalCount > 0 && (
                <span className="ml-2">
                  {currentPage} / {totalPages} ページ
                </span>
              )}
            </p>
            <Link
              href="/kotoba/new"
              className="rounded-md bg-[#5f8f86] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[#4f7d75]"
            >
              ことばをしまう
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
                ことばをしまう
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

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-between gap-3 border-t border-stone-200 pt-5 text-sm">
              {hasPreviousPage ? (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="rounded-md border border-stone-200 bg-[#fffdf8] px-4 py-2 font-medium text-stone-700 transition hover:bg-white"
                >
                  前へ
                </Link>
              ) : (
                <span className="rounded-md border border-stone-100 px-4 py-2 text-stone-400">
                  前へ
                </span>
              )}

              <span className="text-stone-500">
                {currentPage} / {totalPages}
              </span>

              {hasNextPage ? (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="rounded-md border border-stone-200 bg-[#fffdf8] px-4 py-2 font-medium text-stone-700 transition hover:bg-white"
                >
                  次へ
                </Link>
              ) : (
                <span className="rounded-md border border-stone-100 px-4 py-2 text-stone-400">
                  次へ
                </span>
              )}
            </nav>
          )}
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
