import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lampr.ac'

  // جلب الدورات من API
  let courses: any[] = []
  try {
    const coursesRes = await fetch(`${baseUrl}/api/courses`, { cache: 'no-store' })
    if (coursesRes.ok) {
      courses = await coursesRes.json()
    }
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error)
  }

  // جلب المقالات من API
  let articles: any[] = []
  try {
    const articlesRes = await fetch(`${baseUrl}/api/articles`, { cache: 'no-store' })
    if (articlesRes.ok) {
      const articlesData = await articlesRes.json()
      articles = Array.isArray(articlesData) ? articlesData : articlesData.data || []
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
  }

  // إنشاء روابط الدورات (نسختين: إنجليزية وعربية)
  const courseEntries: MetadataRoute.Sitemap = courses.flatMap((course) => {
    const slug = course.slug?.en || course._id || course.id;
    return [
      // النسخة الإنجليزية (الافتراضية)
      {
        url: `${baseUrl}/event/${slug}`,
        lastModified: new Date(course.updatedAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/event/${slug}`,
            en: `${baseUrl}/event/${slug}`,
          },
        },
      },
      // النسخة العربية
      {
        url: `${baseUrl}/ar/event/${slug}`,
        lastModified: new Date(course.updatedAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/event/${slug}`,
            en: `${baseUrl}/event/${slug}`,
          },
        },
      },
    ];
  })

  // إنشاء روابط المقالات
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article._id}`,
    lastModified: new Date(article.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // الصفحات الثابتة (نسختين: إنجليزية وعربية)
  return [
    // الصفحة الرئيسية - إنجليزي
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar`,
          en: baseUrl,
        },
      },
    },
    // الصفحة الرئيسية - عربي
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar`,
          en: baseUrl,
        },
      },
    },
    // الدورات - إنجليزي
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/courses`,
          en: `${baseUrl}/courses`,
        },
      },
    },
    // الدورات - عربي
    {
      url: `${baseUrl}/ar/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/courses`,
          en: `${baseUrl}/courses`,
        },
      },
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/training-method`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...courseEntries,
    ...articleEntries,
  ]
}
