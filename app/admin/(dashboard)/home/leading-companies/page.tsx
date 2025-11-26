"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { PlusCircle, Trash2, List, Upload, FileText } from "lucide-react";

interface IAccreditation {
  _id: string;
  name_ar: string;
  name_en: string;
  logo: {
    url: string;
    public_id: string;
  } | null;
}

export default function LeadingCompaniesAdmin() {
  const [accredits, setAccredits] = useState<IAccreditation[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------------- Fetch Data ----------------
  const fetchLeadingCompanies = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/uploads/leading-companies");
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      const data = await res.json();
      setAccredits(data);
    } catch (error) {
      console.error(error);
      setMessage("فشل في تحميل البيانات");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLeadingCompanies();
  }, []);

  // ---------------- File Change ----------------
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !logoFile) {
      setMessage("يرجى إدخال الاسم والشعار");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name_ar", nameAr);
      formData.append("name_en", nameEn);
      formData.append("logo", logoFile);

      const res = await fetch("/api/uploads/leading-companies", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل الإضافة");

      setMessage("تمت إضافة جهة الاعتماد بنجاح");
      setNameAr("");
      setNameEn("");
      setLogoFile(null);
      setLogoPreview(null);
      fetchLeadingCompanies();
    } catch (error: any) {
      setMessage("فشل الإضافة: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف جهة الاعتماد: ${name}؟`)) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/uploads/leading-companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل الحذف");

      setMessage("تم حذف جهة الاعتماد بنجاح");
      fetchLeadingCompanies();
    } catch (error: any) {
      setMessage("فشل الحذف: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-950 text-gray-100 rounded-2xl border border-gray-800 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-indigo-400 border-b border-gray-800 pb-3">
        <FileText className="w-7 h-7" /> إدارة الشركات المتعاونه
      </h2>

      {/* Add Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 mb-12 bg-gray-900 p-6 rounded-xl border border-gray-800"
      >
        <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-400" /> إضافة شركه متعاونه
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="الاسم بالعربية"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
            required
          />
          <input
            type="text"
            placeholder="Name in English"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
            required
          />
        </div>

        <div className="bg-gray-950 p-4 rounded-lg border border-gray-700">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            شعار الشركه (صورة)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-150"
            required={!logoPreview}
            disabled={loading}
          />
          {logoPreview && (
            <div className="mt-4 flex items-center gap-4">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-16 w-16 object-contain border border-gray-700 rounded-lg p-1"
              />
              <p className="text-sm text-gray-400">الشعار جاهز للرفع.</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || isFetching}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-xl transition duration-150 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {loading ? "جاري الإضافة والرفع..." : "إضافة شعار الشركه"}
        </button>

        {message && (
          <p
            className={`mt-3 p-3 rounded-lg text-center font-medium border ${
              message.startsWith("تمت")
                ? "text-green-400 bg-green-900 border-green-700"
                : "text-red-400 bg-red-900 border-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* List */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-200">
          <List className="w-6 h-6 text-indigo-400" /> شركات التعاون الحاليه (
          {accredits.length})
        </h3>

        {isFetching ? (
          <div className="text-center text-gray-400 py-10 bg-gray-900 rounded-xl border border-gray-800">
            جاري تحميل البيانات...
          </div>
        ) : accredits.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
            لا توجد جهات شركات مسجلة بعد.
          </div>
        ) : (
          <div className="space-y-4">
            {accredits.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800 hover:bg-gray-800 transition duration-200"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.logo?.url || ""}
                    alt={item.name_en}
                    className="w-12 h-12 object-contain border border-gray-700 rounded-lg p-1"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-100">
                      {item.name_ar}
                    </p>
                    <p className="text-sm text-gray-400">{item.name_en}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item._id, item.name_ar)}
                  disabled={loading}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-150 disabled:opacity-50 shadow-md flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
