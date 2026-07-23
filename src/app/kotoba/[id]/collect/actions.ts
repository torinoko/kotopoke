"use server";

import { notFound, redirect } from "next/navigation";
import { parseWordReflectionInput } from "@/lib/word-validation";
import { deleteWord, updateWordReflection } from "@/lib/words-store";

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

export async function deleteWordAction(id: string) {
  const deleted = await deleteWord(id);

  if (!deleted) {
    notFound();
  }

  redirect("/kotobatachi");
}
