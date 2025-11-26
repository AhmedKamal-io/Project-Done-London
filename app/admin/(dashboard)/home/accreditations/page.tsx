"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
// افترض أن هذه المكونات متاحة في مشروعك
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, Loader2, Award, X } from "lucide-react";

// واجهات TypeScript
interface ILogo {
  url: string;
  public_id: string;
}

interface IAccreditation {
  _id: string;
  name_ar: string;
  name_en: string;
  logo: ILogo | null;
  createdAt: string;
}

export default function AdminAccreditationsPage() {
  const [accreditations, setAccreditations] = useState<IAccreditation[]>([]);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- 1. جلب الاعتمادات (بدون تغيير) ---
  const fetchAccreditations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/uploads/accreditations");
      if (!res.ok) throw new Error("Failed to fetch accreditations");
      const data = await res.json();
      setAccreditations(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccreditations();
  }, []);

  // --- 2. رفع جهة اعتماد جديدة (بدون تغيير) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !logoFile) {
      return alert("الرجاء إدخال الاسم باللغتين واختيار شعار.");
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("name_ar", nameAr);
      formData.append("name_en", nameEn);
      formData.append("logo", logoFile);

      const res = await fetch("/api/uploads/accreditations", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // تصفير الحقول وتحديث القائمة
        setNameAr("");
        setNameEn("");
        setLogoFile(null);
        // إعادة تعيين حقل الملف يدويًا
        const fileInput = document.getElementById(
          "logo-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        fetchAccreditations();
      } else {
        const errorData = await res.json();
        alert(`فشل الرفع: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("فشل في الاتصال بالخادم أو الرفع.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 3. حذف جهة اعتماد (بدون تغيير) ---
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف جهة الاعتماد هذه وشعارها نهائياً؟"))
      return;

    try {
      const res = await fetch("/api/uploads/accreditations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setAccreditations((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("تعذر حذف جهة الاعتماد.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("فشل في الاتصال بالخادم أو الحذف.");
    }
  };

  // لإظهار معاينة للصورة المختارة
  const logoPreview = logoFile ? URL.createObjectURL(logoFile) : null;

  return (
    // 💡 خلفية داكنة أعمق
    <div className="bg-gray-900 min-h-screen text-gray-50 p-6 sm:p-8">
      <h1 className="text-3xl font-extrabold mb-8 border-b border-gray-700 pb-3 text-yellow-400">
        إدارة الاعتمادات (Accreditations)
      </h1>

      {/* --- نموذج إضافة اعتماد --- */}
      {/* 💡 كارد (Card) بتصميم داكن واضح */}
      <Card className="bg-gray-800 border-gray-700 shadow-2xl mb-10 transition-all duration-300 hover:shadow-yellow-500/10">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            إضافة جهة اعتماد جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/*  تصميم حقول الإدخال للوضع الداكن */}
              <Input
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="الاسم بالعربية (مثل: الهيئة الوطنية للتقويم...)"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
              />
              <Input
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Name in English (e.g., National Authority for...)"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>

            {/*  تحسين شكل منطقة رفع الشعار */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border border-dashed border-yellow-500/50 p-4 rounded-xl bg-gray-700/30">
              {/* حقل اختيار الشعار */}
              <label
                htmlFor="logo-upload"
                //  زر اختيار ملف بلون الإبراز
                className="flex-shrink-0 flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg cursor-pointer transition text-sm text-gray-900 font-bold shadow-md"
              >
                <Award className="w-4 h-4" />
                {logoFile ? "تغيير الشعار" : "اختيار شعار الاعتماد (صورة)"}
              </label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLogoFile(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
                required
              />

              {/* معاينة الشعار */}
              {logoPreview ? (
                <div className="relative flex items-center gap-3 p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-10 h-10 object-contain rounded bg-white p-1"
                  />
                  <span className="text-sm truncate max-w-[150px] text-gray-200">
                    {logoFile?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      // لتصفير حقل الملف فعليًا
                      const fileInput = document.getElementById(
                        "logo-upload"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-400">
                  لم يتم اختيار شعار بعد. (يجب أن يكون صورة)
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isUploading || !nameAr || !nameEn || !logoFile}
              // 💡 زر الإرسال باللون الأخضر الداكن
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-600 disabled:text-gray-400 transition"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري
                  الرفع...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 ml-2" /> إضافة الاعتماد
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- عرض الاعتمادات الموجودة --- */}
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        جهات الاعتماد المضافة ({accreditations.length})
      </h2>

      {/* تحسين مظهر مُحمل الجلب */}
      {loading && accreditations.length === 0 ? (
        <div className="text-center text-yellow-400 bg-gray-800/50 p-10 rounded-xl border border-gray-700 shadow-inner">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-yellow-400" />
          <span className="font-semibold">جاري تحميل الاعتمادات...</span>
        </div>
      ) : accreditations.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-800/50 p-10 border border-dashed border-gray-700 rounded-xl">
          <Award className="w-8 h-8 mx-auto mb-3 text-gray-600" />
          <p>لا توجد جهات اعتماد مضافة حتى الآن. ابدأ بإضافة جهة جديدة!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {accreditations.map((acc) => (
            //  تصميم كارد الاعتماد للوضع الداكن
            <Card
              key={acc._id}
              className="relative group bg-gray-800 border border-gray-700 shadow-xl flex flex-col items-center justify-center text-center p-5 transition-all duration-300 hover:shadow-yellow-500/20"
            >
              {/* زر الحذف */}
              <Button
                onClick={() => handleDelete(acc._id)}
                //  زر الحذف بلون أحمر واضح
                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                title="حذف جهة الاعتماد"
                size="icon"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              {/* الشعار */}
              <div className="w-20 h-20 mb-3 flex items-center justify-center border border-gray-600 rounded-lg p-2 bg-white shadow-inner">
                {acc.logo?.url ? (
                  <img
                    src={acc.logo.url}
                    alt={acc.name_en}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Award className="w-10 h-10 text-gray-400" />
                )}
              </div>

              {/* الأسماء */}
              <h3 className="font-bold text-lg text-white line-clamp-1">
                {acc.name_ar}
              </h3>
              <p className="text-sm text-gray-400 italic mb-2 line-clamp-1">
                {acc.name_en}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                تاريخ الإضافة: {new Date(acc.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
