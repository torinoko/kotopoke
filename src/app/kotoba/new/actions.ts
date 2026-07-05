"use server";

import { redirect } from "next/navigation";
import { createWord } from "@/lib/words-store";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: string) {
  return value ? value : undefined;
}

export async function createWordAction(formData: FormData) {
  const text = getText(formData, "text");

  if (!text) {
    redirect("/kotoba/new");
  }

  const word = await createWord({
    text,
    sourceTitle: optionalText(getText(formData, "sourceTitle")),
    reading: optionalText(getText(formData, "reading")),
    meaning: optionalText(getText(formData, "meaning")),
    impression: optionalText(getText(formData, "impression")),
  });

  redirect(`/kotoba/${word.id}`);
}
