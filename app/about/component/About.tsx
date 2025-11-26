"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Award, Globe, Target, Eye, Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === "ar"

  const heroTitleRef = useRef<any>(null)
  const heroTextRef = useRef<any>(null)
  const statsRef = useRef<any>(null)
  const storyTitleRef = useRef<any>(null)
  const storyTextRef = useRef<any>(null)
  const visionTitleRef = useRef<any>(null)
  const visionTextRef = useRef<any>(null)
  const missionTitleRef = useRef<any>(null)
  const missionTextRef = useRef<any>(null)
  const valuesTitleRef = useRef<any>(null)
  const valuesItemsRef = useRef<any>(null)
  const whyTitleRef = useRef<any>(null)
  const whyItemsRef = useRef<any>(null)

  const t = {
    ar: {
      heroTitle: "من نحن",
      heroText:
        "أكاديمية لندن للإعلام والعلاقات العامة هي مؤسسة تدريبية رائدة تأسست لتقديم برامج تدريبية متخصصة في مجالات الإعلام والعلاقات العامة والتسويق في أرقى المدن العالمية.",
      stats: [
        { icon: Users, number: "500+", label: "متدرب سنوياً" },
        { icon: Globe, number: "8", label: "مدن عالمية" },
        { icon: Award, number: "15+", label: "سنة خبرة" },
        { icon: Target, number: "200+", label: "شركة ومؤسسة" },
      ],
      storyTitle: "قصتنا",
      storyText: [
        "تأسست أكاديمية لندن للإعلام والعلاقات العامة عام 2009 برؤية واضحة: تقديم تدريب عالي الجودة في مجالات الإعلام والعلاقات العامة للمهنيين العرب في أرقى المدن العالمية.",
        "بدأنا رحلتنا في لندن، ثم توسعنا لنصل إلى 8 مدن عالمية، حيث قدمنا أكثر من 500 دورة تدريبية لأكثر من 7500 متدرب من مختلف أنحاء العالم العربي.",
        "اليوم، نفخر بكوننا الخيار الأول للمؤسسات والأفراد الساعين للتميز في مجالات الإعلام والعلاقات العامة والتسويق.",
      ],
      vision: {
        title: "رؤيتنا",
        text: "أن نكون الأكاديمية الرائدة عالمياً في تقديم برامج التدريب المتخصصة في الإعلام والعلاقات العامة، ونساهم في بناء جيل من المهنيين المتميزين القادرين على قيادة التغيير في مؤسساتهم ومجتمعاتهم.",
      },
      mission: {
        title: "رسالتنا",
        text: "نقدم برامج تدريبية متميزة ومبتكرة في مجالات الإعلام والعلاقات العامة والتسويق، من خلال خبراء دوليين معتمدين، في بيئة تعليمية محفزة تجمع بين النظرية والتطبيق العملي.",
      },
      valuesTitle: "قيمنا",
      values: [
        { icon: Award, title: "التميز", description: "نسعى لتقديم أعلى معايير الجودة في التدريب والتطوير المهني" },
        { icon: Users, title: "الشراكة", description: "نؤمن بأهمية بناء شراكات استراتيجية مع عملائنا لتحقيق النجاح المشترك" },
        { icon: Globe, title: "العالمية", description: "نقدم خدماتنا في 8 مدن عالمية لنكون قريبين من عملائنا في كل مكان" },
        { icon: Heart, title: "الالتزام", description: "نلتزم بتقديم تجربة تدريبية استثنائية تلبي احتياجات وتطلعات المتدربين" },
      ],
      whyTitle: "لماذا تختار أكاديمية لندن؟",
      whyItems: [
        { title: "خبراء دوليون", text: "مدربون معتمدون من أفضل الجامعات والمؤسسات العالمية" },
        { title: "مدن عالمية", text: "دورات في 8 مدن عالمية مختارة بعناية لتوفير تجربة استثنائية" },
        { title: "شهادات معتمدة", text: "شهادات معتمدة دولياً تعزز من مسيرتك المهنية" },
      ],
    },
    en: {
      heroTitle: "About Us",
      heroText:
        "The London Academy for Media and Public Relations is a leading training institution specializing in professional development programs in media, public relations, and marketing across major global cities.",
      stats: [
        { icon: Users, number: "500+", label: "Trainees per year" },
        { icon: Globe, number: "8", label: "Global cities" },
        { icon: Award, number: "15+", label: "Years of experience" },
        { icon: Target, number: "200+", label: "Partner institutions" },
      ],
      storyTitle: "Our Story",
      storyText: [
        "Founded in 2009 with a clear vision to deliver high-quality media and PR training for Arab professionals in world-class cities.",
        "We started in London and expanded to 8 international cities, offering over 500 courses to more than 7,500 professionals from across the Arab world.",
        "Today, we are proud to be the first choice for organizations and individuals seeking excellence in media, PR, and marketing.",
      ],
      vision: {
        title: "Our Vision",
        text: "To be the world's leading academy in specialized training in media and public relations, shaping professionals capable of driving change in their organizations and communities.",
      },
      mission: {
        title: "Our Mission",
        text: "We deliver exceptional and innovative training programs through certified international experts, combining theory and hands-on experience.",
      },
      valuesTitle: "Our Values",
      values: [
        { icon: Award, title: "Excellence", description: "We aim for the highest quality in training and professional development." },
        { icon: Users, title: "Partnership", description: "We believe in strategic partnerships to achieve shared success." },
        { icon: Globe, title: "Global Reach", description: "We serve clients in 8 global cities to stay close to every market." },
        { icon: Heart, title: "Commitment", description: "We are committed to providing an exceptional learning experience." },
      ],
      whyTitle: "Why Choose London Academy?",
      whyItems: [
        { title: "International Experts", text: "Certified trainers from top global institutions." },
        { title: "Global Cities", text: "Courses offered in 8 world-class cities for an exceptional experience." },
        { title: "Accredited Certificates", text: "Internationally recognized certificates to enhance your career." },
      ],
    },
  }

  const lang = isArabic ? t.ar : t.en

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroTitleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(heroTextRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
      })

      // Stats text animation (numbers and labels only)
      gsap.from(statsRef.current?.querySelectorAll(".stat-number"), {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
      })

      gsap.from(statsRef.current?.querySelectorAll(".stat-label"), {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      })

      // Story section
      gsap.from(storyTitleRef.current, {
        scrollTrigger: {
          trigger: storyTitleRef.current,
          start: "top 80%",
        },
        x: isArabic ? 50 : -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(storyTextRef.current?.children, {
        scrollTrigger: {
          trigger: storyTextRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      })

      // Vision title and text
      gsap.from(visionTitleRef.current, {
        scrollTrigger: {
          trigger: visionTitleRef.current,
          start: "top 80%",
        },
        x: isArabic ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(visionTextRef.current, {
        scrollTrigger: {
          trigger: visionTextRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      })

      // Mission title and text
      gsap.from(missionTitleRef.current, {
        scrollTrigger: {
          trigger: missionTitleRef.current,
          start: "top 80%",
        },
        x: isArabic ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(missionTextRef.current, {
        scrollTrigger: {
          trigger: missionTextRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      })

      // Values title
      gsap.from(valuesTitleRef.current, {
        scrollTrigger: {
          trigger: valuesTitleRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })

      // Values text content (titles and descriptions only)
      gsap.from(valuesItemsRef.current?.querySelectorAll(".value-title"), {
        scrollTrigger: {
          trigger: valuesItemsRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
      })

      gsap.from(valuesItemsRef.current?.querySelectorAll(".value-description"), {
        scrollTrigger: {
          trigger: valuesItemsRef.current,
          start: "top 75%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.2,
        duration: 0.7,
        ease: "power2.out",
      })

      // Why Choose Us section
      gsap.from(whyTitleRef.current, {
        scrollTrigger: {
          trigger: whyTitleRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })

      gsap.from(whyItemsRef.current?.querySelectorAll(".why-item"), {
        scrollTrigger: {
          trigger: whyItemsRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      })
    })

    return () => ctx.revert()
  }, [isArabic])

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500"
    >
      {/* Hero */}
      <section className="bg-gradient-to-br from-royal-900 via-navy-800 to-crimson-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center lg:text-start">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${isArabic ? "text-right" : "text-left"}`}>
            <div>
              <h1 ref={heroTitleRef} className="text-4xl lg:text-6xl font-bold mb-6">
                {lang.heroTitle}
              </h1>
              <p ref={heroTextRef} className="text-xl text-gray-200 leading-relaxed">
                {lang.heroText}
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg"
                  alt={lang.heroTitle}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-royal-400/30 to-crimson-400/30 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Stats */}
        <div ref={statsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {lang.stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card
                key={i}
                className="text-center bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg dark:shadow-none"
              >
                <CardContent className="p-6">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-royal-500" />
                  <div className="stat-number text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="stat-label text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 ref={storyTitleRef} className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {lang.storyTitle}
            </h2>
            <div ref={storyTextRef} className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              {lang.storyText.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Vision + Mission */}
          <div className="space-y-8">
            <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg dark:shadow-none">
              <CardHeader>
                <CardTitle
                  ref={visionTitleRef}
                  className="flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  <Eye className="w-6 h-6 text-royal-500" />
                  {lang.vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p ref={visionTextRef} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {lang.vision.text}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg dark:shadow-none">
              <CardHeader>
                <CardTitle
                  ref={missionTitleRef}
                  className="flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  <Target className="w-6 h-6 text-royal-500" />
                  {lang.mission.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p ref={missionTextRef} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {lang.mission.text}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 ref={valuesTitleRef} className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {lang.valuesTitle}
          </h2>
          <div ref={valuesItemsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lang.values.map((value, i) => {
              const Icon = value.icon
              return (
                <Card
                  key={i}
                  className="text-center bg-white/80 dark:bg-white/10 backdrop-blur-sm border-0 shadow-lg dark:shadow-none hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-royal-500" />
                    <h3 className="value-title font-bold text-lg text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="value-description text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <Card className="bg-gradient-to-br from-royal-500 to-crimson-500 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 ref={whyTitleRef} className="text-3xl font-bold mb-6">
              {lang.whyTitle}
            </h2>
            <div ref={whyItemsRef} className="grid md:grid-cols-3 gap-8 mt-8">
              {lang.whyItems.map((item, i) => (
                <div key={i} className="why-item">
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}