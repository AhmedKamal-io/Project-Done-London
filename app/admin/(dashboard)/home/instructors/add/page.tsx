"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 💡 تعريف أنواع حقول النموذج (يجب أن تتطابق مع حقول المخطط)
type FormInputs = {
  name_ar: string;
  name_en: string;
  experience_ar: string;
  experience_en: string;
  linkedin_url: string;
  image: FileList; // لملف الصورة
};

export default function AddInstructorPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // مراقبة ملف الصورة لعرض معاينة
  const imageWatch = watch("image");
  const imageFile = imageWatch?.[0];
  const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  // --- 💡 دالة معالجة إرسال النموذج باستخدام Fetch API ---
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    // 1. إنشاء FormData
    const formData = new FormData();
    formData.append("name_ar", data.name_ar);
    formData.append("name_en", data.name_en);
    formData.append("experience_ar", data.experience_ar);
    formData.append("experience_en", data.experience_en);
    formData.append("linkedin_url", data.linkedin_url);

    // تأكد من وجود ملف قبل إضافته
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    } else {
      setIsLoading(false);
      setError("صورة المدرب مطلوبة.");
      return;
    }

    try {
      // 2. إرسال الطلب باستخدام Fetch API
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructors`;

      const response = await fetch(apiUrl, {
        method: "POST",
        // 💡 لا تحتاج لتعيين Content-Type هنا!
        // المتصفح يقوم بتعيين Content-Type: multipart/form-data وتحديد الـ boundary تلقائياً
        body: formData,
      });

      // 3. تحليل الاستجابة والتعامل مع رموز الحالة
      const result = await response.json();

      if (response.ok) {
        // التحقق من رموز 2xx (201 Created)
        alert("تم إضافة المدرب بنجاح!");
        router.push("/admin/home/instructors");
      } else {
        // التعامل مع أخطاء الخادم (400, 500)
        const errorMessage =
          result.message ||
          result.error ||
          "فشل في إضافة المدرب. يرجى التحقق من الحقول.";
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl p-8 mx-auto bg-white border border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
        <h1 className="pb-3 mb-6 text-3xl font-bold text-gray-900 border-b border-gray-200 dark:text-white dark:border-gray-700">
          إضافة مدرب جديد
        </h1>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* حقول الاسم */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField
              id="name_ar"
              label="الاسم (عربي)"
              register={register}
              errors={errors}
              required
            />
            <InputField
              id="name_en"
              label="Name (English)"
              register={register}
              errors={errors}
              required
            />
          </div>

          {/* حقول الخبرة */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextareaField
              id="experience_ar"
              label="الخبرة (عربي)"
              register={register}
              errors={errors}
              required
            />
            <TextareaField
              id="experience_en"
              label="Experience (English)"
              register={register}
              errors={errors}
              required
            />
          </div>

          {/* حقل LinkedIn */}
          <InputField
            id="linkedin_url"
            label="رابط LinkedIn"
            register={register}
            errors={errors}
            required={false}
            pattern={/^https?:\/\/(www\.)?linkedin\.com\/.*$/}
            patternMessage="الرابط يجب أن يبدأ بـ https://www.linkedin.com/..."
          />

          {/* حقل الصورة */}
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              صورة المدرب (مطلوب)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              {...register("image", { required: "صورة المدرب مطلوبة." })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-indigo-400 dark:hover:file:bg-gray-600"
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}

            {/* معاينة الصورة */}
            {imagePreviewUrl && (
              <div className="relative w-40 h-40 mt-4 overflow-hidden border-2 border-indigo-400 rounded-lg shadow-md">
                <Image
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  fill
                  objectFit="cover"
                  sizes="160px"
                />
              </div>
            )}
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? "جاري الإضافة..." : "حفظ المدرب"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- مكونات مساعدة للحقول (بدون تغيير) ---

// 💡 حقل إدخال نصي عام
const InputField = ({
  id,
  label,
  register,
  errors,
  required,
  pattern,
  patternMessage,
}: any) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type="text"
      {...register(id, {
        required: required && `${label} مطلوب.`,
        pattern: pattern
          ? { value: pattern, message: patternMessage }
          : undefined,
      })}
      className="block w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    />
    {errors[id] && <p className="text-sm text-red-500">{errors[id].message}</p>}
  </div>
);

// 💡 حقل مساحة نصية
const TextareaField = ({ id, label, register, errors, required }: any) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      rows={4}
      {...register(id, { required: required && `${label} مطلوبة.` })}
      className="block w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    />
    {errors[id] && <p className="text-sm text-red-500">{errors[id].message}</p>}
  </div>
);
