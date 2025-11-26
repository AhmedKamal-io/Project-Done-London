import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import "app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import ClientWrapper from "@/components/client-wrapper";
import { LanguageProvider } from "./provider/Language_provider";
import JsonLd from "@/components/JsonLd";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import { RECAPTCHA_CONFIG } from "@/lib/recaptcha-config";
import ScrollToTop from "@/components/scroll-to-top";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
});

// =======================================================
// 1. generateMetadata: يقرأ اللغة من URL
// =======================================================
export async function generateMetadata(): Promise<Metadata> {
  // قراءة اللغة من الكوكيز (الافتراضي إنجليزي)
  const cookieStore = cookies();
  const language = cookieStore.get('language')?.value || 'en';
  const isArabic = language === "ar";

  const metadata = {
    ar: {
      title: "أكاديمية لندن للإعلام والعلاقات العامة | دورات تدريبية احترافية",
      description:
        "أكاديمية لندن للإعلام والعلاقات العامة تقدم دورات تدريبية متخصصة في التواصل المؤسسي، المراسم والاتكيت، الإدارة الإعلامية، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية",
      keywords:
        "دورات إعلام، علاقات عامة، تدريب احترافي، لندن، دبي، اسطنبول، باريس، روما، برشلونة، مدريد، البندقية",
    },
    en: {
      title: "London Academy for Media & PR | Professional Training Courses",
      description:
        "London Academy for Media and Public Relations offers specialized training courses in corporate communication, protocol, media management, marketing, AI and design in 8 global cities",
      keywords:
        "media courses, public relations, professional training, London, Dubai, Istanbul, Paris, Rome, Barcelona, Madrid, Venice",
    },
  };

  const currentMeta = isArabic ? metadata.ar : metadata.en;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    // ... (بقية الـ Metadata) ...
    // تم اختصار الجزء الخاص بالـ Metadata لعدم تكرار الكود
    openGraph: {
      type: "website",
      locale: isArabic ? "ar_SA" : "en_GB",
      url: "https://www.lampr.ac",
      siteName: isArabic
        ? "أكاديمية لندن للإعلام والعلاقات العامة"
        : "London Academy for Media & PR",
      title: currentMeta.title,
      description: currentMeta.description,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: isArabic
            ? "أكاديمية لندن للإعلام والعلاقات العامة"
            : "London Academy for Media & PR",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentMeta.title,
      description: currentMeta.description,
      images: ["/logo.png"],
    },
    alternates: {
      canonical: "https://www.lampr.ac",
      languages: {
        "ar-SA": "https://www.lampr.ac",
        "en-GB": "https://www.lampr.ac/en",
      },
    },
    // ... (بقية الـ icons و manifest) ...
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.png", color: "#2563eb" },
      ],
    },
    manifest: "/site.webmanifest",
    generator: "v0.dev",
  };
}

// =======================================================
// 2. RootLayout: يقرأ اللغة من الكوكيز (التي تم ضبطها في middleware)
// =======================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // قراءة اللغة من الكوكيز (التي تم ضبطها بناءً على URL في middleware)
  const cookieStore = cookies();
  const language = (cookieStore.get('language')?.value || 'en') as 'ar' | 'en';
  const isArabic = language === 'ar';

  // بيانات المنظمة التعليمية (Educational Organization Schema)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "أكاديمية لندن للإعلام والعلاقات العامة",
    "alternateName": "London Academy for Media & PR",
    "url": "https://www.lampr.ac",
    "logo": "https://www.lampr.ac/logo.png",
    "description": "أكاديمية تدريبية احترافية متخصصة في الإعلام والعلاقات العامة والتسويق والذكاء الاصطناعي، تقدم دورات معتمدة في 8 مدن عالمية",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-7999-958569",
      "contactType": "customer service",
      "email": "info@lampr.ac",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.lampr.ac",
    "name": isArabic
      ? "أكاديمية لندن للإعلام والعلاقات العامة"
      : "London Academy for Media & PR",
    "inLanguage": isArabic ? "ar" : "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.lampr.ac/courses?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };


  return (
    <html lang={language} dir={isArabic ? "rtl" : "ltr"}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>

      <body className={cairo.className}>
        {/* تمرير اللغة الديناميكية من الكوكيز */}
        <LanguageProvider>
          <ReCaptchaProvider siteKey={RECAPTCHA_CONFIG.siteKey || ''}>
            <ClientWrapper>
              <ScrollToTop />
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
                <Footer />
              </ThemeProvider>
              <WhatsAppFloat />
            </ClientWrapper>
          </ReCaptchaProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
