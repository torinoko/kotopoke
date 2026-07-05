import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";

type StaticPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function StaticPage({ title, description, children }: StaticPageProps) {
  return (
    <main className="min-h-screen bg-[#fbf8f1] text-stone-700">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <AppHeader title={title} description={description} className="pb-6" />
        <article className="mt-8 flex-1 rounded-lg border border-stone-200 bg-[#fffdf8] p-6 leading-8 shadow-sm">
          {children}
        </article>
        <AppFooter />
      </div>
    </main>
  );
}
