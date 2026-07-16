import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { PasswordResetForm } from "@/app/password-reset/password-reset-form";

export default function PasswordResetPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="パスワード再設定"
          description="リカバリコードで本人確認し、新しいパスワードを設定します。"
          className="pb-6"
        />

        <PasswordResetForm />

        <AppFooter />
      </div>
    </main>
  );
}
