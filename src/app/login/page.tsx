import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader
          title="ログイン"
          description="ログインIDとパスワードで、自分のポケットを開きます。"
          className="pb-6"
        />

        <LoginForm />

        <AppFooter />
      </div>
    </main>
  );
}
