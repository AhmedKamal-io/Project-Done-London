"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  instructorId: string;
}

export default function DeleteInstructorButton({
  instructorId,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // تأكيد الحذف
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذا المدرب؟ سيتم حذف بياناته وصورته من Cloudinary بشكل نهائي."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructors/${instructorId}`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        // بدلاً من إعادة تحميل الصفحة بالكامل، نستخدم router.refresh()
        // لتحميل بيانات الخادم الجديدة بكفاءة
        router.refresh();
      } else {
        const result = await response.json();
        alert(`فشل الحذف: ${result.message || "حدث خطأ غير معروف."}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-3 py-1 text-sm font-medium rounded-full transition duration-150 
                ${
                  isDeleting
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
