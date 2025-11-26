"use client";

import { useEffect, useState } from "react";
import { LinkIcon, Save, Trash2, RefreshCcw, Loader2 } from "lucide-react";

interface GeneralLinks {
  _id?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// قائمة بجميع مفاتيح الروابط
const LINK_KEYS: (keyof GeneralLinks)[] = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
];

// تسميات عربية للمفاتيح
const KEY_LABELS: { [key in keyof GeneralLinks]?: string } = {
  facebook: "فيسبوك (Facebook)",
  instagram: "إنستغرام (Instagram)",
  twitter: "تويتر / إكس (Twitter/X)",
  linkedin: "لينكدإن (LinkedIn)",
  youtube: "يوتيوب (YouTube)",
};

export default function GeneralLinksDashboard() {
  const [links, setLinks] = useState<GeneralLinks>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 1. جلب الروابط - تم التعديل لمعالجة كائن واحد مباشر
  const fetchLinks = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/uploads/generalLinks");
      const data = (await res.json()) as GeneralLinks | { message?: string }; // نتوقع كائن الروابط أو رسالة خطأ

      if (!res.ok) {
        // تحقق من وجود رسالة خطأ في الجسم قبل استخدامها
        const errMsg =
          typeof data === "object" &&
          data &&
          "message" in data &&
          (data as any).message
            ? (data as any).message
            : "Failed to fetch links on server";
        throw new Error(errMsg);
      }

      // الـ API تُرجع كائن الروابط مباشرة، حتى لو كانت فارغة
      setLinks(data as GeneralLinks);
    } catch (error: any) {
      setMessage(
        "❌ فشل في تحميل الروابط: " + (error.message || "خطأ غير معروف")
      );
      setLinks({}); // في حالة الفشل، نبدأ بكائن فارغ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // 2. تحديث الحالة عند الكتابة
  const handleChange = (key: keyof GeneralLinks, value: string) => {
    setLinks((prev) => ({
      ...prev,
      [key]: value.trim() === "" ? null : value, // حفظ null إذا كان فارغًا
    }));
  };

  // 3. حفظ كل الروابط (POST فقط) - تم التعديل لمعالجة كائن واحد مباشر
  const handleSaveAll = async () => {
    setLoading(true);
    setMessage("");

    const apiUrl = "/api/uploads/generalLinks";
    const payload = links;

    try {
      const res = await fetch(apiUrl, {
        method: "POST", // POST مع Upsert
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // الـ API Route ترجع { message, links: GeneralLinks object }
      const data: { message: string; links: GeneralLinks } = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || `خطأ في POST (الحالة ${res.status})`;
        throw new Error(errorMsg);
      }

      // تحديث الحالة بالبيانات المرتجعة (تضمن وجود الـ _id الجديد)
      if (data.links) {
        setLinks(data.links);
      }

      setMessage("✅ تم حفظ جميع الروابط بنجاح.");
    } catch (error: any) {
      setMessage("❌ فشل الحفظ: " + (error.message || "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  // 4. حذف كل الروابط
  const handleDelete = async () => {
    // التحقق من وجود ID ليس شرطًا صارمًا للحذف الكلي،
    // ولكن يُبقي واجهة المستخدم واضحة
    if (Object.keys(links).length === 0 || !links._id) {
      setMessage("⚠️ لا توجد روابط محفوظة للحذف.");
      setShowDeleteConfirm(false);
      return;
    }

    const apiUrl = `/api/uploads/generalLinks`;

    setLoading(true);
    setMessage("");
    setShowDeleteConfirm(false);

    try {
      const res = await fetch(apiUrl, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLinks({}); // تفريغ الحالة بعد الحذف
      setMessage("✅ تم حذف جميع الروابط بنجاح.");
    } catch (error: any) {
      setMessage("❌ فشل الحذف: " + (error.message || "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-950 text-gray-100 p-8 rounded-2xl shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-400 border-b border-gray-800 pb-3">
        <LinkIcon className="w-7 h-7" /> إدارة الروابط العامة
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-4 text-blue-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          جارٍ التحميل...
        </div>
      )}

      {/* حقول الإدخال */}
      <div className="space-y-5">
        {LINK_KEYS.map((key) => (
          <div
            key={key}
            className="bg-gray-900 p-4 rounded-lg flex flex-col border border-gray-800"
          >
            <label
              htmlFor={key}
              className="font-semibold text-gray-300 mb-1 capitalize"
            >
              {KEY_LABELS[key] || key}
            </label>
            <input
              id={key}
              value={(links[key] as string) || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder={`أدخل رابط ${
                KEY_LABELS[key] || key
              } كاملاً (مثال: https://...)`}
              type="url"
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-1">
              الرابط الحالي: {(links[key] as string) || "لا يوجد رابط محدد"}
            </p>
          </div>
        ))}
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}{" "}
          حفظ الكل
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={loading || !links._id}
          className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" /> حذف الكل
        </button>

        <button
          onClick={fetchLinks}
          disabled={loading}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCcw className="w-5 h-5" /> إعادة تحميل
        </button>
      </div>

      {/* تأكيد الحذف - بديل لـ window.confirm */}
      {showDeleteConfirm && (
        <div className="mt-6 p-4 rounded-lg border border-red-700 bg-red-900 text-red-100">
          <p className="font-bold mb-3">تأكيد الحذف:</p>
          <p className="mb-4">
            هل أنت متأكد أنك تريد حذف **جميع** الروابط المحفوظة؟ هذا الإجراء لا
            يمكن التراجع عنه.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold transition"
            >
              تأكيد الحذف
            </button>
          </div>
        </div>
      )}

      {/* رسائل التنبيه */}
      {message && (
        <p
          className={`mt-6 p-3 rounded-lg text-center font-medium border ${
            message.startsWith("✅")
              ? "text-green-400 bg-green-900 border-green-700"
              : message.startsWith("❌")
              ? "text-red-400 bg-red-900 border-red-700"
              : "text-yellow-400 bg-yellow-900 border-yellow-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
