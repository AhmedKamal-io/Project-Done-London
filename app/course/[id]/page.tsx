import React, { Suspense } from "react";
import type { Metadata } from "next";
import CoursePage from "./component/Course";
import Loading from "@/components/loading";
import { cookies } from "next/headers";
import JsonLd from "@/components/JsonLd";

// Bilingual course data
const courseData = {
  1: {
    ar: {
      id: 1,
      name: "إدارة التواصل المؤسسي المتقدم",
      section: "التواصل المؤسسي",
      city: "لندن",
      price: "£2,500",
      duration: "5 أيام",
      nextDate: "15 يناير 2025",
      participants: 25,
      language: "العربية والإنجليزية",
      description:
        "دورة شاملة في إدارة التواصل المؤسسي تهدف إلى تطوير مهارات المشاركين في بناء استراتيجيات التواصل الفعالة داخل المؤسسات وخارجها.",
      importance: [
        "تطوير مهارات التواصل الاستراتيجي للمؤسسات",
        "فهم أحدث اتجاهات التواصل في العصر الرقمي",
        "بناء علاقات قوية مع الجمهور المستهدف",
        "إدارة السمعة المؤسسية بفعالية",
        "تحسين الصورة الذهنية للمؤسسة",
      ],
      outcomes: [
        "القدرة على وضع استراتيجيات تواصل شاملة",
        "إتقان استخدام أدوات التواصل الرقمي",
        "مهارات إدارة الأزمات الإعلامية",
        "تطوير المحتوى الإعلامي المؤثر",
        "قياس وتحليل فعالية حملات التواصل",
        "بناء شبكة علاقات مهنية قوية",
      ],
      services: [
        "مواد تدريبية شاملة ومحدثة",
        "ورش عمل تطبيقية مكثفة",
        "دراسات حالة من الواقع العملي",
        "جلسات استشارية فردية",
        "شبكة تواصل مع المتدربين السابقين",
        "متابعة لمدة 3 أشهر بعد انتهاء الدورة",
        "إمكانية الوصول للمواد التدريبية لمدة سنة",
        "شهادة معتمدة دولياً",
      ],
      objectives: [
        "فهم أسس التواصل المؤسسي الحديث",
        "تطوير استراتيجيات التواصل الداخلي والخارجي",
        "إدارة الأزمات الإعلامية بفعالية",
        "استخدام وسائل التواصل الاجتماعي في التواصل المؤسسي",
        "قياس فعالية حملات التواصل",
      ],
      modules: [
        {
          title: "مقدمة في التواصل المؤسسي",
          duration: "يوم واحد",
          topics: [
            "تعريف التواصل المؤسسي",
            "أهمية التواصل في المؤسسات",
            "أنواع التواصل المؤسسي",
          ],
        },
        {
          title: "استراتيجيات التواصل",
          duration: "يوم واحد",
          topics: [
            "بناء استراتيجية التواصل",
            "تحديد الجمهور المستهدف",
            "اختيار القنوات المناسبة",
          ],
        },
        {
          title: "التواصل الرقمي",
          duration: "يوم واحد",
          topics: [
            "وسائل التواصل الاجتماعي",
            "المحتوى الرقمي",
            "إدارة السمعة الإلكترونية",
          ],
        },
        {
          title: "إدارة الأزمات",
          duration: "يوم واحد",
          topics: ["التخطيط للأزمات", "التواصل أثناء الأزمة", "استعادة السمعة"],
        },
        {
          title: "القياس والتقييم",
          duration: "يوم واحد",
          topics: ["مؤشرات الأداء", "أدوات القياس", "تحليل النتائج"],
        },
      ],
      instructor: {
        name: "د. أحمد المنصوري",
        title: "خبير التواصل المؤسسي",
        experience: "15 سنة خبرة في مجال التواصل المؤسسي",
        image: "/placeholder.svg?height=200&width=200",
      },
      certificate: "شهادة معتمدة من أكاديمية لندن للإعلام والعلاقات العامة",
      venue: "فندق هيلتون لندن - قاعة المؤتمرات الرئيسية",
      includes: [
        "المواد التدريبية",
        "وجبات الإفطار والغداء",
        "استراحات القهوة",
        "شهادة الحضور",
        "متابعة لمدة 3 أشهر بعد الدورة",
      ],
      faq: [
        {
          question: "ما هي متطلبات الحضور؟",
          answer: "لا توجد متطلبات مسبقة، الدورة مناسبة لجميع المستويات",
        },
        {
          question: "هل تشمل الدورة شهادة؟",
          answer: "نعم، ستحصل على شهادة معتمدة من أكاديمية لندن",
        },
        {
          question: "ما هي لغة التدريب؟",
          answer: "التدريب باللغة العربية مع مراجع باللغة الإنجليزية",
        },
      ],
    },
    en: {
      id: 1,
      name: "Advanced Corporate Communication Management",
      section: "Corporate Communication",
      city: "London",
      price: "£2,500",
      duration: "5 Days",
      nextDate: "January 15, 2025",
      participants: 25,
      language: "Arabic and English",
      description:
        "A comprehensive course in corporate communication management aimed at developing participants' skills in building effective communication strategies within and outside organizations.",
      importance: [
        "Develop strategic communication skills for organizations",
        "Understand the latest communication trends in the digital age",
        "Build strong relationships with target audiences",
        "Manage corporate reputation effectively",
        "Improve the organization's mental image",
      ],
      outcomes: [
        "Ability to develop comprehensive communication strategies",
        "Master the use of digital communication tools",
        "Media crisis management skills",
        "Develop impactful media content",
        "Measure and analyze communication campaign effectiveness",
        "Build a strong professional network",
      ],
      services: [
        "Comprehensive and updated training materials",
        "Intensive practical workshops",
        "Real-world case studies",
        "Individual consulting sessions",
        "Network with previous trainees",
        "3-month follow-up after course completion",
        "Access to training materials for one year",
        "Internationally accredited certificate",
      ],
      objectives: [
        "Understand the foundations of modern corporate communication",
        "Develop internal and external communication strategies",
        "Manage media crises effectively",
        "Use social media in corporate communication",
        "Measure communication campaign effectiveness",
      ],
      modules: [
        {
          title: "Introduction to Corporate Communication",
          duration: "One Day",
          topics: [
            "Corporate Communication Definition",
            "Importance of Communication in Organizations",
            "Types of Corporate Communication",
          ],
        },
        {
          title: "Communication Strategies",
          duration: "One Day",
          topics: [
            "Building Communication Strategy",
            "Identifying Target Audience",
            "Choosing Appropriate Channels",
          ],
        },
        {
          title: "Digital Communication",
          duration: "One Day",
          topics: [
            "Social Media",
            "Digital Content",
            "Online Reputation Management",
          ],
        },
        {
          title: "Crisis Management",
          duration: "One Day",
          topics: [
            "Crisis Planning",
            "Communication During Crisis",
            "Reputation Recovery",
          ],
        },
        {
          title: "Measurement and Evaluation",
          duration: "One Day",
          topics: [
            "Performance Indicators",
            "Measurement Tools",
            "Results Analysis",
          ],
        },
      ],
      instructor: {
        name: "Dr. Ahmed Al-Mansouri",
        title: "Corporate Communication Expert",
        experience: "15 years of experience in corporate communication",
        image: "/placeholder.svg?height=200&width=200",
      },
      certificate:
        "Certificate accredited by London Academy for Media and Public Relations",
      venue: "Hilton London Hotel - Main Conference Hall",
      includes: [
        "Training materials",
        "Breakfast and lunch meals",
        "Coffee breaks",
        "Attendance certificate",
        "3-month follow-up after the course",
      ],
      faq: [
        {
          question: "What are the attendance requirements?",
          answer:
            "No prerequisites required, the course is suitable for all levels",
        },
        {
          question: "Does the course include a certificate?",
          answer:
            "Yes, you will receive an accredited certificate from London Academy",
        },
        {
          question: "What is the training language?",
          answer: "Training in Arabic with English references",
        },
      ],
    },
  },
};

