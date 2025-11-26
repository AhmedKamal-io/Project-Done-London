import type React from "react";
import type { Metadata } from "next";

// هذا الـ layout خاص بالمسارات العربية (/ar/*)
// يرث من الـ RootLayout الرئيسي ويضيف metadata خاصة بالعربية

export async function generateMetadata(): Promise<Metadata> {
  const metadata = {
    title: "أكاديمية لندن للإعلام والعلاقات العامة | دورات تدريبية احترافية",
    description:
      "أكاديمية لندن للإعلام والعلاقات العامة تقدم دورات تدريبية متخصصة في التواصل المؤسسي، المراسم والاتكيت، الإدارة الإعلامية، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية",
    keywords:
      "دورات إعلام، علاقات عامة، تدريب احترافي، لندن، دبي، اسطنبول، باريس، روما، برشلونة، مدريد، البندقية",
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: "https://www.lampr.ac/ar",
      siteName: "أكاديمية لندن للإعلام والعلاقات العامة",
      title: "أكاديمية لندن للإعلام والعلاقات العامة | دورات تدريبية احترافية",
      description:
        "أكاديمية لندن للإعلام والعلاقات العامة تقدم دورات تدريبية متخصصة في التواصل المؤسسي، المراسم والاتكيت، الإدارة الإعلامية، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "أكاديمية لندن للإعلام والعلاقات العامة",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "أكاديمية لندن للإعلام والعلاقات العامة | دورات تدريبية احترافية",
      description:
        "أكاديمية لندن للإعلام والعلاقات العامة تقدم دورات تدريبية متخصصة في التواصل المؤسسي، المراسم والاتكيت، الإدارة الإعلامية، التسويق، الذكاء الاصطناعي والتصميم في 8 مدن عالمية",
      images: ["/logo.png"],
    },
    alternates: {
      canonical: "https://www.lampr.ac/ar",
      languages: {
        "ar-SA": "https://www.lampr.ac/ar",
        "en-GB": "https://www.lampr.ac",
        "x-default": "https://www.lampr.ac",
      },
    },
  };

  return metadata;
}

export default function ArLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // هذا الـ layout لا يحتاج إلى تعريف html/body
  // لأنه يرث من RootLayout الرئيسي
  return <>{children}</>;
}
