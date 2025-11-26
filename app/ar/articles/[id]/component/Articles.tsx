"use client"

import { useMemo, useRef, useEffect, ComponentType } from "react";
import DOMPurify from 'isomorphic-dompurify';
import Image from "next/image";;
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  // 🆕 الأيقونات الجديدة للفئات
  Briefcase, // للتواصل المؤسسي
  Bot, // للذكاء الاصطناعي
  Gem, // للمراسم والاتيكيت
  LineChart, // للتسويق الرقمي
  Zap, // لإدارة الأزمات
  Monitor, // للإعلام
  LucideIcon, // النوع الخاص بأيقونات Lucide
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// تسجيل ScrollTrigger لـ GSAP
gsap.registerPlugin(ScrollTrigger);

// ================================
// 📝 1. واجهة البيانات (تعديل الافتراض: categoryArticle هي القيمة العربية)
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
  arAuthor: string;
  enAuthor: string;
  // ⚠️ القيمة الثابتة المخزنة في قاعدة البيانات هي الآن القيمة العربية
  categoryArticle: string;
  specialTag: boolean;
  blogImage: ImageSchema;
  createdAt: string;
  updatedAt: string;
  arKeywords?: string[];
  enKeywords?: string[];
}

interface ArticlesProps {
  articles: Article[];
  language: "ar" | "en";
  allArticles: Article[];
}

// 💡 دالة تحديد الألوان والأيقونات (تعتمد على القيمة العربية الثابتة)
const getCategoryStyles = (
  categoryKey: string
): { className: string; Icon: LucideIcon } => {
  const stylesMap: Record<string, { className: string; Icon: LucideIcon }> = {
    // المفاتيح هنا تتطابق تمامًا مع القيمة العربية القادمة من article.categoryArticle
    "التواصل المؤسسي": {
      className:
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300 border-royal-400",
      Icon: Briefcase,
    },
    "الذكاء الاصطناعي": {
      className:
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300 border-navy-400",
      Icon: Bot,
    },
    "المراسم والاتيكيت": {
      className:
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300 border-crimson-400",
      Icon: Gem,
    },
    "التسويق الرقمي": {
      className:
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300 border-royal-400",
      Icon: LineChart,
    },
    "إدارة الأزمات": {
      className:
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300 border-crimson-400",
      Icon: Zap,
    },
    الإعلام: {
      className:
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300 border-navy-400",
      Icon: Monitor,
    },
  };
  // الإرجاع الافتراضي في حال عدم العثور على تطابق
  return (
    stylesMap[categoryKey] || {
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-400",
      Icon: BookOpen,
    }
  );
};

