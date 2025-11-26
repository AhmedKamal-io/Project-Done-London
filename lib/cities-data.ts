/**
 * بيانات المدن مع معلومات Local Business Schema
 * تستخدم لتحسين SEO المحلي في صفحات المدن
 */

export interface CityData {
  name: {
    ar: string;
    en: string;
  };
  country: {
    ar: string;
    en: string;
  };
  countryCode: string;
  address: {
    ar: string;
    en: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: {
    ar: string;
    en: string;
  };
  phone: string;
  email: string;
}

export const citiesData: Record<string, CityData> = {
  london: {
    name: { ar: "لندن", en: "London" },
    country: { ar: "المملكة المتحدة", en: "United Kingdom" },
    countryCode: "GB",
    address: {
      ar: "123 شارع أكسفورد، لندن",
      en: "123 Oxford Street, London"
    },
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    description: {
      ar: "مركزنا الرئيسي في قلب لندن، عاصمة الإعلام والأعمال العالمية",
      en: "Our main center in the heart of London, the global capital of media and business"
    },
    phone: "+44-7999-958569",
    email: "london@lampr.ac"
  },
  dubai: {
    name: { ar: "دبي", en: "Dubai" },
    country: { ar: "الإمارات العربية المتحدة", en: "United Arab Emirates" },
    countryCode: "AE",
    address: {
      ar: "شارع الشيخ زايد، دبي",
      en: "Sheikh Zayed Road, Dubai"
    },
    coordinates: { latitude: 25.2048, longitude: 55.2708 },
    description: {
      ar: "مركز دبي للتدريب في قلب المدينة العالمية للأعمال والابتكار",
      en: "Dubai training center in the heart of the global city of business and innovation"
    },
    phone: "+971-4-123-4567",
    email: "dubai@lampr.ac"
  },
  istanbul: {
    name: { ar: "إسطنبول", en: "Istanbul" },
    country: { ar: "تركيا", en: "Turkey" },
    countryCode: "TR",
    address: {
      ar: "تقسيم، إسطنبول",
      en: "Taksim, Istanbul"
    },
    coordinates: { latitude: 41.0082, longitude: 28.9784 },
    description: {
      ar: "مركز إسطنبول في ملتقى الحضارات بين الشرق والغرب",
      en: "Istanbul center at the crossroads of civilizations between East and West"
    },
    phone: "+90-212-123-4567",
    email: "istanbul@lampr.ac"
  },
  paris: {
    name: { ar: "باريس", en: "Paris" },
    country: { ar: "فرنسا", en: "France" },
    countryCode: "FR",
    address: {
      ar: "الشانزليزيه، باريس",
      en: "Champs-Élysées, Paris"
    },
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    description: {
      ar: "مركز باريس في عاصمة الثقافة والفنون الأوروبية",
      en: "Paris center in the capital of European culture and arts"
    },
    phone: "+33-1-1234-5678",
    email: "paris@lampr.ac"
  },
  rome: {
    name: { ar: "روما", en: "Rome" },
    country: { ar: "إيطاليا", en: "Italy" },
    countryCode: "IT",
    address: {
      ar: "وسط روما التاريخي",
      en: "Historic Center of Rome"
    },
    coordinates: { latitude: 41.9028, longitude: 12.4964 },
    description: {
      ar: "مركز روما في قلب التاريخ والحضارة الأوروبية",
      en: "Rome center in the heart of European history and civilization"
    },
    phone: "+39-06-1234-5678",
    email: "rome@lampr.ac"
  },
  barcelona: {
    name: { ar: "برشلونة", en: "Barcelona" },
    country: { ar: "إسبانيا", en: "Spain" },
    countryCode: "ES",
    address: {
      ar: "باسيو دي غراسيا، برشلونة",
      en: "Passeig de Gràcia, Barcelona"
    },
    coordinates: { latitude: 41.3851, longitude: 2.1734 },
    description: {
      ar: "مركز برشلونة في مدينة الابتكار والتصميم الأوروبية",
      en: "Barcelona center in the European city of innovation and design"
    },
    phone: "+34-93-123-4567",
    email: "barcelona@lampr.ac"
  },
  madrid: {
    name: { ar: "مدريد", en: "Madrid" },
    country: { ar: "إسبانيا", en: "Spain" },
    countryCode: "ES",
    address: {
      ar: "غران فيا، مدريد",
      en: "Gran Vía, Madrid"
    },
    coordinates: { latitude: 40.4168, longitude: -3.7038 },
    description: {
      ar: "مركز مدريد في قلب العاصمة الإسبانية النابضة بالحياة",
      en: "Madrid center in the heart of the vibrant Spanish capital"
    },
    phone: "+34-91-123-4567",
    email: "madrid@lampr.ac"
  },
  venice: {
    name: { ar: "البندقية", en: "Venice" },
    country: { ar: "إيطاليا", en: "Italy" },
    countryCode: "IT",
    address: {
      ar: "ساحة سان ماركو، البندقية",
      en: "Piazza San Marco, Venice"
    },
    coordinates: { latitude: 45.4408, longitude: 12.3155 },
    description: {
      ar: "مركز البندقية في المدينة الساحرة على الماء",
      en: "Venice center in the enchanting city on water"
    },
    phone: "+39-041-123-4567",
    email: "venice@lampr.ac"
  }
};

/**
 * إنشاء Local Business Schema لمدينة معينة
 */
export function generateLocalBusinessSchema(cityKey: string, language: 'ar' | 'en') {
  const city = citiesData[cityKey];
  if (!city) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.lampr.ac/cities#${cityKey}`,
    "name": language === 'ar' 
      ? `أكاديمية لندن للإعلام والعلاقات العامة - ${city.name.ar}`
      : `London Academy for Media & PR - ${city.name.en}`,
    "alternateName": language === 'ar'
      ? `London Academy - ${city.name.ar}`
      : `London Academy - ${city.name.en}`,
    "description": city.description[language],
    "url": `https://www.lampr.ac${language === 'ar' ? '/ar' : ''}/cities`,
    "telephone": city.phone,
    "email": city.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": city.address[language],
      "addressLocality": city.name[language],
      "addressCountry": city.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.coordinates.latitude,
      "longitude": city.coordinates.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "£££",
    "image": `https://www.lampr.ac/cities/${cityKey}.jpg`,
    "sameAs": [
      "https://www.facebook.com/londonacademy",
      "https://www.twitter.com/londonacademy",
      "https://www.linkedin.com/company/londonacademy"
    ]
  };
}

/**
 * إنشاء ItemList Schema لجميع المدن
 */
export function generateCitiesListSchema(language: 'ar' | 'en') {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": language === 'ar' ? "مدن أكاديمية لندن" : "London Academy Cities",
    "description": language === 'ar'
      ? "المدن العالمية التي تقدم فيها أكاديمية لندن دوراتها التدريبية"
      : "Global cities where London Academy offers its training courses",
    "numberOfItems": Object.keys(citiesData).length,
    "itemListElement": Object.keys(citiesData).map((cityKey, index) => {
      const city = citiesData[cityKey];
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "@id": `https://www.lampr.ac/cities#${cityKey}`,
          "name": city.name[language],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city.name[language],
            "addressCountry": city.country[language]
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": city.coordinates.latitude,
            "longitude": city.coordinates.longitude
          }
        }
      };
    })
  };
}
