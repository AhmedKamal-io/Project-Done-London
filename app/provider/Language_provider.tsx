// Language_provider.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/lib/i18n";

type LanguageContextType = {
  language: "ar" | "en";
  setLanguage: (lang: "ar" | "en") => void;
  isArabic: boolean;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  isArabic: true,
  dir: "rtl",
});

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: "ar" | "en";
}) {
  const pathname = usePathname();
  // قراءة اللغة من URL أولاً
  const langFromUrl = pathname?.startsWith('/ar') ? 'ar' : 'en';
  const [language, setLanguageState] = useState<"ar" | "en">(langFromUrl);

  useEffect(() => {
    // مزامنة اللغة مع URL
    const urlLang = pathname?.startsWith('/ar') ? 'ar' : 'en';
    if (urlLang !== language) {
      setLanguageState(urlLang);
    }
  }, [pathname]);

  useEffect(() => {
    // تحديث DOM و i18n
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: "ar" | "en") => {
    // 🏆 التعديل الرئيسي: تغيير الحالة محلياً فقط دون حفظ الكوكي
    setLanguageState(lang);
    // ❌ تم حذف: setCookie(...)

    // تحديث DOM فوري للتغيير في الجلسة الحالية
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const value = {
    language,
    setLanguage,
    isArabic: language === "ar",
    dir: language === "ar" ? "rtl" : ("ltr" as "rtl" | "ltr"),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
