"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface IMediaItem {
  url: string;
  type: "image" | "video" | "raw";
}

export interface IGalleryMoment {
  id: string;
  title: string;
  description: string;
  media: IMediaItem[];
}

interface Props {
  moments: IGalleryMoment[];
  language?: "ar" | "en";
}

export default function CourseGallery({ moments, language = "ar" }: Props) {
  const isArabic = language === "ar";
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const sectionRef = useRef<any>(null);
  const headingRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const safeMoments = Array.isArray(moments) ? moments : [];

  const galleryItems = safeMoments
    .map((moment) =>
      Array.isArray(moment.media)
        ? moment.media.map((mediaItem) => ({
            image: mediaItem.url,
            alt: moment.title,
            id: mediaItem.url,
            type: mediaItem.type,
            momentTitle: moment.title,
            momentDescription: moment.description,
          }))
        : []
    )
    .flat();

  const openGallery = (index: number) => setSelectedImage(index);
  const closeGallery = () => setSelectedImage(null);
  const nextImage = () =>
    selectedImage !== null &&
    setSelectedImage((selectedImage + 1) % galleryItems.length);
  const prevImage = () =>
    selectedImage !== null &&
    setSelectedImage(
      selectedImage === 0 ? galleryItems.length - 1 : selectedImage - 1
    );

  const handleKeyDown = (e: any) => {
    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children, {
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
      });

      if (gridRef.current) {
        gsap.set(gridRef.current.children, { opacity: 1, y: 0, scale: 1 });
      }

      gsap.from(gridRef.current?.children, {
        scrollTrigger: { trigger: gridRef.current, start: "top 70%" },
        y: 80,
        opacity: 0,
        scale: 0.9,
        stagger: { amount: 0.6, from: "start" },
        duration: 0.8,
        ease: "back.out(1.2)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [moments]);

  if (galleryItems.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        dir={isArabic ? "rtl" : "ltr"}
        className="relative py-20 overflow-hidden transition-colors duration-500 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"
      >
        <div className="container relative z-10 px-4 mx-auto">
          <div ref={headingRef} className="mb-16 text-center">
            <h2 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              {isArabic
                ? "لحظات من دوراتنا السابقة"
                : "Moments from Our Past Courses"}
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              {isArabic
                ? "شاهد صور من الدورات التدريبية التي أقمناها في مختلف المدن العالمية"
                : "See photos from our training programs held in major international cities"}
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {galleryItems.map((item, index) => (
              <Card
                key={item.id}
                className="relative z-10 transition-all duration-500 border-0 cursor-pointer group hover:shadow-2xl bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm"
                onClick={() => openGallery(index)}
              >
                <div className="relative h-64 overflow-hidden">
                  {item.type === "video" ? (
                    <video
                      src={item.image}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedImage !== null && galleryItems.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 bg-black/90 backdrop-blur-sm"
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute z-50 transition top-4 right-4 text-white/90 hover:text-white"
              onClick={closeGallery}
            >
              <X className="w-8 h-8" />
            </button>

            {galleryItems[selectedImage].type === "video" ? (
              <video
                src={galleryItems[selectedImage].image}
                className="rounded-lg shadow-2xl max-h-[80vh] w-full mx-auto object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={galleryItems[selectedImage].image}
                alt={galleryItems[selectedImage].alt}
                className="rounded-lg shadow-2xl max-h-[80vh] w-full mx-auto object-contain"
              />
            )}

            <button
              className={`absolute ${
                isArabic ? "right-4" : "left-4"
              } top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition z-50`}
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              className={`absolute ${
                isArabic ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition z-50`}
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
