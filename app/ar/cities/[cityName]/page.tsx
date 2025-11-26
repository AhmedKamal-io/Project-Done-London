import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from "next"
import Loading from '@/components/loading'
import JsonLd from '@/components/JsonLd'
import { citiesData, generateLocalBusinessSchema } from '@/lib/cities-data'
import { getCityHeroImage } from '@/lib/city-images'
import Link from 'next/link'
import ContactCTA from '@/components/contact-cta'

interface CityPageProps {
  params: {
    cityName: string
  }
}

export async function generateStaticParams() {
  return Object.keys(citiesData).map((cityKey) => ({
    cityName: cityKey,
  }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { cityName } = params
  const city = citiesData[cityName]
  
  if (!city) {
    return {
      title: 'المدينة غير موجودة',
      description: 'لم يتم العثور على صفحة المدينة المطلوبة'
    }
  }

  const heroImage = getCityHeroImage(cityName)

  return {
    title: `${city.name.ar} | أكاديمية لندن للإعلام والعلاقات العامة`,
    description: city.description.ar,
    openGraph: {
      title: `${city.name.ar} | أكاديمية لندن للإعلام والعلاقات العامة`,
      description: city.description.ar,
      locale: "ar_SA",
      images: [{ url: heroImage, width: 1200, height: 600, alt: `دورات تدريبية في ${city.name.ar}` }]
    },
    alternates: {
      canonical: `https://www.lampr.ac/ar/cities/${cityName}`,
      languages: {
        'en-GB': `https://www.lampr.ac/cities/${cityName}`,
        'ar-SA': `https://www.lampr.ac/ar/cities/${cityName}`,
      }
    }
  }
}

async function CityContent({ cityName }: { cityName: string }) {
  const city = citiesData[cityName]
  
  if (!city) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
  const heroImage = getCityHeroImage(cityName)
  
  // Fetch courses for this city
  let coursesData: any[] = []
  try {
    const coursesRes = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" })
    const response = await coursesRes.json()
    
    // Extract courses array from response
    const allCourses = response.data || response || []
    
    // Filter courses by city (check translations.ar.city)
    coursesData = allCourses.filter((course: any) => {
      const courseCity = course.translations?.ar?.city?.toLowerCase() || ''
      return courseCity === city.name.ar.toLowerCase()
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
  }

  const localBusinessSchema = generateLocalBusinessSchema(cityName, 'ar')

  return (
    <>
      {localBusinessSchema && <JsonLd data={localBusinessSchema} />}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
        {/* Hero Section with Image */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={`دورات تدريبية في ${city.name.ar}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60"></div>
          </div>
          
          <div className="relative container mx-auto max-w-6xl px-4 h-full flex flex-col justify-center text-white">
            <nav className="mb-8 text-sm">
              <Link href="/ar" className="hover:underline">الرئيسية</Link>
              <span className="mx-2">/</span>
              <Link href="/ar/cities" className="hover:underline">المدن</Link>
              <span className="mx-2">/</span>
              <span>{city.name.ar}</span>
            </nav>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              دورات تدريبية في {city.name.ar}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl drop-shadow">
              {city.description.ar}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-sm text-blue-100">الموقع</div>
                <div className="font-semibold">{city.country.ar}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-sm text-blue-100">التوقيت</div>
                <div className="font-semibold">{city.timezone}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">📞</div>
                <div className="text-sm text-blue-100">التواصل</div>
                <div className="font-semibold" dir="ltr">{city.phone}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Courses Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              الدورات المتاحة في {city.name.ar}
            </h2>
            
            {coursesData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.map((course: any) => (
                  <Link
                    key={course._id}
                    href={`/ar/event/${course.slug?.ar || course.arCourseName}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                      {course.translations?.ar?.name || course.arCourseName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {course.translations?.ar?.description || course.arCourseDesc}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>📍</span>
                      <span>{course.translations?.ar?.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>💼</span>
                      <span className="line-clamp-1">{course.translations?.ar?.section}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  لا توجد دورات متاحة حالياً في {city.name.ar}
                </p>
                <Link
                  href="/ar/courses"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
                >
                  تصفح جميع الدورات
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose This City */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              لماذا التدريب في {city.name.ar}؟
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🌍 مركز عالمي
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تُعد {city.name.ar} مركزاً عالمياً رائداً للأعمال والثقافة والابتكار، 
                  مما يوفر بيئة مثالية للتطوير المهني.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🎓 مدربون خبراء
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تعلم من خبراء الصناعة والمحترفين المعتمدين ذوي الخبرة الواسعة 
                  في الإعلام والعلاقات العامة والاتصال المؤسسي.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🏆 شهادة دولية
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  احصل على شهادات معترف بها دولياً تعزز مؤهلاتك المهنية 
                  وفرصك الوظيفية في جميع أنحاء العالم.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🤝 فرص التواصل
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تواصل مع محترفين من مختلف الصناعات وابنِ علاقات قيّمة 
                  يمكن أن تعزز مسيرتك المهنية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              استكشف مدن أخرى
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {Object.keys(citiesData)
                .filter(key => key !== cityName)
                .map((key) => (
                  <Link
                    key={key}
                    href={`/ar/cities/${key}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow text-center"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {citiesData[key].name.ar}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {citiesData[key].country.ar}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <ContactCTA />
      </div>
    </>
  )
}

export default function CityPage({ params }: CityPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <CityContent cityName={params.cityName} />
    </Suspense>
  )
}
