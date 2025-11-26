import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles & News | London Academy for Media & PR",
  description: "Latest articles and news about media, public relations, and professional training from London Academy",
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout forces English language for /articles route
  // It inherits from root layout but ensures consistent language
  return <>{children}</>;
}
