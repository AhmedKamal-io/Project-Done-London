"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// 🔄 الواجهة المُعدّلة (تم إضافة targetAudience)
interface ICourseDisplay {
  _id: string;
  translations: {
    ar: {
      name: string;
      section: string;
      city: string;
      price: string;
      duration: string;
      language: string;
      description: string;
      importance: string[];
      outcomes: string[];
      services: string[];
      objectives: string[];
      certificate: string;
      venue: string;
      includes: string[];
      modules: {
        title: string;
        duration: string;
        topics: string[];
      }[];
      // ⬅️ الإضافة الجديدة
      targetAudience: string[];
    };
    en: {
      name: string;
      section: string;
      city: string;
      // ⬅️ الإضافة الجديدة
      targetAudience: string[];
      // ... يمكنك حذف باقي الحقول أو إبقائها حسب الحاجة
    };
  };
  slug: {
    ar: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourseDisplay[]>([]); // استخدام الواجهة الجديدة
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      const data = await res.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        setError("لا توجد كورسات لعرضها");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الكورسات");
    } finally {
      setLoading(false);
    }
  };

  // Delete course by ID
  const deleteCourse = async (id: string) => {
    const confirmDelete = confirm("هل أنت متأكد من حذف هذا الكورس؟");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        alert("تم حذف الكورس بنجاح ✅");
        setCourses((prev) => prev.filter((course) => course._id !== id));
      } else {
        alert(data.message || "فشل في حذف الكورس ❌");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحذف ❌");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="mb-6 text-2xl font-bold">إدارة الكورسات</h1>
        <Link href="/admin/courses/new-course">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            إضافة كورس جديد
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">جارٍ التحميل...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد كورسات حاليًا</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full text-right bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">اسم الكورس</th>
                <th className="p-3 border-b">التصنيف</th>
                <th className="p-3 border-b">المدينة</th>
                <th className="p-3 border-b">التحكم</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course._id}
                  onClick={() =>
                    router.push(`/admin/courses/edit-course/${course._id}`)
                  }
                  className="transition-colors cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-3 border-b">{index + 1}</td>

                  {/* ✅ التعديل الصحيح: الوصول عبر translations.ar.name */}
                  <td className="p-3 font-semibold text-blue-600 border-b hover:underline">
                    {course.translations?.ar?.name || "بدون اسم"}
                  </td>

                  {/* ✅ التعديل الصحيح: الوصول عبر translations.ar.section */}
                  <td className="p-3 text-gray-600 border-b">
                    {course.translations?.ar?.section || "—"}
                  </td>

                  {/* ✅ التعديل الصحيح: الوصول عبر translations.ar.city */}
                  <td className="p-3 text-gray-600 border-b">
                    {course.translations?.ar?.city || "—"}
                  </td>

                  <td
                    className="p-3 border-b text-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course._id);
                      }}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
