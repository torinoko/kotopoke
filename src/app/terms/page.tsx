import { StaticPage } from "@/components/static-page";

export default function TermsPage() {
  return (
    <StaticPage
      title="利用規約"
      description="ことぽけを使うときの簡単な決まりです。"
    >
      <section>
        <h2 className="text-xl font-medium text-stone-600">利用について</h2>
        <p className="mt-3">
          ことぽけは、個人が出会ったことばを記録し、見返すためのアプリです。
          無理のない範囲で、気持ちよく使ってください。
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium text-stone-600">禁止事項</h2>
        <p className="mt-3">
          他の人を傷つける使い方、権利を侵害する使い方、
          アプリの動作を妨げる使い方はしないでください。
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium text-stone-600">変更について</h2>
        <p className="mt-3">
          この内容は、アプリの成長に合わせて見直すことがあります。
        </p>
      </section>
    </StaticPage>
  );
}
