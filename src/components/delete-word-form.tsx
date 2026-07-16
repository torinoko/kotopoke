"use client";

import { useState } from "react";

type DeleteWordFormProps = {
  action: () => void;
};

export function DeleteWordForm({ action }: DeleteWordFormProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="rounded-lg border border-red-100 bg-[#fffdf8] p-4 shadow-sm">
        <p className="text-sm font-medium text-stone-600">
          このことばを削除しますか？
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <form action={action}>
            <button
              type="submit"
              className="w-full rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 sm:w-auto"
            >
              削除する
            </button>
          </form>
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="rounded-md border border-stone-200 bg-[#fffdf8] px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white"
          >
            やめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="rounded-md px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
    >
      このことばを削除
    </button>
  );
}
