"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, MapPin, Plane } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { getLocalizedPath } from "@/lib/i18n-utils"

gsap.registerPlugin(ScrollTrigger)

const cities: any = [
  {
    name: { ar: "لندن", en: "London" },
    country: { ar: "المملكة المتحدة", en: "United Kingdom" },
    image: "/placeholder.svg?height=400&width=600&text=London",
    timezone: "GMT",
    nextCourse: { ar: "15 يناير 2025", en: "15 January 2025" },
    description: {
      ar: "العاصمة البريطانية ومركز الأعمال والثقافة العالمية",
      en: "The British capital and a global center for business and culture",
    },
    highlights: {
      ar: ["مدينة الضباب التاريخية", "مركز الإعلام العالمي", "جامعات عريقة"],
      en: ["Historic fog city", "Global media hub", "Renowned universities"],
    },
    venue: {
      ar: "فندق هيلتون لندن - قاعة المؤتمرات",
      en: "Hilton London Hotel - Conference Hall",
    },
    courses: 12,
  },
  {
    name: { ar: "دبي", en: "Dubai" },
    country: { ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
    image: "/placeholder.svg?height=400&width=600&text=Dubai",
    timezone: "GST",
    nextCourse: { ar: "22 يناير 2025", en: "22 January 2025" },
    description: {
      ar: "مدينة المستقبل ومركز الأعمال في الشرق الأوسط",
      en: "The city of the future and a business hub of the Middle East",
    },
    highlights: {
      ar: ["مدينة الابتكار", "مركز التجارة العالمي", "بوابة الشرق والغرب"],
      en: ["City of innovation", "World Trade Center", "Gateway between East and West"],
    },
    venue: { ar: "فندق برج العرب - قاعة الماس", en: "Burj Al Arab Hotel - Diamond Hall" },
    courses: 10,
  },
]

export default function CitiesPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language || "ar"
  const isArabic = lang === "ar"

  const heroIconRef = useRef<any>(null)
  const heroTitleRef = useRef<any>(null)
  const heroSubtitleRef = useRef<any>(null)
  const citiesGridRef = useRef<any>(null)
  const whyHeadingRef = useRef<any>(null)
  const whyFeaturesRef = useRef<any>(null)

  const t: any = {
    title: {
      ar: "مدننا حول العالم",
      en: "Our Cities Around the World",
    },
    subtitle: {
      ar: "اكتشف المدن العالمية الثمان المختارة بعناية لتقديم تجربة تدريبية استثنائية تجمع بين التعلم والثقافة والجمال",
      en: "Explore eight carefully selected global cities offering a unique training experience blending learning, culture, and beauty.",
    },
    features: {
      heading: { ar: "لماذا اخترنا هذه المدن؟", en: "Why We Chose These Cities" },
      items: [
        {
          icon: <MapPin className="w-8 h-8 text-white" />,
          title: { ar: "مواقع استراتيجية", en: "Strategic Locations" },
          desc: {
            ar: "مدن عالمية مختارة بعناية لتكون مراكز للثقافة والأعمال والتعليم",
            en: "Global cities carefully chosen as centers of culture, business, and education.",
          },
        },
        {
          icon: <Plane className="w-8 h-8 text-white" />,
          title: { ar: "سهولة الوصول", en: "Easy Accessibility" },
          desc: {
            ar: "مطارات دولية رئيسية مع رحلات مباشرة من معظم المدن العربية",
            en: "Major international airports with direct flights from most Arab cities.",
          },
        },
        {
          icon: <Clock className="w-8 h-8 text-white" />,
          title: { ar: "بيئة مثالية", en: "Ideal Environment" },
          desc: {
            ar: "أجواء محفزة للتعلم مع إمكانية الاستفادة من الثقافة المحلية",
            en: "A motivating atmosphere for learning enriched by local culture.",
          },
        },
      ],
    },
    labels: {
      courses: { ar: "دورات", en: "Courses" },
      features: { ar: "مميزات المدينة:", en: "City Highlights:" },
      time: { ar: "التوقيت", en: "Timezone" },
      nextCourse: { ar: "الدورة القادمة", en: "Next Course" },
      viewCourses: { ar: "عرض الدورات في", en: "View courses in" },
    },
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroIconRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      })

      gsap.from(heroTitleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(heroSubtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.4,
        ease: "power3.out",
      })

      // City cards text content
      if (citiesGridRef.current) {
        gsap.from(citiesGridRef.current.querySelectorAll(".city-name"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          y: 30,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-country"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.2,
          delay: 0.1,
          duration: 0.7,
          ease: "power2.out",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-description"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.2,
          delay: 0.2,
          duration: 0.7,
          ease: "power2.out",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-highlight-title"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          x: isArabic ? 30 : -30,
          opacity: 0,
          stagger: 0.2,
          delay: 0.3,
          duration: 0.7,
          ease: "power2.out",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-highlight-badge"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          scale: 0.8,
          opacity: 0,
          stagger: 0.05,
          delay: 0.4,
          duration: 0.6,
          ease: "back.out(1.5)",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-info"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          opacity: 0,
          stagger: 0.1,
          delay: 0.5,
          duration: 0.6,
          ease: "power2.out",
        })

        gsap.from(citiesGridRef.current.querySelectorAll(".city-venue"), {
          scrollTrigger: {
            trigger: citiesGridRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.2,
          delay: 0.6,
          duration: 0.7,
          ease: "power2.out",
        })
      }

      // Why These Cities section
      gsap.from(whyHeadingRef.current, {
        scrollTrigger: {
          trigger: whyHeadingRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })

      if (whyFeaturesRef.current) {
        gsap.from(whyFeaturesRef.current.querySelectorAll(".feature-title"), {
          scrollTrigger: {
            trigger: whyFeaturesRef.current,
            start: "top 75%",
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
        })

        gsap.from(whyFeaturesRef.current.querySelectorAll(".feature-desc"), {
          scrollTrigger: {
            trigger: whyFeaturesRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.15,
          delay: 0.2,
          duration: 0.7,
          ease: "power2.out",
        })
      }
    })

    return () => ctx.revert()
  }, [isArabic])

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 dark:from-blue-950 dark:via-slate-900 dark:to-gray-950 text-white py-20 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div ref={heroIconRef}>
              <Plane className="w-16 h-16 mx-auto mb-6 text-royal-300 dark:text-blue-400" />
            </div>
            <h1 ref={heroTitleRef} className="text-4xl lg:text-6xl font-bold mb-6">
              {t.title[lang]}
            </h1>
            <p ref={heroSubtitleRef} className="text-xl text-gray-200 dark:text-gray-300 leading-relaxed">
              {t.subtitle[lang]}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Cities Grid */}
        <div ref={citiesGridRef} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {cities.map((city: any, index: any) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt={`${city.name[lang]} - ${city.country[lang]}`}
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div
                  className={`absolute bottom-4 ${
                    isArabic ? "right-4" : "left-4"
                  } text-white`}
                >
                  <h3 className="city-name text-2xl font-bold">{city.name[lang]}</h3>
                  <p className="city-country text-sm opacity-90">{city.country[lang]}</p>
                </div>
                <div className={`absolute top-4 ${isArabic ? "left-4" : "right-4"}`}>
                  <div className="bg-royal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {city.courses} {t.labels.courses[lang]}
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <p className="city-description text-gray-600 dark:text-gray-300 leading-relaxed">
                  {city.description[lang]}
                </p>

                <div className="space-y-2">
                  <h4 className="city-highlight-title font-semibold text-gray-900 dark:text-gray-100">
                    {t.labels.features[lang]}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {city.highlights[lang].map((highlight: any, idx: any) => (
                      <span
                        key={idx}
                        className="city-highlight-badge px-3 py-1 bg-royal-100 dark:bg-blue-900/30 text-royal-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="city-info flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-royal-500 dark:text-blue-400" />
                    <span>
                      {t.labels.time[lang]}: {city.timezone}
                    </span>
                  </div>
                  <div className="city-info flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-royal-500 dark:text-blue-400" />
                    <span>
                      {t.labels.nextCourse[lang]}: {city.nextCourse[lang]}
                    </span>
                  </div>
                </div>

                <div className="city-venue flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-royal-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{city.venue[lang]}</span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button className="w-full bg-royal-500 hover:bg-royal-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition">
                    <Link
                      href={getLocalizedPath(
                        `/courses?city=${encodeURIComponent(city.name[lang])}`,
                        lang as "ar" | "en"
                      )}
                    >
                      {t.labels.viewCourses[lang]} {city.name[lang]}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why These Cities Section */}
        <Card className="mt-16 bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-blue-700 dark:to-pink-700 text-white border-0 transition-colors duration-500">
          <CardContent className="p-12">
            <h2 ref={whyHeadingRef} className="text-3xl font-bold text-center mb-8">
              {t.features.heading[lang]}
            </h2>
            <div ref={whyFeaturesRef} className="grid md:grid-cols-3 gap-8">
              {t.features.items.map((item: any, i: any) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="feature-title font-bold text-xl mb-3">{item.title[lang]}</h3>
                  <p className="feature-desc text-white/90">{item.desc[lang]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