// ================================
// ⚛️ المكون الرئيسي (Articles)
// ================================
export default function Articles({
  articles,
  language,
  allArticles,
}: ArticlesProps) {
  const article = articles[0];

  const lang = language;
  const isArabic = lang === "ar";

  // 💡 قاموس ترجمة الفئات - المفاتيح هي القيمة العربية الثابتة من الـ DB
  const categoryTranslations = useMemo<
    Record<string, { ar: string; en: string }>
  >(
    () => ({
      // المفتاح هو القيمة العربية المخزنة في قاعدة البيانات
      "التواصل المؤسسي": {
        ar: "التواصل المؤسسي",
        en: "Corporate Communication",
      },
      "الذكاء الاصطناعي": {
        ar: "الذكاء الاصطناعي",
        en: "Artificial Intelligence",
      },
      "المراسم والاتيكيت": {
        ar: "المراسم والاتكيت",
        en: "Protocol & Etiquette",
      },
      "التسويق الرقمي": {
        ar: "التسويق الرقمي",
        en: "Digital Marketing",
      },
      "إدارة الأزمات": {
        ar: "إدارة الأزمات",
        en: "Crisis Management",
      },
      الإعلام: {
        ar: "الإعلام",
        en: "Media",
      },
    }),
    []
  );

  // قاموس ترجمة النصوص الأخرى (تم الإبقاء عليه كما هو)
  const translations = useMemo(
    () => ({
      ar: {
        articleNotFound: "المقال غير موجود",
        backToArticles: "العودة إلى المقالات",
        minutes: "دقائق",
        keywords: "الكلمات المفتاحية",
        shareArticle: "شارك المقال",
        share: "مشاركة",
        expertIn: "خبير في",
        viewOtherArticles: "عرض المقالات الأخرى",
        relatedArticles: "مقالات ذات صلة",
        subscribeNewsletter: "اشترك في نشرتنا",
        newsletterDesc: "احصل على أحدث المقالات والأخبار",
        subscribeNow: "اشترك الآن",
        previousArticle: "المقال السابق",
        nextArticle: "المقال التالي",
      },
      en: {
        articleNotFound: "Article Not Found",
        backToArticles: "Back to Articles",
        minutes: "minutes",
        keywords: "Keywords",
        shareArticle: "Share Article",
        share: "Share",
        expertIn: "Expert in",
        viewOtherArticles: "View Other Articles",
        relatedArticles: "Related Articles",
        subscribeNewsletter: "Subscribe to Newsletter",
        newsletterDesc: "Get the latest articles and news",
        subscribeNow: "Subscribe Now",
        previousArticle: "Previous Article",
        nextArticle: "Next Article",
      },
    }),
    []
  );

  const t = translations[lang];

  // Ref Hooks لـ GSAP (تم الإبقاء عليها كما هي)
  const heroMetaRef = useRef<any>(null);
  const heroTitleRef = useRef<any>(null);
  const heroExcerptRef = useRef<any>(null);
  const articleContentRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const shareTitleRef = useRef<any>(null);
  const authorTitleRef = useRef<any>(null);
  const authorDescRef = useRef<any>(null);
  const relatedTitleRef = useRef<any>(null);
  const relatedItemsRef = useRef<any>(null);
  const newsletterTitleRef = useRef<any>(null);
  const newsletterDescRef = useRef<any>(null);

  // منطق GSAP Animation (تم الإبقاء عليه كما هو)
  useEffect(() => {
    if (!article) return;
    const ctx = gsap.context(() => {
      // Hero Entrance Animation
      gsap.from(
        [heroMetaRef.current, heroTitleRef.current, heroExcerptRef.current],
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        }
      );

      // Content/Sidebar Fade In
      gsap.from(articleContentRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });

      // Tags and Share
      gsap.from([tagsRef.current, shareTitleRef.current], {
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: tagsRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // Sidebar Items Animation
      gsap.from(
        [
          authorTitleRef.current,
          authorDescRef.current,
          relatedTitleRef.current,
          relatedItemsRef.current,
          newsletterTitleRef.current,
          newsletterDescRef.current,
        ],
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.15,
          ease: "power1.out",
          scrollTrigger: {
            trigger: authorTitleRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [article, isArabic]);

  // ====================================================
  // 🔗 تحديد المحتوى المترجم
  // ====================================================

  if (!article) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.articleNotFound}
          </h1>
          <Link href="/articles">
            <Button className="bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700">
              {t.backToArticles}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 💡 الترجمة الفعلية للفئة:
  // articleCategoryKey تحمل الآن القيمة العربية الثابتة (مثال: "التواصل المؤسسي")
  const articleCategoryKey = article.categoryArticle;

  // استخدام المفتاح (العربي) واللغة لجلب الاسم المترجم للعرض
  const articleCategoryName =
    categoryTranslations[articleCategoryKey]?.[lang] || articleCategoryKey;

  // جلب الألوان والأيقونة
  const { className: categoryClassName, Icon: CategoryIcon } =
    getCategoryStyles(articleCategoryKey);

  // باقي الحقول المترجمة (تم الإبقاء عليها كما هي)
  const articleTitle = isArabic
    ? article.arArticleTitle
    : article.enArticleTitle;
  const articleExcerpt = isArabic
    ? article.arArticleDesc
    : article.enArticleDesc;
  const articleContent = isArabic ? article.arBlog : article.enBlog;
  const articleAuthor = isArabic ? article.arAuthor : article.enAuthor;
  const articleKeywords = isArabic ? article.arKeywords : article.enKeywords;

  // حساب البيانات الديناميكية (تم الإبقاء عليها كما هي)
  const datePublished = new Date(article.createdAt).toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const dateModified = new Date(article.updatedAt).toISOString().split("T")[0];
  const wordCount = articleContent.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 250);

  // تحديد المقالات ذات الصلة (باستخدام القيمة العربية الثابتة للمطابقة)
  const currentIndex = allArticles.findIndex((a) => a._id === article._id);
  const previousArticle =
    currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  const relatedArticles = allArticles
    .filter(
      // المقارنة تتم الآن بناءً على القيمة العربية الثابتة
      (a) => a._id !== article._id && a.categoryArticle === articleCategoryKey
    )
    .slice(0, 3);

  // ** 3. تحديث الـ JSON-LD Schema Markup **
  const jsonLd = {
    // ... (تم الإبقاء على الباقي كما هو)
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleTitle,
    description: articleExcerpt,
    image: article.blogImage.url,
    author: {
      "@type": "Person",
      name: articleAuthor,
    },
    publisher: {
      "@type": "Organization",
      name: isArabic
        ? "أكاديمية لندن للإعلام والعلاقات العامة"
        : "London Academy for Media and Public Relations",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lampr.ac/logo.png",
      },
    },
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.lampr.ac/articles/${article._id}`,
    },
    articleSection: articleCategoryName, // ⬅️ استخدام الاسم المترجم هنا
    keywords: articleKeywords?.join(", ") || articleCategoryName,
    wordCount: wordCount,
    timeRequired: `PT${readTime}M`,
  };

  return (
    <>
      {/* ⚠️ إضافة JSON-LD (Schema Markup) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div
                ref={heroMetaRef}
                className="flex items-center gap-4 mb-6 flex-wrap"
              >
                {/* 🎨 تحديث عرض الفئة (Badge) */}
                <Badge
                  // استخدام الألوان المخصصة + إضافة بعض تنسيقات Badge
                  className={`flex items-center gap-1 font-semibold text-sm px-3 py-1 border ${categoryClassName}`}
                >
                  {/* 🆕 عرض الأيقونة */}
                  <CategoryIcon className="w-4 h-4" />
                  {/* 🆕 عرض الاسم المترجم */}
                  {articleCategoryName}
                </Badge>

                <div className="flex items-center gap-4 text-sm text-gray-300 dark:text-gray-400 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{datePublished}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {readTime} {t.minutes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{articleAuthor}</span>
                  </div>
                </div>
              </div>

              <h1
                ref={heroTitleRef}
                className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              >
                {articleTitle}
              </h1>
              <p
                ref={heroExcerptRef}
                className="text-xl text-gray-200 dark:text-gray-300 leading-relaxed"
              >
                {articleExcerpt}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-8">
                <div className="relative overflow-hidden">
                  <Image
                    src={article.blogImage.url || "/placeholder.svg"}
                    alt={articleTitle}
                    width={800}
                    height={320}
                    className="w-full h-64 md:h-80 object-cover"
                    priority
                  />
                </div>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  {/* Article Content */}
                  <div
                    ref={articleContentRef}
                    className="prose prose-lg max-w-none 
                      prose-headings:text-gray-900 dark:prose-headings:text-white 
                      prose-headings:font-bold 
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 
                      prose-p:leading-relaxed 
                      prose-ul:text-gray-700 dark:prose-ul:text-gray-300 
                      prose-ol:text-gray-700 dark:prose-ol:text-gray-300 
                      prose-strong:text-gray-900 dark:prose-strong:text-white
                      prose-li:text-gray-700 dark:prose-li:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleContent) }}
                  />

                  {/* Tags */}
                  <div
                    ref={tagsRef}
                    className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {t.keywords}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(articleKeywords || [articleCategoryName]).map(
                        (tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="tag-badge text-royal-600 dark:text-royal-400 border-royal-300 dark:border-royal-700"
                          >
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Share section (تم الإبقاء عليه كما هو) */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3
                        ref={shareTitleRef}
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {t.shareArticle}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent dark:border-gray-700"
                      >
                        <Share2 className="w-4 h-4" />
                        {t.share}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info (تم الإبقاء عليه كما هو) */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-royal-500 dark:text-royal-400" />
                  </div>
                  <h3
                    ref={authorTitleRef}
                    className="font-bold text-lg text-gray-900 dark:text-white mb-2"
                  >
                    {articleAuthor}
                  </h3>
                  <p
                    ref={authorDescRef}
                    className="text-gray-600 dark:text-gray-400 text-sm mb-4"
                  >
                    {t.expertIn} {articleCategoryName}{" "}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent dark:border-gray-700"
                  >
                    {t.viewOtherArticles}
                  </Button>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3
                    ref={relatedTitleRef}
                    className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5 text-royal-500 dark:text-royal-400" />
                    {t.relatedArticles}
                  </h3>
                  <div ref={relatedItemsRef} className="space-y-4">
                    {relatedArticles.map((relatedArticle) => {
                      // ترجمة اسم الفئة للمقالات ذات الصلة
                      const relatedArticleCategoryName =
                        categoryTranslations[relatedArticle.categoryArticle]?.[
                          lang
                        ] || relatedArticle.categoryArticle;

                      return (
                        <Link
                          key={relatedArticle._id}
                          href={`/articles/${relatedArticle._id}`}
                        >
                          <div className="group cursor-pointer">
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-royal-600 dark:group-hover:text-royal-400 transition-colors text-sm leading-tight mb-2">
                              {isArabic
                                ? relatedArticle.arArticleTitle
                                : relatedArticle.enArticleTitle}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-semibold text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50">
                                {relatedArticleCategoryName}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Card (تم الإبقاء عليه كما هو) */}
              <Card className="bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-royal-600 dark:to-crimson-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3
                    ref={newsletterTitleRef}
                    className="font-bold text-lg mb-3"
                  >
                    {t.subscribeNewsletter}
                  </h3>
                  <p
                    ref={newsletterDescRef}
                    className="text-white/90 text-sm mb-4"
                  >
                    {t.newsletterDesc}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    {t.subscribeNow}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation (تم الإبقاء عليه كما هو) */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
            <Link href="/articles">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent dark:border-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToArticles}
              </Button>
            </Link>

            <div className="flex gap-4 flex-wrap">
              {previousArticle && (
                <Link href={`/articles/${previousArticle._id}`}>
                  <Button variant="outline" className="dark:border-gray-700">
                    {t.previousArticle}
                  </Button>
                </Link>
              )}
              {nextArticle && (
                <Link href={`/articles/${nextArticle._id}`}>
                  <Button variant="outline" className="dark:border-gray-700">
                    {t.nextArticle}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
