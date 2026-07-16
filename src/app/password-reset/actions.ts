"use server";

import {
  resetPasswordWithRecoveryCode,
  setCurrentUserCookie,
} from "@/lib/users-store";

export type PasswordResetState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: PasswordResetState = {
  status: "idle",
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function resetPasswordAction(
  _state: PasswordResetState = initialState,
  formData: FormData,
): Promise<PasswordResetState> {
  const slug = getText(formData, "slug").toLowerCase();
  const recoveryCode = getText(formData, "recoveryCode");
  const password = getText(formData, "password");

  if (!slug || !recoveryCode || password.length < 8) {
    return {
      status: "error",
      message:
        "ログインID、リカバリコード、8文字以上の新しいパスワードを入力してください。",
    };
  }

  const user = await resetPasswordWithRecoveryCode({
    slug,
    recoveryCode,
    password,
  });

  if (!user) {
    return {
      status: "error",
      message: "入力内容を確認してください。",
    };
  }

  await setCurrentUserCookie(user.id);

  return {
    status: "success",
  };
}
