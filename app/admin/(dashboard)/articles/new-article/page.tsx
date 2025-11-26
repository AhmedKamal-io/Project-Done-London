"use client";
import { useState, ChangeEvent } from "react";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// =======================================================
// ✏️ واجهة بيانات النموذج
// =======================================================
interface ArticleForm {
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  arBlog: string;
  enBlog: string;
  // الحقول الجديدة المطلوبة
  arAuthor: string;
  enAuthor: string;
  arKeywords: string; // سيتم إرسالها كسلسلة مفصولة بفواصل
  enKeywords: string; // سيتم إرسالها كسلسلة مفصولة بفواصل
  categoryArticle: string;
  specialTag: boolean;
}

export default function AddArticlePage() {
  const router = useRouter(); // ** تحديث حالة النموذج لتشمل الحقول الجديدة
  const [form, setForm] = useState<ArticleForm>({
    arArticleTitle: "",
    enArticleTitle: "",
    arArticleDesc: "",
    enArticleDesc: "",
    arBlog: "",
    enBlog: "",
    arAuthor: "", // 🆕 المؤلف بالعربي
    enAuthor: "", // 🆕 المؤلف بالإنجليزي
    arKeywords: "", // 🆕 الكلمات المفتاحية بالعربي
    enKeywords: "", // 🆕 الكلمات المفتاحية بالإنجليزي
    categoryArticle: "",
    specialTag: false,
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const categories = [
    "التواصل المؤسسي",
    "الذكاء الاصطناعي",
    "المراسم والإتيكيت",
    "التسويق الرقمي",
    "إدارة الأزمات",
    "الإعلام",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, type, value } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }; // ======================================================= // ✅ دالة الإرسال (بدون تغيير، لأنها تستخدم FormData بشكل عام) // =======================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // إضافة تحقق بسيط للكلمات المفتاحية

    if (!file) {
      alert("❌ يجب اختيار صورة رئيسية للمقال.");
      setLoading(false);
      return;
    } // 1. إنشاء FormData وتعبئته

    const formDataPayload = new FormData(); // إضافة جميع الحقول النصية والمنطقية (بما في ذلك الحقول الجديدة)

    Object.keys(form).forEach((key) => {
      const value = form[key as keyof typeof form];
      formDataPayload.append(
        key,
        typeof value === "boolean" ? value.toString() : value
      );
    }); // إضافة ملف الصورة

    formDataPayload.append("blogImage", file);

    try {
      // 2. الإرسال إلى Next.js API
      const res = await fetch("/api/articles", {
        method: "POST",
        body: formDataPayload,
      });

      if (res.ok) {
        alert("✅ تم إضافة المقال بنجاح");
        router.push("/admin/articles");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل في إضافة المقال");
      }
    } catch (error) {
      console.error("Error adding article:", error);
      alert(
        `❌ حدث خطأ أثناء إضافة المقال: ${
          error instanceof Error ? error.message : "خطأ غير معروف"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-[0_0_25px_-5px_rgba(0,0,0,0.6)] border border-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
        إضافة مقال جديد
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2"
      >
        {/* العناوين والأوصاف */}
        <div className="space-y-6 bg-gray-800/70 p-6 rounded-xl border border-gray-700 sm:col-span-2 shadow-inner">
          <h2 className="section-title">العناوين والأوصاف</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelStyle}>العنوان الرئيسي (عربي)</label>
              <input
                type="text"
                name="arArticleTitle"
                value={form.arArticleTitle}
                onChange={handleChange}
                required
                className={inputStyle}
                placeholder="مثال: تطور الإعلام الحديث"
              />
            </div>

            <div>
              <label className={labelStyle}>Title (English)</label>
              <input
                type="text"
                name="enArticleTitle"
                value={form.enArticleTitle}
                onChange={handleChange}
                required
                className={inputStyle}
                placeholder="Modern Media Evolution"
              />
            </div>

            <div>
              <label className={labelStyle}>الوصف المختصر (عربي)</label>
              <input
                type="text"
                name="arArticleDesc"
                value={form.arArticleDesc}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Description (English)</label>
              <input
                type="text"
                name="enArticleDesc"
                value={form.enArticleDesc}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* المحتوى الكامل */}
        <div className="space-y-6 bg-gray-800/70 p-6 rounded-xl border border-gray-700 sm:col-span-2 shadow-inner">
          <h2 className="section-title">المحتوى الكامل</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelStyle}>المحتوى الكامل (عربي)</label>
              <textarea
                name="arBlog"
                value={form.arBlog}
                onChange={handleChange}
                required
                rows={8}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Full Content (English)</label>
              <textarea
                name="enBlog"
                value={form.enBlog}
                onChange={handleChange}
                required
                rows={8}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* البيانات الوصفية */}
        <div className="space-y-6 bg-gray-800/70 p-6 rounded-xl border border-gray-700 sm:col-span-2 shadow-inner">
          <h2 className="section-title">البيانات الوصفية (Metadata)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelStyle}>اسم المؤلف (عربي)</label>
              <input
                type="text"
                name="arAuthor"
                value={form.arAuthor}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Author Name (English)</label>
              <input
                type="text"
                name="enAuthor"
                value={form.enAuthor}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelStyle}>الكلمات المفتاحية (عربي)</label>
              <input
                type="text"
                name="arKeywords"
                value={form.arKeywords}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelStyle}>Keywords (English)</label>
              <input
                type="text"
                name="enKeywords"
                value={form.enKeywords}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>فئة المقال</label>
              <select
                name="categoryArticle"
                value={form.categoryArticle}
                onChange={handleChange}
                required
                className={`${inputStyle} cursor-pointer`}
              >
                <option disabled value="">
                  اختر الفئة
                </option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="specialTag"
                checked={form.specialTag}
                onChange={handleChange}
                className="w-5 h-5 text-blue-500 border-gray-600 rounded"
              />
              مقال مميز (Special Tag)
            </label>

            <div className="sm:col-span-2">
              <label className={labelStyle}>رفع صورة المقال</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className={inputStyle}
              />
              {file && (
                <p className="text-xs text-gray-400 mt-1">{file.name}</p>
              )}
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="sm:col-span-2 flex items-center justify-center gap-3 px-6 py-3 text-lg font-semibold rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          {loading ? "جاري الإضافة..." : "إضافة المقال"}
        </button>
      </form>
    </div>
  );
}
