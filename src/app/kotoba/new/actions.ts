"use server";

import { redirect } from "next/navigation";
import { parseInitialWordInput } from "@/lib/word-validation";
import { createWord } from "@/lib/words-store";

export async function createWordAction(formData: FormData) {
  const input = parseInitialWordInput(formData);

  if (!input) {
    redirect("/kotoba/new");
  }

  const result = await createWord(input);

  if (!result.created) {
    redirect(`/kotoba/${result.word.id}?already=1`);
  }

  redirect(`/kotoba/${result.word.id}/collect`);
}
