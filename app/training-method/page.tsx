import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/seo-utils'
import TrainingMethodPage from './components/Training'
import type { Metadata } from "next"
import Loading from '@/components/loading'
import { cookies } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const language = (cookieStore.get('language')?.value || cookieStore.get('i18next')?.value || 'ar') as 'ar' | 'en'

  const metadata = {
    ar: {
      title: "أسلوبنا التدريبي | أكاديمية لندن للإعلام والعلاقات العامة",
      description: "تعرف على منهجية التدريب المتميزة في أكاديمية لندن والتي تجمع بين النظرية والتطبيق العملي",
      keywords: "أسلوب تدريبي، منهجية التدريب، تدريب عملي، أكاديمية لندن، تدريب احترافي، ورش عمل",
    },
    en: {
      title: "Our Training Method | London Academy for Media & PR",
      description: "Discover the distinctive training methodology at London Academy that combines theory with practical application",
      keywords: "training method, training methodology, practical training, London Academy, professional training, workshops",
    }
  }

  const currentMeta = language === 'ar' ? metadata.ar : metadata.en
  const academyName = language === 'ar' 
    ? 'أكاديمية لندن للإعلام والعلاقات العامة' 
    : 'London Academy for Media & PR'

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    authors: [{ name: academyName }],
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      type: "website",
      locale: language === 'ar' ? "ar_SA" : "en_GB",
      siteName: academyName,
      images: [
        {
          url: "/placeholder.svg?height=630&width=1200&text=Training+Method",
          width: 1200,
          height: 630,
          alt: language === 'ar' ? 'أسلوبنا التدريبي' : 'Our Training Method',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentMeta.title,
      description: currentMeta.description,
      images: ["/placeholder.svg?height=630&width=1200&text=Training+Method"],
    },
    alternates: {
      canonical: "https://www.lampr.ac/training-method",
      languages: {
        "ar-SA": "https://www.lampr.ac/training-method",
        "en-GB": "https://www.lampr.ac/en/training-method",
      },
    },
    robots: "index, follow",
  }
}

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <TrainingMethodPage/>
      </div>
    </Suspense>
  )
}

export default page