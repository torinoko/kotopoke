"use server";

import { redirect } from "next/navigation";
import { parseWordInput } from "@/lib/word-validation";
import { createWord } from "@/lib/words-store";

export async function createWordAction(formData: FormData) {
  const input = parseWordInput(formData);

  if (!input) {
    redirect("/kotoba/new");
  }

  const word = await createWord(input);

  redirect(`/kotoba/${word.id}`);
}
