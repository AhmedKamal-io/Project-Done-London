"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  buildCourseUrl,
  toggleLangInPath,
  getLangFromPath,
  getLocalizedPath,
} from "@/lib/i18n-utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import cookies from "js-cookie";
import { useTheme } from "@/components/theme-provider";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng: "en",
    detection: {
      order: [
        "cookie",
        "htmlTag",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
  });

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();
  const router = useRouter();

  // ❗ اللغة الفعلية = من المسار فقط
  const lng = getLangFromPath(pathname);

  useEffect(() => {
    // تحديث i18n + الكوكيز للتوافق مع URL
    i18n.changeLanguage(lng);
    cookies.set("i18next", lng, { expires: 365 });
    cookies.set("language", lng, { expires: 365 });

    document.documentElement.dir = i18n.dir(lng);
  }, [lng, pathname]);

  const langPrefix = lng === "ar" ? "/ar" : "";

  const navigation = [
    { name: lng === "en" ? "Home" : "الرئيسية", href: langPrefix + "/" },
    { name: lng === "en" ? "Courses" : "الدورات", href: langPrefix + "/courses" },
    {
      name: lng === "en" ? "Training Method" : "أسلوبنا التدريبي",
      href: langPrefix + "/training-method",
    },
    { name: lng === "en" ? "Cities" : "المدن", href: langPrefix + "/cities" },
    { name: lng === "en" ? "Articles" : "المقالات", href: langPrefix + "/articles" },
    { name: lng === "en" ? "About" : "من نحن", href: langPrefix + "/about" },
    { name: lng === "en" ? "Contact Us" : "اتصل بنا", href: langPrefix + "/contact" },
  ];

  // 🚀 تغيير اللغة بطريقة صحيحة بدون أي أخطاء
     const changeLanguage = async (newLng: string) => {
    setIsLangMenuOpen(false);

    // المسار الافتراضي لباقي الصفحات: تبديل /ar فقط
    let newPath = toggleLangInPath(pathname, newLng as "ar" | "en");

    // إذا كنا في صفحة دورة /event/[slug] نحتاج أيضًا تبديل الـ slug نفسه
    if (pathname.includes("/event/")) {
      // استخراج الـ slug الحالي من الرابط (بدون Query أو Hash)
      const slugPart = pathname.split("/event/")[1] || "";
      const currentSlug = slugPart.split("?")[0].split("#")[0];

      // دالة مساعدة لتطبيع الـ slug كما هو مُستخدم في صفحة الدورة
      const normalizeSlug = (value: string | undefined | null) => {
        if (!value) return "";
        return decodeURIComponent(value)
          .replace(/-/g, " ")
          .toLowerCase()
          .trim();
      };

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/courses`, {
          cache: "no-store",
        });

        if (res.ok) {
          const apiData = await res.json();
          const courses = Array.isArray(apiData?.data) ? apiData.data : apiData;

          const normalizedCurrent = normalizeSlug(currentSlug);

          // إيجاد الدورة التي يطابق أحد الـ slug الخاص بها الـ slug الحالي (بعد التطبيع)
          const matchedCourse = courses.find((c: any) => {
            const arSlug = c.slug?.ar as string | undefined;
            const enSlug = c.slug?.en as string | undefined;
            return (
              normalizeSlug(arSlug) === normalizedCurrent ||
              normalizeSlug(enSlug) === normalizedCurrent
            );
          });

          if (matchedCourse && matchedCourse.slug) {
            // استخدام دالة buildCourseUrl لبناء الرابط الصحيح
            newPath = buildCourseUrl(
              matchedCourse.slug,
              newLng as "ar" | "en"
            );
          }
        }
      } catch (error) {
        console.error("Failed to map course slug between languages", error);
        // في حالة الفشل، يبقى newPath كما هو (تبديل /ar فقط)
      }
    }

    // تحديث الكوكيز عشان i18next يتزامن
    cookies.set("i18next", newLng, { expires: 365 });
    cookies.set("language", newLng, { expires: 365 });
    i18n.changeLanguage(newLng);

    // انتقال إلى الرابط الجديد
    router.push(newPath);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-royal-500 dark:text-royal-400" />
              <span dir="ltr">+44 7999 958569</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-royal-500 dark:text-royal-400" />
              <span>info@lampr.ac</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-royal-500 dark:text-royal-400" />
              <span>{lng === "en" ? "8 Global Cities" : "8 مدن عالمية"}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {lng === "en" ? "Book a Free Consultation" : "احجز استشارة مجانية"}
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href={getLocalizedPath("/", lng as "ar" | "en")} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-royal-500 to-crimson-600 dark:from-royal-600 dark:to-crimson-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">LA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {lng === "en" ? "London Academy" : "أكاديمية لندن"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lng === "en"
                  ? "For Media and Public Relations"
                  : "للإعلام والعلاقات العامة"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors duration-200 relative group ${
                  isActive(item.href)
                    ? "text-royal-600 dark:text-royal-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-royal-500 dark:bg-royal-400 transition-all duration-200 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex bg-transparent border-gray-300 dark:border-gray-700 hover:border-royal-500 dark:hover:border-royal-400 hover:bg-royal-50 dark:hover:bg-royal-950 transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              )}
            </Button>

            {/* Language Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="hidden md:flex items-center gap-2 bg-transparent border-gray-300 dark:border-gray-700 hover:border-royal-500 dark:hover:border-royal-400 hover:bg-royal-50 dark:hover:bg-royal-950 transition-all duration-200"
              >
                <Globe className="w-4 h-4 text-royal-600 dark:text-royal-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {lng === "en" ? "English" : "العربية"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden z-50 min-w-[120px]">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      lng === "en"
                        ? "bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 font-semibold"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      lng === "ar"
                        ? "bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 font-semibold"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            <Button className="hidden md:flex bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700 text-white">
              <Link href={getLocalizedPath("/courses", lng as "ar" | "en")}>
                {lng === "en" ? "Browse Courses" : "تصفح الدورات"}
              </Link>
            </Button>

            {/* Mobile */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden bg-transparent dark:border-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium py-2 transition-colors duration-200 flex items-center justify-between ${
                    isActive(item.href)
                      ? "text-royal-600 dark:text-royal-400 bg-royal-50 dark:bg-royal-900/30 px-3 rounded-lg"
                      : "text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400 px-3"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <span className="w-2 h-2 bg-royal-500 dark:bg-royal-400 rounded-full"></span>
                  )}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                {/* Theme Toggle */}
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full bg-transparent border-gray-300 dark:border-gray-700 hover:border-royal-500 dark:hover:border-royal-400 hover:bg-royal-50 dark:hover:bg-royal-950"
                >
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {theme === "dark"
                        ? lng === "en"
                          ? "Light Mode"
                          : "الوضع الفاتح"
                        : lng === "en"
                        ? "Dark Mode"
                        : "الوضع الداكن"}
                    </span>
                  </div>
                </Button>

                {/* Language Menu for Mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center justify_between w-full bg-transparent border-gray-300 dark:border-gray-700 hover:border-royal-500 dark:hover:border-royal-400 hover:bg-royal-50 dark:hover:bg-royal-950"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-royal-600 dark:text-royal-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {lng === "en" ? "Language" : "اللغة"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {isLangMenuOpen && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                        lng === "en"
                          ? "bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 font-semibold"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("ar")}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                        lng === "ar"
                          ? "bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 font-semibold"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                )}
              </div>

              <Button className="mt-4 bg-royal-500 hover:bg-royal-600 dark:bg-royal-600 dark:hover:bg-royal-700 text-white">
                <Link href={getLocalizedPath("/courses", lng as "ar" | "en")}>
                  {lng === "en" ? "Browse Courses" : "تصفح الدورات"}
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
