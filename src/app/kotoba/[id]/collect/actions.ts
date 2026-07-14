"use server";

import { notFound, redirect } from "next/navigation";
import { parseWordReflectionInput } from "@/lib/word-validation";
import { updateWordReflection } from "@/lib/words-store";

export async function updateWordReflectionAction(
  id: string,
  formData: FormData,
) {
  const input = parseWordReflectionInput(formData);

  if (!input) {
    redirect(`/kotoba/${id}/collect`);
  }

  const word = await updateWordReflection(id, input);

  if (!word) {
    notFound();
  }

  redirect(`/kotoba/${word.id}`);
}
