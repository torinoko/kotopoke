import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { VisibilitySettingsForm } from "@/components/visibility-settings-form";
import { getCurrentUser } from "@/lib/users-store";
import { updateVisibilityAction } from "./actions";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const isAnonymousUser = user.name === "名無しさん";

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="設定"
          description="ユーザー情報とアカウントの操作を確認できます。"
          className="pb-6"
        />

        <div className="mt-8 flex-1 space-y-6">
          {isAnonymousUser ? (
            <section className="rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
              <h2 className="text-2xl font-medium text-stone-600">
                ユーザーが未登録です
              </h2>
              <p className="mt-4 leading-7 text-stone-700">
                設定を使うには、まずユーザー登録をしてください。
              </p>
              <Link
                href="/users/new"
                className="mt-5 inline-flex rounded-md bg-[#5f8f86] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4f7d75]"
              >
                ユーザー登録へ
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
                <h2 className="text-2xl font-medium text-stone-600">
                  ユーザー情報
                </h2>
                <dl className="mt-5 grid gap-4">
                  <div>
                    <dt className="text-sm font-medium text-stone-500">
                      表示名
                    </dt>
                    <dd className="mt-1 text-stone-700">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-500">
                      URL ID
                    </dt>
                    <dd className="mt-1 text-stone-700">{user.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-500">
                      ユーザーURL
                    </dt>
                    <dd className="mt-1">
                      <Link
                        href={`/users/${user.slug}`}
                        className="text-[#5f8f86] underline-offset-4 hover:underline"
                      >
                        {`/users/${user.slug}`}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
                <h2 className="text-2xl font-medium text-stone-600">
                  公開設定
                </h2>
                <p className="mt-4 leading-7 text-stone-700">
                  公開しない場合、あなた以外はユーザーURLからことばたちを見られません。
                </p>
                <VisibilitySettingsForm
                  isPublic={user.isPublic}
                  action={updateVisibilityAction}
                />
              </section>

              <section className="rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
                <h2 className="text-2xl font-medium text-stone-600">
                  リカバリコード
                </h2>
                <p className="mt-4 leading-7 text-stone-700">
                  リカバリコードはユーザー登録時にだけ表示されます。保存していない場合の扱いは今後整理します。
                </p>
              </section>

              <section
                id="delete-account"
                className="rounded-lg border border-red-100 bg-[#fffdf8] p-6 shadow-sm"
              >
                <h2 className="text-2xl font-medium text-stone-600">
                  アカウント
                </h2>
                <p className="mt-4 leading-7 text-stone-700">
                  アカウントを削除すると、保存したことばも削除されます。
                </p>
                <Link
                  href="/settings/delete"
                  className="mt-5 inline-flex rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  アカウントを削除する
                </Link>
              </section>
            </>
          )}
        </div>

        <AppFooter />
      </div>
    </main>
  );
}
