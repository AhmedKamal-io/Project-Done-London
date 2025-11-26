"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, MessageCircle, Clock, Globe } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReCaptcha } from "@/components/ReCaptchaProvider";
import { RECAPTCHA_CONFIG } from "@/lib/recaptcha-config";
import AnimatedBackground from "@/components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const heroTitleRef = useRef<any>(null);
  const heroDescRef = useRef<any>(null);
  const formTitleRef = useRef<any>(null);
  const formDescRef = useRef<any>(null);
  const formLabelsRef = useRef<any>(null);
  const contactInfoRef = useRef<any>(null);
  const officesTitleRef = useRef<any>(null);
  const officesGridRef = useRef<any>(null);
  const ctaTitleRef = useRef<any>(null);
  const ctaDescRef = useRef<any>(null);

  const t = {
    heroTitle: isArabic ? "اتصل بنا" : "Contact Us",
    heroDesc: isArabic
      ? "نحن هنا لمساعدتك في اختيار البرنامج التدريبي المناسب لك أو لمؤسستك. تواصل معنا اليوم واحصل على استشارة مجانية من خبرائنا."
      : "We're here to help you choose the right training program for you or your organization. Contact us today for a free consultation.",
    sendMessage: isArabic ? "أرسل لنا رسالة" : "Send Us a Message",
    fillForm: isArabic
      ? "املأ النموذج وسنتواصل معك خلال 24 ساعة"
      : "Fill out the form and we'll contact you within 24 hours",
    name: isArabic ? "الاسم *" : "Name *",
    email: isArabic ? "البريد الإلكتروني *" : "Email *",
    phone: isArabic ? "رقم الهاتف *" : "Phone *",
    message: isArabic ? "الرسالة *" : "Message *",
    messagePlaceholder: isArabic
      ? "أخبرنا عن احتياجاتك التدريبية..."
      : "Tell us about your training needs...",
    send: isArabic ? "إرسال الرسالة" : "Send Message",
    officesTitle: isArabic ? "مكاتبنا حول العالم" : "Our Offices Worldwide",
    ready: isArabic ? "جاهز للبدء؟" : "Ready to Get Started?",
    freeConsult: isArabic
      ? "احجز استشارة مجانية مع خبرائنا لتحديد البرنامج التدريبي المناسب لك"
      : "Book a free consultation with our experts to find the right program for you.",
    bookNow: isArabic ? "احجز استشارة مجانية" : "Book a Free Consultation",
    browseCourses: isArabic ? "تصفح الدورات" : "Browse Courses",
    workingHours: isArabic ? "ساعات العمل" : "Working Hours",
  };

  const contactInfo = [
    {
      icon: Phone,
      title: isArabic ? "اتصل بنا" : "Call Us",
      details: ["+44 7999 958569", "+971 4 123 4567"],
      description: isArabic
        ? "متاح 24/7 للرد على استفساراتكم"
        : "Available 24/7 for your inquiries",
    },
    {
      icon: Mail,
      title: isArabic ? "راسلنا" : "Email Us",
      details: ["info@lampr.ac", "training@lampr.ac"],
      description: isArabic
        ? "سنرد عليك خلال 24 ساعة"
        : "We'll reply within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: ["+44 7999 958569"],
      description: isArabic
        ? "تواصل فوري عبر الواتساب"
        : "Instant WhatsApp communication",
    },
    {
      icon: MapPin,
      title: isArabic ? "المكتب الرئيسي" : "Head Office",
      details: ["123 Oxford Street", "London, UK W1D 2HX"],
      description: isArabic
        ? "مكتبنا الرئيسي في قلب لندن"
        : "Our head office in central London",
    },
  ];

  const offices = [
    {
      city: isArabic ? "لندن" : "London",
      address: isArabic
        ? "123 شارع أكسفورد، لندن W1D 2HX"
        : "123 Oxford Street, London W1D 2HX",
      phone: "+44 7999 958569",
    },
    {
      city: isArabic ? "دبي" : "Dubai",
      address: isArabic
        ? "برج خليفة، الطابق 45، دبي"
        : "Burj Khalifa, 45th Floor, Dubai",
      phone: "+971 4 123 4567",
    },
    {
      city: isArabic ? "اسطنبول" : "Istanbul",
      address: isArabic ? "ليفنت، اسطنبول، تركيا" : "Levent, Istanbul, Turkey",
      phone: "+90 212 123 4567",
    },
    {
      city: isArabic ? "باريس" : "Paris",
      address: isArabic
        ? "الشانزليزيه، باريس، فرنسا"
        : "Champs-Élysées, Paris, France",
      phone: "+33 1 23 45 67 89",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroTitleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(heroDescRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
      });

      // Form title and description
      gsap.from(formTitleRef.current, {
        scrollTrigger: {
          trigger: formTitleRef.current,
          start: "top 80%",
        },
        x: isArabic ? 40 : -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(formDescRef.current, {
        scrollTrigger: {
          trigger: formDescRef.current,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
      });

      // Form labels
      if (formLabelsRef.current) {
        gsap.from(formLabelsRef.current.querySelectorAll("label"), {
          scrollTrigger: {
            trigger: formLabelsRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Contact info cards
      if (contactInfoRef.current) {
        gsap.from(contactInfoRef.current.querySelectorAll(".contact-title"), {
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 75%",
          },
          x: isArabic ? -30 : 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
        });

        gsap.from(contactInfoRef.current.querySelectorAll(".contact-detail"), {
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.1,
          delay: 0.2,
          duration: 0.6,
          ease: "power2.out",
        });

        gsap.from(contactInfoRef.current.querySelectorAll(".contact-desc"), {
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 75%",
          },
          opacity: 0,
          stagger: 0.15,
          delay: 0.4,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Offices section
      gsap.from(officesTitleRef.current, {
        scrollTrigger: {
          trigger: officesTitleRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      if (officesGridRef.current) {
        gsap.from(officesGridRef.current.querySelectorAll(".office-city"), {
          scrollTrigger: {
            trigger: officesGridRef.current,
            start: "top 75%",
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
        });

        gsap.from(officesGridRef.current.querySelectorAll(".office-address"), {
          scrollTrigger: {
            trigger: officesGridRef.current,
            start: "top 75%",
          },
          y: 20,
          opacity: 0,
          stagger: 0.15,
          delay: 0.2,
          duration: 0.7,
          ease: "power2.out",
        });

        gsap.from(officesGridRef.current.querySelectorAll(".office-phone"), {
          scrollTrigger: {
            trigger: officesGridRef.current,
            start: "top 75%",
          },
          opacity: 0,
          stagger: 0.15,
          delay: 0.3,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // CTA section
      gsap.from(ctaTitleRef.current, {
        scrollTrigger: {
          trigger: ctaTitleRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(ctaDescRef.current, {
        scrollTrigger: {
          trigger: ctaDescRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [isArabic]);

  // State للفورم
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // reCAPTCHA hook
  const { executeRecaptcha } = useReCaptcha(RECAPTCHA_CONFIG.siteKey, 'contact');

  // handler لتحديث القيم
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handler للإرسال
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 🔒 Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha();
      
      if (!recaptchaToken) {
        alert(isArabic ? "فشل التحقق من الأمان. يرجى المحاولة مرة أخرى." : "Security verification failed. Please try again.");
        return;
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      alert(isArabic ? "تم الإرسال بنجاح!" : "Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        isArabic
          ? "حدث خطأ، حاول مرة أخرى."
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-gray-100 ${
        isArabic ? "font-[Tajawal]" : ""
      }`}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-royal-900 via-navy-900 to-royal-800 text-white py-20 overflow-hidden">
        <AnimatedBackground variant="orbs" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1
            ref={heroTitleRef}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            {t.heroTitle}
          </h1>
          <p
            ref={heroDescRef}
            className="text-xl text-gray-300 leading-relaxed"
          >
            {t.heroDesc}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div
          className={`grid lg:grid-cols-2 gap-12 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit}>
              <Card className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle ref={formTitleRef} className="text-2xl text-white">
                    {t.sendMessage}
                  </CardTitle>
                  <p ref={formDescRef} className="text-gray-400">
                    {t.fillForm}
                  </p>
                </CardHeader>
                <CardContent>
                  <div ref={formLabelsRef} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t.name}
                      </label>
                      <Input
                        value={formData.name}
                        name="name"
                        onChange={handleChange}
                        required
                        className="bg-gray-800 text-white border-gray-700 focus:border-royal-500"
                        placeholder={
                          isArabic
                            ? "أدخل اسمك الكامل"
                            : "Enter your full name"
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t.email}
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 text-white border-gray-700 focus:border-royal-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t.phone}
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        className="bg-gray-800 text-white border-gray-700 focus:border-royal-500"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+966 50 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t.message}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={handleChange}
                        name="message"
                        required
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-royal-500 h-32"
                        placeholder={t.messagePlaceholder}
                      ></textarea>
                    </div>

                    <Button
                      className="w-full bg-royal-600 hover:bg-royal-700 text-white py-3"
                      type="submit"
                    >
                      {t.send}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Contact Info */}
          <div ref={contactInfoRef} className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-royal-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-royal-400" />
                      </div>
                      <div>
                        <h3 className="contact-title font-bold text-lg text-white mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, i) => (
                          <p
                            key={i}
                            className="contact-detail text-gray-300 font-medium"
                          >
                            {detail}
                          </p>
                        ))}
                        <p className="contact-desc text-gray-400 text-sm mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Working Hours */}
            <Card className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-royal-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-royal-400" />
                  </div>
                  <div>
                    <h3 className="contact-title font-bold text-lg text-white mb-2">
                      {t.workingHours}
                    </h3>
                    <div className="space-y-1 text-gray-300">
                      {isArabic ? (
                        <>
                          <p className="contact-detail">
                            الأحد - الخميس: 9:00 ص - 6:00 م
                          </p>
                          <p className="contact-detail">
                            الجمعة: 9:00 ص - 1:00 م
                          </p>
                          <p className="contact-detail">السبت: مغلق</p>
                        </>
                      ) : (
                        <>
                          <p className="contact-detail">
                            Sunday - Thursday: 9:00 AM - 6:00 PM
                          </p>
                          <p className="contact-detail">
                            Friday: 9:00 AM - 1:00 PM
                          </p>
                          <p className="contact-detail">Saturday: Closed</p>
                        </>
                      )}
                    </div>
                    <p className="contact-desc text-gray-400 text-sm mt-1">
                      {isArabic ? "توقيت لندن (GMT)" : "London Time (GMT)"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offices */}
        <div className="mt-16">
          <h2
            ref={officesTitleRef}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            {t.officesTitle}
          </h2>
          <div
            ref={officesGridRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {offices.map((office, index) => (
              <Card
                key={index}
                className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 shadow-lg text-center"
              >
                <CardContent className="p-6">
                  <Globe className="w-8 h-8 mx-auto mb-4 text-royal-400" />
                  <h3 className="office-city font-bold text-lg text-white mb-2">
                    {office.city}
                  </h3>
                  <p className="office-address text-gray-400 text-sm mb-3">
                    {office.address}
                  </p>
                  <p className="office-phone text-royal-400 font-medium">
                    {office.phone}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="relative mt-16 bg-gradient-to-br from-royal-600 to-crimson-600 text-white border-0 shadow-2xl overflow-hidden">
          <AnimatedBackground variant="gradient" />
          <CardContent className="p-12 text-center relative z-10">
            <h2 ref={ctaTitleRef} className="text-3xl font-bold mb-4">
              {t.ready}
            </h2>
            <p ref={ctaDescRef} className="text-xl text-white/90 mb-8">
              {t.freeConsult}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                {t.bookNow}
              </Button>
              <Button
                size="lg"
                className="bg-white text-royal-700 hover:bg-gray-200"
              >
                {t.browseCourses}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
