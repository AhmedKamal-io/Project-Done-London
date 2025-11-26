import { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/seo-utils'
import type { Metadata } from "next"
import { cookies } from 'next/headers'
import CitiesPage from './components/Cities'
import Loading from '@/components/loading'
import JsonLd from '@/components/JsonLd'
import { generateCitiesListSchema } from '@/lib/cities-data'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const language = cookieStore.get('language')?.value || 'ar'
  
  const metadata = {
    ar: {
      title: "المدن | أكاديمية لندن للإعلام والعلاقات العامة",
      description: "اكتشف المدن العالمية الثمان التي تقدم فيها أكاديمية لندن دوراتها التدريبية المتميزة",
    },
    en: {
      title: "Cities | London Academy for Media & PR",
      description: "Discover the eight global cities where London Academy offers its distinguished training courses",
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

const page = () => {
  const cookieStore = cookies()
  const language = (cookieStore.get('language')?.value || 'ar') as 'ar' | 'en'
  
  const citiesListSchema = generateCitiesListSchema(language)
  
  return (
    <>
      <JsonLd data={citiesListSchema} />
      <Suspense fallback={<Loading />}>
        <div><CitiesPage/></div>
      </Suspense>
    </>
  )
}

export default page