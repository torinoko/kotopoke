import { notFound } from "next/navigation";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getUserBySlug } from "@/lib/users-store";

type UserPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader title={user.name} description={`/${user.slug}`} className="pb-6" />

        <section className="mt-8 flex-1 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 shadow-sm">
          <p className="leading-7 text-stone-700">
            このユーザーの公開ページです。公開する内容は今後整理します。
          </p>
        </section>

        <AppFooter />
      </div>
    </main>
  );
}
