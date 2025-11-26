"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
// تأكد من وجود المكون Button في هذا المسار
import { Button } from "@/components/ui/button";
import {
  Save,
  Loader2,
  Type,
  FileText,
  User,
  Key,
  Tag,
  ImageIcon,
  X,
} from "lucide-react";

// =======================================================
// ✏️ واجهات TypeScript
// =======================================================
interface IImage {
  url: string;
  public_id: string;
}

interface IArticleData {
  arArticleTitle: string;
  enArticleTitle: string;
  arArticleDesc: string;
  enArticleDesc: string;
  arBlog: string;
  enBlog: string;
  arAuthor: string;
  enAuthor: string;
  arKeywords: string[];
  enKeywords: string[];
  categoryArticle: string;
  blogImage: IImage | null;
  specialTag: boolean;
}

// 💡 واجهة خاصة بالـ State لتسهيل التعامل مع الكلمات المفتاحية كـ string
interface IFormState extends Omit<IArticleData, "arKeywords" | "enKeywords"> {
  arKeywords: string; // نص مفصول بفواصل في النموذج
  enKeywords: string; // نص مفصول بفواصل في النموذج
}

// =======================================================
// 💡 المكون الرئيسي: EditArticlePage
// =======================================================
export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [formData, setFormData] = useState<IFormState>({
    arArticleTitle: "",
    enArticleTitle: "",
    arArticleDesc: "",
    enArticleDesc: "",
    arBlog: "",
    enBlog: "",
    arAuthor: "",
    enAuthor: "",
    arKeywords: "",
    enKeywords: "",
    categoryArticle: "",
    blogImage: null,
    specialTag: false,
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const categories = [
    "التواصل المؤسسي",
    "الذكاء الاصطناعي",
    "المراسم والإتيكيت",
    "التسويق الرقمي",
    "إدارة الأزمات",
    "الإعلام",
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        // تأكد من أن مسار الـ API صحيح
        const res = await fetch(`/api/articles/${id}`);

        // التحقق من حالة الاستجابة قبل محاولة قراءة JSON
        if (!res.ok) {
          console.error(`Failed to fetch article: ${res.status}`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success && data.data) {
          const articleData: IArticleData = data.data;
          setFormData({
            ...articleData,
            // تحويل مصفوفات الكلمات المفتاحية إلى سلاسل نصية مفصولة بفواصل
            arKeywords: articleData.arKeywords.join(", "),
            enKeywords: articleData.enKeywords.join(", "),
          });
        } else {
          console.error(
            "Article not found or fetch failed (data.success is false)."
          );
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      // للـ Checkboxs: نستخدم .checked، وللأخرى: نستخدم .value
      [name]: isCheckbox ? (target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageFile(e.target.files ? e.target.files[0] : null);
  };

  // =======================================================
  // 🚀 إرسال التعديلات إلى الـ API
  // =======================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      const currentKey = key as keyof IFormState;
      // نتجاوز حقل الصورة القديمة لأنه كائن ولا يتم إرساله مباشرةً في FormData
      if (currentKey !== "blogImage") {
        let value = formData[currentKey];

        // معالجة الكلمات المفتاحية: يجب إرسالها كسلسلة نصية مفصولة بفواصل
        if (currentKey === "arKeywords" || currentKey === "enKeywords") {
          value = (value as string)
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k)
            .join(",");
        }

        // نضيف القيمة إلى FormData
        if (typeof value === "boolean") {
          formPayload.append(key, value.toString());
        } else if (typeof value === "string" && value !== null) {
          formPayload.append(key, value);
        }
      }
    });

    // ⚠️ إرسال public_id للصورة القديمة إذا لم يتم رفع صورة جديدة
    if (!newImageFile && formData.blogImage) {
      formPayload.append("existingImageId", formData.blogImage.public_id);
    }

    // إضافة ملف الصورة الجديد إذا تم اختياره
    if (newImageFile) {
      formPayload.append("blogImage", newImageFile);
    } else if (!formData.blogImage) {
      // حماية: إذا لم تكن هناك صورة قديمة ولم يتم اختيار صورة جديدة
      alert("❌ يجب توفير صورة للمقال.");
      setIsUpdating(false);
      return;
    }

    try {
      // مهم: إرسال formPayload مباشرة دون تحديد Content-Type (سيتم تعيينه تلقائياً كـ multipart/form-data)
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        body: formPayload,
      });

      if (res.ok) {
        alert("✅ تم تعديل المقال بنجاح");
        router.push("/admin/articles");
      } else {
        const errorData = await res.json();
        alert(
          `❌ حدث خطأ أثناء حفظ التعديلات: ${
            errorData.message || res.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("❌ خطأ في الاتصال بالخادم.");
    } finally {
      setIsUpdating(false);
    }
  };

  // رابط الصورة للمعاينة (سواء كانت القديمة أو الجديدة)
  const imagePreviewUrl = newImageFile
    ? URL.createObjectURL(newImageFile)
    : formData.blogImage?.url || null;

  // =======================================================
  // 🖼️ عرض حالة التحميل/الخطأ
  // =======================================================
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-200">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        جاري تحميل البيانات...
      </p>
    );

  if (!formData.arArticleTitle && !loading) {
    return (
      <p className="text-center mt-10 text-red-400">
        المقال المطلوب غير موجود.
      </p>
    );
  }

  // =======================================================
  // 🧱 العرض (JSX)
  // =======================================================
  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-500 border-b border-gray-700 pb-3">
        تعديل المقال
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. قسم العناوين والأوصاف */}
        <ArticleSection title="العناوين والأوصاف الأساسية">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label text="العنوان الرئيسي (عربي)" subText={undefined} />
              <Input
                name="arArticleTitle"
                placeholder="عنوان المقال بالعربية"
                value={formData.arArticleTitle}
                onChange={handleChange}
                Icon={Type}
                required
              />
            </div>
            <div>
              <Label text="Title (English)" subText={undefined} />
              <Input
                name="enArticleTitle"
                placeholder="Article Title in English"
                value={formData.enArticleTitle}
                onChange={handleChange}
                Icon={Type}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label text="الوصف المختصر (عربي)" subText={undefined} />
              <Textarea
                name="arArticleDesc"
                placeholder="وصف المقال بالعربية"
                value={formData.arArticleDesc}
                onChange={handleChange}
                Icon={FileText}
                rows={2}
                required
              />
            </div>
            <div>
              <Label text="Description (English)" subText={undefined} />
              <Textarea
                name="enArticleDesc"
                placeholder="Article Description in English"
                value={formData.enArticleDesc}
                onChange={handleChange}
                Icon={FileText}
                rows={2}
                required
              />
            </div>
          </div>
        </ArticleSection>

        {/* 2. قسم المحتوى الكامل */}
        <ArticleSection title="المحتوى التفصيلي للمقال">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label text="المحتوى الكامل (عربي)" subText={undefined} />
              <Textarea
                name="arBlog"
                placeholder="المحتوى الكامل للمقال بالعربية"
                value={formData.arBlog}
                onChange={handleChange}
                Icon={FileText}
                rows={8}
                required
              />
            </div>
            <div>
              <Label text="Full Content (English)" subText={undefined} />
              <Textarea
                name="enBlog"
                placeholder="Full Article Content in English"
                value={formData.enBlog}
                onChange={handleChange}
                Icon={FileText}
                rows={8}
                required
              />
            </div>
          </div>
        </ArticleSection>

        {/* 3. قسم البيانات الوصفية (Metadata) والصورة */}
        <ArticleSection title="البيانات الوصفية (Metadata) والصورة">
          {/* الكاتب (Author) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label text="اسم الكاتب (عربي)" subText={undefined} />
              <Input
                name="arAuthor"
                placeholder="اسم الكاتب بالعربية"
                value={formData.arAuthor}
                onChange={handleChange}
                Icon={User}
                required
              />
            </div>
            <div>
              <Label text="Author Name (English)" subText={undefined} />
              <Input
                name="enAuthor"
                placeholder="Author Name in English"
                value={formData.enAuthor}
                onChange={handleChange}
                Icon={User}
                required
              />
            </div>
          </div>

          {/* الكلمات المفتاحية (Keywords) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                text="الكلمات المفتاحية (عربي)"
                subText="(افصل بفواصل ,)"
              />
              <Input
                name="arKeywords"
                placeholder="مثال: تسويق, إعلام, تواصل"
                value={formData.arKeywords}
                onChange={handleChange}
                Icon={Key}
                required
              />
            </div>
            <div>
              <Label
                text="Keywords (English)"
                subText="(Separate with commas ,)"
              />
              <Input
                name="enKeywords"
                placeholder="Example: marketing, media, communication"
                value={formData.enKeywords}
                onChange={handleChange}
                Icon={Key}
                required
              />
            </div>
          </div>

          {/* الفئة و Special Tag */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-700">
            <div className="md:col-span-2">
              <Label text="فئة المقال" subText={undefined} />
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <select
                  name="categoryArticle"
                  value={formData.categoryArticle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                  required
                >
                  <option
                    value=""
                    disabled
                    className="bg-gray-800 text-gray-400"
                  >
                    اختر الفئة
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-gray-800"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 font-semibold text-gray-200 self-end mb-2">
              <input
                type="checkbox"
                name="specialTag"
                checked={formData.specialTag}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              مقال مميز
            </label>
          </div>

          {/* قسم الصورة */}
          <div className="pt-4 border-t border-gray-700 mt-4">
            <h4 className="font-semibold mb-3 text-gray-200 flex items-center gap-1">
              <ImageIcon className="w-5 h-5 text-yellow-400" /> صورة المقال
              الرئيسية
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="relative w-36 h-36 flex-shrink-0 border-2 border-dashed border-gray-500 rounded-lg overflow-hidden bg-gray-900 shadow-inner">
                {imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
                    alt="Article Image Preview"
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm p-2">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span>لا توجد صورة</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                <label
                  htmlFor="blogImageUpload"
                  className="block text-sm font-medium text-gray-300"
                >
                  للتغيير: اختر ملف صورة جديد (سيحل محل القديم)
                </label>

                <input
                  id="blogImageUpload"
                  type="file"
                  accept="image/*"
                  name="blogImage"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 transition duration-150"
                />

                {newImageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewImageFile(null)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-xs"
                  >
                    <X className="w-4 h-4" /> إلغاء الصورة الجديدة
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ArticleSection>

        {/* زر الإرسال */}
        <div className="text-center pt-4">
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-xl font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            {isUpdating ? (
              <>
                <Loader2 size={22} className="animate-spin" /> جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={22} /> حفظ التعديلات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------------
// 🚀 مكونات مساعدة (خارج المكون الرئيسي) - تم إصلاح مشكلة التعريف
// ------------------------------------------------------------------

// @ts-ignore: لتجاهل تحذير TypeScript حول النوع غير المحدد لـ children/props
const ArticleSection = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-xl space-y-6 border border-gray-700 shadow-md">
    <h3 className="text-2xl font-bold text-yellow-400 border-b border-gray-700 pb-3 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

// @ts-ignore
const Label = ({ text, subText }) => (
  <label className="block font-semibold mb-1 text-gray-200">
    {text}
    {subText && <span className="text-xs text-gray-400 mr-1">{subText}</span>}
  </label>
);

// @ts-ignore
const Input = ({ Icon, ...props }) => (
  <div className="flex items-center gap-2">
    {Icon && <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />}
    <input
      {...props}
      className="w-full p-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
    />
  </div>
);

// @ts-ignore
const Textarea = ({ Icon, rows = 3, ...props }) => (
  <div className="flex items-start gap-2">
    {Icon && <Icon className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />}
    <textarea
      {...props}
      rows={rows}
      className="w-full p-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
    />
  </div>
);
