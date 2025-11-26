"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Crown, Megaphone, TrendingUp, Brain, Palette, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const translations:any = {
  ar: {
    heading: "أقسام الأكاديمية",
    subheading: "نقدم مجموعة شاملة من الدورات التدريبية المتخصصة في مختلف مجالات الإعلام والعلاقات العامة",
    buttonText: "استعرض الدورات",
    sections: [
      {
        id: "corporate-communication",
        title: "دورات التواصل المؤسسي",
        description: "تطوير مهارات التواصل الداخلي والخارجي للمؤسسات والشركات",
        courses: ["إدارة التواصل المؤسسي", "العلاقات العامة الرقمية", "إدارة الأزمات الإعلامية"],
      },
      {
        id: "protocol-etiquette",
        title: "دورات المراسم والاتكيت",
        description: "أصول المراسم والبروتوكول الدبلوماسي والاتكيت في بيئة العمل",
        courses: ["البروتوكول الدبلوماسي", "اتكيت الأعمال", "فن الضيافة المؤسسية"],
      },
      {
        id: "media-management",
        title: "دورات الإدارة الإعلامية",
        description: "إدارة المحتوى الإعلامي والتخطيط الاستراتيجي للحملات الإعلامية",
        courses: ["التخطيط الإعلامي", "إنتاج المحتوى", "إدارة المنصات الرقمية"],
      },
      {
        id: "marketing-branding",
        title: "دورات التسويق والعلامة التجارية",
        description: "بناء وتطوير العلامات التجارية واستراتيجيات التسويق الحديثة",
        courses: ["استراتيجية العلامة التجارية", "التسويق الرقمي", "تحليل السوق"],
      },
      {
        id: "artificial-intelligence",
        title: "دورات الذكاء الاصطناعي",
        description: "تطبيقات الذكاء الاصطناعي في الإعلام والتسويق والعلاقات العامة",
        courses: ["الذكاء الاصطناعي في الإعلام", "أتمتة التسويق", "تحليل البيانات"],
      },
      {
        id: "design-editing",
        title: "دورات التصميم والمونتاج",
        description: "تصميم المحتوى البصري ومونتاج الفيديو للمنصات الرقمية",
        courses: ["التصميم الجرافيكي", "مونتاج الفيديو", "الموشن جرافيك"],
      },
    ],
  },
  en: {
    heading: "Academy Sections",
    subheading: "We offer a comprehensive range of specialized training courses in various fields of media and public relations.",
    buttonText: "Browse Courses",
    sections: [
      {
        id: "corporate-communication",
        title: "Corporate Communication Courses",
        description: "Develop internal and external communication skills for organizations and companies.",
        courses: ["Corporate Communication Management", "Digital Public Relations", "Media Crisis Management"],
      },
      {
        id: "protocol-etiquette",
        title: "Protocol and Etiquette Courses",
        description: "Principles of protocol, diplomatic etiquette, and workplace manners.",
        courses: ["Diplomatic Protocol", "Business Etiquette", "Corporate Hospitality"],
      },
      {
        id: "media-management",
        title: "Media Management Courses",
        description: "Media content management and strategic planning for media campaigns.",
        courses: ["Media Planning", "Content Production", "Digital Platform Management"],
      },
      {
        id: "marketing-branding",
        title: "Marketing and Branding Courses",
        description: "Building and developing brands and modern marketing strategies.",
        courses: ["Brand Strategy", "Digital Marketing", "Market Analysis"],
      },
      {
        id: "artificial-intelligence",
        title: "Artificial Intelligence Courses",
        description: "AI applications in media, marketing, and public relations.",
        courses: ["AI in Media", "Marketing Automation", "Data Analysis"],
      },
      {
        id: "design-editing",
        title: "Design and Editing Courses",
        description: "Visual content design and video editing for digital platforms.",
        courses: ["Graphic Design", "Video Editing", "Motion Graphics"],
      },
    ],
  },
}

const courseSectionsBase = [
  { id: "corporate-communication", icon: Users, color: "from-royal-500 to-royal-600" },
  { id: "protocol-etiquette", icon: Crown, color: "from-crimson-500 to-crimson-600" },
  { id: "media-management", icon: Megaphone, color: "from-navy-500 to-navy-600" },
  { id: "marketing-branding", icon: TrendingUp, color: "from-royal-600 to-crimson-500" },
  { id: "artificial-intelligence", icon: Brain, color: "from-navy-600 to-royal-500" },
  { id: "design-editing", icon: Palette, color: "from-crimson-600 to-navy-500" },
]

export default function CourseSections() {
  const { i18n } = useTranslation()
  const lng = i18n.language || "ar"
  const isArabic = lng === "ar"
  const t = translations[lng]
  
  const sectionRef = useRef<any>(null)
  const headingRef = useRef<any>(null)
  const cardsRef = useRef<any>(null)

  const courseSections = t.sections.map((s:any, index:any) => ({
    ...s,
    icon: courseSectionsBase[index].icon,
    color: courseSectionsBase[index].color,
  }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current?.children, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      })

      // Cards stagger animation
      gsap.from(cardsRef.current?.children, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      dir={isArabic ? "rtl" : "ltr"}
      className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-300"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal-100/50 dark:bg-royal-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson-100/50 dark:bg-crimson-900/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.heading}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.subheading}
          </p>
        </div>

        <div  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseSections.map((section:any) => {
            const IconComponent = section.icon
            return (
              <Card
                key={section.id}
                className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-royal-700 dark:group-hover:text-royal-400 transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {section.courses.map((course:any, index:any) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <div className="w-2 h-2 bg-royal-400 rounded-full"></div>
                        {course}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-royal-50 dark:group-hover:bg-royal-900/30 group-hover:border-royal-300 dark:group-hover:border-royal-700 bg-transparent border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    <Link
                      href={`/courses?section=${encodeURIComponent(
                        section.title.replace(isArabic ? "دورات " : "Courses", "")
                      )}`}
                      className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      {t.buttonText}
                      <ArrowLeft className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}