export const languages = ["ar", "en"] as const
export type Language = (typeof languages)[number]

export const defaultLanguage: Language = "ar"

export const languageNames: Record<Language, string> = {
  ar: "العربية",
  en: "English",
}