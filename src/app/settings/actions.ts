"use server";

import { revalidatePath } from "next/cache";
import { updateCurrentUserVisibility } from "@/lib/users-store";

export async function updateVisibilityAction(formData: FormData) {
  const isPublic = formData.get("isPublic") === "on";
  await updateCurrentUserVisibility(isPublic);
  revalidatePath("/settings");
}
