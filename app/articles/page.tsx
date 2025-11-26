import ArticlesPage from "./components/Articles";
import { generatePageMetadata } from '@/lib/seo-utils'
import type { Metadata } from "next";
import fetchArticles from "@/lib/fetchArticles";

export const metadata: Metadata = {
  title: "Articles & News | London Academy for Media & PR",
  description:
    "Explore the latest articles and news in media and public relations from London Academy experts",
};

const Page = async () => {
  const articles = await fetchArticles();
  return <ArticlesPage articles={articles} />;
};

export default Page;
