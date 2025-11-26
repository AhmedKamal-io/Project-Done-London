import React from 'react'

interface HreflangProps {
  /** المسار الحالي بدون /ar/ prefix (مثل: /event/course-slug) */
  pathname: string
  /** اللغة الحالية */
  currentLang: 'ar' | 'en'
}

/**
 * مكون لإضافة hreflang tags لتحسين SEO متعدد اللغات
 * يخبر محركات البحث عن النسخ المختلفة للصفحة بلغات مختلفة
 */
export default function Hreflang({ pathname, currentLang }: HreflangProps) {
  const baseUrl = 'https://www.lampr.ac'
  
  // إزالة /ar/ من المسار إذا كان موجوداً
  const cleanPath = pathname.startsWith('/ar/') 
    ? pathname.replace('/ar/', '/') 
    : pathname.startsWith('/ar')
    ? '/'
    : pathname
  
  // بناء الروابط
  const enUrl = `${baseUrl}${cleanPath}`
  const arUrl = `${baseUrl}/ar${cleanPath === '/' ? '' : cleanPath}`
  
  return (
    <>
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  )
}
