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
        className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden transition-colors duration-500"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div ref={headingRef} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isArabic
                ? "لحظات من دوراتنا السابقة"
                : "Moments from Our Past Courses"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isArabic
                ? "شاهد صور من الدورات التدريبية التي أقمناها في مختلف المدن العالمية"
                : "See photos from our training programs held in major international cities"}
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {galleryItems.map((item, index) => (
              <Card
                key={item.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm cursor-pointer z-10 relative"
                onClick={() => openGallery(index)}
              >
                <div className="relative h-64 overflow-hidden">
                  {item.type === "video" ? (
                    <video
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-5xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white/90 hover:text-white transition z-50"
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
