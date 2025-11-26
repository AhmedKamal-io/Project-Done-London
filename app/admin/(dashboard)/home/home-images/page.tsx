"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Image, Upload, Trash2, List } from "lucide-react";

interface IMediaItem {
  media_url: string;
  public_id: string;
  _id?: string;
}

export default function HomeMediaUploader() {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaList, setMediaList] = useState<IMediaItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchMediaList = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/uploads/homeMedia/");
      if (!res.ok) throw new Error("Failed to fetch media list");

      const data = await res.json();
      const newMediaList: IMediaItem[] = data.images || [];
      setMediaList(newMediaList);
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("❌ فشل في تحميل الوسائط.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteMedia = async (public_id: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه الصورة؟")) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/uploads/homeMedia", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشلت عملية الحذف");

      setMessage("✅ تم حذف الصورة بنجاح.");
      fetchMediaList();
    } catch (error: any) {
      setMessage("❌ فشلت عملية الحذف: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setMessage("الرجاء تحديد صور جديدة للرفع.");
      return;
    }

    setLoading(true);
    setMessage("جاري الرفع...");

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("homeMedia", img));

      const res = await fetch("/api/uploads/homeMedia/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل رفع الصور");

      setMessage(data.message || `✅ تم رفع ${data.count || 0} صورة بنجاح.`);
      fetchMediaList();
      setImages([]);
      setPreviewUrls([]);
    } catch (error: any) {
      setMessage("❌ فشل الرفع: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaList();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-gray-950 text-gray-100 p-8 rounded-2xl shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-blue-400 border-b border-gray-800 pb-3">
        <Image className="w-7 h-7" /> الإدارة المركزية للصور
      </h2>

      {/* رفع الوسائط */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <label className="flex items-center gap-2 text-gray-200 font-semibold mb-3">
            <Upload className="w-5 h-5 text-blue-400" /> رفع صور جديدة
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-700 bg-gray-950 text-gray-100 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-150"
          />

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-800 shadow-md hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || isFetching}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition duration-150 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {loading ? "جاري الرفع..." : "رفع وحفظ الصور"}
        </button>

        {message && (
          <p
            className={`mt-3 p-3 rounded-lg text-center font-medium border ${
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
      </form>

      {/* عرض الصور */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-200">
          <List className="w-6 h-6 text-blue-400" /> الصور المرفوعة{" "}
          <span className="text-gray-500 text-base">({mediaList.length})</span>
        </h3>

        {isFetching ? (
          <div className="text-center text-gray-400 py-8">
            جاري تحميل الصور...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
            لا توجد صور مرفوعة بعد.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {mediaList.map((item) => (
              <div
                key={item.public_id}
                className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group shadow-md hover:shadow-lg transition duration-300"
              >
                <img
                  src={item.media_url}
                  alt="Media"
                  className="w-full h-32 object-cover group-hover:opacity-80 transition duration-300"
                />
                <button
                  onClick={() => handleDeleteMedia(item.public_id)}
                  disabled={loading}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-500 disabled:opacity-50 shadow-md"
                  title="حذف الصورة"
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
