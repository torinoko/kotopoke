import { redirect } from "next/navigation";
import { WordsListPage } from "@/components/words-list-page";
import { getCurrentUser } from "@/lib/users-store";
import { getWordsPage } from "@/lib/words-store";

type WordsPageProps = {
  searchParams: Promise<{ page?: string; scope?: string }>;
};

export default async function WordsPage({ searchParams }: WordsPageProps) {
  const { page, scope } = await searchParams;
  const pageNumber = Number(page);
  const currentPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  if (scope === "mine") {
    const user = await getCurrentUser();
    redirect(`/${user.slug}/kotobatachi?page=${currentPage}`);
  }

  const wordsPage = await getWordsPage(currentPage);
  return (
    <WordsListPage
      {...wordsPage}
      title="ことばたち"
      description="みんながしまったことばを眺めます。"
      basePath="/kotobatachi"
    />
  );
}
