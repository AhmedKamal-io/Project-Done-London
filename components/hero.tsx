import { Button } from "@/components/ui/button"
import { Play, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-900 via-navy-800 to-royal-800 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-royal-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-crimson-400/20 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-royal-300">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-medium">الأكاديمية الرائدة في التدريب الإعلامي</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              أكاديمية لندن
              <span className="block text-royal-300">للإعلام والعلاقات العامة</span>
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
              نقدم دورات تدريبية احترافية متخصصة في الإعلام والعلاقات العامة والتسويق والذكاء الاصطناعي في 8 مدن عالمية
              مع خبراء دوليين معتمدين
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-royal-500 hover:bg-royal-600 text-white px-8 py-4 text-lg">
                <Link href="/courses" className="flex items-center gap-2">
                  استعرض الدورات
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                شاهد الفيديو التعريفي
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-royal-300">500+</div>
                <div className="text-sm text-gray-300">متدرب سنوياً</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-royal-300">8</div>
                <div className="text-sm text-gray-300">مدن عالمية</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-royal-300">15+</div>
                <div className="text-sm text-gray-300">سنة خبرة</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl h-[600px]">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="جلسة تدريبية في أكاديمية لندن"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-royal-400/30 to-crimson-400/30 rounded-2xl blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
