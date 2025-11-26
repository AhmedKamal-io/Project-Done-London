import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ar: {
    translation: {
      // Add your Arabic translations here
    }
  },
  en: {
    translation: {
      // Add your English translations here
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language (changed from 'ar' to 'en' to fix Articles page)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n