"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"; // إضافة مؤشر التحميل

// واجهة بيانات المقال المعدلة (لتحسين TypeScript)
interface IArticle {
  _id: string;
  arArticleTitle: string;
  arArticleDesc: string;
  categoryArticle: string;
  specialTag: boolean;
  blogImage: {
    url: string;
    public_id: string;
  } | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //  جلب المقالات من قاعدة البيانات
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  //  حذف مقال
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        // تحديث القائمة محلياً بعد الحذف الناجح
        setArticles((prev) => prev.filter((article) => article._id !== id));
      } else {
        alert("فشل في حذف المقال.");
      }
    } catch (error) {
      console.error("❌ Error deleting article:", error);
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  // الدالة المساعدة لاستخلاص رابط الصورة
  const getImageUrl = (blogImage: IArticle["blogImage"]) => {
    return blogImage?.url || "/default-placeholder.jpg"; // استخدام صورة احتياطية في حالة عدم وجود رابط
  };

  return (
    <div className="p-6 min-h-[calc(100vh-64px)] bg-gray-900 text-gray-100">
      {/*  عنوان الصفحة + زر الإضافة */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-100">إدارة المقالات</h1>

        <Link href="/admin/articles/new-article">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle size={18} />
            إضافة مقال جديد
          </Button>
        </Link>
      </div>

      {/* حالة التحميل */}
      {isLoading && (
        <div className="text-center p-10 col-span-full">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-400">جاري تحميل المقالات...</p>
        </div>
      )}

      {/* حالة عدم وجود مقالات بعد التحميل */}
      {!isLoading && articles.length === 0 && (
        <p className="text-center text-gray-400 col-span-full text-lg p-10 border border-gray-700 rounded-lg">
          لا توجد مقالات حالياً
        </p>
      )}

      {/*  شبكة عرض الكروت */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {articles.map((article) => (
          <div
            key={article._id}
            className="relative group bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/*  شارة المقال (مميز أو عادي) */}
            <div
              className={cn(
                "absolute z-10 top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full",
                article.specialTag
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-600 text-gray-200"
              )}
            >
              {article.specialTag ? "مميز" : "عادي"}
            </div>

            {/* صورة المقال */}
            <Link href={`/admin/articles/edit/${article._id}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  // ⚠️ التعديل هنا: استخدام الدالة المساعدة لاستخلاص الرابط
                  src={getImageUrl(article.blogImage)}
                  alt={article.arArticleTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Article Details*/}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-lg line-clamp-1 text-gray-100">
                {article.arArticleTitle}
              </h2>

              <p className="text-sm text-gray-400 line-clamp-2">
                {article.arArticleDesc}
              </p>

              {/* 🏷️ Category*/}
              <span className="inline-block bg-blue-800 text-blue-300 text-xs font-medium px-2 py-1 rounded-md w-fit">
                {article.categoryArticle}
              </span>

              {/* Control Buttons*/}
              <div className="flex justify-end mt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(article._id)}
                >
                  <Trash2 size={16} /> حذف
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
