import { notFound } from "next/navigation";
import { WordsListPage } from "@/components/words-list-page";
import { getCurrentUser } from "@/lib/users-store";
import { getWordsPageByUserId } from "@/lib/words-store";

type UserWordsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function UserWordsPage({ params, searchParams }: UserWordsPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (id !== user.slug) {
    notFound();
  }

  const { page } = await searchParams;
  const pageNumber = Number(page);
  const wordsPage = await getWordsPageByUserId(
    user.id,
    Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
  );

  return (
    <WordsListPage
      {...wordsPage}
      title={`${user.name}のことばたち`}
      description="ポケットにしまったことばを見返します。"
      basePath={`/${user.slug}/kotobatachi`}
    />
  );
}
