import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { UserRegistrationForm } from "@/app/users/new/user-registration-form";

export default function NewUserPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ユーザー登録"
          description="表示名と URL ID を設定します。メールアドレスとパスワードは使いません。"
          className="pb-6"
        />

        <UserRegistrationForm />

        <AppFooter />
      </div>
    </main>
  );
}
