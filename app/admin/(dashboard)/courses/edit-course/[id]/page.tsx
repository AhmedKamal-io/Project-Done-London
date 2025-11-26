"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  Trash2,
  Globe,
  PlusCircle,
  XCircle,
  Image as ImageIcon,
  User,
} from "lucide-react";

// ====== TypeScript Interfaces (لم يتم تغييرها) ======

interface IModule {
  title: string;
  duration: string;
  topics: string[];
}

interface ILanguageData {
  name: string;
  nameSlug?: string;
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
  targetAudience: string[];
  modules: IModule[];
}

interface IInstructor {
  _id: string;
  name_ar: string;
  name_en: string;
}

interface ICourseData {
  _id: string;
  trainer: IInstructor;
  images: string[];
  slug: { ar: string; en: string };
  translations: {
    ar: ILanguageData;
    en: ILanguageData;
  };
}

// ====== OPTIONS DEFINITION (لم يتم تغييرها) ======
const cityMap: Record<string, string> = {
  لندن: "London",
  دبي: "Dubai",
  إسطنبول: "Istanbul",
  باريس: "Paris",
  روما: "Rome",
  برشلونة: "Barcelona",
  مدريد: "Madrid",
  البندقية: "Venice",
};

const CITY_OPTIONS = Object.entries(cityMap).map(([ar, en]) => ({
  value: en,
  ar: ar,
  en: en,
}));

const categoryMap = [
  { ar: "التواصل المؤسسي", en: "Corporate Communication" },
  { ar: "المراسم والاتكيت", en: "Protocol & Etiquette" },
  { ar: "الإدارة الإعلامية", en: "Media Management" },
  { ar: "التسويق والعلامة التجارية", en: "Marketing & Branding" },
  { ar: "الذكاء الاصطناعي", en: "Artificial Intelligence" },
  { ar: "التصميم والمونتاج", en: "Design & Editing" },
];

const SECTION_OPTIONS = categoryMap.map((item) => ({
  value: item.en,
  ar: item.ar,
  en: item.en,
}));

