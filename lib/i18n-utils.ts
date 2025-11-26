/**
 * دوال مساعدة لإدارة الروابط متعددة اللغات
 */

/**
 * تنظيف وتنسيق slug لاستخدامه في URL
 * - يستبدل المسافات بـ -
 * - يزيل الأحرف الخاصة
 * - يحول للأحرف الصغيرة (للإنجليزية فقط)
 */
export function formatSlug(slug: string, lang: "ar" | "en" = "en"): string {
  if (!slug) return "";

  let formatted = slug
    .trim()
    .replace(/\s+/g, "-") // استبدال المسافات بـ -
    .replace(/\//g, "-") // استبدال / بـ -
    .replace(/\\/g, "-"); // استبدال \ بـ -

  // للإنجليزية فقط: تحويل للأحرف الصغيرة
  if (lang === "en") {
    formatted = formatted.toLowerCase();
  }

  return formatted;
}

/**
 * بناء رابط الدورة حسب اللغة
 * - عربي: /ar/event/slug
 * - إنجليزي: /event/slug
 */
export function buildCourseUrl(
  slug: string | { ar?: string; en?: string },
  lang: "ar" | "en"
): string {
  // إذا كان slug object (يحتوي على ar و en)
  if (typeof slug === "object" && slug !== null) {
    const selectedSlug = lang === "ar" ? slug.ar : slug.en;
    if (!selectedSlug) {
      // fallback: استخدم اللغة الأخرى إذا لم تكن موجودة
      const fallbackSlug = slug.ar || slug.en || "";
      return lang === "ar"
        ? `/ar/event/${formatSlug(fallbackSlug, lang)}`
        : `/event/${formatSlug(fallbackSlug, lang)}`;
    }
    return lang === "ar"
      ? `/ar/event/${formatSlug(selectedSlug, lang)}`
      : `/event/${formatSlug(selectedSlug, lang)}`;
  }

  // إذا كان slug string بسيط
  const formattedSlug = formatSlug(slug as string, lang);
  return lang === "ar"
    ? `/ar/event/${formattedSlug}`
    : `/event/${formattedSlug}`;
}

/**
 * بناء رابط صفحة حسب اللغة
 * - عربي: /ar/page-name
 * - إنجليزي: /page-name
 */
export function buildPageUrl(pageName: string, lang: "ar" | "en"): string {
  if (!pageName) return lang === "ar" ? "/ar" : "/";

  // إزالة / من البداية إذا كانت موجودة
  const cleanPageName = pageName.startsWith("/") ? pageName.slice(1) : pageName;

  return lang === "ar" ? `/ar/${cleanPageName}` : `/${cleanPageName}`;
}

/**
 * الحصول على اللغة من المسار
 */
export function getLangFromPath(pathname: string): "ar" | "en" {
  return /^\/ar(\/|$)/.test(pathname) ? "ar" : "en";
}

/**
 * تبديل اللغة في المسار
 * - من /event/slug إلى /ar/event/slug
 * - من /ar/event/slug إلى /event/slug
 */
export function toggleLangInPath(
  pathname: string,
  targetLang: "ar" | "en"
): string {
  const currentLang = getLangFromPath(pathname);

  if (currentLang === targetLang) {
    return pathname; // نفس اللغة، لا تغيير
  }

  if (targetLang === "ar") {
    // التحويل للعربية: إضافة /ar
    return `/ar${pathname}`;
  } else {
    // التحويل للإنجليزية: إزالة /ar
    return pathname.replace(/^\/ar/, "") || "/";
  }
}

/**
 * بناء رابط محلي حسب اللغة الحالية
 * يستخدم في المكونات للحفاظ على اللغة
 */
export function getLocalizedPath(path: string, lang: "ar" | "en"): string {
  // إزالة / من البداية إذا كانت موجودة
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (lang === "ar") {
    // إذا كان المسار يبدأ بـ /ar بالفعل، أرجعه كما هو
    if (cleanPath.startsWith("/ar")) {
      return cleanPath;
    }
    // إضافة /ar للمسار
    return `/ar${cleanPath}`;
  } else {
    // إزالة /ar إذا كان موجوداً
    return cleanPath.replace(/^\/ar/, "") || "/";
  }
}
