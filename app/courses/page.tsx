"use client";
import { generatePageMetadata } from "@/lib/seo-utils";

import { useState, useEffect, useRef, Suspense } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import CoursesTable from "@/components/courses-table";
import CourseFilters from "@/components/course-filters";
import Loading from "@/components/loading";
import JsonLd from "@/components/JsonLd";

export default function CoursesPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const titleRef = useRef<any>(null);
  const subtitleRef = useRef<any>(null);

  type FAQItem = {
    question: string;
    answer: string;
  };

  const translations: Record<
    "ar" | "en",
    {
      title: string;
      subtitle: string;
      loadingFilters: string;
      loadingTable: string;
      introAnswer: string;
      filtersHeading: string;
      filtersDescription: string;
      faqTitle: string;
      filters: {
        city: string;
        section: string;
        search: string;
      };
      faqItems: FAQItem[];
    }
  > = {
    ar: {
      title: "جدول الدورات التدريبية",
      subtitle:
        "اختر الدورة التدريبية المناسبة لك من مجموعة واسعة من البرامج المتخصصة في 8 مدن عالمية",
      loadingFilters: "جارٍ تحميل المرشحات…",
      loadingTable: "جارٍ تحميل الجدول…",
      introAnswer: "",
      filtersHeading: "تصفية الدورات",
      filtersDescription: "استخدم المرشحات أدناه لتضييق نطاق الدورات",
      faqTitle: "الأسئلة الشائعة",
      filters: {
        city: "جميع المدن",
        section: "جميع الأقسام",
        search: "بحث",
      },
      faqItems: [],
    },
    en: {
      title: "Training Courses Schedule",
      subtitle:
        "Choose the right training course for you from a wide range of specialized programs in 8 global cities.",
      loadingFilters: "Loading filters…",
      loadingTable: "Loading course table…",
      introAnswer: "",
      filtersHeading: "Filter Courses",
      filtersDescription: "Use the filters below to narrow down the courses",
      faqTitle: "Frequently Asked Questions",
      filters: {
        city: "All Cities",
        section: "All Sections",
        search: "Search",
      },
      faqItems: [],
    },
  };

  const t = isArabic ? translations.ar : translations.en;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (translations[isArabic ? "ar" : "en"].faqItems || []).map(
      (item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })
    ),
  };

  const [filters, setFilters] = useState({
    city: t.filters.city,
    section: t.filters.section,
    search: "",
  });

  // GSAP Animation for text elements only
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Animate subtitle with delay
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  const handleFilterChange = (newFilters: {
    city: string;
    section: string;
    search: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <Suspense fallback={<Loading />}>
      <main
        className={`min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 
        dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 
        relative overflow-hidden ${isArabic ? "rtl" : "ltr"}`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Floating background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Soft glowing animated circles */}
          <div className="absolute w-32 h-32 rounded-full shadow-lg top-20 right-20 bg-gradient-to-br from-royal-200/30 to-royal-400/20 dark:from-royal-800/40 dark:to-royal-600/30 blur-2xl animate-float-slow"></div>
          <div className="absolute w-24 h-24 rounded-full shadow-md bottom-40 left-20 bg-gradient-to-br from-crimson-200/30 to-crimson-400/20 dark:from-crimson-700/40 dark:to-crimson-500/30 blur-xl animate-float-medium"></div>
          <div className="absolute w-16 h-16 rounded-full shadow-sm top-1/2 left-1/3 bg-gradient-to-br from-royal-300/25 to-royal-400/15 dark:from-royal-700/40 dark:to-royal-500/25 blur-lg animate-float-fast"></div>
          <div className="absolute w-20 h-20 rounded-full shadow-md bottom-20 right-1/3 bg-gradient-to-br from-crimson-300/25 to-crimson-400/15 dark:from-crimson-700/40 dark:to-crimson-500/25 blur-xl animate-float-slow"></div>
          <div className="absolute w-12 h-12 rounded-full shadow-sm top-1/3 right-1/4 bg-gradient-to-br from-royal-200/25 to-royal-300/15 dark:from-royal-700/40 dark:to-royal-500/25 blur-md animate-float-medium"></div>
        </div>

        {/* Page content */}
        <div className="container relative z-10 px-4 py-12 mx-auto">
          <JsonLd data={faqSchema} />
          {/* Title and subtitle */}
          <div className="mb-12 text-center">
            <h1
              ref={titleRef}
              className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white"
            >
              {t.title}
            </h1>
            <p
              ref={subtitleRef}
              className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-300"
            >
              {t.subtitle}
            </p>
            <p className="max-w-3xl mx-auto mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {t.introAnswer}
            </p>
          </div>

          {/* Filters */}
          <section className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {t.filtersHeading}
            </h2>
            <p className="max-w-3xl mx-auto text-sm text-gray-600 dark:text-gray-300 md:text-base">
              {t.filtersDescription}
            </p>
          </section>
          <Suspense
            fallback={
              <div className="text-center text-gray-500 dark:text-gray-400">
                {t.loadingFilters}
              </div>
            }
          >
            <CourseFilters onFilterChange={handleFilterChange} />
          </Suspense>

          {/* Table */}
          <Suspense
            fallback={
              <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                {t.loadingTable}
              </div>
            }
          >
            <CoursesTable filters={filters} />
          </Suspense>

          {/* FAQ section for SEO and user support */}
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900 dark:text-white">
              {t.faqTitle}
            </h2>
            <div className="space-y-4">
              {(t.faqItems || []).map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur"
                >
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                    {item.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700 md:text-base dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Suspense>
  );
}
