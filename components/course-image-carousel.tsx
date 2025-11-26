"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface CourseImageCarouselProps {
  /** مصفوفة روابط الصور */
  images: string[];
  /** سرعة الحركة (بالثواني) - افتراضي 30 */
  speed?: number;
}

/**
 * مكون عرض الصور المتحركة بشكل مستمر من اليمين لليسار
 * يستخدم في صفحة الدورة أسفل العنوان مباشرة
 */
export default function CourseImageCarousel({
  images,
  speed = 30,
}: CourseImageCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;

    const scroller = scrollerRef.current;
    const scrollerContent = Array.from(scroller.children);

    // تكرار الصور لإنشاء حلقة لا نهائية
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 border-y border-gray-200 dark:border-gray-700">
      <div
        ref={scrollerRef}
        className="flex gap-6 animate-scroll"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-48 w-80 flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={image}
              alt={`Course image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 3} // تحميل أول 3 صور بأولوية
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
