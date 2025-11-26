import ArticlesPage from "./components/Articles";
import { generatePageMetadata } from '@/lib/seo-utils'
import type { Metadata } from "next";
import fetchArticles from "@/lib/fetchArticles";

export const metadata: Metadata = {
  title: "المقالات | أكاديمية لندن للإعلام والعلاقات العامة",
  description:
    "اطلع على أحدث المقالات والأخبار في مجال الإعلام والعلاقات العامة من خبراء أكاديمية لندن",
};

const Page = async () => {
  const articles = await fetchArticles(); // هيرجع مباشرة array جاهزة

  return <ArticlesPage articles={articles} />;
};

export default Page;
