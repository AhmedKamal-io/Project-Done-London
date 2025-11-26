"use client";

import { useMemo, useRef, useEffect } from "react";
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
  Users,
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
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CoursePageProps {
  params: { id: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "ar") as "ar" | "en";
  const isArabic = lang === "ar";

  // Refs for animations
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
  const bookingLabelsRef = useRef<any>(null);
  const infoTitleRef = useRef<any>(null);
  const infoItemsRef = useRef<any>(null);
  const includesTitleRef = useRef<any>(null);
  const includesListRef = useRef<any>(null);
  const contactTitleRef = useRef<any>(null);
  const contactItemsRef = useRef<any>(null);

  const translations = useMemo(
    () => ({
      ar: {
        courseNotFound: "الدورة غير موجودة",
        backToCourses: "العودة إلى الدورات",
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
        multipleCities: "مدن متعددة",
        locations: "المواقع",
        trainee: "متدرب",
        afterCompletion: "بعد إتمام هذه الدورة بنجاح، ستكون قادراً على:",
        importanceDesc:
          "في عالم الأعمال اليوم، يعتبر التواصل المؤسسي الفعال أحد أهم العوامل المحددة لنجاح أي مؤسسة.",
        servicesDesc:
          "نحرص على تقديم تجربة تدريبية شاملة تتضمن مجموعة من الخدمات المتميزة:",
        required: "*",
      },
      en: {
        courseNotFound: "Course Not Found",
        backToCourses: "Back to Courses",
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
        courseImportance: "Course Importance",
        courseObjectives: "Course Objectives",
        courseOutcomes: "Course Outcomes",
        courseModules: "Course Modules",
        companionServices: "Included Services",
        instructor: "Instructor",
        faq: "FAQ",
        multipleDates: "Multiple Dates",
        dates: "Dates",
        trainingWeek: "Training Week",
        duration: "Duration",
        multipleCities: "Multiple Cities",
        locations: "Locations",
        trainee: "Trainee",
        afterCompletion:
          "After successfully completing this course, you will be able to:",
        importanceDesc:
          "In today's business world, effective corporate communication is critical for organizational success.",
        servicesDesc:
          "We ensure a comprehensive training experience with distinguished services:",
        required: "*",
      },
    }),
    []
  );

  const t = translations[lang];

  const courseData = useMemo(
    () => ({
      ar: {
        1: {
          id: 1,
          name: "إدارة التواصل المؤسسي المتقدم",
          section: "التواصل المؤسسي",
          city: "لندن",
          price: "£2,500",
          duration: "5 أيام",
          participants: 25,
          language: "العربية والإنجليزية",
          description: "دورة شاملة في إدارة التواصل المؤسسي",
          importance: [
            "تطوير مهارات التواصل",
            "فهم أحدث الاتجاهات",
            "بناء علاقات قوية",
          ],
          outcomes: [
            "وضع استراتيجيات تواصل",
            "إتقان أدوات التواصل",
            "إدارة الأزمات",
          ],
          services: ["مواد تدريبية شاملة", "ورش عمل تطبيقية", "شهادة معتمدة"],
          objectives: [
            "فهم أسس التواصل",
            "تطوير استراتيجيات",
            "قياس فعالية الحملات",
          ],
          modules: [
            {
              title: "مقدمة في التواصل",
              duration: "يوم واحد",
              topics: ["تعريف", "أهمية"],
            },
            {
              title: "استراتيجيات التواصل",
              duration: "يوم واحد",
              topics: ["بناء استراتيجية"],
            },
          ],
          instructor: { name: "د. أحمد", title: "خبير", experience: "15 سنة" },
          certificate: "شهادة معتمدة",
          venue: "فندق هيلتون لندن",
          includes: ["المواد التدريبية", "الوجبات", "الشهادة"],
          faq: [
            { question: "ما المتطلبات؟", answer: "لا توجد" },
            { question: "هل تشمل شهادة؟", answer: "نعم" },
          ],
        },
      },
      en: {
        1: {
          id: 1,
          name: "Advanced Corporate Communication",
          section: "Corporate Communication",
          city: "London",
          price: "£2,500",
          duration: "5 Days",
          participants: 25,
          language: "Arabic and English",
          description: "Comprehensive course in corporate communication",
          importance: [
            "Develop communication skills",
            "Understand trends",
            "Build relationships",
          ],
          outcomes: [
            "Create strategies",
            "Master digital tools",
            "Manage crises",
          ],
          services: [
            "Training materials",
            "Practical workshops",
            "Certificate",
          ],
          objectives: [
            "Understand communication",
            "Develop strategies",
            "Measure effectiveness",
          ],
          modules: [
            {
              title: "Introduction",
              duration: "One Day",
              topics: ["Definition", "Importance"],
            },
            {
              title: "Strategies",
              duration: "One Day",
              topics: ["Building strategy"],
            },
          ],
          instructor: {
            name: "Dr. Ahmed",
            title: "Expert",
            experience: "15 years",
          },
          certificate: "Accredited certificate",
          venue: "Hilton London",
          includes: ["Materials", "Meals", "Certificate"],
          faq: [
            { question: "Requirements?", answer: "None" },
            { question: "Certificate?", answer: "Yes" },
          ],
        },
      },
    }),
    []
  );

  const cities = useMemo(
    () => ({ ar: ["لندن", "دبي"], en: ["London", "Dubai"] }),
    []
  );

  function getNext8Mondays() {
    const mondays = [];
    const today = new Date();
    const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(
      today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000
    );
    for (let i = 0; i < 8; i++) {
      const monday = new Date(
        nextMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      mondays.push({
        value: monday.toISOString().split("T")[0],
        label: monday.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
    return mondays;
  }

  const course =
    courseData[lang][Number.parseInt(params.id) as keyof typeof courseData.ar];
  const availableDates = getNext8Mondays();
  const currentCities = cities[lang];

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
        if (listRef?.current) {
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
        { headerRef: bookingHeaderRef, contentRef: bookingLabelsRef },
        { headerRef: infoTitleRef, contentRef: infoItemsRef },
        { headerRef: includesTitleRef, contentRef: includesListRef },
        { headerRef: contactTitleRef, contentRef: contactItemsRef },
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
        if (contentRef?.current) {
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

  if (!course) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t.courseNotFound}</h1>
          <Link href="/courses">
            <Button>{t.backToCourses}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getSectionColor = () =>
    "bg-royal-100 text-royal-700 dark:bg-royal-900 dark:text-royal-300";

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div ref={heroBadgeRef}>
              <Badge className={`${getSectionColor()} mb-4`}>
                {course.section}
              </Badge>
            </div>
            <h1
              ref={heroTitleRef}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              {course.name}
            </h1>
            <p ref={heroDescRef} className="text-xl text-gray-200 mb-8">
              {course.description}
            </p>
            <div ref={heroStatsRef} className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-royal-300" />
                <div className="font-semibold">{t.multipleDates}</div>
                <div className="text-sm text-gray-300">{t.dates}</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-royal-300" />
                <div className="font-semibold">{t.trainingWeek}</div>
                <div className="text-sm text-gray-300">{t.duration}</div>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-royal-300" />
                <div className="font-semibold">{t.multipleCities}</div>
                <div className="text-sm text-gray-300">{t.locations}</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-royal-300" />
                <div className="font-semibold">{course.participants}</div>
                <div className="text-sm text-gray-300">{t.trainee}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Importance */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle
                  ref={importanceTitleRef}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-6 h-6 text-royal-500" />
                  {t.courseImportance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  ref={importanceDescRef}
                  className="text-gray-600 dark:text-gray-300 mb-4"
                >
                  {t.importanceDesc}
                </p>
                <ul ref={importanceListRef} className="space-y-3">
                  {course.importance.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-royal-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle
                  ref={objectivesTitleRef}
                  className="flex items-center gap-2"
                >
                  <Star className="w-6 h-6 text-royal-500" />
                  {t.courseObjectives}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul ref={objectivesListRef} className="space-y-3">
                  {course.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-royal-500 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Outcomes */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle
                  ref={outcomesTitleRef}
                  className="flex items-center gap-2"
                >
                  <Target className="w-6 h-6 text-royal-500" />
                  {t.courseOutcomes}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  ref={outcomesDescRef}
                  className="text-gray-600 dark:text-gray-300 mb-4"
                >
                  {t.afterCompletion}
                </p>
                <div
                  ref={outcomesListRef}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {course.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-royal-500 mt-0.5" />
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle
                  ref={modulesTitleRef}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-6 h-6 text-royal-500" />
                  {t.courseModules}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={modulesListRef} className="space-y-4">
                  {course.modules.map((module, i) => (
                    <div key={i} className="border-l-4 border-royal-500 pl-4">
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <Badge variant="outline" className="mt-1">
                        {module.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle
                  ref={servicesTitleRef}
                  className="flex items-center gap-2"
                >
                  <Gift className="w-6 h-6 text-royal-500" />
                  {t.companionServices}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  ref={servicesDescRef}
                  className="text-gray-600 dark:text-gray-300 mb-4"
                >
                  {t.servicesDesc}
                </p>
                <div
                  ref={servicesListRef}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {course.services.map((service, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-royal-500 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle ref={instructorTitleRef}>{t.instructor}</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={instructorInfoRef} className="flex gap-4">
                  <div className="w-20 h-20 bg-royal-100 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-royal-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {course.instructor.name}
                    </h3>
                    <p className="text-royal-600">{course.instructor.title}</p>
                    <p className="text-sm text-gray-600">
                      {course.instructor.experience}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle ref={faqTitleRef}>{t.faq}</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={faqListRef} className="space-y-4">
                  {course.faq.map((item, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-2">{item.question}</h4>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <div
                  ref={bookingHeaderRef}
                  className="flex justify-between items-center"
                >
                  <CardTitle>{t.bookCourse}</CardTitle>
                  <div className="text-2xl font-bold text-royal-600">
                    {course.price}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div ref={bookingLabelsRef} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.selectDate}
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectDatePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.selectCity}
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCityPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.name}
                    </label>
                    <Input placeholder={t.namePlaceholder} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.email}
                    </label>
                    <Input type="email" placeholder={t.emailPlaceholder} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.phone}
                    </label>
                    <Input type="tel" placeholder={t.phonePlaceholder} />
                  </div>
                  <Button className="w-full bg-crimson-500 hover:bg-crimson-600">
                    {t.bookNow}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle ref={infoTitleRef}>{t.courseInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={infoItemsRef} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-royal-500" />
                    <div>
                      <div className="font-medium">{t.trainingLanguage}</div>
                      <div className="text-sm text-gray-600">
                        {course.language}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-royal-500" />
                    <div>
                      <div className="font-medium">{t.venue}</div>
                      <div className="text-sm text-gray-600">
                        {course.venue}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-royal-500" />
                    <div>
                      <div className="font-medium">{t.certificate}</div>
                      <div className="text-sm text-gray-600">
                        {course.certificate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Includes */}
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle ref={includesTitleRef}>{t.courseIncludes}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul ref={includesListRef} className="space-y-2">
                  {course.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-royal-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gradient-to-br from-royal-500 to-crimson-500 text-white">
              <CardHeader>
                <CardTitle ref={contactTitleRef}>{t.needHelp}</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={contactItemsRef} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>+44 7999 958569</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>info@lampr.ac</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    {t.contactUs}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
