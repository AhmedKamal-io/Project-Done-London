"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedBackground from "@/components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

// =======================================================
// ** 1. تحديد هيكل البيانات المستقبلة من Server Component (المُعدل) **
// =======================================================
interface ImageSchema {
  url: string;
  public_id: string;
}

interface Article {
  _id: string; // ObjectId من Mongoose
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  arBlog: string;
  enBlog: string;
  // 💡 تم تحديث حقول الكاتب لتكون مترجمة
  arAuthor: string;
  enAuthor: string;
  // يمكن إضافة حقول الكلمات المفتاحية هنا إذا لزم الأمر:
  // arKeywords: string[];
  // enKeywords: string[];
  categoryArticle: string; // فئة المقال
  specialTag: boolean; // مقال مميز (يساوي featured)
  blogImage: ImageSchema;
  createdAt: string; // من timestamps
  updatedAt: string; // من timestamps
}

interface ArticlesPageProps {
  articles: Article[];
}
// =======================================================

// 2. تعديل تعريف المكون لإضافة قيمة افتراضية { articles = [] } لمنع خطأ .filter
export default function ArticlesPage({ articles = [] }: ArticlesPageProps) {
  const { i18n } = useTranslation();
  const isArabic = true; // Force Arabic for /ar/articles route

  // تعريف الـ Refs للـ GSAP (لم يتم التغيير عليها)
  const heroTitleRef = useRef<any>(null);
  const heroSubtitleRef = useRef<any>(null);
  const featuredTitleRef = useRef<any>(null);
  const featuredArticlesRef = useRef<any>(null);
  const allArticlesTitleRef = useRef<any>(null);
  const regularArticlesRef = useRef<any>(null);
  const newsletterTitleRef = useRef<any>(null);
  const newsletterSubtitleRef = useRef<any>(null);

  // 3. الدوال المساعدة للتعامل مع الترجمة والتاريخ (تم إضافة getArticleAuthor)
  const getArticleTitle = (article: Article) =>
    isArabic ? article.arArticleTitle : article.enArticleTitle;
  const getArticleDesc = (article: Article) =>
    isArabic ? article.arArticleDesc : article.enArticleDesc;

  // 💡 الدالة الجديدة: الحصول على اسم الكاتب المترجم
  const getArticleAuthor = (article: Article) =>
    isArabic ? article.arAuthor : article.enAuthor;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (article: Article) => {
    // قيمة تقديرية ثابتة
    return isArabic ? "5 دقائق" : "5 min read";
  };

  const t = {
    // ... (كود الترجمة لم يتغير)
    ar: {
      heroTitle: "المقالات والأخبار",
      heroSubtitle:
        "اطلع على أحدث المقالات والأخبار في مجال الإعلام والعلاقات العامة من خبراء أكاديمية لندن",
      searchPlaceholder: "ابحث في المقالات...",
      featuredTitle: "المقالات المميزة",
      allArticles: "جميع المقالات",
      readArticle: "اقرأ المقال",
      newsletterTitle: "اشترك في نشرتنا الإخبارية",
      newsletterSubtitle:
        "احصل على أحدث المقالات والأخبار في مجال الإعلام والعلاقات العامة",
      subscribeNow: "اشترك الآن",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      categories: [
        "جميع المقالات",
        "التواصل المؤسسي",
        "الذكاء الاصطناعي",
        "المراسم والاتكيت",
        "التسويق الرقمي",
        "إدارة الأزمات",
        "الإعلام",
      ],
    },
    en: {
      heroTitle: "Articles & News",
      heroSubtitle:
        "Explore the latest articles and insights in media and public relations from London Academy experts.",
      searchPlaceholder: "Search articles...",
      featuredTitle: "Featured Articles",
      allArticles: "All Articles",
      readArticle: "Read Article",
      newsletterTitle: "Subscribe to Our Newsletter",
      newsletterSubtitle:
        "Get the latest updates and articles in media and communication",
      subscribeNow: "Subscribe Now",
      emailPlaceholder: "Enter your email address",
      categories: [
        "All Articles",
        "Corporate Communication",
        "Artificial Intelligence",
        "Etiquette & Protocol",
        "Digital Marketing",
        "Crisis Management",
        "Media",
      ],
    },
  };

  const lang = isArabic ? t.ar : t.en;

  // 4. استخدام البيانات القادمة من الـ props لتصفية المقالات (لم يتغير)
  const featuredArticles = Array.isArray(articles)
    ? articles.filter((a) => a.specialTag)
    : [];

  const regularArticles = Array.isArray(articles)
    ? articles.filter((a) => !a.specialTag)
    : [];
  const getCategoryColor = (category: string) =>
    isArabic
      ? "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-200"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";

  // كود الـ GSAP يبقى كما هو
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ... (كود GSAP)
    });

    return () => ctx.revert();
  }, [isArabic]);

  const categoryMap: Record<string, string> = {
    "التواصل المؤسسي": "Corporate Communication",
    "الذكاء الاصطناعي": "Artificial Intelligence",
    "المراسم والإتيكيت": "Etiquette & Protocol",
    "التسويق الرقمي": "Digital Marketing",
    "إدارة الأزمات": "Crisis Management",
    الإعلام: "Media",
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors`}
    >
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden text-white bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 dark:from-royal-950 dark:via-navy-900 dark:to-royal-900">
        <AnimatedBackground variant="orbs" />
        <div className="container relative z-10 px-4 mx-auto text-center">
          <h1
            ref={heroTitleRef}
            className="mb-6 text-4xl font-bold lg:text-6xl"
          >
            {lang.heroTitle}
          </h1>
          <p
            ref={heroSubtitleRef}
            className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-200 dark:text-gray-300"
          >
            {lang.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="container px-4 py-16 mx-auto">
        {/* Search + Filter (لم يتغير) */}
        <Card className="mb-12 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search
                  className={`absolute ${
                    isArabic ? "left-3" : "right-3"
                  } top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300`}
                />
                <Input
                  placeholder={lang.searchPlaceholder}
                  className={`${
                    isArabic ? "pl-10 text-right" : "pr-10 text-left"
                  } dark:bg-gray-900 dark:text-white dark:border-gray-700`}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {lang.categories.map((category, i) => (
                  <Button
                    key={i}
                    variant={i === 0 ? "default" : "outline"}
                    size="sm"
                    className={`${
                      i === 0
                        ? "bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700"
                        : "dark:border-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <>
            <h2
              ref={featuredTitleRef}
              className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              {lang.featuredTitle}
            </h2>
            <div
              ref={featuredArticlesRef}
              className="grid gap-8 mb-16 md:grid-cols-2"
            >
              {featuredArticles.map((article) => (
                <Card
                  key={article._id} // استخدام _id
                  className="overflow-hidden transition-all duration-500 border-0 group hover:shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={article.blogImage.url}
                      alt={getArticleTitle(article)}
                      width={400}
                      height={256}
                      className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={getCategoryColor(article.categoryArticle)}
                      >
                        {article.categoryArticle} /{" "}
                        {categoryMap[article.categoryArticle] || ""}
                      </Badge>
                    </div>
                    {article.specialTag && ( // عرض "Featured" بناءً على specialTag
                      <div className="absolute top-4 left-4">
                        <Badge className="text-white bg-royal-500 dark:bg-royal-600">
                          {isArabic ? "مميز" : "Featured"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors article-title dark:text-white group-hover:text-royal-700 dark:group-hover:text-royal-400">
                      {getArticleTitle(article)} {/* العنوان المترجم */}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 article-excerpt dark:text-gray-300">
                      {getArticleDesc(article)} {/* الوصف المترجم */}
                    </p>
                    <div
                      className={`article-meta flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 ${
                        isArabic ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getArticleAuthor(article)} {/* 💡 تم التعديل هنا */}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.createdAt)} {/* تاريخ الإنشاء */}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getReadTime(article)} {/* وقت القراءة (تقديري) */}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent group-hover:bg-royal-50 group-hover:border-royal-300 dark:group-hover:bg-royal-900 dark:border-gray-700 dark:text-gray-200"
                    >
                      <Link
                        href={`/ar/articles/${article._id}`}
                        className="flex items-center gap-2"
                      >
                        {lang.readArticle}
                        {isArabic ? (
                          <ArrowLeft className="w-3 h-3" />
                        ) : (
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Regular Articles */}
        <h2
          ref={allArticlesTitleRef}
          className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {lang.allArticles}
        </h2>
        <div
          ref={regularArticlesRef}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {regularArticles.map((article) => (
            <Card
              key={article._id}
              className="overflow-hidden transition-all duration-500 border-0 group hover:shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={article.blogImage.url}
                  alt={getArticleTitle(article)}
                  width={400}
                  height={192}
                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getCategoryColor(article.categoryArticle)}>
                    {article.categoryArticle} /{" "}
                    {categoryMap[article.categoryArticle] || ""}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors article-title dark:text-white group-hover:text-royal-700 dark:group-hover:text-royal-400">
                  {getArticleTitle(article)}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 article-excerpt dark:text-gray-300">
                  {getArticleDesc(article)}
                </p>
                <div
                  className={`article-meta flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 ${
                    isArabic ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {getArticleAuthor(article)} {/* 💡 تم التعديل هنا */}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getReadTime(article)}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent group-hover:bg-royal-50 group-hover:border-royal-300 dark:group-hover:bg-royal-900 dark:border-gray-700 dark:text-gray-200"
                >
                  <Link
                    href={`/ar/articles/${article._id}`}
                    className="flex items-center gap-2"
                  >
                    {lang.readArticle}
                    {isArabic ? (
                      <ArrowLeft className="w-3 h-3" />
                    ) : (
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    )}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter (لم يتغير) */}
        <Card className="mt-16 text-white border-0 bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-royal-800 dark:to-crimson-700">
          <CardContent className="p-12 text-center">
            <h2 ref={newsletterTitleRef} className="mb-4 text-3xl font-bold">
              {lang.newsletterTitle}
            </h2>
            <p
              ref={newsletterSubtitleRef}
              className="mb-8 text-xl text-white/90"
            >
              {lang.newsletterSubtitle}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              <Input
                placeholder={lang.emailPlaceholder}
                className="text-white bg-white/20 border-white/30 placeholder:text-white/70 dark:bg-gray-900/40"
              />
              <Button className="bg-white text-royal-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-royal-800">
                {lang.subscribeNow}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
