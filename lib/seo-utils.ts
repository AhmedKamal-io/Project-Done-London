import { Metadata } from 'next';

interface PageMetadata {
  ar: {
    title: string;
    description: string;
    keywords?: string;
  };
  en: {
    title: string;
    description: string;
    keywords?: string;
  };
}

export function generatePageMetadata(
  page: string,
  lang: 'ar' | 'en'
): Metadata {
  const baseUrl = 'https://www.lampr.ac';
  const siteName = lang === 'ar' 
    ? 'أكاديمية لندن للإعلام والعلاقات العامة'
    : 'London Academy for Media & PR';

  const pages: Record<string, PageMetadata> = {
    home: {
      ar: {
        title: 'أكاديمية لندن للإعلام والعلاقات العامة | دورات تدريبية احترافية',
        description: 'أكاديمية لندن للإعلام والعلاقات العامة تقدم دورات تدريبية متخصصة في التواصل المؤسسي، المراسم والاتكيت، الإدارة الإعلامية، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية',
        keywords: 'دورات إعلام، علاقات عامة، تدريب احترافي، لندن، دبي، اسطنبول'
      },
      en: {
        title: 'London Academy for Media & PR | Professional Training Courses',
        description: 'London Academy for Media and Public Relations offers specialized training courses in corporate communication, protocol, media management, marketing, AI and design in 8 global cities',
        keywords: 'media courses, public relations, professional training, London, Dubai, Istanbul'
      }
    },
    about: {
      ar: {
        title: 'من نحن | أكاديمية لندن للإعلام والعلاقات العامة',
        description: 'تعرف على أكاديمية لندن للإعلام والعلاقات العامة، رؤيتنا، رسالتنا، وفريق العمل المتخصص في تقديم أفضل الدورات التدريبية الاحترافية',
        keywords: 'عن الأكاديمية، رؤية ورسالة، فريق العمل، تدريب احترافي'
      },
      en: {
        title: 'About Us | London Academy for Media & PR',
        description: 'Learn about London Academy for Media & PR, our vision, mission, and specialized team dedicated to providing the best professional training courses',
        keywords: 'about academy, vision mission, team, professional training'
      }
    },
    courses: {
      ar: {
        title: 'الدورات التدريبية | أكاديمية لندن',
        description: 'استعرض جميع الدورات التدريبية المتخصصة في الإعلام، العلاقات العامة، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية',
        keywords: 'دورات تدريبية، إعلام، علاقات عامة، تسويق، ذكاء اصطناعي'
      },
      en: {
        title: 'Training Courses | London Academy',
        description: 'Browse all specialized training courses in media, public relations, marketing, AI and design across 8 global cities',
        keywords: 'training courses, media, public relations, marketing, artificial intelligence'
      }
    },
    cities: {
      ar: {
        title: 'المدن | أكاديمية لندن',
        description: 'نقدم دوراتنا التدريبية في 8 مدن عالمية: لندن، دبي، اسطنبول، باريس، روما، برشلونة، مدريد، والبندقية',
        keywords: 'مدن التدريب، لندن، دبي، اسطنبول، باريس، روما'
      },
      en: {
        title: 'Cities | London Academy',
        description: 'We offer our training courses in 8 global cities: London, Dubai, Istanbul, Paris, Rome, Barcelona, Madrid, and Venice',
        keywords: 'training cities, London, Dubai, Istanbul, Paris, Rome'
      }
    },
    contact: {
      ar: {
        title: 'اتصل بنا | أكاديمية لندن',
        description: 'تواصل معنا للاستفسار عن الدورات التدريبية، التسجيل، أو أي معلومات إضافية. نحن هنا لمساعدتك',
        keywords: 'اتصل بنا، تواصل، استفسارات، تسجيل'
      },
      en: {
        title: 'Contact Us | London Academy',
        description: 'Contact us for inquiries about training courses, registration, or any additional information. We are here to help you',
        keywords: 'contact us, inquiries, registration, support'
      }
    },
    'training-method': {
      ar: {
        title: 'أسلوبنا التدريبي | أكاديمية لندن',
        description: 'تعرف على منهجيتنا التدريبية المتميزة والأساليب الحديثة التي نستخدمها لضمان أفضل تجربة تعليمية',
        keywords: 'أسلوب تدريبي، منهجية، تعليم حديث، تدريب احترافي'
      },
      en: {
        title: 'Training Method | London Academy',
        description: 'Learn about our distinctive training methodology and modern approaches we use to ensure the best learning experience',
        keywords: 'training method, methodology, modern education, professional training'
      }
    },
    articles: {
      ar: {
        title: 'المقالات | أكاديمية لندن',
        description: 'اقرأ أحدث المقالات والمدونات المتخصصة في الإعلام، العلاقات العامة، التسويق والذكاء الاصطناعي',
        keywords: 'مقالات، مدونة، إعلام، علاقات عامة، تسويق'
      },
      en: {
        title: 'Articles | London Academy',
        description: 'Read the latest articles and blogs specialized in media, public relations, marketing and artificial intelligence',
        keywords: 'articles, blog, media, public relations, marketing'
      }
    }
  };

  const metadata = pages[page] || pages.home;
  const current = metadata[lang];
  const prefix = lang === 'ar' ? '/ar' : '';
  const pagePath = page === 'home' ? '' : `/${page}`;

  return {
    title: current.title,
    description: current.description,
    keywords: current.keywords,
    openGraph: {
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_GB',
      url: `${baseUrl}${prefix}${pagePath}`,
      siteName: siteName,
      title: current.title,
      description: current.description,
      images: [{
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: siteName
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: current.title,
      description: current.description,
      images: [`${baseUrl}/logo.png`]
    },
    alternates: {
      canonical: `${baseUrl}${prefix}${pagePath}`,
      languages: {
        'ar-SA': `${baseUrl}/ar${pagePath}`,
        'en-GB': `${baseUrl}${pagePath}`
      }
    }
  };
}
