"use server";

import { notFound, redirect } from "next/navigation";
import { createAnotherWordEncounter } from "@/lib/words-store";

export async function createAnotherWordEncounterAction(id: string) {
  const word = await createAnotherWordEncounter(id);

  if (!word) {
    notFound();
  }

  redirect(`/kotoba/${word.id}/collect`);
}
