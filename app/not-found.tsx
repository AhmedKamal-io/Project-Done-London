"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, BookOpen, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function NotFound() {
  const { i18n } = useTranslation()
  const lang = (i18n.language || "ar") as "ar" | "en"
  const isArabic = lang === "ar"

  // Embedded translations
  const translations = useMemo(
    () => ({
      ar: {
        title404: "404",
        pageNotFound: "الصفحة غير موجودة",
        description:
          "عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها، أو أنك كتبت الرابط بشكل خاطئ.",
        goHome: "العودة للرئيسية",
        goHomeDesc: "ابدأ من جديد من الصفحة الرئيسية",
        homePage: "الصفحة الرئيسية",
        browseCourses: "تصفح الدورات",
        browseCoursesDesc: "اكتشف دوراتنا التدريبية المتنوعة",
        allCourses: "جميع الدورات",
        searchSite: "ابحث في الموقع",
        searchSiteDesc: "ابحث عن المحتوى الذي تريده",
        advancedSearch: "البحث المتقدم",
        popularPages: "الصفحات الأكثر زيارة",
        coursesSchedule: "جدول الدورات",
        globalCities: "المدن العالمية",
        aboutUs: "من نحن",
        contactUs: "اتصل بنا",
        errorMessage: "إذا كنت تعتقد أن هذا خطأ، يرجى",
        contactLink: "التواصل معنا",
        orReturn: "أو يمكنك العودة إلى",
        homeLink: "الصفحة الرئيسية",
        startOver: "والبدء من جديد",
      },
      en: {
        title404: "404",
        pageNotFound: "Page Not Found",
        description:
          "Sorry, we couldn't find the page you're looking for. It may have been moved or deleted, or you may have typed the link incorrectly.",
        goHome: "Go to Homepage",
        goHomeDesc: "Start fresh from the homepage",
        homePage: "Homepage",
        browseCourses: "Browse Courses",
        browseCoursesDesc: "Discover our diverse training courses",
        allCourses: "All Courses",
        searchSite: "Search Website",
        searchSiteDesc: "Find the content you want",
        advancedSearch: "Advanced Search",
        popularPages: "Most Visited Pages",
        coursesSchedule: "Courses Schedule",
        globalCities: "Global Cities",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        errorMessage: "If you think this is an error, please",
        contactLink: "contact us",
        orReturn: "or you can return to the",
        homeLink: "homepage",
        startOver: "and start over",
      },
    }),
    [],
  )

  const t = translations[lang]

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Enhanced Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-royal-200/8 to-royal-300/4 dark:from-royal-600/8 dark:to-royal-700/4 rounded-full blur-2xl animate-float-slow shadow-lg"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-crimson-200/8 to-crimson-300/4 dark:from-crimson-600/8 dark:to-crimson-700/4 rounded-full blur-xl animate-float-medium shadow-md"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-royal-300/6 to-royal-400/3 dark:from-royal-700/6 dark:to-royal-800/3 rounded-full blur-lg animate-float-fast shadow-sm"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-crimson-300/6 to-crimson-400/3 dark:from-crimson-700/6 dark:to-crimson-800/3 rounded-full blur-xl animate-float-slow shadow-md"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-royal-200/6 to-royal-300/3 dark:from-royal-600/6 dark:to-royal-700/3 rounded-full blur-md animate-float-medium shadow-sm"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Hero */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="text-9xl lg:text-[12rem] font-bold text-transparent bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-royal-400 dark:to-crimson-400 bg-clip-text leading-none">
                {t.title404}
              </div>
              <div className="absolute inset-0 text-9xl lg:text-[12rem] font-bold text-royal-200/20 dark:text-royal-800/20 blur-sm leading-none">
                {t.title404}
              </div>
            </div>
          </div>

          {/* Error Message */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl mb-12">
            <CardContent className="p-12">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-royal-600 dark:to-crimson-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.pageNotFound}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                {t.description}
              </p>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-royal-50 dark:bg-royal-900/30 border-royal-200 dark:border-royal-700 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <Home className="w-8 h-8 mx-auto mb-3 text-royal-500 dark:text-royal-400 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.goHome}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.goHomeDesc}</p>
                    <Button className="w-full bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700">
                      <Link href="/" className="flex items-center gap-2">
                        {t.homePage}
                        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-crimson-50 dark:bg-crimson-900/30 border-crimson-200 dark:border-crimson-700 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-crimson-500 dark:text-crimson-400 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.browseCourses}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.browseCoursesDesc}</p>
                    <Button className="w-full bg-crimson-500 hover:bg-crimson-600 dark:bg-crimson-600 dark:hover:bg-crimson-700">
                      <Link href="/courses" className="flex items-center gap-2">
                        {t.allCourses}
                        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-navy-50 dark:bg-navy-900/30 border-navy-200 dark:border-navy-700 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <Search className="w-8 h-8 mx-auto mb-3 text-navy-500 dark:text-navy-400 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.searchSite}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.searchSiteDesc}</p>
                    <Button
                      variant="outline"
                      className="w-full border-navy-300 dark:border-navy-600 text-navy-700 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800 bg-transparent"
                    >
                      <Link href="/courses" className="flex items-center gap-2">
                        {t.advancedSearch}
                        <Search className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Popular Links */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.popularPages}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/courses"
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-royal-300 dark:hover:border-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/30 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-royal-500 dark:text-royal-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t.coursesSchedule}</span>
                  </div>
                </Link>

                <Link
                  href="/cities"
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-royal-300 dark:hover:border-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/30 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-6 h-6 mx-auto mb-2 text-royal-500 dark:text-royal-400 group-hover:scale-110 transition-transform text-2xl">
                      🌍
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t.globalCities}</span>
                  </div>
                </Link>

                <Link
                  href="/about"
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-royal-300 dark:hover:border-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/30 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-6 h-6 mx-auto mb-2 text-royal-500 dark:text-royal-400 group-hover:scale-110 transition-transform text-2xl">
                      ℹ️
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t.aboutUs}</span>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-royal-300 dark:hover:border-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/30 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-6 h-6 mx-auto mb-2 text-royal-500 dark:text-royal-400 group-hover:scale-110 transition-transform text-2xl">
                      📞
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t.contactUs}</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t.errorMessage}{" "}
              <Link href="/contact" className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 underline">
                {t.contactLink}
              </Link>
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {t.orReturn}{" "}
              <Link href="/" className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 underline">
                {t.homeLink}
              </Link>{" "}
              {t.startOver}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}