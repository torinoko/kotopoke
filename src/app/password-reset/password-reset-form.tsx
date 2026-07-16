"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { resetPasswordAction } from "@/app/password-reset/actions";
import type { PasswordResetState } from "@/app/password-reset/actions";

const initialState: PasswordResetState = {
  status: "idle",
};

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

export function PasswordResetForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
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
        <label className={labelClassName} htmlFor="recoveryCode">
          リカバリコード
        </label>
        <input
          id="recoveryCode"
          name="recoveryCode"
          type="text"
          required
          className={inputClassName}
        />
      </div>

      <div className="mt-5">
        <label className={labelClassName} htmlFor="password">
          新しいパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">8文字以上</p>
      </div>

      {state.status === "error" && state.message && (
        <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 rounded-md bg-[#5f8f86] px-5 py-3 text-center font-medium text-white transition hover:bg-[#4f7d75] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isPending ? "更新中..." : "パスワードを再設定する"}
      </button>
    </form>
  );
}
