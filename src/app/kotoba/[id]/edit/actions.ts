"use server";

import { notFound, redirect } from "next/navigation";
import { parseWordInput } from "@/lib/word-validation";
import { deleteWord, updateWord } from "@/lib/words-store";

export async function updateWordAction(id: string, formData: FormData) {
  const input = parseWordInput(formData);

  if (!input) {
    redirect(`/kotoba/${id}/edit`);
  }

  const word = await updateWord(id, input);

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
