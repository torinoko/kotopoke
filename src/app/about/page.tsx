import { StaticPage } from "@/components/static-page";

export default function AboutPage() {
  return (
    <StaticPage
      title="製作者"
      description="ことぽけを作っている人について。"
    >
      <p>
        ことぽけは、読書や日々の中で出会ったことばを、
        そっとしまっておくための小さなアプリです。
      </p>
      <p className="mt-4">
        まだ作りはじめたばかりですが、ことばとの出会いを大切にできる場所として、
        少しずつ育てています。
      </p>
    </StaticPage>
  );
}
