"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  MapPin,
  Tag,
  BookOpen,
  Send,
  Loader2,
  PlusCircle,
  Trash2,
  Globe,
  Users, // ⬅️ أيقونة الجمهور المستهدف
} from "lucide-react";

// (افتراض) استخدام مكونات shadcn/ui
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// =============================================================
// الواجهات المساعدة (Interfaces)
// =============================================================

interface ITranslation {
  ar: string;
  en: string;
}

interface IModule {
  title: ITranslation;
  duration: ITranslation;
  arTopics: string[];
  enTopics: string[];
}

// ⬅️ واجهة بيانات المدرب المُستجلبة
interface IInstructorOption {
  name_en: string;
  _id: string;
}

// =============================================================
// الدوال المساعدة (Helper Functions)
// =============================================================
const parseList = (text: string): string[] => text.split("\n").filter(Boolean);

// =============================================================
// الكومبوننت الرئيسي والمنطق (Logic)
// =============================================================
export default function AddCoursePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const [instructors, setInstructors] = useState<IInstructorOption[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true); // ⬅️ حالة جديدة لملفات الصور التي سيتم رفعها

  const [imageFiles, setImageFiles] = useState<File[]>([]); // خريطة المدن المحدثة والموحدة

  const cityMap: Record<string, string> = {
    لندن: "London",
    دبي: "Dubai",
    اسطنبول: "Istanbul",
    باريس: "Paris",
    روما: "Rome",
    برشلونة: "Barcelona",
    مدريد: "Madrid",
    البندقية: "Venice",
  };
  const allCitiesAR = Object.keys(cityMap); // خريطة الفئات (Section)

  const categoryMap = [
    { ar: "التواصل المؤسسي", en: "Corporate Communication" },
    { ar: "المراسم والاتكيت", en: "Protocol & Etiquette" },
    { ar: "الإدارة الإعلامية", en: "Media Management" },
    { ar: "التسويق والعلامة التجارية", en: "Marketing & Branding" },
    { ar: "الذكاء الاصطناعي", en: "Artificial Intelligence" },
    { ar: "التصميم والمونتاج", en: "Design & Editing" },
  ]; // بيانات افتراضية للوحدات

  const defaultModule: IModule = {
    title: { ar: "الوحدة #1", en: "Module #1" },
    duration: { ar: "4 ساعات", en: "4 Hours" },
    arTopics: ["مقدمة في الوحدة بالعربية"],
    enTopics: ["Introduction to the module in English"],
  }; // تحديث defaultLists

  const defaultLists = {
    includes: {
      ar: "تدريب تفاعلي\nكوفي بريك\nالمادة العلمية\nشهادة معتمدة",
      en: "Interactive training\nCoffee break\nTraining materials\nAccredited certificate",
    },
    outcomes: { ar: "مهارة 1\nمهارة 2", en: "Skill 1\nSkill 2" },
    importance: { ar: "أهمية 1", en: "Importance 1" },
    services: {
      ar: "توصيل من وإلى المطار\nحفل ختامي لتسليم الشهادة\nهدية تاب",
      en: "Airport pick-up and drop-off\nClosing ceremony for certificate presentation\nTablet gift",
    },
    objectives: { ar: "هدف 1", en: "Objective 1" },
    targetAudience: {
      ar: "المدراء\nالقياديون\nالعاملون في المجال",
      en: "Managers\nLeaders\nField workers",
    },
  }; // 🌟 تحديث حالة formData الأولية 🌟

  const [formData, setFormData] = useState<{
    [key: string]: any;
    trainerId: string;
    images: string[]; // ⬅️ تم تغيير النوع لحفظ مصفوفة الروابط
    modules: IModule[];
  }>({
    // النصوص الأساسية
    arName: "",
    enName: "",
    arDescription: "",
    enDescription: "",
    arSlug: "",
    enSlug: "",
    price: "4200",
    images: [], // ⬅️ القيمة الافتراضية أصبحت مصفوفة
    trainerId: "",
    arCity: "لندن",
    enCity: "London",
    arSection: "",
    enSection: "",
    arVenue: "ماربل آرش - أكسفورد ستريت",
    enVenue: "Marble Arch – Oxford Street",
    arDuration: "أسبوع تدريبي",
    enDuration: "One training week",
    arLanguage: "العربية والإنجليزية",
    enLanguage: "Arabic and English",
    arCertificate: "شهادة معتمدة",
    enCertificate: "Accredited Certificate", // القوائم

    arIncludes: defaultLists.includes.ar,
    enIncludes: defaultLists.includes.en,
    arOutcomes: defaultLists.outcomes.ar,
    enOutcomes: defaultLists.outcomes.en,
    arImportance: defaultLists.importance.ar,
    enImportance: defaultLists.importance.en,
    arServices: defaultLists.services.ar,
    enServices: defaultLists.services.en,
    arObjectives: defaultLists.objectives.ar,
    enObjectives: defaultLists.objectives.en,
    arTargetAudience: defaultLists.targetAudience.ar,
    enTargetAudience: defaultLists.targetAudience.en,

    modules: [defaultModule],
  }); // ⬅️ دالة جلب المدربين

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/instructors");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const rawData = await res.json();

      // 💡 منطق التحقق المرن:
      let instructorsData: IInstructorOption[] = [];

      // السيناريو 1: الـ API يرجع كائن به success و data (الطريقة المفضلة)
      if (
        typeof rawData === "object" &&
        rawData !== null &&
        rawData.success &&
        Array.isArray(rawData.data)
      ) {
        instructorsData = rawData.data;
      }
      // السيناريو 2: الـ API يرجع مصفوفة المدربين مباشرةً (كما يبدو في كود الـ API القديم)
      else if (Array.isArray(rawData)) {
        instructorsData = rawData;
      }

      if (instructorsData.length > 0) {
        setInstructors(instructorsData as IInstructorOption[]);
      } else {
        console.warn(
          "API returned no instructors or the data structure was unexpected:",
          rawData
        );
        setInstructors([]);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      setInstructors([]);
    } finally {
      setLoadingInstructors(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []); // ⬅️ دالة معالجة إدخالات النصوص والقوائم المنسدلة

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === "number" ? value.toString() : value;

    if (name === "arCity") {
      const selectedCityAR = finalValue;
      const selectedCityEN = cityMap[selectedCityAR] || "";

      setFormData((prev) => ({
        ...prev,
        arCity: selectedCityAR,
        enCity: selectedCityEN,
      }));
    } else if (name === "arSection") {
      const selectedCategory = categoryMap.find((c) => c.ar === finalValue);
      setFormData((prev) => ({
        ...prev,
        arSection: finalValue,
        enSection: selectedCategory?.en || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  }; // ⬅️ دوال إدارة ملفات الصور

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // تحويل FileList إلى مصفوفة وتخزينها
      setImageFiles(Array.from(files));
    }
  };
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }; // ============================================================= // دوال إدارة الوحدات التعليمية (Modules) // =============================================================

  const handleAddModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: {
            ar: `الوحدة #${prev.modules.length + 1}`,
            en: `Module #${prev.modules.length + 1}`,
          },
          duration: { ar: "4 ساعات", en: "4 Hours" },
          arTopics: ["موضوع جديد بالعربية"],
          enTopics: ["New topic in English"],
        },
      ],
    }));
  };

  const handleRemoveModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const handleModuleChange = (
    index: number,
    field: "title" | "duration",
    lang: "ar" | "en",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === index
          ? {
              ...m,
              [field]: {
                ...m[field],
                [lang]: value,
              },
            }
          : m
      ),
    }));
  };

  const handleTopicChangeByLang = (
    index: number,
    lang: "ar" | "en",
    text: string
  ) => {
    const topicField = lang === "ar" ? "arTopics" : "enTopics";
    const topicsArray = text.split("\n").filter((t) => t.trim() !== "");

    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === index
          ? {
              ...m,
              [topicField]: topicsArray,
            }
          : m
      ),
    }));
  };

  const getSelectedCityDisplay = () => {
    if (!formData.arCity) {
      return "لم يتم اختيار أي مدينة";
    }
    return `${formData.arCity} (${formData.enCity})`;
  }; // ⬅️ دالة الإرسال (handleSubmit) المُحدَّثة مع منطق رفع الصور

  // =============================================================
  // 🚀 دالة الإرسال الرئيسية (handleSubmit)
  // =============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ message: "", type: null }); // 1. 🛑 التحقق من الحقول الأساسية

    if (
      !formData.arName ||
      !formData.enName ||
      !formData.arSlug ||
      !formData.enSlug ||
      !formData.arCity ||
      !formData.trainerId ||
      formData.modules.length === 0
    ) {
      setFeedback({
        message:
          "❌ يرجى ملء الحقول الأساسية المطلوبة (الاسم، الـ Slug، المدينة، المدرب، والوحدات).",
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    setFeedback({
      message: "⏳ جاري تجميع البيانات ورفع الصور. يرجى الانتظار...",
      type: null,
    });

    try {
      const dataToSend = new FormData(); // 2. 📝 بناء البيانات النصية (الـ Payload) // يتم بناء هذا الكائن ليطابق واجهة IRequestData في الـ API

      const coursePayload = {
        // ربط المدرب
        trainerId: formData.trainerId, // بيانات اللغة العربية

        ar: {
          name: formData.arName,
          nameSlug: formData.arSlug, // ... (استمر في إضافة جميع حقول اللغة العربية الأخرى)
          section: formData.arSection,
          city: formData.arCity,
          price: formData.price,
          duration: formData.arDuration,
          language: formData.arLanguage,
          description: formData.arDescription,
          certificate: formData.arCertificate,
          venue: formData.arVenue,
          importance: formData.arImportance,
          outcomes: formData.arOutcomes,
          services: formData.arServices,
          objectives: formData.arObjectives,
          includes: formData.arIncludes,
          modules: formData.modules.map((m) => ({
            title: m.title.ar,
            duration: m.duration.ar,
            topics: m.arTopics,
          })),
          targetAudience: formData.arTargetAudience,
        }, // بيانات اللغة الإنجليزية

        en: {
          name: formData.enName,
          nameSlug: formData.enSlug, // ... (استمر في إضافة جميع حقول اللغة الإنجليزية الأخرى)
          section: formData.enSection,
          city: formData.enCity,
          price: formData.price,
          duration: formData.enDuration,
          language: formData.enLanguage,
          description: formData.enDescription,
          certificate: formData.enCertificate,
          venue: formData.enVenue,
          importance: formData.enImportance,
          outcomes: formData.enOutcomes,
          services: formData.enServices,
          objectives: formData.enObjectives,
          includes: formData.enIncludes,
          modules: formData.modules.map((m) => ({
            title: m.title.en,
            duration: m.duration.en,
            topics: m.enTopics,
          })),
          targetAudience: formData.enTargetAudience,
        },
      }; // 3. 📦 إضافة البيانات إلى FormData // 3.1. إضافة البيانات النصية كـ JSON String تحت المفتاح 'courseData' (حل المشكلة 400)

      dataToSend.append("courseData", JSON.stringify(coursePayload)); // 3.2. إضافة ملفات الصور المتعددة تحت المفتاح 'images'

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          dataToSend.append("images", file);
        });
      } // 4. 📞 إرسال الطلب النهائي إلى API

      const res = await fetch("/api/courses", {
        method: "POST",
        body: dataToSend, // يحتوي على البيانات النصية والصور
      });

      const result = await res.json(); // 5. ❌ معالجة خطأ الـ API

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "فشل في حفظ الكورس في قاعدة البيانات."
        );
      } // 6. 🎉 النجاح

      setFeedback({
        message:
          "🎉 تم إنشاء الكورس بنجاح ورفع الصور وحفظها في قاعدة البيانات!",
        type: "success",
      }); // يمكنك هنا إعادة تعيين النموذج أو توجيه المستخدم // resetFormState();
      router.push(`/admin/courses/`);
    } catch (error: any) {
      console.error("Error during form submission:", error);
      setFeedback({
        message: `❌ خطأ في الإرسال: ${error.message}`,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const inputStyle =
    "w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner";
  const labelStyle = "block text-sm font-medium text-gray-400 mb-1";

  return (
    <div className="max-w-5xl p-6 mx-auto bg-gray-900 shadow-2xl rounded-2xl">
      <h1 className="mb-8 text-3xl font-bold text-center text-blue-400">
        <BookOpen className="inline-block w-6 h-6 mr-3" /> إضافة كورس جديد
      </h1>

      {feedback.message && (
        <div
          className={`p-4 mb-6 rounded-lg font-medium text-center ${
            feedback.type === "success"
              ? "bg-green-700 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================= العناوين والأوصاف ======================= */}
        <div className="p-5 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-gray-100 border-b border-gray-700">
            بيانات الكورس الأساسية
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* الاسم (العنوان) عربي */}
            <div>
              <label className={labelStyle}>الاسم (عربي)</label>
              <Input
                type="text"
                name="arName"
                placeholder="اسم الكورس بالعربية"
                value={formData.arName}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
            {/* الاسم (العنوان) انجليزي */}
            <div>
              <label className={labelStyle}>Name (English)</label>
              <Input
                type="text"
                name="enName"
                placeholder="Course Name (English)"
                value={formData.enName}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* حقول الـ SLUG */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Slug عربي */}
            <div>
              <label className={labelStyle}>
                <Globe className="inline w-4 h-4 mr-1 text-blue-300" /> Slug
                (عربي - بدون مسافات أو رموز)
              </label>
              <Input
                type="text"
                name="arSlug"
                placeholder="slug-arabi-yadawe"
                value={formData.arSlug}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
            {/* Slug انجليزي */}
            <div>
              <label className={labelStyle}>
                <Globe className="inline w-4 h-4 mr-1 text-blue-300" /> Slug
                (English - Lowercase, hyphenated)
              </label>
              <Input
                type="text"
                name="enSlug"
                placeholder="manual-english-slug"
                value={formData.enSlug}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>
          {/* نهاية حقول SLUG */}

          {/* الوصف عربي */}
          <div>
            <label className={labelStyle}>الوصف (عربي)</label>
            <Textarea
              name="arDescription"
              placeholder="الوصف التفصيلي بالعربية"
              value={formData.arDescription}
              onChange={handleChange}
              required
              rows={3}
              className={inputStyle}
            />
          </div>
          {/* الوصف انجليزي */}
          <div>
            <label className={labelStyle}>Description (English)</label>
            <Textarea
              name="enDescription"
              placeholder="Detailed description in English"
              value={formData.enDescription}
              onChange={handleChange}
              required
              rows={3}
              className={inputStyle}
            />
          </div>
        </div>

        {/* ======================= التفاصيل المالية واللوجستية ======================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* الفئة والسعر والمدة */}
          <div className="p-5 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
            <h2 className="flex items-center gap-2 pb-2 mb-4 text-lg font-semibold text-gray-100 border-b border-gray-700">
              <DollarSign className="w-5 h-5 text-yellow-400" /> المالية والفئة
            </h2>
            {/* السعر */}
            <div>
              <label className={labelStyle}>السعر / Price (نص)</label>
              <Input
                type="text"
                name="price"
                placeholder="مثل: £2,500"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
            {/* الفئة (Section) */}
            <div>
              <label className={labelStyle}>الفئة / Category</label>
              <select
                name="arSection"
                value={formData.arSection}
                onChange={handleChange}
                className={`${inputStyle} appearance-none cursor-pointer`}
                required
              >
                <option value="" disabled className="text-gray-500 bg-gray-700">
                  اختر الفئة
                </option>
                {categoryMap.map((cat) => (
                  <option key={cat.en} value={cat.ar} className="bg-gray-700">
                    {cat.ar}
                  </option>
                ))}
              </select>
            </div>
            {/* المدة (Duration) عربي */}
            <div>
              <label className={labelStyle}>المدة (عربي) / (مثل: 5 أيام)</label>
              <Input
                type="text"
                name="arDuration"
                placeholder="5 أيام"
                value={formData.arDuration}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
            {/* المدة الإنجليزية (Duration) */}
            <div>
              <label className={labelStyle}>Duration (English)</label>
              <Input
                type="text"
                name="enDuration"
                placeholder="5 Days"
                value={formData.enDuration}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>

          {/* معلومات الموقع */}
          <div className="p-5 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
            <h2 className="flex items-center gap-2 pb-2 mb-4 text-lg font-semibold text-gray-100 border-b border-gray-700">
              <MapPin className="w-5 h-5 text-red-400" /> الموقع
            </h2>

            {/* القائمة المنسدلة لاختيار مدينة واحدة */}
            <div className="p-2 space-y-2 border border-gray-700 rounded-md">
              <label className={labelStyle}>اختر المدينة:</label>
              {/* ملاحظة: المدينة الافتراضية "لندن" ستكون مختارة هنا */}
              <select
                name="arCity"
                value={formData.arCity}
                onChange={handleChange}
                className={`${inputStyle} appearance-none cursor-pointer`}
                required
              >
                <option value="" disabled className="text-gray-500 bg-gray-700">
                  اختر مدينة واحدة
                </option>
                {allCitiesAR.map((cityAR) => (
                  <option key={cityAR} value={cityAR} className="bg-gray-700">
                    {cityAR} ({cityMap[cityAR]})
                  </option>
                ))}
              </select>
            </div>

            {/* عرض المدينة المختارة (للتأكد) */}
            <div className="p-3 mt-4 bg-gray-700 rounded-md">
              <p className="mb-1 text-xs font-semibold text-blue-300">
                المدينة المختارة:
              </p>
              <p className="text-sm text-gray-200 break-words">
                {getSelectedCityDisplay()}
              </p>
            </div>

            {/* المكان (Venue) عربي */}
            <div>
              <label className={labelStyle}>المكان بالعربية (Venue)</label>
              <Input
                type="text"
                name="arVenue"
                placeholder="اسم القاعة/الفندق بالعربية"
                value={formData.arVenue}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
            {/* المكان (Venue) انجليزي */}
            <div>
              <label className={labelStyle}>Venue (English)</label>
              <Input
                type="text"
                name="enVenue"
                placeholder="Venue name in English"
                value={formData.enVenue}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          </div>
        </div>

        {/* ======================= القوائم (Lists) ======================= */}
        <div className="p-5 space-y-4 bg-gray-800 border border-gray-700 rounded-xl">
          <h2 className="flex items-center gap-2 pb-2 mb-4 text-lg font-semibold text-gray-100 border-b border-gray-700">
            <Tag className="w-5 h-5 text-purple-400" /> القوائم (افصل بسطر جديد)
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            يرجى إدخال العناصر لكل لغة في الحقل المخصص وفصل كل عنصر بسطر جديد
            (Enter).
          </p>

          {/* New Row for Target Audience */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 font-medium text-blue-400 md:col-span-2 text-md">
              <Users className="w-4 h-4" /> الجمهور المستهدف
            </div>
            {/* Target Audience (عربي) */}
            <div>
              <label className={labelStyle}>الجمهور المستهدف (عربي)</label>
              <Textarea
                name="arTargetAudience"
                value={formData.arTargetAudience}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Target Audience (انجليزي) */}
            <div>
              <label className={labelStyle}>Target Audience (English)</label>
              <Textarea
                name="enTargetAudience"
                value={formData.enTargetAudience}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
          </div>
          {/* End New Row for Target Audience */}

          {/* Includes & Outcomes */}
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Includes (عربي) */}
            <div>
              <label className={labelStyle}>ما تتضمنه (عربي)</label>
              <Textarea
                name="arIncludes"
                value={formData.arIncludes}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Includes (انجليزي) */}
            <div>
              <label className={labelStyle}>Includes (English)</label>
              <Textarea
                name="enIncludes"
                value={formData.enIncludes}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Outcomes (عربي) */}
            <div>
              <label className={labelStyle}>النتائج المتوقعة (عربي)</label>
              <Textarea
                name="arOutcomes"
                value={formData.arOutcomes}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Outcomes (انجليزي) */}
            <div>
              <label className={labelStyle}>Outcomes (English)</label>
              <Textarea
                name="enOutcomes"
                value={formData.enOutcomes}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
          </div>
          {/* Importance & Objectives */}
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Importance (عربي) */}
            <div>
              <label className={labelStyle}>أهمية الدورة (عربي)</label>
              <Textarea
                name="arImportance"
                value={formData.arImportance}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Importance (انجليزي) */}
            <div>
              <label className={labelStyle}>Importance (English)</label>
              <Textarea
                name="enImportance"
                value={formData.enImportance}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Objectives (عربي) */}
            <div>
              <label className={labelStyle}>الأهداف (عربي)</label>
              <Textarea
                name="arObjectives"
                value={formData.arObjectives}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Objectives (انجليزي) */}
            <div>
              <label className={labelStyle}>Objectives (English)</label>
              <Textarea
                name="enObjectives"
                value={formData.enObjectives}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
          </div>
          {/* Services & Certificate */}
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Services (عربي) */}
            <div>
              <label className={labelStyle}>الخدمات (عربي)</label>
              <Textarea
                name="arServices"
                value={formData.arServices}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Services (انجليزي) */}
            <div>
              <label className={labelStyle}>Services (English)</label>
              <Textarea
                name="enServices"
                value={formData.enServices}
                onChange={handleChange}
                rows={3}
                className={inputStyle}
              />
            </div>
            {/* Certificate (عربي) */}
            <div>
              <label className={labelStyle}>الشهادة (عربي)</label>
              <Input
                name="arCertificate"
                value={formData.arCertificate}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            {/* Certificate (انجليزي) */}
            <div>
              <label className={labelStyle}>Certificate (English)</label>
              <Input
                name="enCertificate"
                value={formData.enCertificate}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <section className="p-6 space-y-4 bg-gray-900 border border-gray-700 rounded-lg shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-400">
            <Users size={20} /> أختيار المدربين
          </h2>

          {/* 🧑‍🏫 Trainer Select */}
          <div className="mb-4">
            <label
              htmlFor="trainerId"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              المدرب المسؤول <span className="text-red-500">*</span>
            </label>

            {loadingInstructors ? (
              <p className="flex items-center gap-2 mt-1 text-gray-400">
                <Loader2 className="animate-spin" size={16} />
                جارٍ تحميل المدربين...
              </p>
            ) : (
              <select
                id="trainerId"
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                required
                disabled={submitting}
                className="block w-full p-2 mt-1 text-gray-200 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="" className="text-gray-400">
                  -- اختر المدرب --
                </option>

                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name_en}
                  </option>
                ))}
              </select>
            )}

            {instructors.length === 0 && !loadingInstructors && (
              <p className="mt-1 text-sm text-red-500">
                لا يوجد مدربون متاحون حالياً.
              </p>
            )}
          </div>
        </section>
        {/* ======================= الوحدات التعليمية (Modules) ======================= */}
        <div className="p-5 space-y-6 bg-gray-800 border border-yellow-700 rounded-xl">
          <div className="flex items-center justify-between pb-2 border-b border-gray-700">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-yellow-400">
              <BookOpen className="w-5 h-5" /> الوحدات التعليمية (
              {formData.modules.length})
            </h2>
            <button
              type="button"
              onClick={handleAddModule}
              className="flex items-center gap-1 text-sm text-green-400 transition-colors hover:text-green-300"
            >
              <PlusCircle className="w-4 h-4" /> إضافة وحدة
            </button>
          </div>

          <div className="space-y-8">
            {formData.modules.map((module, index) => (
              <div
                key={index}
                className="relative p-4 bg-gray-900 border border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-100">
                    الوحدة رقم {index + 1}
                  </h3>
                  {formData.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(index)}
                      className="p-1 text-red-500 transition-colors rounded-full hover:text-red-400"
                      title="حذف الوحدة"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* حقول العنوان والمدة */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelStyle}>عنوان الوحدة (عربي)</label>
                    <Input
                      type="text"
                      placeholder="عنوان الوحدة"
                      value={module.title.ar}
                      onChange={(e) =>
                        handleModuleChange(index, "title", "ar", e.target.value)
                      }
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Module Title (English)</label>
                    <Input
                      type="text"
                      placeholder="Module Title"
                      value={module.title.en}
                      onChange={(e) =>
                        handleModuleChange(index, "title", "en", e.target.value)
                      }
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                  <div>
                    <label className={labelStyle}>مدة الوحدة (عربي)</label>
                    <Input
                      type="text"
                      placeholder="مدة الوحدة"
                      value={module.duration.ar}
                      onChange={(e) =>
                        handleModuleChange(
                          index,
                          "duration",
                          "ar",
                          e.target.value
                        )
                      }
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      Module Duration (English)
                    </label>
                    <Input
                      type="text"
                      placeholder="Module Duration"
                      value={module.duration.en}
                      onChange={(e) =>
                        handleModuleChange(
                          index,
                          "duration",
                          "en",
                          e.target.value
                        )
                      }
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* حقول المواضيع (مفصولة) */}
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                  {/* المواضيع بالعربية */}
                  <div>
                    <label className={labelStyle}>
                      المواضيع (عربي) - (افصل بسطر جديد)
                    </label>
                    <Textarea
                      placeholder="أدخل كل موضوع عربي في سطر جديد"
                      value={module.arTopics.join("\n")}
                      onChange={(e) =>
                        handleTopicChangeByLang(index, "ar", e.target.value)
                      }
                      rows={4}
                      className={inputStyle}
                    />
                  </div>
                  {/* المواضيع بالإنجليزية */}
                  <div>
                    <label className={labelStyle}>
                      Topics (English) - (New line separated)
                    </label>
                    <Textarea
                      placeholder="Enter each English topic on a new line"
                      value={module.enTopics.join("\n")}
                      onChange={(e) =>
                        handleTopicChangeByLang(index, "en", e.target.value)
                      }
                      rows={4}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
                     
          <label
            htmlFor="images-upload"
            className="block text-sm font-medium text-gray-700"
          >
            رفع صور الكورس (يمكن اختيار أكثر من صورة)
          </label>
                     
          <Input
            type="file"
            id="images-upload"
            name="images"
            multiple // ⬅️ تفعيل اختيار ملفات متعددة
            accept="image/*" // قبول ملفات الصور فقط
            onChange={handleImageFileChange}
          />
          {/* 🖼️ معاينة الصور المختارة 🖼️ */}
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 mt-2 border rounded-md bg-gray-50">
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 overflow-hidden border rounded-md"
                >
                  {/* استخدام URL.createObjectURL لعرض المعاينة قبل الرفع */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 text-xs leading-none text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================= زر الإرسال ======================= */}
        <button
          type="submit"
          className="flex items-center justify-center w-full gap-3 py-3 mt-8 font-bold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
          disabled={submitting}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {submitting ? "جاري الإرسال..." : "إضافة الكورس"}
        </button>
      </form>
    </div>
  );
}
function setLoadingInstructors(arg0: boolean) {
  throw new Error("Function not implemented.");
}
