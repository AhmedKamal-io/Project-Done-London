"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import Marquee from "react-fast-marquee";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export interface ILeadingCompany {
  _id: string;
  name_ar: string;
  name_en: string;
  logo: {
    url: string;
    public_id: string;
  } | null;
}

interface ClientsStripProps {
  companies: ILeadingCompany[];
}

export const translations: Record<
  string,
  { title: string; description: string }
> = {
  ar: {
    title: "يثق بنا كبرى الشركات والمؤسسات",
    description: "أكثر من 200 شركة ومؤسسة اختارت أكاديمية لندن لتدريب موظفيها",
  },
  en: {
    title: "Trusted by Leading Companies and Organizations",
    description:
      "Over 200 companies and organizations have chosen London Academy to train their employees.",
  },
};

export default function ClientsStrip({ companies }: ClientsStripProps) {
  const { i18n } = useTranslation();
  const lng = i18n.language || "ar";
  const t = translations[lng];

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!companies || companies.length === 0 || isMounted.current) return;
    isMounted.current = true;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(Array.from(headingRef.current.children), {
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top 80%",
          },
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power2.out",
        });

        gsap.from(Array.from(marqueeRef.current.querySelectorAll("img")), {
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top 75%",
          },
          opacity: 0,
          scale: 0.8,
          stagger: 0.05,
          duration: 0.6,
          ease: "back.out(1.5)",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [companies]);

  const direction = lng === "ar" ? "right" : "left";
  const speed = 30;

  return (
    <section
      ref={sectionRef}
      dir={lng === "ar" ? "rtl" : "ltr"}
      className="py-16 bg-white border-y border-gray-100 dark:bg-gray-950 dark:border-gray-800 transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            {t.description}
          </p>{" "}
        </div>
        {/*  استبدال الكود اليدوي بـ Marquee */}
        {/* pnpm i react-fast-marquee */}
        <div className="relative overflow-hidden" ref={marqueeRef}>
          <Marquee
            direction={direction}
            speed={speed}
            autoFill={true}
            pauseOnHover={true}
          >
            {companies.map((client) => (
              <div
                key={client._id}
                className="mx-8 flex flex-col items-center justify-center space-y-2 overflow-hidden"
              >
                <Image
                  src={client.logo?.url || "/placeholder.svg"}
                  alt={lng === "ar" ? client.name_ar : client.name_en}
                  height={64}
                  width={88}
                  className="h-16 w-auto opacity-60 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 dark:opacity-70 dark:hover:opacity-100 rounded-md"
                />

                <p className="text-md text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {lng === "ar" ? client.name_ar : client.name_en}
                </p>
              </div>
            ))}
          </Marquee>
        </div>{" "}
      </div>{" "}
    </section>
  );
}
