"use client";

import {
  useMemo,
  useRef,
  useEffect,
  useState,
  type ReactNode,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactPortal,
} from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Award,
  Globe,
  Phone,
  Mail,
  Target,
  TrendingUp,
  Gift,
  BookOpen,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CourseImageCarousel from "@/components/course-image-carousel";
import { useReCaptcha } from "@/components/ReCaptchaProvider";
import { RECAPTCHA_CONFIG } from "@/lib/recaptcha-config";
import Marquee from "react-fast-marquee";

gsap.registerPlugin(ScrollTrigger);

// =================================================================
// 💡 REFINED INTERFACES FOR TYPE SAFETY
// =================================================================
interface ITranslation {
  name: string;
  section: string;
  city: string;
  price: string;
  duration: string;
  nextDate: string;
  participants: number;
  language: string;
  description: string;
  importance: string[];
  outcomes: string[];
  services: string[];
  objectives: string[];
  targetAudience?: string[]; // لمن هذه الدورة
  modules: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  instructor: {
    name: string;
    title: string;
    experience: string;
    image: string;
  };
  certificate: string;
  venue: string;
  includes: string[];
  faq: { question: string; answer: string }[];
}

interface ICourseDetails {
  trainer: any;
  _id: string;
  slug: { ar: string; en: string };
  translations: {
    ar: ITranslation;
    en: ITranslation;
  };
  images?: string[];
}

interface DateOption {
  value: string;
  label: string;
}

interface TranslationProps {
  dates: ReactNode;
  trainingWeek: any;
  duration: ReactNode;
  city: ReactNode;
  courseImportance: ReactNode;
  importanceDesc: ReactNode;
  courseObjectives: ReactNode;
  courseOutcomes: ReactNode;
  afterCompletion: ReactNode;
  courseModules: ReactNode;
  companionServices: ReactNode;
  servicesDesc: ReactNode;
  faq: ReactNode;
  staticFaq: any;
  courseInfo: ReactNode;
  trainingLanguage: ReactNode;
  venue: ReactNode;
  certificate: ReactNode;
  participants: ReactNode;
  courseIncludes: ReactNode;
  needHelp: ReactNode;
  contactUs: ReactNode;
  relatedCourses: ReactNode;
  viewAllCourses: ReactNode | null | undefined;
  multipleDates: ReactNode;
  bookCourse: string;
  selectDate: string;
  selectDatePlaceholder: string;
  selectCity: string;
  selectCityPlaceholder: string;
  name: string;
  required: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  bookNow: string;
}

interface IInstructor {
  _id: string;
  name_ar: string;
  name_en: string;
  experience_ar: string;
  experience_en: string;
  linkedin_url: string;
  image_url: string;
}

interface CourseProps {
  duration: any;
  city: ReactNode;
  importance: any;
  objectives: any;
  outcomes: any;
  modules: any;
  services: any;
  language: ReactNode;
  venue: ReactNode;
  certificate: ReactNode;
  participants: ReactNode;
  includes: any;
  section: ReactNode;
  description: ReactNode;
  name: ReactNode;
  price: string; // افترضنا وجود سعر
}

interface BookingFormProps {
  t: TranslationProps;
  course: CourseProps; // أضفنا Course لتمرير السعر
  availableDates: DateOption[];
  currentCities: string[];
}

interface CoursePageProps {
  params: {
    slug: string;
  };
  // 💡 Expecting the fetched course data structure
  course: {
    success: boolean;
    data: ICourseDetails;
  };
  instructor?: IInstructor;
}

