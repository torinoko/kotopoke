import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { createWordAction } from "@/app/kotoba/new/actions";
import { wordFieldLimits } from "@/lib/word-validation";

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

export default function NewWordPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばを拾う"
          description="気になったことばを、忘れないうちにポケットへしまいましょう。"
          className="pb-6"
        />

        <form
          action={createWordAction}
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
              placeholder="静謐"
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
              placeholder="せいひつ"
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
              placeholder="本のタイトル、記事名、場所など"
              maxLength={wordFieldLimits.source}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.source}文字まで
            </p>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="impression">
              受け取った印象
            </label>
            <textarea
              id="impression"
              name="impression"
              placeholder="そのことばから、どんな感じを受け取りましたか？"
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
              placeholder="あとで辞書や WordNet から入れる予定。今は空でも大丈夫です。"
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
              意味を取得する
            </button>
            <Link
              href="/"
              className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
            >
              トップへ戻る
            </Link>
          </div>

          <p className="mt-4 text-sm leading-6 text-stone-500">
            読み方が空の場合は、取得できる範囲で自動補完します。
          </p>
        </form>

        <AppFooter />
      </div>
    </main>
  );
}
