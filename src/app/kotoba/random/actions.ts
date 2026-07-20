"use server";

import { redirect } from "next/navigation";
import { createWord } from "@/lib/words-store";

export async function collectRandomWordAction(formData: FormData) {
  const text = formData.get("text");
  const reading = formData.get("reading");
  const meaning = formData.get("meaning");

  if (typeof text !== "string" || !text.trim()) {
    redirect("/kotoba/random");
  }

  const result = await createWord({
    text: text.trim(),
    reading: typeof reading === "string" ? reading : undefined,
    source: "ことぽけ",
    meaning: typeof meaning === "string" ? meaning : undefined,
  });

  if (!result.created) {
    redirect(`/kotoba/${result.word.id}`);
  }

  redirect(`/kotoba/${result.word.id}/collect`);
}
