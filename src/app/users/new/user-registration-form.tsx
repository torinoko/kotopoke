"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  RegisterUserState,
  registerUserAction,
} from "@/app/users/new/actions";

const initialState: RegisterUserState = {
  status: "idle",
};

const inputClassName =
  "mt-2 w-full rounded-md border border-stone-200 bg-[#fffdf8] px-3 py-3 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5f8f86] focus:ring-2 focus:ring-[#dfeae6]";

const labelClassName = "block text-sm font-medium text-stone-500";

export function UserRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerUserAction,
    initialState,
  );

  if (state.status === "success" && state.user && state.recoveryCode) {
    return (
      <section className="mt-8 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
        <h2 className="text-2xl font-medium text-stone-600">
          ユーザーを作成しました
        </h2>
        <dl className="mt-5 grid gap-4">
          <div>
            <dt className="text-sm font-medium text-stone-500">表示名</dt>
            <dd className="mt-1 text-stone-700">{state.user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">URL ID</dt>
            <dd className="mt-1 text-stone-700">{state.user.slug}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-stone-500">ユーザーURL</dt>
            <dd className="mt-1">
              <Link
                href={state.user.url}
                className="text-[#5f8f86] underline-offset-4 hover:underline"
              >
                {state.user.url}
              </Link>
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md bg-[#f4efe4] p-4">
          <p className="text-sm font-medium text-stone-500">
            リカバリコード
          </p>
          <code className="mt-2 block break-all rounded-md bg-[#fffdf8] p-3 text-stone-700">
            {state.recoveryCode}
          </code>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            このコードは再表示できません。端末を失った場合の復旧に使うため、手元に保存してください。
          </p>
        </div>
      </section>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-8 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm"
    >
      <div>
        <label className={labelClassName} htmlFor="name">
          表示名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={40}
          placeholder="例: aki"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">40文字まで</p>
      </div>

      <div className="mt-5">
        <label className={labelClassName} htmlFor="slug">
          URL ID
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          minLength={3}
          maxLength={30}
          pattern="[a-zA-Z0-9][a-zA-Z0-9-]{2,29}"
          placeholder="例: aki-kotoba"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">
          半角英数字またはハイフン。3文字以上30文字以内。
        </p>
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
        {isPending ? "作成中..." : "ユーザーを作成する"}
      </button>
    </form>
  );
}
