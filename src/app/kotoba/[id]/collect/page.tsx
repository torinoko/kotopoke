import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { wordFieldLimits } from "@/lib/word-validation";
import { getOwnWord } from "@/lib/words-store";
import { updateWordReflectionAction } from "@/app/kotoba/[id]/collect/actions";

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

type CollectWordPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CollectWordPage({ params }: CollectWordPageProps) {
  const { id } = await params;
  const word = await getOwnWord(id);

  if (!word) {
    notFound();
  }

  const action = updateWordReflectionAction.bind(null, word.id);

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばをながめる"
          description="ひろった場所や受け取った印象を残します。"
          className="pb-6"
        />

        <section className="mt-8 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
          <div className="border-b border-stone-100 pb-5">
            <p className="text-sm font-medium text-stone-500">ことば</p>
            <h2 className="mt-2 break-words text-4xl font-medium text-stone-600">
              {word.text}
            </h2>
            {word.reading && (
              <p className="mt-2 text-lg text-stone-500">{word.reading}</p>
            )}
          </div>

          {word.relatedWords.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-stone-500">
                関連することば
              </p>
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

        <form
          action={action}
          className="mt-6 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm"
        >
          <div>
            <label className={labelClassName} htmlFor="meaning">
              ことばの意味
              <span className="ml-2 text-xs text-stone-400">任意</span>
            </label>
            <textarea
              id="meaning"
              name="meaning"
              placeholder="辞書から意味を見つけられませんでした。必要であれば追記できます。"
              defaultValue={word.meaning ?? ""}
              rows={5}
              maxLength={wordFieldLimits.meaning}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.meaning}文字まで
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="source">
              ひろった場所
              <span className="ml-2 text-xs text-stone-400">任意</span>
            </label>
            <input
              id="source"
              name="source"
              type="text"
              placeholder="本のタイトル、記事名、場所など"
              defaultValue={word.source ?? ""}
              maxLength={wordFieldLimits.source}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.source}文字まで
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="impression">
              ことばの印象
            </label>
            <textarea
              id="impression"
              name="impression"
              placeholder="そのことばから、どんな感じを受け取りましたか？"
              defaultValue={word.impression ?? ""}
              rows={5}
              maxLength={wordFieldLimits.impression}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.impression}文字まで
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75]"
            >
              保存する
            </button>
            <Link
              href={`/kotoba/${word.id}`}
              className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
            >
              あとで書く
            </Link>
          </div>
        </form>

        <AppFooter />
      </div>
    </main>
  );
}
