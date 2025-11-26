"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLocalizedPath, getLangFromPath } from "@/lib/i18n-utils";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Globe,
  ChevronDown,
  Loader2, // تم إضافة Loader2 للاستخدام الداخلي
} from "lucide-react";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import cookies from "js-cookie";

// 💡 واجهة الروابط الاجتماعية المطابقة لـ Mongoose Schema
interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
}

// 🔑 مسار API Route الافتراضي لجلب الروابط
const API_GENERAL_LINKS_PATH = "/api/uploads/generalLinks";

// إعداد i18n
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
      loadPath: "/locales/{{lng}}/translation.json", // adjust if needed
    },
  });

export default function Footer() {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
    youtube: null,
  });

  // 💡 حالة التحميل للروابط الاجتماعية فقط
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

const pathname = usePathname();
const lng = getLangFromPath(pathname);

  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir(lng);
  }, [lng]);

  // --- دالة جلب الروابط الاجتماعية ---
  const fetchSocialLinks = async () => {
    setIsLoadingLinks(true);
    try {
      const res = await fetch(API_GENERAL_LINKS_PATH);
      if (!res.ok) throw new Error("Failed to fetch social links");

      // نفترض أن الخادم يرجع كائن الوثيقة الواحدة مباشرةً
      const data = await res.json();
      setSocialLinks(data);
    } catch (error) {
      console.error("Error fetching social links:", error);
      // في حالة الفشل، تبقى الروابط null
    } finally {
      setIsLoadingLinks(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);
  // ------------------------------------

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    cookies.set("i18next", language);
    setIsLangMenuOpen(false);
  };

  const citiesData = [
    { key: "london", ar: "لندن", en: "London" },
    { key: "dubai", ar: "دبي", en: "Dubai" },
    { key: "istanbul", ar: "إسطنبول", en: "Istanbul" },
    { key: "paris", ar: "باريس", en: "Paris" },
    { key: "rome", ar: "روما", en: "Rome" },
    { key: "barcelona", ar: "برشلونة", en: "Barcelona" },
    { key: "madrid", ar: "مدريد", en: "Madrid" },
    { key: "venice", ar: "البندقية", en: "Venice" },
  ];

  const courses =
    lng === "en"
      ? [
          "Corporate Communication",
          "Protocol & Etiquette",
          "Media Management",
          "Marketing & Branding",
          "Artificial Intelligence",
          "Design & Editing",
        ]
      : [
          "التواصل المؤسسي",
          "المراسم والاتكيت",
          "الإدارة الإعلامية",
          "التسويق والعلامة التجارية",
          "الذكاء الاصطناعي",
          "التصميم والمونتاج",
        ];

  // 💡 مصفوفة أيقونات السوشيال ميديا و مفاتيح الروابط
  const socialItems: { Icon: any; key: keyof SocialLinks }[] = [
    { Icon: Facebook, key: "facebook" },
    { Icon: Twitter, key: "twitter" },
    { Icon: Linkedin, key: "linkedin" },
    { Icon: Instagram, key: "instagram" },
  ];

  return (
    // 🚫 لم يتم تغيير أي شيء في فئات الشكل هنا
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-royal-500 to-crimson-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">LA</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {lng === "en" ? "London Academy" : "أكاديمية لندن"}
                </h3>
                <p className="text-sm text-gray-400">
                  {lng === "en"
                    ? "For Media and Public Relations"
                    : "للإعلام والعلاقات العامة"}
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              {lng === "en"
                ? "We offer professional media and PR training courses in 8 world cities with certified international experts."
                : "نقدم دورات تدريبية احترافية متخصصة في الإعلام والعلاقات العامة والتسويق في 8 مدن عالمية مع خبراء دوليين معتمدين."}
            </p>

            {/* 🔗 Social Links Section - تم التعديل هنا */}
            <div className="flex gap-4">
              {isLoadingLinks ? (
                // 💡 عرض حالة التحميل
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Loading links...
                  </span>
                </div>
              ) : (
                socialItems.map(({ Icon, key }, i) => {
                  // جلب الرابط من حالة socialLinks
                  const link = socialLinks[key];

                  // عدم عرض الزر إذا كان الرابط غير موجود
                  if (!link) return null;

                  return (
                    <Link
                      key={key}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        // 🚫 لم يتم تغيير أي شيء في فئات الشكل هنا
                        className="border-gray-600 text-gray-400 hover:text-white hover:border-royal-500 bg-transparent"
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    </Link>
                  );
                })
              )}
            </div>
            {/* نهاية تعديل السوشيال ميديا */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-royal-400">
              {lng === "en" ? "Quick Links" : "روابط سريعة"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath('/about', lng as 'ar' | 'en')}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "About Us" : "من نحن"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('/courses', lng as 'ar' | 'en')}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "All Courses" : "جميع الدورات"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('/cities', lng as 'ar' | 'en')}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "Cities" : "المدن"}
                </Link>
              </li>
              <li>
                <Link
                  href={lng === "ar" ? "/ar/articles" : "/articles"}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "Articles" : "المقالات"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('/contact', lng as 'ar' | 'en')}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "Contact Us" : "اتصل بنا"}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('/training-method', lng as 'ar' | 'en')}
                  className="text-gray-300 hover:text-royal-400 transition-colors"
                >
                  {lng === "en" ? "Training Method" : "أسلوبنا التدريبي"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Course Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-royal-400">
              {lng === "en" ? "Course Categories" : "أقسام الدورات"}
            </h4>
            <ul className="space-y-3">
              {courses.map((course, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedPath(
                      `/courses?category=${encodeURIComponent(course)}`,
                      lng as "ar" | "en"
                      )}
                      className="text-gray-300 hover:text-royal-400 transition-colors"
                      >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-royal-400">
              {lng === "en" ? "Contact Us" : "تواصل معنا"}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-royal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    {lng === "en" ? "Head Office" : "المكتب الرئيسي"}
                  </p>
                  <p className="text-sm text-gray-400">
                    123 Oxford Street, London, UK
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-royal-400" />
                <div>
                  <p className="text-gray-300" dir="ltr">+44 7999 958569</p>
                  <p className="text-sm text-gray-400">
                    {lng === "en" ? "Hotline" : "الخط الساخن"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-royal-400" />
                <div>
                  <p className="text-gray-300">info@lampr.ac</p>
                  <p className="text-sm text-gray-400">
                    {lng === "en" ? "Email" : "البريد الإلكتروني"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-royal-400" />
                <div>
                  <p className="text-gray-300" dir="ltr">+44 7999 958569</p>
                  <p className="text-sm text-gray-400">
                    {lng === "en" ? "WhatsApp" : "واتساب"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-bold mb-6 text-royal-400 text-center">
            {lng === "en" ? "Our Global Cities" : "مدننا حول العالم"}
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {citiesData.map((city, index) => (
              <Link
                key={index}
                href={lng === 'ar' ? `/ar/cities/${city.key}` : `/cities/${city.key}`}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-royal-600 hover:text-white transition-all duration-300"
              >
                {lng === 'ar' ? city.ar : city.en}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2024{" "}
            {lng === "en"
              ? "London Academy for Media & Public Relations. All rights reserved."
              : "أكاديمية لندن للإعلام والعلاقات العامة. جميع الحقوق محفوظة."}
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-royal-400 transition-colors"
            >
              {lng === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-royal-400 transition-colors"
            >
              {lng === "en" ? "Terms & Conditions" : "الشروط والأحكام"}
            </Link>
            <Link
              href="/sitemap"
              className="text-gray-400 hover:text-royal-400 transition-colors"
            >
              {lng === "en" ? "Sitemap" : "خريطة الموقع"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
