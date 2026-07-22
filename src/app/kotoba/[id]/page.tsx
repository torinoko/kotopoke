import { notFound } from "next/navigation";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { WordDetail } from "@/components/word-detail";
import { canEditWord, getWord } from "@/lib/words-store";
import { createAnotherWordEncounterAction } from "@/app/kotoba/[id]/actions";

type WordPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    already?: string;
  }>;
};

export default async function WordPage({ params, searchParams }: WordPageProps) {
  const { id } = await params;
  const { already } = await searchParams;
  const word = await getWord(id);

  if (!word) {
    notFound();
  }

  const showEditLink = await canEditWord(word.id);
  const showCreateAnotherButton = already === "1";
  const createAnotherAction = createAnotherWordEncounterAction.bind(
    null,
    word.id,
  );
  const description =
    showCreateAnotherButton
      ? "このことばはもうポケットにはいっています。"
      : "ポケットにしまったことばを、ゆっくりふりかえれます。";

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        <AppHeader
          title="ことば"
          description={description}
          className="pb-6"
        />

        <WordDetail word={word} />

        {showEditLink && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/kotoba/${word.id}/edit`}
              className="inline-block rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
            >
              編集する
            </Link>
            {showCreateAnotherButton && (
              <form action={createAnotherAction}>
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75] sm:w-auto"
                >
                  あたらしくしまう
                </button>
              </form>
            )}
          </div>
        )}

        <AppFooter />
      </div>
    </main>
  );
}
