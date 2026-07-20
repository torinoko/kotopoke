import { NextResponse } from "next/server";
import { getKanaReading } from "@/lib/kana-reading-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text")?.trim() ?? "";

  if (!text) {
    return NextResponse.json({ reading: null });
  }

  const reading = await getKanaReading(text);

  return NextResponse.json({ reading: reading ?? null });
}