// 💡 MOCK RELATED COURSES (Needed for the Related Courses section)
const mockRelatedCourses = {
  ar: [
    {
      id: "2",
      name: "مهارات العلاقات العامة المتقدمة",
      section: "التواصل المؤسسي",
      slug: "advanced-pr-skills-ar",
    },
    {
      id: "3",
      name: "إدارة الأزمات الإعلامية",
      section: "الإدارة الإعلامية",
      slug: "media-crisis-management-ar",
    },
  ],
  en: [
    {
      id: "2",
      name: "Advanced PR Skills",
      section: "Corporate Communication",
      slug: "advanced-pr-skills-en",
    },
    {
      id: "3",
      name: "Media Crisis Management",
      section: "Media Management",
      slug: "media-crisis-management-en",
    },
  ],
};

// =================================================================
// 💡 MAIN COMPONENT START
// =================================================================
export default function EventPage({
  params,
  course: serverCourse,
  instructor,
}: CoursePageProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "ar") as "ar" | "en";
  const isArabic = lang === "ar";

  // 1. Data Extraction and Validation
  const courseData = serverCourse?.data;
  // The current course object in the selected language
  const course = courseData ? courseData.translations[lang] : null;

  if (!courseData || !course) {
    // If data is missing, use notFound() to show a 404 page
    notFound();
    return null; // Should not be reached, but necessary for TS
  }

  // Refs for animations (Keeping the original structure)
  const heroBadgeRef = useRef<any>(null);
  const heroTitleRef = useRef<any>(null);
  const heroDescRef = useRef<any>(null);
  const heroStatsRef = useRef<any>(null);
  const importanceTitleRef = useRef<any>(null);
  const importanceDescRef = useRef<any>(null);
  const importanceListRef = useRef<any>(null);
  const objectivesTitleRef = useRef<any>(null);
  const objectivesListRef = useRef<any>(null);
  const outcomesTitleRef = useRef<any>(null);
  const outcomesDescRef = useRef<any>(null);
  const outcomesListRef = useRef<any>(null);
  const modulesTitleRef = useRef<any>(null);
  const modulesListRef = useRef<any>(null);
  const servicesTitleRef = useRef<any>(null);
  const servicesDescRef = useRef<any>(null);
  const servicesListRef = useRef<any>(null);
  const instructorTitleRef = useRef<any>(null);
  const instructorInfoRef = useRef<any>(null);
  const faqTitleRef = useRef<any>(null);
  const faqListRef = useRef<any>(null);
  const bookingHeaderRef = useRef<any>(null);
  const bookingFormRef = useRef<any>(null);
  const infoTitleRef = useRef<any>(null);
  const infoItemsRef = useRef<any>(null);
  const includesTitleRef = useRef<any>(null);
  const includesListRef = useRef<any>(null);
  const contactTitleRef = useRef<any>(null);
  const contactItemsRef = useRef<any>(null);
  const relatedTitleRef = useRef<any>(null);
  const relatedListRef = useRef<any>(null);

  // Embedded translations (Completed the EN part)
  const translations = useMemo(
    () => ({
      ar: {
        bookCourse: "حجز الدورة",
        selectDate: "اختر التاريخ",
        selectDatePlaceholder: "اختر تاريخ الدورة",
        selectCity: "اختر المدينة",
        selectCityPlaceholder: "اختر المدينة",
        name: "الاسم",
        namePlaceholder: "أدخل اسمك الكامل",
        email: "البريد الإلكتروني",
        emailPlaceholder: "your@email.com",
        phone: "رقم الهاتف",
        phonePlaceholder: "+966 50 123 4567",
        bookNow: "احجز الآن",
        courseInfo: "معلومات الدورة",
        trainingLanguage: "لغة التدريب",
        venue: "مكان الانعقاد",
        certificate: "الشهادة",
        courseIncludes: "تشمل الدورة",
        needHelp: "هل تحتاج مساعدة؟",
        contactUs: "تواصل معنا",
        relatedCourses: "دورات ذات صلة",
        viewAllCourses: "عرض جميع دورات",
        courseImportance: "أهمية الدورة",
        courseObjectives: "أهداف الدورة",
        courseOutcomes: "مخرجات الدورة",
        courseModules: "محاور الدورة",
        companionServices: "الخدمات المرافقة",
        instructor: "المدرب",
        faq: "الأسئلة الشائعة",
        multipleDates: "تواريخ متعددة",
        dates: "التواريخ",
        trainingWeek: "أسبوع تدريبي",
        duration: "المدة",
        city: "المدينة",
        participants: "عدد المشاركين",
        afterCompletion: "بعد إتمام هذه الدورة بنجاح، ستكون قادراً على:",
        importanceDesc:
          "في عالم الأعمال اليوم، يعتبر التواصل المؤسسي الفعال أحد أهم العوامل المحددة لنجاح أي مؤسسة. هذه الدورة تزودك بالمهارات والأدوات اللازمة لتطوير استراتيجيات تواصل مؤثرة.",
        servicesDesc:
          "نحرص على تقديم تجربة تدريبية شاملة تتضمن مجموعة من الخدمات المتميزة:",
        oneDay: "يوم واحد",
        required: "*",
        // 💡 تمت إضافة بيانات FAQ الثابتة هنا
        staticFaq: [
          {
            question: "هل الشهادة معتمدة؟",
            answer:
              "نعم، الشهادة معتمدة دولياً من الأكاديمية ومانحي الاعتماد العالميين.",
          },
          {
            question: "أين سيتم عقد الدورة؟",
            answer:
              "مكان الانعقاد يختلف حسب المدينة التي تختارها، ويتم تحديده في بريد التأكيد قبل بدء الدورة.",
          },
          {
            question: "ما هي شروط الإلغاء؟",
            answer:
              "يمكن الإلغاء حتى 7 أيام قبل بدء الدورة مع استرداد كامل المبلغ، وتطبق الشروط والأحكام.",
          },
        ],
      },
      en: {
        // 💡 COMPLETED ENGLISH TRANSLATIONS
        bookCourse: "Book Course",
        selectDate: "Select Date",
        selectDatePlaceholder: "Choose course date",
        selectCity: "Select City",
        selectCityPlaceholder: "Choose city",
        name: "Name",
        namePlaceholder: "Enter your full name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        phone: "Phone Number",
        phonePlaceholder: "+44 7999 958569",
        bookNow: "Book Now",
        courseInfo: "Course Information",
        trainingLanguage: "Training Language",
        venue: "Venue",
        certificate: "Certificate",
        courseIncludes: "Course Includes",
        needHelp: "Need Help?",
        contactUs: "Contact Us",
        relatedCourses: "Related Courses",
        viewAllCourses: "View All Courses in",
        courseImportance: "Course Importance",
        courseObjectives: "Course Objectives",
        courseOutcomes: "Course Outcomes",
        courseModules: "Course Modules",
        companionServices: "Included Services",
        instructor: "Instructor",
        faq: "Frequently Asked Questions",
        multipleDates: "Multiple Dates",
        dates: "Dates",
        trainingWeek: "Training Week",
        duration: "Duration",
        city: "City",
        participants: "Participants",
        afterCompletion:
          "After successfully completing this course, you will be able to:",
        importanceDesc:
          "In today's business world, effective corporate communication is one of the most critical factors determining organizational success. This course equips you with the skills and tools needed to develop impactful communication strategies.",
        servicesDesc:
          "We ensure a comprehensive training experience that includes a range of distinguished services:",
        oneDay: "One Day",
        required: "*",
        // 💡 تمت إضافة بيانات FAQ الثابتة هنا
        staticFaq: [
          {
            question: "Is the certificate accredited?",
            answer:
              "Yes, the certificate is internationally accredited by the Academy and global accreditation bodies.",
          },
          {
            question: "Where will the course be held?",
            answer:
              "The venue varies by the city you choose and will be specified in the confirmation email before the course starts.",
          },
          {
            question: "What are the cancellation terms?",
            answer:
              "Cancellation is permitted up to 7 days before the course start date for a full refund. Terms and conditions apply.",
          },
        ],
      },
    }),
    []
  );

  const t = translations[lang];

  const cities = useMemo(
    () => ({
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
    }),
    []
  );

  function getNext10MondaysFromSecondMonday() {
    const mondays = [];
    const today = new Date();

    // 1 = Monday in JS (0 = Sunday)
    const daysUntilNextMonday = (1 + 7 - today.getDay()) % 7 || 7;
    const firstMonday = new Date(
      today.getTime() + daysUntilNextMonday * 24 * 60 * 60 * 1000
    );

    // نبدأ من الاثنين الثاني بعد اليوم الحالي
    const secondMonday = new Date(
      firstMonday.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    for (let i = 0; i < 10; i++) {
      const monday = new Date(
        secondMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      mondays.push({
        value: monday.toISOString().split("T")[0],
        label: monday.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
    return mondays;
  }

  // Using the extracted course variable, which is already in the correct language
  const availableDates = getNext10MondaysFromSecondMonday();
  const currentRelatedCourses = mockRelatedCourses[lang];
  const currentCities = cities[lang];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // GSAP Animations (Keeping the original structure)
  useEffect(() => {
    if (!course) return;

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroBadgeRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
      gsap.from(heroTitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(heroDescRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      });
      gsap.from(heroStatsRef.current?.children, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        delay: 0.6,
        ease: "power2.out",
      });

      // Main content sections
      const sections = [
        {
          titleRef: importanceTitleRef,
          descRef: importanceDescRef,
          listRef: importanceListRef,
        },
        { titleRef: objectivesTitleRef, listRef: objectivesListRef },
        {
          titleRef: outcomesTitleRef,
          descRef: outcomesDescRef,
          listRef: outcomesListRef,
        },
        { titleRef: modulesTitleRef, listRef: modulesListRef },
        {
          titleRef: servicesTitleRef,
          descRef: servicesDescRef,
          listRef: servicesListRef,
        },
        { titleRef: instructorTitleRef, listRef: instructorInfoRef },
        { titleRef: faqTitleRef, listRef: faqListRef },
      ];

      sections.forEach(({ titleRef, descRef, listRef }) => {
        if (titleRef.current) {
          gsap.from(titleRef.current, {
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
            x: isArabic ? 40 : -40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }
        if (descRef?.current) {
          gsap.from(descRef.current, {
            scrollTrigger: { trigger: descRef.current, start: "top 80%" },
            y: 20,
            opacity: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out",
          });
        }
        if (listRef?.current && listRef.current.children) {
          gsap.from(listRef.current.children, {
            scrollTrigger: { trigger: listRef.current, start: "top 75%" },
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
          });
        }
      });

      // Sidebar
      const sidebarSections = [
        { headerRef: bookingHeaderRef, contentRef: bookingFormRef },
        { headerRef: infoTitleRef, contentRef: infoItemsRef },
        { headerRef: includesTitleRef, contentRef: includesListRef },
        { headerRef: contactTitleRef, contentRef: contactItemsRef },
        { headerRef: relatedTitleRef, contentRef: relatedListRef },
      ];

      sidebarSections.forEach(({ headerRef, contentRef }) => {
        if (headerRef?.current) {
          gsap.from(headerRef.current, {
            scrollTrigger: { trigger: headerRef.current, start: "top 80%" },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
          });
        }
        if (contentRef?.current && contentRef.current.children) {
          gsap.from(contentRef.current.children, {
            scrollTrigger: { trigger: contentRef.current, start: "top 75%" },
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      });
    });

    return () => ctx.revert();
  }, [course, isArabic]);

  const getSectionColor = (section: string) => {
    const sectionMap: Record<string, string> = {
      "التواصل المؤسسي":
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300",
      "Corporate Communication":
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300",
      "المراسم والاتكيت":
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300",
      "Protocol & Etiquette":
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300",
      "الإدارة الإعلامية":
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300",
      "Media Management":
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300",
      "التسويق والعلامة التجارية":
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300",
      "Marketing & Branding":
        "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300",
      "الذكاء الاصطناعي":
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300",
      "Artificial Intelligence":
        "bg-navy-100 text-navy-700 dark:bg-navy-900 dark:text-navy-300",
      "التصميم والمونتاج":
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300",
      "Design & Editing":
        "bg-crimson-100 text-crimson-700 dark:bg-crimson-900 dark:text-crimson-300",
    };
    return (
      sectionMap[section] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  // 2. Structured Data (JSON-LD) - Using course data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: isArabic
        ? "أكاديمية لندن للإعلام والعلاقات العامة"
        : "London Academy of Media and Public Relations",
      url: "https://lampr.ac",
      logo: "https://lampr.ac/logo.png",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
        addressLocality: "London",
        streetAddress: "123 Oxford Street",
      },
    },
    courseCode: `LA-${courseData._id}`, // Using MongoDB ID
    educationalLevel: "Professional",
    timeRequired: course.duration,
    coursePrerequisites: isArabic
      ? "لا توجد متطلبات مسبقة"
      : "No prerequisites",
    inLanguage: lang,
    availableLanguage: ["ar", "en"],
    offers: {
      "@type": "Offer",
      price: course.price.replace(/[^\d]/g, ""),
      priceCurrency: course.price.includes("£")
        ? "GBP"
        : course.price.includes("$")
        ? "USD"
        : "EUR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      category: course.section,
    },
    location: {
      "@type": "Place",
      name: course.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: course.city,
        addressCountry:
          course.city.includes("London") || course.city.includes("لندن")
            ? "GB"
            : course.city.includes("Dubai") || course.city.includes("دبي")
            ? "AE"
            : "EU",
      },
    },
    startDate: availableDates[0]?.value,
    endDate: availableDates[0]?.value,
    duration: "P5D", // Assuming 5 days training week
    courseMode: "Blended",
    educationalCredentialAwarded: course.certificate,
    teaches: course.objectives,
    syllabusSections: course.modules.map((module: any) => ({
      "@type": "Syllabus",
      name: module.title,
      timeRequired: module.duration,
      description: module.topics.join(", "),
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // ✅ الكود المصحح: يستخدم t.staticFaq
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.staticFaq.map((item: any) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // 💡 الحالات (States) لتخزين بيانات النموذج
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha(
    RECAPTCHA_CONFIG.siteKey,
    "booking"
  );

  // 💡 دالة معالجة الإرسال (handleSubmit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ التحقق المبدئي على العميل لمنع الإرسال الفارغ
    if (!date || !city || !name || !email || !phone) {
      alert(
        isArabic
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill all required fields"
      );
      return;
    }

    setLoading(true);

    try {
      // 🔒 Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha();

      if (!recaptchaToken) {
        alert(
          isArabic
            ? "فشل التحقق من الأمان. يرجى المحاولة مرة أخرى."
            : "Security verification failed. Please try again."
        );
        setLoading(false);
        return;
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 💡 إرسال البيانات المجمعة مع reCAPTCHA token
        body: JSON.stringify({
          date,
          city,
          name,
          email,
          phone,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("تم إرسال الحجز بنجاح");
        // إعادة ضبط الفورم
        setDate("");
        setCity("");
        setName("");
        setEmail("");
        setPhone("");
        router.push("/ar/courses");
      } else {
        // 🛡️ استخدام رسالة خطأ من الخادم إن وُجدت
        alert(data.message || "حدث خطأ أثناء إرسال الحجز");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  // 1. تعريف متغير الحالة في أعلى المكون
  const [error, setError] = useState<string | null>(null);
  // ...

  // 2. تعديل دالة useEffect لتخزين البيانات
  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Enhanced Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-24 h-24 rounded-full shadow-lg top-10 right-10 bg-gradient-to-br from-royal-200/10 to-royal-300/5 dark:from-royal-600/10 dark:to-royal-700/5 blur-2xl animate-float-slow"></div>
          <div className="absolute w-20 h-20 rounded-full shadow-md bottom-20 left-10 bg-gradient-to-br from-crimson-200/10 to-crimson-300/5 dark:from-crimson-600/10 dark:to-crimson-700/5 blur-xl animate-float-medium"></div>
          <div className="absolute w-16 h-16 rounded-full shadow-sm top-1/3 left-1/4 bg-gradient-to-br from-royal-300/8 to-royal-400/3 dark:from-royal-700/8 dark:to-royal-800/3 blur-lg animate-float-fast"></div>
          <div className="absolute rounded-full shadow-lg bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-crimson-300/8 to-crimson-400/3 dark:from-crimson-700/8 dark:to-crimson-800/3 blur-2xl animate-float-slow"></div>
          <div className="absolute rounded-full shadow-md top-2/3 right-1/4 w-18 h-18 bg-gradient-to-br from-royal-200/8 to-royal-300/4 dark:from-royal-600/8 dark:to-royal-700/4 blur-md animate-float-medium"></div>
          <div className="absolute rounded-full shadow-sm top-1/4 right-1/2 w-14 h-14 bg-gradient-to-br from-crimson-200/6 to-crimson-300/3 dark:from-crimson-600/6 dark:to-crimson-700/3 blur-lg animate-float-fast"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden text-white bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div ref={heroBadgeRef}>
                <Badge className={`${getSectionColor(course.section)} mb-4`}>
                  {course.section}
                </Badge>
              </div>
              <h1
                ref={heroTitleRef}
                className="mb-6 text-4xl font-bold lg:text-5xl"
              >
                {course.name}
              </h1>
              <p
                ref={heroDescRef}
                className="mb-8 text-xl text-gray-200 dark:text-gray-300"
              >
                {course.description}
              </p>

              <div
                ref={heroStatsRef}
                className="grid gap-6 mb-8 md:grid-cols-3"
              >
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-royal-300 dark:text-royal-400" />
                  <div className="font-semibold">{t.multipleDates}</div>
                  <div className="text-sm text-gray-300 dark:text-gray-400">
                    {t.dates}
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-royal-300 dark:text-royal-400" />
                  <div className="font-semibold">
                    {course.duration || t.trainingWeek}
                  </div>
                  <div className="text-sm text-gray-300 dark:text-gray-400">
                    {t.duration}
                  </div>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-royal-300 dark:text-royal-400" />
                  <div className="font-semibold">{course.city}</div>
                  <div className="text-sm text-gray-300 dark:text-gray-400">
                    {t.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* قسم الصور المتحركة */}
        <div className="py-8">
               
          <Marquee // 🚀 سرعة العرض: استخدمنا هنا الخاصية التي طلبتها (speed={40})
            speed={20}
            pauseOnHover={true}
            autoFill={true}
          >
                   
            {
              // 🔑 نستخدم courseData.images لإنشاء عناصر الصورة
              (courseData.images || []).map(
                (imageUrl: string, index: number) => (
                  <div key={index} className="flex-shrink-0 mx-4">
                                 
                    {/* 💡 استخدم مكون الصورة الذي تفضله (مثلاً: Next.js Image أو <img> عادي) */}
                                 
                    <Image
                      src={imageUrl}
                      alt={`Course Image ${index + 1}`}
                      className="object-cover w-auto h-40 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700"
                      width={160}
                      height={160}
                    />
                               
                  </div>
                )
              )
            }
                 
          </Marquee>
             
        </div>

        <div className="container relative z-10 px-4 py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-3">
              {/* Course Importance */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={importanceTitleRef}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <Lightbulb className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                    {t.courseImportance}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    ref={importanceDescRef}
                    className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300"
                  >
                    {t.importanceDesc}
                  </p>
                  <ul ref={importanceListRef} className="space-y-3">
                    {course.importance.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-royal-500 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Course Objectives */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={objectivesTitleRef}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <Star className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                    {t.courseObjectives}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul ref={objectivesListRef} className="space-y-3">
                    {course.objectives.map(
                      (objective: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-royal-500 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {objective}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* لمن هذه الدورة / Who Should Attend */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Target className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                      {isArabic ? "لمن هذه الدورة" : "Who Should Attend"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.targetAudience.map(
                        (item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-royal-500 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Course Outcomes */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={outcomesTitleRef}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <Target className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                    {t.courseOutcomes}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    ref={outcomesDescRef}
                    className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300"
                  >
                    {t.afterCompletion}
                  </p>
                  <div
                    ref={outcomesListRef}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {course.outcomes.map((outcome: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-royal-500 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={modulesTitleRef}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <BookOpen className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                    {t.courseModules}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={modulesListRef} className="space-y-6">
                    {course.modules.map((module: any, index: number) => (
                      <div
                        key={index}
                        className={`border-${
                          isArabic ? "r" : "l"
                        }-4 border-royal-500 dark:border-royal-400 p${
                          isArabic ? "r" : "l"
                        }-4`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300"
                          >
                            {module.duration}
                          </Badge>
                        </div>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                          {module.topics.map(
                            (topic: string, topicIndex: number) => (
                              <li
                                key={topicIndex}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-royal-400 dark:bg-royal-500 rounded-full"></div>
                                {topic}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={servicesTitleRef}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    <Gift className="w-6 h-6 text-royal-500 dark:text-royal-400" />
                    {t.companionServices}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    ref={servicesDescRef}
                    className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300"
                  >
                    {t.servicesDesc}
                  </p>
                  <div
                    ref={servicesListRef}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {course.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-royal-500 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instructor */}
              {instructor ? (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle
                      ref={instructorTitleRef}
                      className="text-gray-900 dark:text-white"
                    >
                      {t.instructor}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={instructor?.linkedin_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        ref={instructorInfoRef}
                        className="flex items-start gap-4"
                      >
                        <img
                          src={instructor?.image_url ?? "/placeholder.svg"}
                          alt={
                            (isArabic
                              ? instructor?.name_ar
                              : instructor?.name_en) || ""
                          }
                          className="object-cover w-20 h-20 rounded-full"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isArabic
                              ? instructor?.name_ar ?? instructor?.name_en
                              : instructor?.name_en ?? instructor?.name_ar}
                          </h3>

                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {isArabic
                              ? instructor?.experience_ar ??
                                instructor?.experience_en
                              : instructor?.experience_en ??
                                instructor?.experience_ar}
                          </p>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      {t.instructor}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center text-gray-500">
                      {/* simple placeholder while instructor is loading */}
                      {isArabic
                        ? "جاري تحميل المدرب..."
                        : "Loading instructor..."}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQ */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    ref={faqTitleRef}
                    className="text-gray-900 dark:text-white"
                  >
                    {t.faq}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={faqListRef} className="space-y-6">
                    {t.staticFaq.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                          {item.question}
                        </h3>
                        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 lg:sticky lg:top-8">
                {/* Booking Form */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div
                      ref={bookingHeaderRef}
                      className="flex items-center justify-between"
                    >
                      <CardTitle className="text-gray-900 dark:text-white">
                        {t.bookCourse}
                      </CardTitle>
                      <div className="text-2xl font-bold text-royal-600 dark:text-royal-400">
                        {course.price}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* تحويل div إلى form مع onSubmit للحفاظ على الفانكشينالتي */}
                    <form
                      ref={bookingFormRef}
                      className="space-y-4"
                      onSubmit={handleSubmit}
                    >
                      {/* التاريخ */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.selectDate} <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={setDate} value={date}>
                          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue
                              placeholder={t.selectDatePlaceholder}
                            />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {availableDates.map((d) => (
                              <SelectItem
                                key={d.value}
                                value={d.value}
                                className="dark:text-white dark:hover:bg-gray-700"
                              >
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* المدينة */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.selectCity} <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={setCity} value={city}>
                          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue
                              placeholder={t.selectCityPlaceholder}
                            />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {currentCities.map((c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="dark:text-white dark:hover:bg-gray-700"
                              >
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* الاسم */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.name} {t.required}
                        </label>
                        <Input
                          placeholder={t.namePlaceholder}
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                      </div>

                      {/* الايميل */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.email} {t.required}
                        </label>
                        <Input
                          type="email"
                          placeholder={t.emailPlaceholder}
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                      </div>

                      {/* الهاتف */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.phone} {t.required}
                        </label>
                        <Input
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                      </div>

                      {/* زر الإرسال */}
                      <Button
                        type="submit"
                        className="w-full bg-crimson-500 hover:bg-crimson-600 dark:bg-crimson-600 dark:hover:bg-crimson-700 text-white py-3 text-lg font-semibold transition duration-300 h-fit !opacity-100 !visible"
                      >
                        {t.bookNow}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Course Information */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle
                      ref={infoTitleRef}
                      className="text-gray-900 dark:text-white"
                    >
                      {t.courseInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      ref={infoItemsRef}
                      className="space-y-3 text-gray-700 dark:text-gray-300"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="flex-shrink-0 w-5 h-5 text-royal-500" />
                        <span className="font-medium">
                          {t.trainingLanguage}:
                        </span>
                        <span>{course.language}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="flex-shrink-0 w-5 h-5 text-royal-500" />
                        <span className="font-medium">{t.venue}:</span>
                        <span>{course.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="flex-shrink-0 w-5 h-5 text-royal-500" />
                        <span className="font-medium">{t.certificate}:</span>
                        <span>{course.certificate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="flex-shrink-0 w-5 h-5 text-royal-500" />
                        <span className="font-medium">{t.duration}:</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="flex-shrink-0 w-5 h-5 text-royal-500" />
                        <span className="font-medium">{t.participants}:</span>
                        <span>{course.participants}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Includes */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle
                      ref={includesTitleRef}
                      className="text-gray-900 dark:text-white"
                    >
                      {t.courseIncludes}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul ref={includesListRef} className="space-y-3">
                      {course.includes.map(
                        (
                          item:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | Iterable<ReactNode>
                            | null
                            | undefined,
                          index: Key | null | undefined
                        ) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-5 h-5 text-crimson-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card className="text-white border-0 shadow-xl bg-crimson-500 dark:bg-crimson-700">
                  <CardHeader>
                    <CardTitle
                      ref={contactTitleRef}
                      className="text-center text-white"
                    >
                      {t.needHelp}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={contactItemsRef} className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <Phone className="w-5 h-5" />
                        <a href="tel:+44201234567" className="hover:underline">
                          +44 20 1234 567
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Mail className="w-5 h-5" />
                        <a
                          href="mailto:info@lampr.ac"
                          className="hover:underline"
                        >
                          info@lampr.ac
                        </a>
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full mt-4 text-white bg-white/20 hover:bg-white/30"
                      >
                        {t.contactUs}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Courses */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle
                      ref={relatedTitleRef}
                      className="text-gray-900 dark:text-white"
                    >
                      {t.relatedCourses}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={relatedListRef} className="space-y-4">
                      {currentRelatedCourses.map((related) => (
                        <Link
                          key={related.id}
                          href={`/course/${related.slug}`} // Assuming slug is the new route param
                          className="block p-3 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            {related.name}
                          </p>
                          <Badge
                            className={`mt-1 ${getSectionColor(
                              related.section
                            )}`}
                          >
                            {related.section}
                          </Badge>
                        </Link>
                      ))}
                      <Link
                        href="/courses"
                        className="block pt-2 text-sm text-center text-royal-600 dark:text-royal-400 hover:underline"
                      >
                        {t.viewAllCourses}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
