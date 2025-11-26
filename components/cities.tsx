"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedBackground from "@/components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

interface CitiesProps {
  cityImages: Record<string, string | undefined>;
}

const translations: any = {
  ar: {
    title: "مدن الأكاديمية حول العالم",
    description:
      "نقدم دوراتنا التدريبية في 8 مدن عالمية مختارة بعناية لتوفير تجربة تعليمية استثنائية",
    timezone: "التوقيت",
    nextCourse: "الدورة القادمة",
    limitedSeats: "مقاعد محدودة متاحة",
    viewCourses: "عرض الدورات في",
    cities: [
      {
        name: "لندن",
        country: "المملكة المتحدة",
        timezone: "GMT",
        nextCourse: "15 يناير 2025",
        key: "london",
      },
      {
        name: "دبي",
        country: "الإمارات العربية المتحدة",
        timezone: "GST",
        nextCourse: "22 يناير 2025",
        key: "dubai",
      },
      {
        name: "اسطنبول",
        country: "تركيا",
        timezone: "TRT",
        nextCourse: "29 يناير 2025",
        key: "istanbul",
      },
      {
        name: "باريس",
        country: "فرنسا",
        timezone: "CET",
        nextCourse: "5 فبراير 2025",
        key: "paris",
      },
      {
        name: "روما",
        country: "إيطاليا",
        timezone: "CET",
        nextCourse: "12 فبراير 2025",
        key: "rome",
      },
      {
        name: "برشلونة",
        country: "إسبانيا",
        timezone: "CET",
        nextCourse: "19 فبراير 2025",
        key: "barcelona",
      },
      {
        name: "مدريد",
        country: "إسبانيا",
        timezone: "CET",
        nextCourse: "26 فبراير 2025",
        key: "madrid",
      },
      {
        name: "البندقية",
        country: "إيطاليا",
        timezone: "CET",
        nextCourse: "5 مارس 2025",
        key: "venice",
      },
    ],
  },
  en: {
    title: "Academy Cities Around the World",
    description:
      "We offer our training courses in 8 carefully selected global cities to provide an exceptional learning experience.",
    timezone: "Timezone",
    nextCourse: "Next Course",
    limitedSeats: "Limited seats available",
    viewCourses: "View courses in",
    cities: [
      {
        name: "London",
        country: "United Kingdom",
        timezone: "GMT",
        nextCourse: "January 15, 2025",
        key: "london",
      },
      {
        name: "Dubai",
        country: "United Arab Emirates",
        timezone: "GST",
        nextCourse: "January 22, 2025",
        key: "dubai",
      },
      {
        name: "Istanbul",
        country: "Turkey",
        timezone: "TRT",
        nextCourse: "January 29, 2025",
        key: "istanbul",
      },
      {
        name: "Paris",
        country: "France",
        timezone: "CET",
        nextCourse: "February 5, 2025",
        key: "paris",
      },
      {
        name: "Roma",
        country: "Italy",
        timezone: "CET",
        nextCourse: "February 12, 2025",
        key: "roma",
      },
      {
        name: "Barcelona",
        country: "Spain",
        timezone: "CET",
        nextCourse: "February 19, 2025",
        key: "barcelona",
      },
      {
        name: "Madrid",
        country: "Spain",
        timezone: "CET",
        nextCourse: "February 26, 2025",
        key: "madrid",
      },
      {
        name: "Venice",
        country: "Italy",
        timezone: "CET",
        nextCourse: "March 5, 2025",
        key: "venice",
      },
    ],
  },
};

export default function Cities({ cityImages }: CitiesProps) {
  const { i18n } = useTranslation();
  const lng = i18n.language || "ar";
  const isArabic = lng === "ar";
  const t = translations[lng];

  const sectionRef = useRef<any>(null);
  const headingRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current?.children, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
      });

      // City cards animation
      gsap.from(gridRef.current?.children, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.2)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir={isArabic ? "rtl" : "ltr"}
      className="relative py-20 overflow-hidden transition-colors duration-300 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-950"
    >
      <AnimatedBackground variant="orbs" />

      <div className="container relative z-10 px-4 mx-auto">
        <div ref={headingRef} className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            {t.title}
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            {t.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.cities.map((city: any, index: any) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-500 border border-gray-200 group hover:shadow-2xl dark:border-gray-800 bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden">
                <img
                  // يتم تحويل اسم المدينة إلى مفتاح صغير (مثل "لندن" تصبح "london")
                  src={
                    cityImages[city.key] ||
                    "/placeholder.svg?height=300&width=400"
                  }
                  alt={`${city.name} - ${city.country}`}
                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute text-white bottom-4 left-4">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm opacity-90">{city.country}</p>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-royal-500" />
                  <span>
                    {t.timezone}: {city.timezone}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-royal-500" />
                  <span>
                    {t.nextCourse}: {city.nextCourse}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-royal-400 to-crimson-500 animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.limitedSeats}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button className="w-full text-white bg-royal-500 hover:bg-royal-600 dark:hover:bg-royal-700">
                    <Link
                      href={
                        isArabic
                          ? `/ar/cities/${city.key}`
                          : `/cities/${city.key}`
                      }
                    >
                      {t.viewCourses} {city.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
