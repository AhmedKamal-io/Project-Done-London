"use client"

import { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Target,
  Award,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  Star,
  Globe,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrainingMethodPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "ar") as "ar" | "en";
  const isArabic = lang === "ar";

  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [philosophyVisible, setPhilosophyVisible] = useState(false);
  const [methodsVisible, setMethodsVisible] = useState(false);
  const [phasesVisible, setPhasesVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);

  // Refs for intersection observer
  const philosophyRef = useRef<HTMLDivElement>(null);
  const methodsRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const translations = useMemo(
    () => ({
      ar: {
        title: "أسلوبنا التدريبي",
        subtitle:
          "منهجية تدريبية متطورة تجمع بين أحدث النظريات العلمية والتطبيق العملي المكثف لضمان تحقيق أقصى استفادة من التجربة التدريبية",
        philosophyTitle: "فلسفتنا التدريبية",
        philosophyDesc:
          "نؤمن بأن التدريب الفعال يجب أن يكون تجربة شاملة تجمع بين التعلم النظري والتطبيق العملي في بيئة محفزة تشجع على الإبداع والابتكار. نحن لا نقدم مجرد معلومات، بل نبني قدرات ومهارات حقيقية.",
        methodsTitle: "أساليب التدريب",
        phasesTitle: "مراحل التدريب",
        featuresTitle: "مميزات تدريبنا",
        resultsTitle: "نتائج مثبتة",
        satisfaction: "معدل رضا المتدربين",
        skill: "تطبيق المهارات في العمل",
        recommend: "يوصون بالدورة للآخرين",
        promotion: "حصلوا على ترقيات",
        activitiesLabel: "الأنشطة:",
      },
      en: {
        title: "Our Training Method",
        subtitle:
          "An advanced methodology combining the latest scientific theories with intensive practical application to ensure maximum training benefit.",
        philosophyTitle: "Our Training Philosophy",
        philosophyDesc:
          "We believe effective training should be a holistic experience combining theory and practice in a motivating environment that inspires creativity and innovation. We don't just deliver information — we build real capabilities and skills.",
        methodsTitle: "Training Methods",
        phasesTitle: "Training Phases",
        featuresTitle: "Our Training Advantages",
        resultsTitle: "Proven Results",
        satisfaction: "Trainee Satisfaction",
        skill: "Skill Application at Work",
        recommend: "Recommend Course to Others",
        promotion: "Received Promotions",
        activitiesLabel: "Activities:",
      },
    }),
    []
  );

  const t = translations[lang];

  const methods = useMemo(
    () => ({
      ar: [
        {
          icon: Users,
          title: "التعلم التفاعلي",
          description:
            "نعتمد على المشاركة الفعالة للمتدربين من خلال النقاشات الجماعية وورش العمل التطبيقية",
          features: ["مجموعات صغيرة", "نقاشات تفاعلية", "تبادل الخبرات"],
        },
        {
          icon: Target,
          title: "التطبيق العملي",
          description:
            "كل مفهوم نظري يتبعه تطبيق عملي فوري لضمان ترسيخ المعلومة وإمكانية تطبيقها",
          features: ["دراسات حالة حقيقية", "محاكاة المواقف", "مشاريع تطبيقية"],
        },
        {
          icon: BookOpen,
          title: "المحتوى المحدث",
          description:
            "نحرص على تحديث محتوى دوراتنا باستمرار لمواكبة أحدث التطورات في المجال",
          features: ["أحدث الاتجاهات", "أفضل الممارسات", "تقنيات حديثة"],
        },
        {
          icon: MessageSquare,
          title: "التغذية الراجعة",
          description:
            "نقدم تقييماً مستمراً وتغذية راجعة فورية لضمان تحقيق أقصى استفادة من التدريب",
          features: ["تقييم مستمر", "ملاحظات فورية", "خطط تطوير شخصية"],
        },
      ],
      en: [
        {
          icon: Users,
          title: "Interactive Learning",
          description:
            "We rely on active participation through group discussions and practical workshops.",
          features: ["Small groups", "Interactive discussions", "Experience exchange"],
        },
        {
          icon: Target,
          title: "Practical Application",
          description:
            "Each theoretical concept is followed by direct practical application for better retention.",
          features: ["Real case studies", "Scenario simulations", "Applied projects"],
        },
        {
          icon: BookOpen,
          title: "Updated Content",
          description:
            "We continuously update our course materials to reflect the latest industry trends.",
          features: ["Latest trends", "Best practices", "Modern techniques"],
        },
        {
          icon: MessageSquare,
          title: "Continuous Feedback",
          description:
            "We provide ongoing evaluation and instant feedback to ensure maximum learning benefit.",
          features: ["Continuous evaluation", "Instant feedback", "Personal development plans"],
        },
      ],
    }),
    []
  );

  const phases = useMemo(
    () => ({
      ar: [
        {
          phase: "المرحلة الأولى",
          title: "التقييم والتحليل",
          description: "نبدأ بتقييم مستوى المتدربين وتحديد احتياجاتهم التدريبية",
          duration: "يوم واحد",
          activities: ["اختبار تحديد المستوى", "تحليل الاحتياجات", "وضع الأهداف الشخصية"],
        },
        {
          phase: "المرحلة الثانية",
          title: "بناء الأسس النظرية",
          description: "تقديم المفاهيم الأساسية والنظريات المتخصصة في المجال",
          duration: "يومان",
          activities: ["محاضرات تفاعلية", "مواد تعليمية متقدمة", "نقاشات جماعية"],
        },
        {
          phase: "المرحلة الثالثة",
          title: "التطبيق العملي",
          description: "تطبيق المفاهيم النظرية من خلال تمارين وورش عمل متخصصة",
          duration: "يومان",
          activities: ["ورش عمل تطبيقية", "دراسات حالة", "مشاريع جماعية"],
        },
        {
          phase: "المرحلة الرابعة",
          title: "التقييم والمتابعة",
          description: "تقييم شامل للمهارات المكتسبة ووضع خطة للمتابعة",
          duration: "نصف يوم",
          activities: ["تقييم نهائي", "خطة عمل شخصية", "جلسة متابعة"],
        },
      ],
      en: [
        {
          phase: "Phase 1",
          title: "Assessment & Analysis",
          description: "We start by assessing trainee levels and identifying training needs.",
          duration: "1 day",
          activities: ["Level test", "Needs analysis", "Personal goal setting"],
        },
        {
          phase: "Phase 2",
          title: "Building Theoretical Foundations",
          description: "Delivering core concepts and specialized theories in the field.",
          duration: "2 days",
          activities: ["Interactive lectures", "Advanced materials", "Group discussions"],
        },
        {
          phase: "Phase 3",
          title: "Practical Application",
          description: "Applying theory through exercises and specialized workshops.",
          duration: "2 days",
          activities: ["Hands-on workshops", "Case studies", "Group projects"],
        },
        {
          phase: "Phase 4",
          title: "Evaluation & Follow-up",
          description: "Comprehensive skills evaluation and follow-up planning.",
          duration: "Half day",
          activities: ["Final evaluation", "Personal action plan", "Follow-up session"],
        },
      ],
    }),
    []
  );

  const features = useMemo(
    () => ({
      ar: [
        {
          icon: Star,
          title: "مدربون معتمدون",
          description: "جميع مدربينا حاصلون على شهادات دولية ولديهم خبرة عملية واسعة",
        },
        {
          icon: Globe,
          title: "بيئة عالمية",
          description: "التدريب في مدن عالمية يوفر تجربة ثقافية غنية ومنظور دولي",
        },
        {
          icon: Award,
          title: "شهادات معتمدة",
          description: "شهادات معتمدة دولياً تضيف قيمة حقيقية لسيرتك الذاتية",
        },
        {
          icon: Clock,
          title: "مرونة في التوقيت",
          description: "برامج مصممة لتناسب جداول المهنيين المشغولين",
        },
      ],
      en: [
        {
          icon: Star,
          title: "Certified Trainers",
          description:
            "All our trainers are internationally certified and highly experienced.",
        },
        {
          icon: Globe,
          title: "Global Environment",
          description:
            "Training in world-class cities offers cultural enrichment and a global perspective.",
        },
        {
          icon: Award,
          title: "Accredited Certificates",
          description:
            "Internationally recognized certificates that add real value to your CV.",
        },
        {
          icon: Clock,
          title: "Flexible Scheduling",
          description:
            "Programs designed to suit the schedules of busy professionals.",
        },
      ],
    }),
    []
  );

  const currentMethods = methods[lang];
  const currentPhases = phases[lang];
  const currentFeatures = features[lang];

  // Hero animation on mount
  useEffect(() => {
    setHeroVisible(true);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === philosophyRef.current) setPhilosophyVisible(true);
          if (entry.target === methodsRef.current) setMethodsVisible(true);
          if (entry.target === phasesRef.current) setPhasesVisible(true);
          if (entry.target === featuresRef.current) setFeaturesVisible(true);
          if (entry.target === resultsRef.current) setResultsVisible(true);
        }
      });
    }, observerOptions);

    if (philosophyRef.current) observer.observe(philosophyRef.current);
    if (methodsRef.current) observer.observe(methodsRef.current);
    if (phasesRef.current) observer.observe(phasesRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (resultsRef.current) observer.observe(resultsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100"
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInRotate {
          from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(${isArabic ? '50px' : '-50px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-hero-icon {
          animation: fadeInRotate 0.8s ease-out forwards;
        }
        .animate-hero-title {
          animation: fadeInUp 0.9s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-hero-subtitle {
          animation: fadeInUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-hero-image {
          animation: fadeInScale 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        .animate-section {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-card {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        .animate-slide {
          animation: fadeInSlide 0.8s ease-out forwards;
        }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-24 h-24 bg-royal-400/10 dark:bg-royal-700/20 rounded-full blur-xl animate-float-slow"></div>
          <div className="absolute bottom-20 left-10 w-18 h-18 bg-crimson-400/10 dark:bg-crimson-700/20 rounded-full blur-lg animate-float-medium"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={heroVisible ? "animate-hero-icon" : "opacity-0"}>
                <Lightbulb className="w-16 h-16 mb-6 text-royal-300 dark:text-yellow-400" />
              </div>
              <h1 className={heroVisible ? "animate-hero-title" : "opacity-0"} style={{fontSize: "clamp(2rem, 5vw, 3.75rem)"}}>{t.title}</h1>
              <p className={heroVisible ? "animate-hero-subtitle text-xl text-gray-200 dark:text-gray-300 leading-relaxed mt-6" : "opacity-0"}>
                {t.subtitle}
              </p>
            </div>
            <div className="relative">
              <Image
                className={heroVisible ? "animate-hero-image w-full h-80 object-cover rounded-2xl shadow-2xl" : "opacity-0"}
                src="/placeholder.svg"
                alt={t.title}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Philosophy */}
        <div ref={philosophyRef} className="text-center mb-16">
          <h2 className={philosophyVisible ? "animate-section text-3xl font-bold mb-6" : "opacity-0"}>{t.philosophyTitle}</h2>
          <p className={philosophyVisible ? "animate-section text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" : "opacity-0"} style={{animationDelay: "0.2s"}}>
            {t.philosophyDesc}
          </p>
        </div>

        {/* Methods */}
        <div ref={methodsRef}>
          <h2 className={methodsVisible ? "animate-section text-3xl font-bold text-center mb-12" : "opacity-0"}>{t.methodsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {currentMethods.map((m, i) => {
              const Icon = m.icon;
              return (
                <Card
                  key={i}
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg ${methodsVisible ? `animate-card stagger-${i + 1}` : 'opacity-0'}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-royal-100 dark:bg-royal-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-royal-500 dark:text-royal-300" />
                      </div>
                      <CardTitle className="text-xl">{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{m.description}</p>
                    <div className="space-y-2">
                      {m.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-royal-500 dark:text-royal-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">{f}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Phases */}
        <div ref={phasesRef}>
          <h2 className={phasesVisible ? "animate-section text-3xl font-bold text-center mb-12" : "opacity-0"}>{t.phasesTitle}</h2>
          <div className="space-y-8 mb-16">
            {currentPhases.map((p, i) => (
              <Card
                key={i}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg ${phasesVisible ? `animate-slide stagger-${i + 1}` : 'opacity-0'}`}
              >
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-royal-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        {i + 1}
                      </div>
                      <div className="text-royal-600 dark:text-royal-300 font-semibold text-sm">
                        {p.phase}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{p.description}</p>
                      <div className="flex items-center gap-2 text-sm text-royal-600 dark:text-royal-300">
                        <Clock className="w-4 h-4" />
                        <span>{p.duration}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">{t.activitiesLabel}</h4>
                      <ul className="space-y-1">
                        {p.activities.map((a, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <div className="w-1.5 h-1.5 bg-royal-400 dark:bg-royal-300 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div ref={featuresRef}>
          <h2 className={featuresVisible ? "animate-section text-3xl font-bold text-center mb-12" : "opacity-0"}>{t.featuresTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {currentFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card
                  key={i}
                  className={`text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg ${featuresVisible ? `animate-card stagger-${i + 1}` : 'opacity-0'}`}
                >
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-royal-500 dark:text-royal-300" />
                    <h3 className="font-bold text-lg mb-3">{f.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef}>
          <Card className={`bg-gradient-to-br from-royal-500 to-crimson-500 dark:from-royal-700 dark:to-crimson-600 text-white border-0 ${resultsVisible ? 'animate-section' : 'opacity-0'}`}>
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-8">{t.resultsTitle}</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="text-white/90">{t.satisfaction}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">88%</div>
                  <div className="text-white/90">{t.skill}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">92%</div>
                  <div className="text-white/90">{t.recommend}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-white/90">{t.promotion}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}