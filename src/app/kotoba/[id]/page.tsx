import { notFound } from "next/navigation";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { WordDetail } from "@/components/word-detail";
import { getWord } from "@/lib/words-store";

type WordPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WordPage({ params }: WordPageProps) {
  const { id } = await params;
  const word = await getWord(id);

  if (!word) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばの詳細"
          description="ポケットにしまったことばを、ゆっくり眺めます。"
          className="pb-6"
        />

        <WordDetail word={word} />

        <AppFooter />
      </div>
    </main>
  );
}
