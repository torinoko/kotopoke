import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { WordDetail } from "@/components/word-detail";
import { sampleWord } from "@/lib/sample-word";

export default function SampleWordPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        <AppHeader
          title="ことばの詳細"
          description="まずはひとつのことばを、詳細画面として表示します。"
          className="pb-6"
        />

        <WordDetail word={sampleWord} />

        <AppFooter />
      </div>
    </main>
  );
}
