"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/app/login/actions";
import type { LoginState } from "@/app/login/actions";

const initialState: LoginState = {
  status: "idle",
};

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    router.push("/");
  }, [router, state.status]);

  return (
    <form
      action={formAction}
      className="mt-8 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm"
    >
      <div>
        <label className={labelClassName} htmlFor="slug">
          ログインID
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          autoComplete="username"
          className={inputClassName}
        />
      </div>

      <div className="mt-5">
        <label className={labelClassName} htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClassName}
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75] disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isPending ? "ログイン中..." : "ログインする"}
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/password-reset"
          className="text-sm text-gray-500" >
          パスワードを忘れた
        </Link>
      </div>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/users/new"
          className="text-sm text-gray-500">
          新規登録
        </Link>
      </div>
    </form>
  );
}
