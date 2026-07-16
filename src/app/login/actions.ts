"use server";

import { authenticateUser, setCurrentUserCookie } from "@/lib/users-store";

export type LoginState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: LoginState = {
  status: "idle",
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(
  _state: LoginState = initialState,
  formData: FormData,
): Promise<LoginState> {
  const slug = getText(formData, "slug").toLowerCase();
  const password = getText(formData, "password");

  if (!slug || !password) {
    return {
      status: "error",
      message: "ログインIDとパスワードを入力してください。",
    };
  }

  const user = await authenticateUser({ slug, password });

  if (!user) {
    return {
      status: "error",
      message: "ログインIDまたはパスワードが違います。",
    };
  }

  await setCurrentUserCookie(user.id);

  return {
    status: "success",
  };
}
