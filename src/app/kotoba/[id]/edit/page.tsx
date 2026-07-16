import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { wordFieldLimits } from "@/lib/word-validation";
import { getWord } from "@/lib/words-store";
import {
  deleteWordAction,
  updateWordAction,
} from "@/app/kotoba/[id]/edit/actions";

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

type EditWordPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWordPage({ params }: EditWordPageProps) {
  const { id } = await params;
  const word = await getWord(id);

  if (!word) {
    notFound();
  }

  const action = updateWordAction.bind(null, word.id);
  const deleteAction = deleteWordAction.bind(null, word.id);

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばを編集する"
          description="ポケットにしまったことばを整えます。"
          className="pb-6"
        />

        <form
          action={action}
          className="mt-8 flex-1 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm"
        >
          <div>
            <label className={labelClassName} htmlFor="text">
              ことば
            </label>
            <input
              id="text"
              name="text"
              type="text"
              defaultValue={word.text}
              required
              maxLength={wordFieldLimits.text}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.text}文字まで
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="reading">
              読み方
              <span className="ml-2 text-xs text-stone-400">任意</span>
            </label>
            <input
              id="reading"
              name="reading"
              type="text"
              defaultValue={word.reading ?? ""}
              maxLength={wordFieldLimits.reading}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.reading}文字まで
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
              defaultValue={word.impression ?? ""}
              rows={5}
              maxLength={wordFieldLimits.impression}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.impression}文字まで
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="meaning">
              ことばの意味
            </label>
            <textarea
              id="meaning"
              name="meaning"
              defaultValue={word.meaning ?? ""}
              rows={4}
              maxLength={wordFieldLimits.meaning}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.meaning}文字まで
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75]"
            >
              更新する
            </button>
            <Link
              href={`/kotoba/${word.id}`}
              className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
            >
              詳細へ戻る
            </Link>
          </div>
        </form>

        <section className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <form action={deleteAction} className="shrink-0">
              <button
                type="submit"
                className="rounded-md px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                このことばを削除
              </button>
            </form>
          </div>
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
