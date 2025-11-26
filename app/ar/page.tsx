// ✅ تم حذف import { cookies } from "next/headers";
import HeroCarousel from "@/components/hero-carousel";
import CourseSections from "@/components/course-sections";
import Cities from "@/components/cities";
import ClientsStrip from "@/components/clients-strip";
import type { ILeadingCompany } from "@/components/clients-strip";
import InternationalAccreditations from "@/components/international-accreditations";
import type { AccreditationItem } from "@/components/international-accreditations";
import CourseGallery from "@/components/course-gallery";
import type { IGalleryMoment } from "@/components/course-gallery";
import Articles from "@/components/articles";
import ContactCTA from "@/components/contact-cta";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const WhatsAppFloat = dynamic(() => import("@/components/whatsapp-float"), {
  ssr: false,
});
import { faqData } from "@/lib/faq-data";

// ==========================
// 1. واجهة المقال
// ==========================
export interface IArticle {
  _id: string;
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  arBlog: string;
  enBlog: string;
  author: string;
  createdAt: string;
  categoryArticle: string;
  blogImage: { url: string; public_id: string };
  specialTag: boolean;
  updatedAt: string;
}

// =======================================================
// 2. Metadata: تم نقله لـ page.tsx في layout
// =======================================================
// Metadata removed from client component
function getMetadata() {
  // 🏆 فرض اللغة العربية دائماً للميتا داتا
  const language = "ar";
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
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      type: "website",
      locale: language === "ar" ? "ar_SA" : "en_GB",
    },
    alternates: {
      canonical: "https://www.lampr.ac",
      languages: {
        "ar-SA": "https://www.lampr.ac",
        "en-GB": "https://www.lampr.ac/en",
      },
    },
  };
}

// =======================================================
// 3. Home Page Component: يفرض 'ar' لجلب المحتوى الديناميكي
// =======================================================
export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // ❌ حذف قراءة الكوكيز بالكامل.
  // 🏆 فرض اللغة العربية لجلب البيانات وترجمة المحتوى
  const language = "ar" as "ar" | "en";

  // Fetch جميع البيانات مرة واحدة
  const [
    imagesRes,
    youtubeRes,
    citiesRes,
    companiesRes,
    accreditationsRes,
    articlesRes,
    momentsRes,
  ] = await Promise.all([
    fetch(`${baseUrl}/api/uploads/homeMedia`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/uploads/generalLinks`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/uploads/cities`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/uploads/leading-companies`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/uploads/accreditations`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/articles`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/uploads/moments`, { cache: "no-store" }),
  ]);

  // 2. معالجة بيانات المقالات بأمان
  let articlesData: IArticle[] = [];
  try {
    const rawData = await articlesRes.json();
    if (Array.isArray(rawData)) {
      articlesData = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      articlesData = rawData.data as IArticle[];
    }
  } catch (e) {
    console.error("Error fetching or parsing articles data:", e);
    articlesData = [];
  }

  const imagesData = await imagesRes.json();
  const youtubeData = await youtubeRes.json();
  const cityData = await citiesRes.json();
  const companiesData: ILeadingCompany[] = (await companiesRes.json()).filter(
    (c: ILeadingCompany) => c.logo?.url
  );
  const accreditationsData: AccreditationItem[] =
    await accreditationsRes.json();
  const momentsJson: IGalleryMoment[] = (await momentsRes.json()) || [];

  // ==========================
  // تجهيز بيانات HeroCarousel
  // ==========================
  const heroCarouselImages =
    imagesData?.images?.map((img: any, i: number) => ({
      id: img.public_id || `img-${i}`,
      image: img.media_url,
      alt: {
        ar: `صورة رقم ${i + 1}`,
        en: `Image number ${i + 1}`,
      },
    })) || [];

  // ==========================
  // تجهيز بيانات المدن
  // ==========================
  const cityImages: Record<string, string> = {};
  if (cityData && Object.keys(cityData).length > 0) {
    for (const cityKey in cityData) {
      cityImages[cityKey] = cityData[cityKey]?.media_url;
    }
  }

  const youtubeLink = youtubeData?.youtube || "";

  // ==========================
  // إعداد FAQ Schema
  // ==========================
  const currentFaqData = language === "ar" ? faqData.ar : faqData.en;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: currentFaqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // ==========================
  // Return الصفحة مع props جاهزة
  // ==========================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <JsonLd data={faqSchema} />
      <HeroCarousel
        heroCarouselImages={heroCarouselImages}
        youtubeLink={youtubeLink}
      />
      <CourseSections />
      <Cities cityImages={cityImages} />
      <ClientsStrip companies={companiesData} />
      <InternationalAccreditations
        accreditations={accreditationsData}
        language={language}
      />
      <CourseGallery moments={momentsJson} language={language} />
      {/* تمرير articlesData كـ prop articles */}
      <Articles articles={articlesData} language={language} />
      <ContactCTA />
      <WhatsAppFloat />
    </main>
  );
}
