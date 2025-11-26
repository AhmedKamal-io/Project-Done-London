// app/articles/[id]/page.tsx
import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import connectToDB from "@/lib/db/db";
import ArticleModel from "@/lib/db/models/articles";
// ⚠️ ملاحظة: يجب أن يكون المكون Articles قادراً على التعامل مع مقال واحد
import Articles from "./component/Articles";
import JsonLd from "@/components/JsonLd";

// ================================
// ** 1. تعديل واجهات TypeScript (Schema الجديدة) **
// ================================
interface ImageSchema {
  url: string;
  public_id: string;
}

interface Article {
  _id: string;
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  arBlog: string;
  enBlog: string;
  // 💡 التعديل هنا: استخدام حقول الكاتب المترجمة
  arAuthor: string;
  enAuthor: string;
  categoryArticle: string;
  specialTag: boolean;
  blogImage: ImageSchema;
  createdAt: string;
  updatedAt: string;
  // 💡 التعديل هنا: التأكد من نوع الكلمات المفتاحية (مصفوفة)
  arKeywords?: string[];
  enKeywords?: string[];
}

interface ArticlePageProps {
  params: { id: string };
}

// ================================
// 🔹 Generate Metadata (المعدلة)
// ================================
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  await connectToDB();
  const cookieStore = cookies();
  const language = (cookieStore.get("language")?.value ||
    cookieStore.get("i18next")?.value ||
    "ar") as "ar" | "en";

  // جلب المقال
  const article = (await ArticleModel.findById(params.id).lean()) as
    | (Article & { keywords?: any; author?: any })
    | null;

  if (!article) {
    return {
      title:
        language === "ar"
          ? "المقال غير موجود | أكاديمية لندن"
          : "Article Not Found | London Academy",
      description:
        language === "ar"
          ? "المقال المطلوب غير متوفر"
          : "The requested article is not available",
    };
  }

  const academyName =
    language === "ar"
      ? "أكاديمية لندن للإعلام والعلاقات العامة"
      : "London Academy for Media & PR";
  const title =
    language === "ar" ? article.arArticleTitle : article.enArticleTitle;
  const excerpt =
    language === "ar" ? article.arArticleDesc : article.enArticleDesc;
  const imageUrl = article.blogImage?.url || "/placeholder.svg";

  // 💡 تم تحديث الكلمات المفتاحية واسم الكاتب للميتاداتا
  const keywords =
    language === "ar"
      ? article.arKeywords?.join(", ")
      : article.enKeywords?.join(", ");
  const authorName = language === "ar" ? article.arAuthor : article.enAuthor;

  return {
    title: `${title} | ${academyName}`,
    description: excerpt,
    keywords: keywords || "", // استخدام الكلمات المفتاحية المترجمة
    authors: [{ name: authorName }], // استخدام اسم الكاتب المترجم
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      locale: language === "ar" ? "ar_SA" : "en_GB",
      images: [{ url: imageUrl, width: 800, height: 400, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: language === 'ar' 
        ? `https://www.lampr.ac/ar/articles/${article._id}`
        : `https://www.lampr.ac/articles/${article._id}`,
      languages: {
        "ar-SA": `https://www.lampr.ac/ar/articles/${article._id}`,
        "en-GB": `https://www.lampr.ac/articles/${article._id}`,
      },
    },
  };
}

// ================================
// 🔹 الصفحة الرئيسية (المعدلة)
// ================================
const Page = async ({ params }: ArticlePageProps) => {
  await connectToDB();

  // 🧭 قراءة اللغة من الكوكيز
  const cookieStore = cookies();
  const language = (cookieStore.get("language")?.value ||
    cookieStore.get("i18next")?.value ||
    "ar") as "ar" | "en";

  // 🗂️ جلب المقال مباشرة بالـ ID ليكون أكثر كفاءة
  const articleFromDB = (await ArticleModel.findById(params.id).lean()) as
    | (Article & { keywords?: any; author?: any })
    | null;

  if (!articleFromDB) {
    return (
      <p className="text-center py-20 text-lg">
        {language === "ar" ? "المقال غير موجود" : "Article Not Found"}
      </p>
    );
  }

  // 🧱 تحويل المقال لواجهة Article (مع تعيين الحقول الجديدة)
  const article: Article = {
    _id: articleFromDB._id.toString(),
    arArticleTitle: articleFromDB.arArticleTitle,
    enArticleTitle: articleFromDB.enArticleTitle,
    arArticleDesc: articleFromDB.arArticleDesc,
    enArticleDesc: articleFromDB.enArticleDesc,
    arBlog: articleFromDB.arBlog,
    enBlog: articleFromDB.enBlog,
    // 💡 تعيين الحقول الجديدة
    arAuthor: articleFromDB.arAuthor,
    enAuthor: articleFromDB.enAuthor,
    categoryArticle: articleFromDB.categoryArticle,
    specialTag: articleFromDB.specialTag,
    blogImage: articleFromDB.blogImage,
    createdAt: articleFromDB.createdAt,
    updatedAt: articleFromDB.updatedAt,
    // 💡 تعيين الكلمات المفتاحية الجديدة
    arKeywords: articleFromDB.arKeywords,
    enKeywords: articleFromDB.enKeywords,
  };

  // Article Schema للحصول على Rich Snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": language === "ar" ? article.arArticleTitle : article.enArticleTitle,
    "description": language === "ar" ? article.arArticleDesc : article.enArticleDesc,
    "image": [
      article.blogImage?.url || "/placeholder.svg"
    ],
    "author": {
      "@type": "Person",
      "name": language === "ar" ? article.arAuthor : article.enAuthor
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": language === "ar" ? "أكاديمية لندن للإعلام والعلاقات العامة" : "London Academy for Media & PR",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.lampr.ac/logo.png"
      }
    },
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.lampr.ac/articles/${article._id}`
    },
    "keywords": language === "ar" ? article.arKeywords?.join(", ") : article.enKeywords?.join(", "),
    "articleSection": article.categoryArticle
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": language === "ar" ? "الرئيسية" : "Home",
      "item": "https://www.lampr.ac"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": language === "ar" ? "المقالات" : "Articles",
      "item": "https://www.lampr.ac/articles"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": language === "ar" ? article.arArticleTitle : article.enArticleTitle,
      "item": `https://www.lampr.ac/articles/${article._id}`
    }]
  };

  // ✅ تمرير المقال واللغة معًا كـ props
  // نفترض أن مكون <Articles> يمكنه التعامل مع مصفوفة تحتوي على مقال واحد
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Articles articles={[article]} language={language} allArticles={[]} />
    </>
  );
};

export default Page;
