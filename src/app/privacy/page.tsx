import { StaticPage } from "@/components/static-page";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="プライバシーポリシー"
      description="ことぽけで扱う情報のこと。"
    >
      <section>
        <h2 className="text-2xl font-medium text-stone-600">扱う情報</h2>
        <p className="mt-3">
          ことぽけでは、ユーザーが入力した以下の内容を保存します。<br/>
        </p>

        <h3 className="mt-2 text-xl">ユーザー情報</h3>
        <ol className="list-inside list-disc">
          <li>ID</li>
          <li>表示名</li>
          <li>パスワード</li>
        </ol>

        <h3 className="mt-2 text-xl">ことばの情報</h3>
        <ol className="list-inside list-disc">
          <li>ことば（単語、熟語）</li>
          <li>ことばをひろった場所</li>
          <li>ことばから受けた印象</li>
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-medium text-stone-600">利用目的</h2>
        <p className="mt-3">
          入力された情報は、ことばを保存し、見返しやすくするために利用します。
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-medium text-stone-600">今後の見直し</h2>
        <p className="mt-3">
          今後機能を追加するときは、その内容に合わせてこのページを更新します。
        </p>
      </section>
    </StaticPage>
  );
}
