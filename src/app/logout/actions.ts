"use server";

import { redirect } from "next/navigation";
import { clearCurrentUserCookie } from "@/lib/users-store";

export async function logoutAction() {
  await clearCurrentUserCookie();
  redirect("/");
}
