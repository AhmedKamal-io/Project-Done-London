import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقالات والأخبار | أكاديمية لندن للإعلام والعلاقات العامة",
  description: "آخر المقالات والأخبار حول الإعلام والعلاقات العامة والتدريب الاحترافي من أكاديمية لندن",
};

export default function ArticlesLayoutAr({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout forces Arabic language for /ar/articles route
  // It inherits from root layout but ensures consistent language
  return <>{children}</>;
}
