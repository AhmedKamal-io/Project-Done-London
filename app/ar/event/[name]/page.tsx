import EventPage from "./components/Event";
import { notFound } from "next/navigation";
import Hreflang from "@/components/Hreflang";
import { cookies } from "next/headers";
import JsonLd from "@/components/JsonLd";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ================================
// 1) Fetch all courses
// ================================
async function fetchAllCourses() {
  if (!API_BASE_URL) {
    console.error("❌ Missing NEXT_PUBLIC_BASE_URL");
    throw new Error("Server configuration error: Missing base URL");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("API ERROR:", body);
      throw new Error("Failed to fetch courses");
    }

    return res.json();
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    throw err;
  }
}

// ================================
// 2) Generate Metadata
// ================================
export async function generateMetadata({ params }: any) {
  const slugFromURL = params.name;
  
  try {
    const result = await fetchAllCourses();
    const courses = result?.data || [];
    const course = findCourseBySlug(courses, slugFromURL);
    
    if (!course) {
      return {
        title: 'Course Not Found',
        description: 'The requested course could not be found.'
      };
    }
    
    // قراءة اللغة
    const cookieStore = cookies();
    const lang = (cookieStore.get('language')?.value || 'en') as 'ar' | 'en';
    
    // استخراج البيانات حسب اللغة من translations
    const title = course.translations?.[lang]?.name || course.translations?.en?.name || 'Course';
    const description = course.translations?.[lang]?.description || course.translations?.en?.description || '';
    const siteName = lang === 'ar' 
      ? 'أكاديمية لندن للإعلام والعلاقات العامة'
      : 'London Academy for Media & PR';
    
    const baseUrl = 'https://www.lampr.ac';
    const slug = course.slug?.[lang] || slugFromURL;
    const prefix = lang === 'ar' ? '/ar' : '';
    const url = `${baseUrl}${prefix}/event/${slug}`;
    
    return {
      title: `${title} | ${siteName}`,
      description: description.substring(0, 160),
      keywords: course.keywords?.[lang] || '',
      openGraph: {
        type: 'website',
        locale: lang === 'ar' ? 'ar_SA' : 'en_GB',
        url: url,
        siteName: siteName,
        title: title,
        description: description.substring(0, 160),
        images: course.image ? [{
          url: course.image,
          width: 1200,
          height: 630,
          alt: title
        }] : [{
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: siteName
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description.substring(0, 160),
        images: course.image ? [course.image] : [`${baseUrl}/logo.png`]
      },
      alternates: {
        canonical: url,
        languages: {
          'ar-SA': `${baseUrl}/ar/event/${course.slug?.ar || slug}`,
          'en-GB': `${baseUrl}/event/${course.slug?.en || slug}`
        }
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Course',
      description: 'Professional training course'
    };
  }
}

// ================================
// 3) Find course by slug
// ================================
function findCourseBySlug(courses: any[], slug: string) {
  // تنظيف slug: إزالة URL encoding واستبدال - بمسافة
  const normalizedSlug = decodeURIComponent(slug)
    .replace(/-/g, ' ')  // استبدال - بمسافة
    .toLowerCase()
    .trim();

  for (const c of courses) {
    console.log("🔹 Compare with:", {
      ar: c.slug?.ar,
      en: c.slug?.en,
      normalized: normalizedSlug,
    });
  }

  return courses.find((c) => {
    const arSlug = c.slug?.ar?.toLowerCase().trim();
    const enSlug = c.slug?.en?.toLowerCase().trim();
    
    return arSlug === normalizedSlug || enSlug === normalizedSlug;
  });
}

// ================================
// 3) Page Component
// ================================
export default async function EventPageWrapper({ params }: any) {
  const slugFromURL = params.name;

  // 1) Fetch ALL courses
  const result = await fetchAllCourses();
  const courses = result?.data || [];

  // 2) Find matched course
  const matchedCourse = findCourseBySlug(courses, slugFromURL);

  if (!matchedCourse) {
    console.error("❌ Course not found for slug:", slugFromURL);
    notFound();
  }

  // 3) قراءة اللغة الحالية
  const cookieStore = cookies();
  const currentLang = (cookieStore.get('language')?.value || 'ar') as 'ar' | 'en';

  // 4) إنشاء Course Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": matchedCourse.translations?.[currentLang]?.name || matchedCourse.translations?.ar?.name,
    "description": matchedCourse.translations?.[currentLang]?.description || matchedCourse.translations?.ar?.description,
    "provider": {
      "@type": "Organization",
      "name": currentLang === 'ar' ? "أكاديمية لندن للإعلام والعلاقات العامة" : "London Academy for Media & PR",
      "url": "https://www.lampr.ac"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "onsite",
      "location": {
        "@type": "Place",
        "name": matchedCourse.translations?.[currentLang]?.city || matchedCourse.translations?.ar?.city,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": matchedCourse.translations?.[currentLang]?.city || matchedCourse.translations?.ar?.city
        }
      },
      "startDate": matchedCourse.courseDate,
      "instructor": {
        "@type": "Organization",
        "name": currentLang === 'ar' ? "أكاديمية لندن" : "London Academy"
      }
    },
    "offers": {
      "@type": "Offer",
      "category": matchedCourse.translations?.[currentLang]?.section || matchedCourse.translations?.ar?.section,
      "availability": "https://schema.org/InStock"
    }
  };

  // 5) إنشاء Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": currentLang === 'ar' ? "الرئيسية" : "Home",
        "item": "https://www.lampr.ac"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": currentLang === 'ar' ? "الدورات" : "Courses",
        "item": "https://www.lampr.ac/ar/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": matchedCourse.translations?.[currentLang]?.name || matchedCourse.translations?.ar?.name,
        "item": `https://www.lampr.ac/ar/event/${slugFromURL}`
      }
    ]
  };

  // 6) إنشاء FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": currentLang === 'ar' ? "ما هي مدة الدورة?" : "What is the course duration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": currentLang === 'ar' ? "الدورة تستغرق 5 أيام تدريبية مكثفة." : "The course duration is 5 intensive training days."
        }
      },
      {
        "@type": "Question",
        "name": currentLang === 'ar' ? "أين تُعقد الدورة?" : "Where is the course held?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${currentLang === 'ar' ? 'تُعقد الدورة في' : 'The course is held in'} ${matchedCourse.translations?.[currentLang]?.city || matchedCourse.translations?.ar?.city}.`
        }
      },
      {
        "@type": "Question",
        "name": currentLang === 'ar' ? "هل تحصل على شهادة?" : "Do I get a certificate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": currentLang === 'ar' ? "نعم، تحصل على شهادة معتمدة من أكاديمية لندن بعد إتمام الدورة." : "Yes, you will receive an accredited certificate from London Academy upon course completion."
        }
      }
    ]
  };

  // 7) Pass course to child component
  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Hreflang pathname={`/event/${slugFromURL}`} currentLang={currentLang} />
      <EventPage
        params={{ slug: slugFromURL }}
        course={{ success: true, data: matchedCourse }}
      />
    </>
  );
}
