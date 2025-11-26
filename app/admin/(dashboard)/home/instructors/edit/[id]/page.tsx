"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

// 💡 تعريف أنواع البيانات المدخلة والمُعادة من API
type FormInputs = {
  name_ar: string;
  name_en: string;
  experience_ar: string;
  experience_en: string;
  linkedin_url: string;
  image: FileList; // لملف الصورة الجديد
};

type InstructorData = {
  _id: string;
  name_ar: string;
  name_en: string;
  experience_ar: string;
  experience_en: string;
  linkedin_url: string;
  image_url: string;
  [key: string]: any;
};

export default function EditInstructorPage() {
  const router = useRouter();
  const params = useParams(); // للحصول على الـ ID من المسار
  const instructorId = params.id as string;

  const [instructor, setInstructor] = useState<InstructorData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset, // 💡 مهم لملء النموذج بالبيانات القديمة
  } = useForm<FormInputs>();

  // ------------------------------------
  // 1. جلب بيانات المدرب الحالي (GET by ID)
  // ------------------------------------
  useEffect(() => {
    const fetchInstructor = async () => {
      if (!instructorId) return;

      setLoadingData(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructors/${instructorId}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error("فشل في جلب بيانات المدرب.");
        }

        const data: InstructorData = await res.json();
        setInstructor(data);

        // ملء النموذج بالبيانات القديمة
        reset({
          name_ar: data.name_ar,
          name_en: data.name_en,
          experience_ar: data.experience_ar,
          experience_en: data.experience_en,
          linkedin_url: data.linkedin_url,
          // لا نملأ حقل الملف هنا
        });
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchInstructor();
  }, [instructorId, reset]); // يعتمد على الـ ID و دالة reset

  // ------------------------------------
  // 2. معاينة الصورة الجديدة
  // ------------------------------------
  const imageWatch = watch("image");
  const imageFile = imageWatch?.[0];
  const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  // ------------------------------------
  // 3. دالة معالجة التحديث (PUT by ID)
  // ------------------------------------
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name_ar", data.name_ar);
    formData.append("name_en", data.name_en);
    formData.append("experience_ar", data.experience_ar);
    formData.append("experience_en", data.experience_en);
    formData.append("linkedin_url", data.linkedin_url);

    // إرفاق ملف الصورة فقط إذا قام المستخدم بتحديد ملف جديد
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructors/${instructorId}`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        body: formData, // Fetch API يرسل FormData مباشرة
      });

      const result = await response.json();

      if (response.ok) {
        alert("تم تحديث المدرب بنجاح!");
        router.push("/admin/home/instructors"); // العودة إلى صفحة القائمة
      } else {
        const errorMessage = result.message || "فشل في تحديث المدرب.";
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error("Update Error:", err);
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------
  // 4. عرض حالة التحميل/الخطأ
  // ------------------------------------
  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl text-white">جاري تحميل بيانات المدرب...</p>
      </div>
    );
  }

  if (error && !instructor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl text-red-400">{error}</p>
      </div>
    );
  }

  // ------------------------------------
  // 5. النموذج الرئيسي
  // ------------------------------------
  return (
    <div className="min-h-screen p-6 transition-colors bg-gray-900">
      <div className="max-w-4xl p-8 mx-auto bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl">
        <h1 className="pb-3 mb-6 text-3xl font-bold text-white border-b border-indigo-500">
          {" "}
          تعديل المدرب: {instructor?.name_en}
        </h1>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-300 bg-red-900 rounded-lg">
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
            <label className="block text-sm font-medium text-gray-300">
              صورة المدرب الحالية
            </label>
            <div className="flex items-end space-x-6">
              {/* الصورة الحالية أو معاينة الصورة الجديدة */}
              <div className="relative w-40 h-40 overflow-hidden border-2 border-indigo-500 rounded-lg shadow-md">
                <Image
                  src={
                    imagePreviewUrl ||
                    instructor?.image_url ||
                    "/placeholder.png"
                  }
                  alt="Instructor Image"
                  fill
                  objectFit="cover"
                  sizes="160px"
                />
              </div>

              {/* حقل رفع الملف الجديد */}
              <div className="flex-1">
                <label
                  htmlFor="image"
                  className="block mb-1 text-sm font-medium text-gray-400"
                >
                  تغيير الصورة (اختياري)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")} // هنا لا نجعلها required لأنها تعديل
                  className="block w-full text-sm text-gray-400 transition duration-150 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-700 file:text-white hover:file:bg-indigo-600"
                />
                {errors.image && (
                  <p className="text-sm text-red-400">{errors.image.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition duration-300 ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            }`}
          >
            {isLoading ? "جاري التحديث..." : "تعديل وحفظ المدرب"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------
// ⚠️ المكونات المساعدة (يجب أن تكون في نفس الملف أو ملف منفصل)
// ------------------------------------

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
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
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
      className="block w-full p-3 mt-1 text-white placeholder-gray-400 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
    {errors[id] && <p className="text-sm text-red-400">{errors[id].message}</p>}
  </div>
);

const TextareaField = ({ id, label, register, errors, required }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <textarea
      id={id}
      rows={4}
      {...register(id, { required: required && `${label} مطلوبة.` })}
      className="block w-full p-3 mt-1 text-white placeholder-gray-400 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
    {errors[id] && <p className="text-sm text-red-400">{errors[id].message}</p>}
  </div>
);
