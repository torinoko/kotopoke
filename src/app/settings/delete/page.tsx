import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser } from "@/lib/users-store";

export default async function DeleteAccountPage() {
  const user = await getCurrentUser();
  const isAnonymousUser = user.name === "名無しさん";

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="アカウントを削除する"
          description="削除前に、対象のユーザー情報を確認します。"
          className="pb-6"
        />

        <section className="mt-8 flex-1 rounded-lg border border-red-100 bg-[#fffdf8] p-6 shadow-sm">
          {isAnonymousUser ? (
            <>
              <h2 className="text-2xl font-medium text-stone-600">
                ユーザーが未登録です
              </h2>
              <p className="mt-4 leading-7 text-stone-700">
                削除できるユーザーがありません。
              </p>
              <Link
                href="/settings"
                className="mt-5 inline-flex rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                設定へ戻る
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-medium text-stone-600">
                {user.name} を削除しますか
              </h2>
              <p className="mt-4 leading-7 text-stone-700">
                この操作を実行すると、このユーザーと保存したことばが削除されます。
              </p>
              <dl className="mt-5 grid gap-4 rounded-md bg-[#f4efe4] p-4">
                <div>
                  <dt className="text-sm font-medium text-stone-500">表示名</dt>
                  <dd className="mt-1 text-stone-700">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">URL ID</dt>
                  <dd className="mt-1 text-stone-700">{user.slug}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/settings"
                  className="rounded-md border border-stone-200 bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover:bg-white"
                >
                  設定へ戻る
                </Link>
                <button
                  type="button"
                  disabled
                  className="rounded-md bg-stone-300 px-5 py-3 text-sm font-medium text-white"
                >
                  削除する
                </button>
              </div>
            </>
          )}
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
