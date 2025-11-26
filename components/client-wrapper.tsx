"use client"

import { useEffect } from 'react'
import { getCookie } from 'cookies-next'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lang = getCookie('language') as 'ar' | 'en' || 'ar'
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  return <>{children}</>
}