// ====== Main Component ======
const CourseEdit: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;

  const [course, setCourse] = useState<ICourseData | null>(null);
  const [allInstructors, setAllInstructors] = useState<IInstructor[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  // 1. 🟢 حالة جديدة لروابط الصور المعروضة (بديل imagesText)
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  // 2. 🟢 حالة جديدة لتتبع عملية الرفع
  const [isUploading, setIsUploading] = useState(false);

  // 3. 🔴 إزالة imagesText و parseList حيث لم يعدا مطلوبين
  // const [imagesText, setImagesText] = useState("");
  // const parseList = (text: string) => text.split("\n").filter((v) => v.trim() !== "");

  const isArabic = activeTab === "ar";

  // دالة parseList لازالت مستخدمة في مناطق أخرى (مثل الـ Modules)
  const parseList = (text: string) =>
    (typeof text === "string" ? text.split("\n") : []).filter(
      (v) => v.trim() !== ""
    );

  // ====== Initial Fetch ======
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchInstructors(), fetchCourse()]);
      setLoading(false);
    };

    if (courseId) {
      initData();
    }
  }, [courseId]);

  // 1. جلب المدربين لملء القائمة
  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/instructors");
      const data = await res.json();

      if (Array.isArray(data)) {
        setAllInstructors(data);
      } else if (data.success && Array.isArray(data.data)) {
        setAllInstructors(data.data);
      } else {
        console.error("API response format is incorrect or missing data.");
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  // 2. جلب بيانات الكورس
  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();

      if (data.success) {
        const loadedCourse: ICourseData = data.data;

        const normalizedCourse: ICourseData = {
          ...loadedCourse,
          images: loadedCourse.images || [],
          // ... (باقي تهيئة البيانات)
          translations: {
            ar: {
              ...loadedCourse.translations.ar,
              targetAudience: loadedCourse.translations.ar.targetAudience || [],
            },
            en: {
              ...loadedCourse.translations.en,
              targetAudience: loadedCourse.translations.en.targetAudience || [],
            },
          },
        };

        setCourse(normalizedCourse);

        if (loadedCourse.trainer && loadedCourse.trainer._id) {
          setSelectedTrainerId(loadedCourse.trainer._id);
        }

        // 🟢 التعديل هنا: تعيين مصفوفة الصور مباشرة لحالة displayImages
        if (loadedCourse.images && loadedCourse.images.length > 0) {
          setDisplayImages(loadedCourse.images);
        }
      } else {
        alert("فشل في تحميل الدورة: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("خطأ في الاتصال بالخادم أثناء الجلب.");
    }
  };

  // ====== 🟢 الدوال الجديدة للصور ======

  // دالة التعامل مع رفع الصور
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    // ⚠️ يتم هنا إرسال الملفات إلى API Route الخاص بالرفع (يجب أن تقوم بإنشائه)
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file); // اسم الحقل الذي تتوقعه API الرفع

      try {
        // 💡 افترضنا وجود مسار API لرفع الصور /api/upload-course-image
        const res = await fetch("/api/upload-course-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success && data.url) {
          // افترض أن الرد يحتوي على success و url
          uploadedUrls.push(data.url);
        } else {
          alert(`فشل رفع الصورة: ${data.message || "خطأ غير معروف"}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setIsUploading(false);

    // تحديث حالة displayImages
    if (uploadedUrls.length > 0) {
      setDisplayImages((prevImages) => [...prevImages, ...uploadedUrls]);
    }
  };

  // دالة التعامل مع حذف الصور
  const handleDeleteImage = (urlToDelete: string) => {
    if (
      !confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذه الصورة؟"
          : "Are you sure you want to delete this image?"
      )
    )
      return;

    // ⚠️ يجب عليك هنا إرسال طلب حذف إلى Cloudinary أو الـ API الخاص بك
    // قبل إزالتها من الـ State (للتنظيف).
    // (لغرض هذا الكود، سنقوم فقط بإزالتها من الواجهة الأمامية)

    setDisplayImages((prevImages) =>
      prevImages.filter((url) => url !== urlToDelete)
    );
  };

  // ====== Handle Input Change (لم يتم تغييره) ======
  const handleChange = (
    lang: "ar" | "en",
    field: keyof ILanguageData,
    value: any
  ) => {
    if (!course) return;

    const arrayFields: (keyof ILanguageData)[] = [
      "importance",
      "outcomes",
      "services",
      "objectives",
      "includes",
      "targetAudience",
    ];

    const syncFields: (keyof ILanguageData)[] = [
      "price",
      "duration",
      "language",
      "certificate",
      "venue",
    ];

    setCourse((prev) => {
      if (!prev) return null;

      let newArValue = prev.translations.ar[field];
      let newEnValue = prev.translations.en[field];

      const getCrossLangValue = (
        options: typeof CITY_OPTIONS | typeof SECTION_OPTIONS,
        selectedValue: string
      ) => {
        const isEnglishActive = activeTab === "en";
        const found = options.find(
          (opt) => (isEnglishActive ? opt.en : opt.ar) === selectedValue
        );
        if (found) {
          return { ar: found.ar, en: found.en };
        }
        return { ar: selectedValue, en: selectedValue };
      };

      if (field === "city" || field === "section") {
        const options = field === "city" ? CITY_OPTIONS : SECTION_OPTIONS;
        const { ar, en } = getCrossLangValue(options, value);
        newArValue = ar;
        newEnValue = en;
      } else if (arrayFields.includes(field)) {
        const newArray = parseList(value);
        if (lang === "ar") newArValue = newArray;
        else newEnValue = newArray;
      } else if (syncFields.includes(field)) {
        newArValue = value;
        newEnValue = value;
      } else {
        if (lang === "ar") newArValue = value;
        else newEnValue = value;
      }

      return {
        ...prev,
        translations: {
          ar: { ...prev.translations.ar, [field]: newArValue as any },
          en: { ...prev.translations.en, [field]: newEnValue as any },
        },
      };
    });
  };

  // ====== Handle Modules Change (لم يتم تغييره) ======
  const handleModuleChange = (
    lang: "ar" | "en",
    index: number,
    field: keyof IModule,
    value: any
  ) => {
    if (!course) return;
    setCourse((prev) => {
      if (!prev) return null;
      const updatedModules = [...prev.translations[lang].modules];
      if (field === "topics") {
        updatedModules[index][field] = parseList(value);
      } else {
        updatedModules[index][field] = value;
      }
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: {
            ...prev.translations[lang],
            modules: updatedModules,
          },
        },
      };
    });
  };

  // ====== Add / Remove Module (لم يتم تغييره) ======
  const addModule = (lang: "ar" | "en") => {
    if (!course) return;
    setCourse((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: {
            ...prev.translations[lang],
            modules: [
              ...prev.translations[lang].modules,
              { title: "", duration: "", topics: [] },
            ],
          },
        },
      };
    });
  };

  const removeModule = (lang: "ar" | "en", index: number) => {
    if (!course) return;
    setCourse((prev) => {
      if (!prev) return null;
      const updatedModules = [...prev.translations[lang].modules];
      updatedModules.splice(index, 1);
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: {
            ...prev.translations[lang],
            modules: updatedModules,
          },
        },
      };
    });
  };

  // ====== Handle Slug Change (لم يتم تغييره) ======
  const handleSlugChange = (lang: "ar" | "en", value: string) => {
    if (!course) return;
    setCourse((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        slug: { ...prev.slug, [lang]: value },
      };
    });
  };

  // ====== Handle Submit (Update) ======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !courseId || submitting) return;

    if (!selectedTrainerId) {
      alert(isArabic ? "الرجاء اختيار المدرب" : "Please select an instructor");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ar: {
          ...course.translations.ar,
          nameSlug: course.slug.ar,
        },
        en: {
          ...course.translations.en,
          nameSlug: course.slug.en,
        },
        // 🟢 التعديل هنا: إرسال مصفوفة الصور الجديدة displayImages
        trainerId: selectedTrainerId,
        images: displayImages, // ⬅️ تم استبدال parseList(imagesText)
      };

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ تم تحديث الدورة بنجاح!");
        router.push("/admin/courses");
      } else {
        alert("❌ فشل التحديث: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ حدث خطأ أثناء التحديث.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== Handle Delete (لم يتم تغييره) ======
  const handleDelete = async () => {
    if (
      !course ||
      !courseId ||
      !confirm("هل أنت متأكد من حذف الدورة؟ لا يمكن التراجع عن هذا الإجراء.")
    )
      return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ تم حذف الدورة بنجاح.");
        router.push("/admin/courses");
      } else alert("❌ فشل الحذف: " + data.message);
    } catch (err) {
      console.error(err);
      alert("⚠️ حدث خطأ أثناء الحذف.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading)
    return (
      <div className="min-h-screen p-8 text-xl text-center text-blue-400 bg-gray-900">
        جاري تحميل بيانات الدورة...
      </div>
    );
  if (!course)
    return (
      <div className="min-h-screen p-8 text-xl text-center text-red-500 bg-gray-900">
        لم يتم العثور على الدورة.
      </div>
    );

  const langData = course.translations[activeTab];

  const arrayFieldsMap: { [key: string]: { ar: string; en: string } } = {
    importance: { ar: "أهمية الدورة", en: "Importance" },
    outcomes: { ar: "نواتج الدورة", en: "Outcomes" },
    services: { ar: "الخدمات المتاحة", en: "Services" },
    objectives: { ar: "الأهداف", en: "Objectives" },
    includes: { ar: "ما تشمله الدورة", en: "Includes" },
    targetAudience: { ar: "الجمهور المستهدف", en: "Target Audience" },
  };

  const inputBaseClasses =
    "w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 border-gray-600 appearance-none";
  const selectBaseClasses =
    "w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white border-gray-600";

  const getDisplayValue = (
    options: typeof CITY_OPTIONS | typeof SECTION_OPTIONS,
    savedValue: string
  ) => {
    const found = options.find(
      (opt) =>
        opt.ar === savedValue ||
        opt.en === savedValue ||
        opt.value === savedValue
    );
    if (!found) return savedValue;
    return isArabic ? found.ar : found.en;
  };

  const currentSection = getDisplayValue(SECTION_OPTIONS, langData.section);
  const currentCity = getDisplayValue(CITY_OPTIONS, langData.city);

  return (
    <div
      className="min-h-screen p-8 mx-auto text-white bg-gray-900 max-w-7xl"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h1 className="pb-4 mb-8 text-3xl font-extrabold text-blue-400 border-b border-gray-700">
        {isArabic
          ? `تعديل الدورة: ${course.translations.ar.name}`
          : `Edit Course: ${course.translations.en.name}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- 1. إعدادات عامة (المدرب، الصور، السلوغ) --- */}
        <div className="flex flex-col gap-4 p-4 bg-gray-800 border border-gray-700 shadow-xl rounded-xl">
          <h2 className="pb-2 mb-2 text-xl font-bold text-gray-200 border-b border-gray-700">
            {isArabic ? "الإعدادات العامة" : "Global Settings"}
          </h2>

          {/* اختيار المدرب */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-semibold text-gray-400">
              <User className="inline w-4 h-4 mr-1 text-yellow-400" />
              {isArabic ? "المدرب" : "Trainer"}
            </label>
            <select
              value={selectedTrainerId}
              onChange={(e) => setSelectedTrainerId(e.target.value)}
              className={selectBaseClasses}
              required
            >
              <option value="" disabled>
                -- "Select Trainer" --
              </option>
              {allInstructors.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* قسم الصور */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-semibold text-gray-400">
              <ImageIcon className="inline w-4 h-4 mr-1 text-purple-400" />
              {isArabic ? "معرض الصور" : "Image Gallery"}
            </label>

            {/* عرض الصور الحالية مع زر الحذف */}
            <div className="flex flex-wrap gap-3 p-2 mb-3 bg-gray-900 border border-gray-600 rounded min-h-[100px] items-start">
              {/* 1. تكرار الصور الموجودة */}
              {displayImages.map((imgUrl, idx) => (
                <div key={idx} className="relative w-24 h-24 group">
                  <img
                    src={imgUrl}
                    alt={`Course Image ${idx + 1}`}
                    className="object-cover w-full h-full border border-gray-500 rounded"
                  />

                  {/* 2. زر الحذف */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(imgUrl)} // 💡 سنقوم بتعريف هذه الدالة
                    className="absolute top-0 right-0 p-1 text-white transition duration-200 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110"
                    title={isArabic ? "حذف الصورة" : "Delete Image"}
                  >
                    {/* استخدم أيقونة X بسيطة (مثلاً Tailwind Heroicon XMarkIcon) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* 3. حقل الرفع (لإضافة صور جديدة) */}
              <label className="flex items-center justify-center w-24 h-24 text-gray-400 transition border-2 border-dashed rounded cursor-pointer border-gray-600/50 hover:border-gray-500 hover:text-white">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload} // 💡 سنقوم بتعريف هذه الدالة
                />
                {/* أيقونة إضافة بسيطة */}
                {isUploading ? (
                  <span className="text-sm">Uploading...</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
              </label>
            </div>
          </div>

          {/* Slugs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-400">
                <Globe className="inline w-4 h-4 mr-1 text-blue-300" />{" "}
                {isArabic ? "Slug عربي" : "Arabic Slug"}
              </label>
              <input
                type="text"
                value={course.slug.ar}
                onChange={(e) => handleSlugChange("ar", e.target.value)}
                className={inputBaseClasses}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-400">
                <Globe className="inline w-4 h-4 mr-1 text-blue-300" />{" "}
                {isArabic ? "Slug إنجليزي" : "English Slug"}
              </label>
              <input
                type="text"
                value={course.slug.en}
                onChange={(e) => handleSlugChange("en", e.target.value)}
                className={inputBaseClasses}
                required
              />
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex mt-4 space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-500"
            >
              {submitting
                ? "جارٍ الحفظ..."
                : isArabic
                ? "حفظ التغييرات"
                : "Save Changes"}
              <Save className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition duration-200 bg-red-600 rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-500"
            >
              {isArabic ? "حذف الدورة" : "Delete Course"}
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- 2. Language Tabs --- */}
        <div className="flex border-b border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab("ar")}
            className={`py-3 px-6 text-lg transition duration-200 ${
              activeTab === "ar"
                ? "border-b-4 border-blue-500 text-blue-400 font-bold bg-gray-800"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            العربية 🇸🇦
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`py-3 px-6 text-lg transition duration-200 ${
              activeTab === "en"
                ? "border-b-4 border-blue-500 text-blue-400 font-bold bg-gray-800"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            الإنجليزية 🇬🇧
          </button>
        </div>

        {/* --- 3. Language Content --- */}
        <div className="p-6 space-y-6 bg-gray-800 border border-gray-700 shadow-xl rounded-xl">
          <h2 className="pb-2 mb-4 text-2xl font-bold text-gray-200 border-b border-gray-700">
            {isArabic ? "تفاصيل المحتوى" : "Content Details"}
          </h2>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 1. Course Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "اسم الدورة" : "Course Name"}
              </label>
              <input
                type="text"
                value={langData.name}
                onChange={(e) =>
                  handleChange(activeTab, "name", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>

            {/* 2. Section */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "القسم" : "Section"}
              </label>
              <select
                value={currentSection}
                onChange={(e) =>
                  handleChange(activeTab, "section", e.target.value)
                }
                className={selectBaseClasses}
                required
              >
                <option value="" disabled className="text-gray-400">
                  {isArabic ? "اختر القسم" : "Select Section"}
                </option>
                {SECTION_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={isArabic ? opt.ar : opt.en}
                    className="text-white bg-gray-700"
                  >
                    {isArabic ? opt.ar : opt.en}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. City */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "المدينة" : "City"}
              </label>
              <select
                value={currentCity}
                onChange={(e) =>
                  handleChange(activeTab, "city", e.target.value)
                }
                className={selectBaseClasses}
                required
              >
                <option value="" disabled className="text-gray-400">
                  {isArabic ? "اختر المدينة" : "Select City"}
                </option>
                {CITY_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={isArabic ? opt.ar : opt.en}
                    className="text-white bg-gray-700"
                  >
                    {isArabic ? opt.ar : opt.en}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Price */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "السعر" : "Price"}
              </label>
              <input
                type="text"
                value={langData.price}
                onChange={(e) =>
                  handleChange(activeTab, "price", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>

            {/* 5. Duration */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "المدة" : "Duration"}
              </label>
              <input
                type="text"
                value={langData.duration}
                onChange={(e) =>
                  handleChange(activeTab, "duration", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>

            {/* 6. Language */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "اللغة" : "Language"}
              </label>
              <input
                type="text"
                value={langData.language}
                onChange={(e) =>
                  handleChange(activeTab, "language", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>

            {/* 7. Certificate */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "الشهادة" : "Certificate"}
              </label>
              <input
                type="text"
                value={langData.certificate}
                onChange={(e) =>
                  handleChange(activeTab, "certificate", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>
            {/* 8. Venue */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">
                {isArabic ? "مكان الانعقاد" : "Venue"}
              </label>
              <input
                type="text"
                value={langData.venue}
                onChange={(e) =>
                  handleChange(activeTab, "venue", e.target.value)
                }
                className={inputBaseClasses}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-400">
              {isArabic ? "الوصف التفصيلي" : "Description"}
            </label>
            <textarea
              value={langData.description}
              onChange={(e) =>
                handleChange(activeTab, "description", e.target.value)
              }
              rows={5}
              className={inputBaseClasses}
              required
            />
          </div>

          {/* --- 4. Array Fields --- */}
          <h3 className="pt-4 mt-6 text-xl font-bold text-gray-200 border-t border-gray-700">
            {isArabic
              ? "العناصر المتعددة (سطر لكل عنصر)"
              : "Array Fields (One Item Per Line)"}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* جميع الحقول المصفوفة */}
            {Object.keys(arrayFieldsMap).map((field) => (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium text-gray-400">
                  {isArabic
                    ? arrayFieldsMap[field].ar
                    : arrayFieldsMap[field].en}
                </label>
                <textarea
                  value={(langData as any)[field].join("\n")}
                  onChange={(e) =>
                    handleChange(
                      activeTab,
                      field as keyof ILanguageData,
                      e.target.value
                    )
                  }
                  rows={4}
                  className={inputBaseClasses}
                />
              </div>
            ))}
          </div>

          {/* --- 5. Modules --- */}
          <div className="pt-6 mt-8 border-t border-gray-700">
            <h3 className="mb-4 text-2xl font-bold text-gray-200">
              {isArabic ? "الوحدات (Modules)" : "Course Modules"}
            </h3>
            <div className="space-y-6">
              {langData.modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-4 space-y-3 bg-gray-900 border border-blue-700 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-700">
                    <h4 className="font-medium text-blue-400">
                      {isArabic ? `الوحدة رقم ${idx + 1}` : `Module ${idx + 1}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeModule(activeTab, idx)}
                      className="flex items-center gap-1 p-1 text-sm font-bold text-red-500 transition duration-200 rounded hover:text-red-400 bg-red-900/50"
                      disabled={langData.modules.length <= 1}
                    >
                      <XCircle className="w-4 h-4" />
                      {isArabic ? "حذف الوحدة" : "Remove Module"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-400">
                        {isArabic ? "عنوان الوحدة" : "Title"}
                      </label>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) =>
                          handleModuleChange(
                            activeTab,
                            idx,
                            "title",
                            e.target.value
                          )
                        }
                        className={inputBaseClasses}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-400">
                        {isArabic ? "مدة الوحدة" : "Duration"}
                      </label>
                      <input
                        type="text"
                        value={mod.duration}
                        onChange={(e) =>
                          handleModuleChange(
                            activeTab,
                            idx,
                            "duration",
                            e.target.value
                          )
                        }
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-400">
                      {isArabic
                        ? "الموضوعات (سطر لكل موضوع)"
                        : "Topics (one per line)"}
                    </label>
                    <textarea
                      value={mod.topics.join("\n")}
                      onChange={(e) =>
                        handleModuleChange(
                          activeTab,
                          idx,
                          "topics",
                          e.target.value
                        )
                      }
                      rows={3}
                      className={inputBaseClasses}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addModule(activeTab)}
                className="flex items-center justify-center w-full gap-1 p-2 mt-2 font-semibold text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                {isArabic ? "إضافة وحدة جديدة" : "Add New Module"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit;
