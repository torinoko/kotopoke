import { notFound } from "next/navigation";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser, getUserBySlug } from "@/lib/users-store";
import { getWordsPageByUserId } from "@/lib/words-store";

type UserPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function pageHref(slug: string, page: number) {
  return `/users/${slug}?page=${page}`;
}

export default async function UserPage({ params, searchParams }: UserPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const user = await getUserBySlug(slug);

  if (!user) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isOwner = currentUser.id === user.id;
  const canViewWords = user.isPublic || isOwner;

  const wordsPage = canViewWords
    ? await getWordsPageByUserId(user.id, parsePage(page))
    : null;
  const hasPreviousPage = wordsPage ? wordsPage.currentPage > 1 : false;
  const hasNextPage = wordsPage
    ? wordsPage.currentPage < wordsPage.totalPages
    : false;

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title={`${user.name}のことばたち`}
          description={`/${user.slug}`}
          className="pb-6"
        />

        <section className="mt-8 flex-1">
          {!canViewWords ? (
            <div className="rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
              <h2 className="text-2xl font-medium text-stone-600">
                非公開のポケットです
              </h2>
              <p className="mt-4 leading-7 text-stone-700">
                このユーザーのことばたちは公開されていません。
              </p>
            </div>
          ) : wordsPage && wordsPage.words.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-[#fffdf8] p-6">
              <h2 className="text-2xl font-medium text-stone-600">
                まだことばがありません
              </h2>
              <p className="mt-3 leading-7 text-stone-700">
                ここに、公開されたことばたちが並びます。
              </p>
            </div>
          ) : wordsPage ? (
            <>
              <p className="text-sm text-stone-500">
                {wordsPage.totalCount}件のことば
                {wordsPage.totalCount > 0 && (
                  <span className="ml-2">
                    {wordsPage.currentPage} / {wordsPage.totalPages} ページ
                  </span>
                )}
              </p>

              <div className="mt-6 grid gap-4">
                {wordsPage.words.map((word) => (
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

                    {word.meaning && (
                      <p className="mt-3 line-clamp-2 leading-7 text-stone-700">
                        {word.meaning}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              {wordsPage.totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-between gap-3 border-t border-stone-200 pt-5 text-sm">
                  {hasPreviousPage ? (
                    <Link
                      href={pageHref(user.slug, wordsPage.currentPage - 1)}
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
                    {wordsPage.currentPage} / {wordsPage.totalPages}
                  </span>

                  {hasNextPage ? (
                    <Link
                      href={pageHref(user.slug, wordsPage.currentPage + 1)}
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
            </>
          ) : null}
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
