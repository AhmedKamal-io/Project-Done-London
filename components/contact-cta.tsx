"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AnimatedBackground from "@/components/AnimatedBackground"

gsap.registerPlugin(ScrollTrigger)

export default function ContactCTA() {
  const { i18n } = useTranslation()
  const lng = i18n.language || "ar"
  const isArabic = lng === "ar"

  const sectionRef = useRef<any>(null)
  const headingRef = useRef<any>(null)
  const cardsRef = useRef<any>(null)
  const buttonsRef = useRef<any>(null)

  const translations: any = {
    ar: {
      title: "ابدأ رحلتك التدريبية معنا",
      subtitle:
        "تواصل معنا اليوم للحصول على استشارة مجانية وتحديد البرنامج التدريبي المناسب لك أو لمؤسستك",
      cards: [
        {
          icon: Phone,
          title: "اتصل بنا",
          desc: "تحدث مع مستشارينا مباشرة",
          button: "+44 7999 958569",
        },
        {
          icon: Mail,
          title: "راسلنا",
          desc: "أرسل استفسارك عبر البريد",
          button: "info@lampr.ac",
        },
        {
          icon: MessageCircle,
          title: "واتساب",
          desc: "تواصل فوري عبر الواتساب",
          button: "+44 7999 958569",
        },
        {
          icon: MapPin,
          title: "زرنا",
          desc: "مكتبنا الرئيسي في لندن",
          button: "عرض العنوان",
          link: "/contact",
        },
      ],
      buttons: {
        viewCourses: "استعرض جميع الدورات",
        freeConsult: "احجز استشارة مجانية",
      },
    },
    en: {
      title: "Start Your Training Journey With Us",
      subtitle:
        "Contact us today for a free consultation and find the training program that fits you or your organization.",
      cards: [
        {
          icon: Phone,
          title: "Call Us",
          desc: "Speak directly with our consultants",
          button: "+44 7999 958569",
        },
        {
          icon: Mail,
          title: "Email Us",
          desc: "Send your inquiry via email",
          button: "info@lampr.ac",
        },
        {
          icon: MessageCircle,
          title: "WhatsApp",
          desc: "Instant communication via WhatsApp",
          button: "+44 7999 958569",
        },
        {
          icon: MapPin,
          title: "Visit Us",
          desc: "Our main office is located in London",
          button: "View Address",
          link: "/contact",
        },
      ],
      buttons: {
        viewCourses: "Browse All Courses",
        freeConsult: "Book a Free Consultation",
      },
    },
  }

  const t = translations[lng]

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
        duration: 0.9,
        ease: "power3.out",
      })

      // Contact cards stagger
      gsap.from(cardsRef.current?.children, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.7,
        ease: "back.out(1.3)",
      })

      // CTA buttons
      gsap.from(buttonsRef.current?.children, {
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-gradient-to-br from-royal-900 via-navy-800 to-crimson-900 text-white relative overflow-hidden ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <AnimatedBackground variant="particles" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t.title}</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.cards.map((card: any, index: any) => {
            const Icon = card.icon

            // === التعديل الوحيد المهم ===
            // أي زر يحتوي على رقم أو + أو إيميل نعرضه داخل span باتجاه LTR
            const isLtrContent =
              typeof card.button === "string" &&
              (card.button.trim().startsWith("+") ||
                card.button.includes("@") ||
                /\d/.test(card.button))

            const buttonLabel = isLtrContent ? (
              <span dir="ltr" className="inline-block">
                {card.button}
              </span>
            ) : (
              card.button
            )
            // ==============================

            return (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-royal-300" />
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{card.desc}</p>

                  {card.link ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Link href={card.link}>{buttonLabel}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      {buttonLabel}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div ref={buttonsRef} className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-royal-500 hover:bg-royal-600 text-white px-8 py-4 text-lg"
            >
              <Link href={isArabic ? "/ar/courses" : "/courses"}>
                {t.buttons.viewCourses}
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              <Link href={isArabic ? "/ar/contact" : "/contact"}>
                {t.buttons.freeConsult}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
