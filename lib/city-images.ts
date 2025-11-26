/**
 * City Hero Images Configuration
 * يمكن استبدال الصور بصور حقيقية لاحقاً
 */

export const cityHeroImages: Record<string, string> = {
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop",
  madrid: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop",
  amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=600&fit=crop",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=600&fit=crop",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&h=600&fit=crop",
}

export function getCityHeroImage(cityKey: string): string {
  return cityHeroImages[cityKey] || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop"
}
