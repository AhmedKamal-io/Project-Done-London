"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface AccreditationItem {
  _id: string;
  name_ar: string;
  name_en: string;
  logo: {
    url: string;
    public_id: string;
  } | null;
}

interface Props {
  accreditations: AccreditationItem[];
  language?: "ar" | "en";
}

const translations: Record<
  "ar" | "en",
  { title: string; description: string }
> = {
  ar: {
    title: "الاعتمادات الدولية",
    description:
      "حاصلون على اعتمادات من أرقى المؤسسات التعليمية والمهنية العالمية",
  },
  en: {
    title: "International Accreditations",
    description:
      "We are accredited by leading global educational and professional institutions.",
  },
};

export default function InternationalAccreditations({
  accreditations,
  language = "ar",
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const isArabic = language === "ar";

  useEffect(() => {
    if (!accreditations || accreditations.length === 0) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(Array.from(headingRef.current?.children ?? []), {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });

      // Card container animation
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });

      // Accreditation logos stagger
      const accreditationItems = Array.from(
        cardRef.current?.querySelectorAll(".accreditation-item") ?? []
      );
      gsap.from(accreditationItems, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 70%",
        },
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "back.out(1.5)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [accreditations]);

  return (
    <section
      ref={sectionRef}
      dir={isArabic ? "rtl" : "ltr"}
      className="py-16 bg-gradient-to-br from-slate-50 to-gray-100 border-y border-gray-100 dark:from-gray-950 dark:to-gray-900 dark:border-gray-800 transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <Card
          ref={cardRef}
          className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg dark:shadow-gray-900/40 transition-colors duration-500"
        >
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              {accreditations.map((accr) => (
                <div
                  key={accr._id}
                  className="flex flex-col items-center group accreditation-item"
                >
                  <div className="relative overflow-hidden rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm dark:shadow-none group-hover:shadow-md dark:group-hover:shadow-gray-700/50 transition-all duration-300 w-full">
                    {accr.logo?.url ? (
                      <img
                        src={accr.logo.url}
                        alt={isArabic ? accr.name_ar : accr.name_en}
                        className="h-12 w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 dark:opacity-80 dark:group-hover:opacity-100"
                      />
                    ) : (
                      <div className="h-12 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        {isArabic ? accr.name_ar : accr.name_en}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center font-medium">
                    {isArabic ? accr.name_ar : accr.name_en}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
