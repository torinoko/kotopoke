import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { collectRandomWordAction } from "@/app/kotoba/random/actions";
import {
  formatWordNetMeanings,
  getRandomWordNetEntry,
} from "@/lib/wordnet-store";
import { getKanaReading } from "@/lib/kana-reading-store";

export const dynamic = "force-dynamic";

export default async function RandomWordPage() {
  const entry = await getRandomWordNetEntry();
  const reading = entry ? await getKanaReading(entry.text) : undefined;

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばに出会う"
          description="辞書の中から、偶然ひとつのことばをひろいます。"
          className="pb-6"
        />

        <section className="mt-8 flex-1 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
          {entry ? (
            <>
              <p className="text-sm font-medium text-stone-500">
                今日ではなく、今この瞬間の出会い
              </p>
              <h2 className="mt-3 break-words text-4xl font-medium text-stone-600">
                {entry.text}
              </h2>
              {reading && (
                <p className="mt-2 text-lg text-stone-500">{reading}</p>
              )}

              {entry.meanings.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-stone-500">
                    ことばの意味
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words leading-8 text-stone-700">
                    {formatWordNetMeanings(entry.meanings)}
                  </p>
                </div>
              )}

              {entry.relatedWords.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-stone-500">
                    関連することば
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.relatedWords.map((relatedWord) => (
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <form action={collectRandomWordAction}>
                  <input type="hidden" name="text" value={entry.text} />
                  <input type="hidden" name="reading" value={reading ?? ""} />
                  <input
                    type="hidden"
                    name="meaning"
                    value={formatWordNetMeanings(entry.meanings)}
                  />
                  <button
                    type="submit"
                    className="w-full rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75] sm:w-auto"
                  >
                    このことばをしまう
                  </button>
                </form>
                <Link
                  href="/kotoba/random"
                  className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
                >
                  もう一度出会う
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-medium text-stone-600">
                ことばをひろえませんでした
              </h2>
              <p className="mt-4 leading-7 text-stone-700">
                WordNet の辞書データを参照できていない可能性があります。
              </p>
              <Link
                href="/kotoba/random"
                className="mt-6 inline-block rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
              >
                もう一度試す
              </Link>
            </>
          )}
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
