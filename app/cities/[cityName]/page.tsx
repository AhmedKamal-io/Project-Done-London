import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from "next"
import Loading from '@/components/loading'
import JsonLd from '@/components/JsonLd'
import { citiesData, generateLocalBusinessSchema } from '@/lib/cities-data'
import { getCityHeroImage } from '@/lib/city-images'
import Link from 'next/link'
import ContactCTA from '@/components/contact-cta'
import Image from 'next/image'

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
      title: 'City Not Found',
      description: 'The requested city page was not found'
    }
  }

  const heroImage = getCityHeroImage(cityName)

  return {
    title: `${city.name.en} | London Academy for Media & PR`,
    description: city.description.en,
    openGraph: {
      title: `${city.name.en} | London Academy for Media & PR`,
      description: city.description.en,
      locale: "en_GB",
      images: [{ url: heroImage, width: 1200, height: 600, alt: `Training courses in ${city.name.en}` }]
    },
    alternates: {
      canonical: `https://www.lampr.ac/cities/${cityName}`,
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
    
    // Filter courses by city (check translations.en.city)
    coursesData = allCourses.filter((course: any) => {
      const courseCity = course.translations?.en?.city?.toLowerCase() || ''
      return courseCity === city.name.en.toLowerCase()
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
  }

  const localBusinessSchema = generateLocalBusinessSchema(cityName, 'en')

  return (
    <>
      {localBusinessSchema && <JsonLd data={localBusinessSchema} />}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section with Image */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={`Training courses in ${city.name.en}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60"></div>
          </div>
          
          <div className="relative container mx-auto max-w-6xl px-4 h-full flex flex-col justify-center text-white">
            <nav className="mb-8 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/cities" className="hover:underline">Cities</Link>
              <span className="mx-2">/</span>
              <span>{city.name.en}</span>
            </nav>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Training Courses in {city.name.en}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl drop-shadow">
              {city.description.en}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-sm text-blue-100">Location</div>
                <div className="font-semibold">{city.country.en}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-sm text-blue-100">Timezone</div>
                <div className="font-semibold">{city.timezone}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">📞</div>
                <div className="text-sm text-blue-100">Contact</div>
                <div className="font-semibold" dir="ltr">{city.phone}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Courses Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              Available Courses in {city.name.en}
            </h2>
            
            {coursesData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.map((course: any) => (
                  <Link
                    key={course._id}
                    href={`/event/${course.slug?.en || course.enCourseName}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                      {course.translations?.en?.name || course.enCourseName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {course.translations?.en?.description || course.enCourseDesc}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>📍</span>
                      <span>{course.translations?.en?.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>💼</span>
                      <span className="line-clamp-1">{course.translations?.en?.section}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  No courses currently available in {city.name.en}
                </p>
                <Link
                  href="/courses"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
                >
                  Browse All Courses
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose This City */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              Why Train in {city.name.en}?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🌍 Global Hub
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {city.name.en} is recognized as a leading global center for business, culture, and innovation, 
                  providing an ideal environment for professional development.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🎓 Expert Trainers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn from industry experts and certified professionals with extensive experience 
                  in media, public relations, and corporate communication.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🏆 International Certification
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive internationally recognized certifications that enhance your professional 
                  credentials and career prospects worldwide.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  🤝 Networking Opportunities
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with professionals from diverse industries and build valuable relationships 
                  that can advance your career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
              Explore Other Cities
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {Object.keys(citiesData)
                .filter(key => key !== cityName)
                .map((key) => (
                  <Link
                    key={key}
                    href={`/cities/${key}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow text-center"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {citiesData[key].name.en}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {citiesData[key].country.en}
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
