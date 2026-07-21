import { logoutAction } from "@/app/logout/actions";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="transition hover:text-[#5f8f86]">
        ログアウト
      </button>
    </form>
  );
}
