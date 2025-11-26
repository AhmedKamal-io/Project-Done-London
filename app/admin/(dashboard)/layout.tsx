import type React from "react";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import "app/globals.css"; // لو حابب تورث نفس الـ styles العامة
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "@/components/client-wrapper";
import { LanguageProvider } from "../../provider/Language_provider";
import AdminSidebar from "@/components/AdminSidebar";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const language = cookieStore.get("language")?.value || "ar";
  const isArabic = language === "ar";

  return (
    <html lang={language} dir={isArabic ? "rtl" : "ltr"}>
      <body className={`${cairo.className} bg-gray-200`}>
        <LanguageProvider>
          <ClientWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen">
                {/* الشريط الجانبي */}
                <AdminSidebar />

                {/* منطقة المحتوى */}
                <div className="flex flex-col flex-1">
                  <main className="p-6">{children}</main>
                </div>
              </div>
            </ThemeProvider>
          </ClientWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