// Generate next 8 Mondays
function getNext8Mondays(language: "ar" | "en" = "ar") {
  const mondays = [];
  const today = new Date();
  const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;
  const nextMonday = new Date(
    today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000
  );

  const locale = language === "ar" ? "ar-SA" : "en-GB";

  for (let i = 0; i < 8; i++) {
    const monday = new Date(nextMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    mondays.push({
      value: monday.toISOString().split("T")[0],
      label: monday.toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  }
  return mondays;
}

const cities = {
  ar: [
    "لندن",
    "دبي",
    "اسطنبول",
    "باريس",
    "روما",
    "برشلونة",
    "مدريد",
    "البندقية",
  ],
  en: [
    "London",
    "Dubai",
    "Istanbul",
    "Paris",
    "Rome",
    "Barcelona",
    "Madrid",
    "Venice",
  ],
};

interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const cookieStore = cookies();
  const language = (cookieStore.get("language")?.value ||
    cookieStore.get("i18next")?.value ||
    "ar") as "ar" | "en";

  const courseId = Number.parseInt(params.id);
  const course = courseData[courseId as keyof typeof courseData]?.[language];

  if (!course) {
    return {
      title:
        language === "ar"
          ? "الدورة غير موجودة | أكاديمية لندن"
          : "Course Not Found | London Academy",
      description:
        language === "ar"
          ? "الدورة المطلوبة غير متوفرة"
          : "The requested course is not available",
    };
  }

  const academyName =
    language === "ar"
      ? "أكاديمية لندن للإعلام والعلاقات العامة"
      : "London Academy for Media & PR";

  return {
    title: `${course.name} | ${academyName}`,
    description: course.description,
    keywords: `${course.name}, ${course.section}, ${
      language === "ar" ? "دورة تدريبية" : "training course"
    }, ${language === "ar" ? "أكاديمية لندن" : "London Academy"}, ${
      course.city
    }`,
    authors: [{ name: course.instructor.name }],
    openGraph: {
      title: course.name,
      description: course.description,
      type: "article",
      locale: language === "ar" ? "ar_SA" : "en_GB",
      images: [
        {
          url: course.instructor.image,
          width: 200,
          height: 200,
          alt: course.instructor.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: course.name,
      description: course.description,
      images: [course.instructor.image],
    },
    alternates: {
      canonical: `https://www.lampr.ac/event/${course.id}`,
      languages: {
        "ar-SA": `https://www.lampr.ac/event/${course.id}`,
        "en-GB": `https://www.lampr.ac/en/event/${course.id}`,
      },
    },
    other: {
      "article:author": course.instructor.name,
      "article:section": course.section,
      "course:duration": course.duration,
      "course:price": course.price,
      "course:location": course.city,
      "course:language": course.language,
      "course:participants": course.participants.toString(),
    },
  };
}

const page = async ({ params }: CoursePageProps) => {
  const cookieStore = cookies();
  const language = (cookieStore.get("language")?.value ||
    cookieStore.get("i18next")?.value ||
    "ar") as "ar" | "en";

  const courseId = Number.parseInt(params.id);
  const course = courseData[courseId as keyof typeof courseData]?.[language];

  // Course Schema للحصول على Rich Snippets
  const courseSchema = course ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": language === "ar" ? "أكاديمية لندن للإعلام والعلاقات العامة" : "London Academy for Media & PR",
      "sameAs": "https://www.lampr.ac"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "in-person",
      "location": {
        "@type": "Place",
        "name": course.venue,
        "address": course.city
      },
      "startDate": "2025-01-15",
      "duration": course.duration,
      "inLanguage": course.language
    },
    "offers": {
      "@type": "Offer",
      "price": course.price.replace(/[^0-9]/g, ''),
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    },
    "educationalCredentialAwarded": course.certificate,
    "instructor": {
      "@type": "Person",
      "name": course.instructor.name,
      "jobTitle": course.instructor.title,
      "description": course.instructor.experience
    }
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = course ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": language === "ar" ? "الرئيسية" : "Home",
      "item": "https://www.lampr.ac"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": language === "ar" ? "الدورات" : "Courses",
      "item": "https://www.lampr.ac/courses"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": course.name,
      "item": `https://www.lampr.ac/course/${courseId}`
    }]
  } : null;

  return (
    <Suspense fallback={<Loading />}>
      <div>
        {courseSchema && <JsonLd data={courseSchema} />}
        {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
        <CoursePage params={params} />
      </div>
    </Suspense>
  );
};

export default page;
