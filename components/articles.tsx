"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ==========================
// 1. تعريف الأنواع المحدثة للـ Props (للتوافق مع IArticle في HomePage.tsx)
// ==========================
interface ArticleImage {
  url: string;
  public_id: string;
}

export interface ArticleProps {
  _id: string;
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  author: string;
  categoryArticle: string;
  blogImage: ArticleImage;
  createdAt: string;
}

interface ArticlesComponentProps {
  articles: ArticleProps[];
  language: "ar" | "en";
}

// ==========================
// 2. دالة الكومبوننت
// ==========================
export default function Articles({
  articles,
  language,
}: ArticlesComponentProps) {
  const { i18n } = useTranslation();
  const lng = language || i18n.language || "ar";
  const isArabic = lng === "ar";

  const sectionRef = useRef<any>(null);
  const headingRef = useRef<any>(null);
  const articlesGridRef = useRef<any>(null);
  const viewAllRef = useRef<any>(null);

  // 🏆 فحص المقالات: إذا كانت فارغة، نكتفي بعرض العنوان أو لا شيء
  if (!articles || articles.length === 0) {
    // ✅ نرجع 'null' لتجنب الأخطاء، لكن القسم لن يظهر إذا لم تكن هناك مقالات.
    return null;
  }

  const translations: any = {
    ar: {
      sectionTitle: "أحدث المقالات والأخبار",
      sectionSubtitle:
        "اطلع على آخر المقالات والأخبار في مجال الإعلام والعلاقات العامة من خبرائنا",
      readArticle: "اقرأ المقال",
      viewAll: "عرض جميع المقالات",
    },
    en: {
      sectionTitle: "Latest Articles & News",
      sectionSubtitle:
        "Discover the latest insights and updates in media and public relations from our experts",
      readArticle: "Read Article",
      viewAll: "View All Articles",
    },
  };

  // 💡 خريطة لترجمة فئة المقال من العربية إلى الإنجليزية
  const categoryMap: Record<string, string> = {
    "التواصل المؤسسي": "Corporate Communication",
    "الذكاء الاصطناعي": "Artificial Intelligence",
    "المراسم والإتيكيت": "Etiquette & Protocol",
    "التسويق الرقمي": "Digital Marketing",
    "إدارة الأزمات": "Crisis Management",
    الإعلام: "Media",
  };

  const t = translations[lng];

  // دالة لمساعدتك في تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(
      lng === "ar" ? "ar-EG" : "en-US",
      options
    );
  };

  // دالة بسيطة لتقدير وقت القراءة
  const getReadTime = (desc: string) => {
    const wordCount = desc.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return lng === "ar" ? `${minutes} دقائق` : `${minutes} min read`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading animation
      gsap.from(headingRef.current?.children, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Article cards stagger
      gsap.from(articlesGridRef.current?.children, {
        scrollTrigger: {
          trigger: articlesGridRef.current,
          start: "top 70%",
        },
        y: 80,
        // ❌ تم إزالة opacity: 0 لتجنب الإخفاء الكامل قبل التحريك
        // GSAP سيفترض أن الكائن يبدأ عند y: 80 و opacity: 1 (إذا لم يتم تعيينه)
        // أو يمكنك إضافة: autoAlpha: 0.01 للحفاظ على رؤية العنصر قبل التحريك
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        // 💡 لضمان الظهور في حالة فشل التحريك، يمكن إضافة:
        onComplete: () => {
          gsap.set(articlesGridRef.current?.children, { clearProps: "all" });
        },
      });

      // 3. View all button
      gsap.from(viewAllRef.current, {
        scrollTrigger: {
          trigger: viewAllRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-500 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ... (Backgrounds) ... */}
      <div className="absolute rounded-full top-20 right-20 w-72 h-72 bg-emerald-100/30 dark:bg-emerald-900/20 blur-3xl"></div>
      <div className="absolute rounded-full bottom-20 left-20 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/20 blur-3xl"></div>

      <div className="container relative z-10 px-4 mx-auto">
        <div ref={headingRef} className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            {t.sectionTitle}
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* 🏆 هنا يتم استخدام الـ ref والتحقق من articles.slice */}
        <div
          ref={articlesGridRef}
          className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.slice(0, 3).map((article) => {
            const title = isArabic
              ? article.arArticleTitle
              : article.enArticleTitle;
            const excerpt = isArabic
              ? article.arArticleDesc
              : article.enArticleDesc;
            const articleLink = isArabic
              ? `/ar/articles/${article._id}`
              : `/articles/${article._id}`;

            return (
              <Card
                key={article._id}
                className="overflow-hidden transition-all duration-500 border border-gray-100 group hover:shadow-2xl dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    // ✅ استخدام blogImage.url بأمان
                    src={article.blogImage?.url || "/placeholder.svg"}
                    alt={title}
                    className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute top-4 ${
                      isArabic ? "left-4" : "right-4"
                    }`}
                  >
                    <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-emerald-500">
                      {/* 💡 التعديل هنا: تطبيق الترجمة على الفئة */}
                      {isArabic
                        ? article.categoryArticle
                        : categoryMap[article.categoryArticle] ||
                          article.categoryArticle}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold leading-tight text-gray-900 transition-colors dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getReadTime(excerpt)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-gray-900 border-gray-200 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 dark:border-gray-700 dark:text-gray-100"
                  >
                    <Link
                      href={articleLink}
                      className="flex items-center gap-2"
                    >
                      {t.readArticle}
                      <ArrowLeft
                        className={`w-3 h-3 ${isArabic ? "rotate-180" : ""}`}
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={viewAllRef} className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg bg-transparent border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <Link
              href={isArabic ? "/ar/articles" : "/articles"}
              className="flex items-center gap-2"
            >
              {t.viewAll}
              <ArrowLeft
                className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`}
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
