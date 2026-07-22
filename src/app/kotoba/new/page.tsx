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
          title="ことばをしまう"
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
              placeholder="静寂"
              required
              maxLength={wordFieldLimits.text}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-stone-400">
              {wordFieldLimits.text}文字まで
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75]"
            >
              このことばをしまう
            </button>
            <Link
              href="/"
              className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
            >
              トップへ戻る
            </Link>
          </div>

          <p className="mt-4 text-sm leading-6 text-stone-500">
            読み方は次の画面で自動補完します。
          </p>
        </form>

        <AppFooter />
      </div>
    </main>
  );
}
