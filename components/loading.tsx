"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function Loading() {
  const { i18n } = useTranslation()
  const [progress, setProgress] = useState(0)
  const isArabic = i18n.language === "ar"

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const loadingText = isArabic ? "جارٍ التحميل..." : "Loading..."
  const pleaseWait = isArabic ? "يرجى الانتظار" : "Please wait"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-royal-200/10 to-royal-300/5 dark:from-royal-600/10 dark:to-royal-700/5 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-crimson-200/10 to-crimson-300/5 dark:from-crimson-600/10 dark:to-crimson-700/5 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-royal-300/8 to-royal-400/3 dark:from-royal-700/8 dark:to-royal-800/3 rounded-full blur-lg animate-float-fast"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-crimson-300/8 to-crimson-400/3 dark:from-crimson-700/8 dark:to-crimson-800/3 rounded-full blur-xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo with Pulse Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-royal-500 to-crimson-600 dark:from-royal-600 dark:to-crimson-700 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-white font-bold text-4xl">LA</span>
            </div>
            {/* Rotating Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-royal-500 dark:border-t-royal-400 rounded-2xl animate-spin"></div>
          </div>
        </div>

        {/* Academy Name */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isArabic ? "أكاديمية لندن" : "London Academy"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          {isArabic ? "للإعلام والعلاقات العامة" : "For Media and Public Relations"}
        </p>

        {/* Loading Text */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{loadingText}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{pleaseWait}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-royal-500 to-crimson-500 dark:from-royal-600 dark:to-crimson-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{Math.round(progress)}%</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-royal-500 dark:bg-royal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-royal-500 dark:bg-royal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-royal-500 dark:bg-royal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}