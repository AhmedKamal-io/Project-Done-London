"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const convertUrlToEmbed = (url: string) => {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  let videoId = null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];
  if (!videoId) {
    const shortUrlMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortUrlMatch) videoId = shortUrlMatch[1];
  }
  if (!videoId) {
    if (url.includes("/embed/")) return url;
    return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  }
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

export default function HeroCarousel({
  heroCarouselImages,
  youtubeLink,
}: {
  heroCarouselImages: any[];
  youtubeLink: string;
}) {
  const { i18n } = useTranslation();
  const lng = i18n.language || "ar";
  const isArabic = lng === "ar";

  const [currentImage, setCurrentImage] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const textRef: any = useRef<HTMLDivElement>(null);
  const statsRef: any = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroCarouselImages.length]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(textRef.current?.querySelectorAll(".fade-up"), {
        y: 60,
        opacity: 0,
        stagger: 0.15,
      })
        .from(
          imageRef.current,
          {
            x: isArabic ? -80 : 80,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.8"
        )
        .from(statsRef.current?.querySelectorAll(".stat-item"), {
          y: 40,
          opacity: 0,
          stagger: 0.2,
        });
    }, heroRef);

    return () => ctx.revert();
  }, [isArabic]);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % heroCarouselImages.length);
  const prevImage = () =>
    setCurrentImage(
      (prev) =>
        (prev - 1 + heroCarouselImages.length) % heroCarouselImages.length
    );

  const content: any = {
    ar: {
      tagline: "الأكاديمية الرائدة في التدريب الإعلامي",
      title1: "أكاديمية لندن",
      title2: "للإعلام والعلاقات العامة",
      desc: "نقدم دورات تدريبية احترافية متخصصة في الإعلام والعلاقات العامة والتسويق والذكاء الاصطناعي في 8 مدن عالمية مع خبراء دوليين معتمدين.",
      btnCourses: "استعرض الدورات",
      btnVideo: "شاهد الفيديو التعريفي",
      stats: [
        { value: "500+", label: "متدرب سنوياً" },
        { value: "8", label: "مدن عالمية" },
        { value: "15+", label: "سنة خبرة" },
      ],
      videoTitle: "فيديو تعريفي - أكاديمية لندن",
    },
    en: {
      tagline: "The leading academy in media training",
      title1: "London Academy",
      title2: "for Media & Public Relations",
      desc: "We provide professional training courses in media, public relations, marketing, and AI across 8 global cities with certified international experts.",
      btnCourses: "Explore Courses",
      btnVideo: "Watch Intro Video",
      stats: [
        { value: "500+", label: "Trainees yearly" },
        { value: "8", label: "Global cities" },
        { value: "15+", label: "Years of experience" },
      ],
      videoTitle: "Intro Video - London Academy",
    },
  };

  const t = content[lng];

  return (
    <>
      <section
        ref={heroRef}
        dir={isArabic ? "rtl" : "ltr"}
        className="relative overflow-hidden bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 text-white"
      >
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-red-400/50 rounded-full blur-xl animate-float-slow"></div>
          <div className="absolute bottom-40 left-30 w-24 h-24 bg-blue-500/40 rounded-full blur-lg animate-float-medium"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div
            className={`grid lg:grid-cols-2 gap-12 items-center ${
              isArabic ? "" : "lg:flex-row-reverse"
            }`}
          >
            {/* Text section */}
            <div
              ref={textRef}
              className={`space-y-8 ${isArabic ? "text-right" : "text-left"}`}
            >
              <div className="flex items-center gap-2 text-royal-300 fade-up">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">{t.tagline}</span>
              </div>

              <h1 className="fade-up text-4xl lg:text-6xl font-bold leading-tight">
                {t.title1}
                <span className="block text-royal-300">{t.title2}</span>
              </h1>

              <p className="fade-up text-xl text-gray-200 leading-relaxed max-w-2xl">
                {t.desc}
              </p>

              <div
                className={`fade-up flex flex-col sm:flex-row gap-4 ${
                  isArabic ? "sm:flex-row-reverse" : ""
                }`}
              >
                <Button
                  size="lg"
                  className="bg-royal-500 hover:bg-royal-600 text-white px-8 py-4 text-lg"
                >
                  <Link href={isArabic ? '/ar/courses' : '/courses'} className="flex items-center gap-2">
                    {t.btnCourses}
                    {isArabic ? (
                      <ArrowLeft className="w-5 h-5" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                  onClick={() => setShowVideoModal(true)}
                >
                  <Play className={`w-5 h-5 ${isArabic ? "ml-2" : "mr-2"}`} />
                  {t.btnVideo}
                </Button>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="flex items-center gap-8 pt-8">
                {t.stats.map((stat: any, i: any) => (
                  <div key={i} className="stat-item text-center">
                    <div className="text-3xl font-bold text-royal-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Carousel */}
            <div ref={imageRef} className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative h-96 md:h-[500px]">
                  {heroCarouselImages.map((img, index) => (
                    <Image
                      key={img.id}
                      src={img.image || "/placeholder.svg"}
                      alt={img.alt[isArabic ? "ar" : "en"] || ""}
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentImage ? "opacity-100" : "opacity-0"
                      }`}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ))}

                  {/* Arrows */}
                  <button
                    onClick={isArabic ? nextImage : prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  >
                    {isArabic ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={isArabic ? prevImage : nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  >
                    {isArabic ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {heroCarouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImage ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              src={convertUrlToEmbed(youtubeLink)}
              title={t.videoTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
