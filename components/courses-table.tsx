"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { buildCourseUrl } from "@/lib/i18n-utils";

// ====== COURSE DATA INTERFACE (هيكل البيانات المتوقع من الـ API) ======
interface CourseData {
  _id: string;
  name: string;
  slug: string;
  section: string;
  city: string;
  price: string;
}
// =========================================================================

interface CoursesTableProps {
  filters: { city: string; section: string; search: string };
}

export default function CoursesTable({ filters }: CoursesTableProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const isArabic = lang === "ar";

  const [dataCourses, setDataCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Translations ---
  const t = useMemo(() => {
    const translations = {
      ar: {
        noResultsTitle: "لا توجد دورات تطابق معايير البحث",
        noResultsHint: "جرب تغيير الفلاتر أو البحث بكلمات مختلفة",
        resultsCount: (filtered: number, total: number) =>
          `عرض ${filtered} من أصل ${total} دورة`,
        tableHeaders: {
          name: "اسم الدورة",
          section: "القسم",
          city: "المدينة",
          price: "السعر",
          action: "الإجراء",
        },
        weekLabel: "أسبوع تدريبي",
        multiDateLabel: "تواريخ متعددة",
        viewDetails: "عرض التفاصيل",
        prev: "السابق",
        next: "التالي",
        fetchError: "فشل جلب البيانات. يرجى التحقق من الخادم.",
      },
      en: {
        noResultsTitle: "No courses match your search criteria",
        noResultsHint:
          "Try adjusting filters or searching with different keywords",
        resultsCount: (filtered: number, total: number) =>
          `Showing ${filtered} out of ${total} courses`,
        tableHeaders: {
          name: "Course Name",
          section: "Category",
          city: "City",
          price: "Price",
          action: "Action",
        },
        weekLabel: "Training Week",
        multiDateLabel: "Multiple Dates",
        viewDetails: "View Details",
        prev: "Previous",
        next: "Next",
        fetchError: "Failed to fetch data. Please check the server.",
      },
    };
    return translations[lang as "ar" | "en"];
  }, [lang]);

  // 1. دالة جلب البيانات من الـ API
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (!Array.isArray(result.data))
        throw new Error("API did not return an array of courses.");

      setDataCourses(
        result.data.map((course: any) => ({
          _id: course._id,
          slug: course.slug[lang],
          name: course.translations[lang].name,
          section: course.translations[lang].section,
          city: course.translations[lang].city,
          price: course.translations[lang].price,
        }))
      );
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(t.fetchError);
      setDataCourses([]);
    } finally {
      setLoading(false);
    }
  }, [lang, t.fetchError]);

  // جلب البيانات عند تحميل المكون أو تغيير اللغة
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 2. تطبيق الفلاتر عند تغيير الفلاتر أو البيانات
  useEffect(() => {
    let filtered = dataCourses;

    const cityFilterValue = isArabic ? "جميع المدن" : "All Cities";
    const sectionFilterValue = isArabic ? "جميع الأقسام" : "All Sections";

    // تصفية المدينة
    if (filters.city && filters.city !== cityFilterValue) {
      // نعتمد هنا أن c.city هي المفتاح الإنجليزي أو القيمة التي تأتي من الفلتر
      filtered = filtered.filter((c) => c.city === filters.city);
    }

    // تصفية القسم
    if (filters.section && filters.section !== sectionFilterValue) {
      filtered = filtered.filter((c) => c.section === filters.section);
    }

    // تصفية البحث
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.section.toLowerCase().includes(term) ||
          c.city.toLowerCase().includes(term)
      );
    }

    setFilteredCourses(filtered);
  }, [filters, lang, dataCourses, isArabic]);

  // دالة تحديد لون البادج
  const getSectionColor = (section: string) => {
    const colors = [
      "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300",
      "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300",
      "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    ];
    return colors[section.length % colors.length];
  };

  // --- شاشات التحميل والخطأ ---

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-royal-500 dark:text-royal-400">
        <Loader2 className="w-8 h-8 mr-2 animate-spin" />
        <span className="text-xl">
          {isArabic ? "جاري تحميل الدورات..." : "Loading Courses..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Card
        dir={isArabic ? "rtl" : "ltr"}
        className="border-red-500 shadow-lg bg-red-50/80 dark:bg-red-900/80 backdrop-blur-sm"
      >
        <CardContent className="p-12 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <div className="text-lg font-semibold text-red-700 dark:text-red-300">
            {t.fetchError}
          </div>
          <p className="mt-2 text-red-500 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <Card
        dir={isArabic ? "rtl" : "ltr"}
        className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
      >
        <CardContent className="p-12 text-center">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            {t.noResultsTitle}
          </div>
          <p className="mt-2 text-gray-400 dark:text-gray-500">
            {t.noResultsHint}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="space-y-6">
      {/* Results Count */}
      <div className="text-gray-600 dark:text-gray-400">
        {t.resultsCount(filteredCourses.length, dataCourses.length)}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-bold text-left text-gray-900 dark:text-white">
                      {t.tableHeaders.name}
                    </th>
                    <th className="px-6 py-4 font-bold text-left text-gray-900 dark:text-white">
                      {t.tableHeaders.section}
                    </th>
                    <th className="px-6 py-4 font-bold text-left text-gray-900 dark:text-white">
                      {t.tableHeaders.city}
                    </th>
                    <th className="px-6 py-4 font-bold text-left text-gray-900 dark:text-white">
                      {t.tableHeaders.price}
                    </th>
                    <th className="px-6 py-4 font-bold text-center text-gray-900 dark:text-white">
                      {t.tableHeaders.action}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* ✅ تم إضافة Array.isArray() هنا لحل مشكلة TypeError */}
                  {Array.isArray(filteredCourses) &&
                    filteredCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="transition-colors border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                              {course.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{t.weekLabel}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{t.multiDateLabel}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getSectionColor(course.section)}>
                            {course.section}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-royal-500 dark:text-royal-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {course.city}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-royal-600 dark:text-royal-400">
                            £ {course.price}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            size="sm"
                            className="bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700"
                          >
                            <Link
                              href={buildCourseUrl(
                                course.slug,
                                lang as "ar" | "en"
                              )}
                              className="flex items-center gap-2"
                            >
                              {t.viewDetails}
                              {isArabic ? (
                                <ArrowLeft className="w-3 h-3" />
                              ) : (
                                <ArrowRight className="w-3 h-3" />
                              )}
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {/* ✅ تم إضافة Array.isArray() هنا لحل مشكلة TypeError */}
        {Array.isArray(filteredCourses) &&
          filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                      {course.name}
                    </h3>
                    <Badge className={getSectionColor(course.section)}>
                      {course.section}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-royal-500 dark:text-royal-400" />
                      <span>{course.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-royal-500 dark:text-royal-400" />
                      <span>{t.weekLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-royal-500 dark:text-royal-400" />
                      <span>{t.multiDateLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-bold text-royal-600 dark:text-royal-400">
                      {course.price}
                    </span>
                    <Button className="bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700">
                      <Link
                        href={buildCourseUrl(course.slug, lang as "ar" | "en")}
                        className="flex items-center gap-2"
                      >
                        {t.viewDetails}
                        {isArabic ? (
                          <ArrowLeft className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled
            className="dark:border-gray-700 dark:text-gray-400"
          >
            {t.prev}
          </Button>
          <Button className="bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700">
            1
          </Button>
          <Button
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            2
          </Button>
          <Button
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            3
          </Button>
          <Button
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
