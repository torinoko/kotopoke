import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser } from "@/lib/users-store";
import { getTodaysWord } from "@/lib/words-store";

export default async function Home() {
  const user = await getCurrentUser();
  const isAnonymousUser = user.name === "名無しさん";
  const todaysWord = await getTodaysWord();

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <AppHeader />

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold text-[#5f8f86]">
              どこかで見つけた、気になることば。
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-tight tracking-normal text-stone-600 sm:text-5xl">
              ことばをひろって、
              <br />
              そっとポケットへ。
            </h1>
            <p className="mt-6 max-w-3xl leading-8 text-stone-700">
              響きが好きだったり、景色が浮かんだり、何となく心に残ったり。<br />
              こどもの頃、道で拾った宝物をポケットへ入れたときのように。<br/>
              ことぽけは、そんなことばとの出会いをやさしくしまっておく場所です。
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/kotoba/new"
                className="rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75]"
              >
                ことばを残す
              </Link>
              <Link
                href="/kotobatachi"
                className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center font-medium text-stone-700 transition hover:bg-white"
              >
                ことばを見る
              </Link>
            </div>

            {isAnonymousUser && (
              <div className="mt-6 border-l-2 border-[#dfeae6] pl-4">
                <p className="text-sm leading-6 text-stone-500">
                  自分だけのポケットを作る場合は
                  <Link
                    href="/users/new"
                    className="ml-1 font-medium text-[#5f8f86] underline-offset-4 hover:underline"
                  >
                    ユーザー登録
                  </Link>
                  へ。
                </p>
              </div>
            )}
          </div>

          <div className="mx-auto w-full max-w-sm rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
            <Image
              src="/kotopoke_main_logo.png"
              alt="ことぽけ"
              width={160}
              height={160}
              priority
              className="mx-auto h-40 w-40"
            />
            <div className="mt-6 rounded-md bg-[#f4efe4] p-4">
              <p className="text-sm font-medium text-stone-500">
                今日のポケット
              </p>
              {todaysWord ? (
                <>
                  <Link
                    href={`/kotoba/${todaysWord.id}`}
                    className="mt-2 block break-words text-3xl font-medium text-stone-600 transition hover:text-[#5f8f86]"
                  >
                    {todaysWord.text}
                  </Link>
                  {todaysWord.reading && (
                    <p className="mt-2 text-sm text-stone-500">
                      {todaysWord.reading}
                    </p>
                  )}
                  {todaysWord.meaning && (
                    <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-stone-700">
                      {todaysWord.meaning}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-2xl font-medium text-stone-600">
                    まだ空です
                  </p>
                  <p className="mt-3 leading-7 text-stone-700">
                    ことばを残すと、日替わりでここに表示されます。
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <section
          id="concept"
          className="border-t border-stone-200 py-8 text-stone-700"
        >
          <h2 className="text-2xl font-medium text-stone-600">
            集めるのはたいせつなことば
          </h2>
          <p className="mt-4 max-w-3xl leading-8">
            ことぽけは「このことば、好きだな」と思った瞬間を残していくアプリです。<br />
            こどものころ、自分だけのたからものを見つけて拾ったときのように。<br />
            庭で、道端で、公園で、海辺で、森の中で、そして本の中で。
          </p>
        </section>

        <AppFooter />
      </section>
    </main>
  );
}
