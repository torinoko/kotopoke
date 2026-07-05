import { StaticPage } from "@/components/static-page";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="プライバシーポリシー"
      description="ことぽけで扱う情報について。"
    >
      <section>
        <h2 className="text-xl font-medium text-stone-600">扱う情報</h2>
        <p className="mt-3">
          ことぽけでは、保存したことば、拾った場所、印象など、
          ユーザーが入力した内容を扱う予定です。
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium text-stone-600">利用目的</h2>
        <p className="mt-3">
          入力された情報は、ことばを保存し、見返しやすくするために利用します。
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium text-stone-600">今後の見直し</h2>
        <p className="mt-3">
          ログイン機能や外部サービス連携を追加するときは、
          その内容に合わせてこのページを更新します。
        </p>
      </section>
    </StaticPage>
  );
}
