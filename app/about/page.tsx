import React, { Suspense } from 'react'
import AboutPage from './component/About'
import type { Metadata } from "next"
import { cookies } from 'next/headers'
import Loading from '@/components/loading'
import JsonLd from '@/components/JsonLd'
import { generatePageMetadata } from '@/lib/seo-utils'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const language = (cookieStore.get('language')?.value || 'en') as 'ar' | 'en'
  
  return generatePageMetadata('about', language);
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
      "name": language === "ar" ? "من نحن" : "About Us",
      "item": "https://www.lampr.ac/about"
    }]
  };

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <JsonLd data={breadcrumbSchema} />
        <AboutPage/>
      </div>
    </Suspense>
  )
}

export default page