"use server";

import { createUser, isValidSlug } from "@/lib/users-store";

export type RegisterUserState = {
  status: "idle" | "success" | "error";
  message?: string;
  user?: {
    name: string;
    slug: string;
    url: string;
  };
  recoveryCode?: string;
};

const initialState: RegisterUserState = {
  status: "idle",
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function registerUserAction(
  _state: RegisterUserState = initialState,
  formData: FormData,
): Promise<RegisterUserState> {
  const name = getText(formData, "name");
  const slug = getText(formData, "slug").toLowerCase();

  if (!name || name.length > 40) {
    return {
      status: "error",
      message: "表示名は1文字以上40文字以内で入力してください。",
    };
  }

  if (!isValidSlug(slug)) {
    return {
      status: "error",
      message:
        "URL ID は半角英数字またはハイフンで、3文字以上30文字以内にしてください。",
    };
  }

  try {
    const result = await createUser({ name, slug });

    if (!result) {
      return {
        status: "error",
        message: "入力内容を確認してください。",
      };
    }

    return {
      status: "success",
      user: {
        name: result.user.name,
        slug: result.user.slug,
        url: `/users/${result.user.slug}`,
      },
      recoveryCode: result.recoveryCode,
    };
  } catch (error) {
    if (isUniqueError(error)) {
      return {
        status: "error",
        message: "その URL ID はすでに使われています。",
      };
    }

    return {
      status: "error",
      message: "ユーザー登録に失敗しました。",
    };
  }
}
