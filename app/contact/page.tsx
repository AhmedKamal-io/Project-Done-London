import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/seo-utils'
import type { Metadata } from "next"
import { cookies } from 'next/headers'
import ContactPage from './component/Contact'
import Loading from '@/components/loading'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'ar'
  
  const metadata = {
    ar: {
      title: "اتصل بنا | أكاديمية لندن للإعلام والعلاقات العامة",
      description: "تواصل مع أكاديمية لندن للإعلام والعلاقات العامة للاستفسار عن الدورات التدريبية والحصول على استشارة مجانية",
    },
    en: {
      title: "Contact Us | London Academy for Media & PR",
      description: "Contact London Academy for Media and Public Relations to inquire about training courses and get a free consultation",
    }
  }

  const currentMeta = language === 'ar' ? metadata.ar : metadata.en

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      locale: language === 'ar' ? "ar_SA" : "en_GB",
    },
  }
}

const page = async () => {
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'ar'

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": language === "ar" ? "الرئيسية" : "Home",
      "item": "https://www.lampr.ac"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": language === "ar" ? "اتصل بنا" : "Contact Us",
      "item": "https://www.lampr.ac/contact"
    }]
  };

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <JsonLd data={breadcrumbSchema} />
        <ContactPage/>
      </div>
    </Suspense>
  )
}

export default page