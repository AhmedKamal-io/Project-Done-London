import React from 'react'

interface JsonLdProps {
  data: Record<string, any>
}

/**
 * مكون لإضافة البيانات المنظمة (Structured Data) بصيغة JSON-LD
 * يستخدم لتحسين SEO والحصول على Rich Snippets في نتائج البحث
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
