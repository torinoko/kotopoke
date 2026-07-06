import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <AppHeader />

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold text-[#5f8f86]">
              どこかで見つけた、気になることば。
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-tight tracking-normal text-stone-600 sm:text-6xl">
              ことばをひろって、
              <br />
              そっとポケットへ。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-stone-700">
              響きが好きだったり、景色が浮かんだり、何となく心に残ったり。
              ことぽけは、そんなことばとの出会いをやさしくしまっておく場所。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              <p className="mt-2 text-3xl font-medium text-stone-600">静謐</p>
              <p className="mt-3 leading-7 text-stone-700">
                静かというより、空気まで澄んでいる感じがした。
              </p>
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
