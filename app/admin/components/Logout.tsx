"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // 1. استدعاء Route Handler لتسجيل الخروج لحذف الكوكي
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        // 2. توجيه المستخدم لصفحة تسجيل الدخول
        router.replace("/login");

        // 3. مهم: إجبار Next.js على تحديث حالة الـ Router لتشغيل Middleware
        router.refresh();
      } else {
        alert("حدث خطأ أثناء تسجيل الخروج. (Server Error)");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      style={{
        padding: "8px 15px",
        backgroundColor: "#dc3545",
        opacity: isLoggingOut ? 0.7 : 1,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: isLoggingOut ? "not-allowed" : "pointer",
        fontWeight: "bold",
        fontSize: "0.9em",
        transition: "background-color 0.3s",
      }}
    >
      {isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
