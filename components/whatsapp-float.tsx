"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "447999958569" // رقم الواتساب
    const message = "مرحباً، أود الاستفسار عن دورات أكاديمية لندن للإعلام والعلاقات العامة"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse hover:animate-none"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        تواصل معنا عبر الواتساب
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}
