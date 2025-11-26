"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Upload, Trash2, ImageIcon } from "lucide-react";

export default function CitiesMediaUploader() {
  const [citiesMedia, setCitiesMedia] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploadingCity, setUploadingCity] = useState<string | null>(null);

  const cities = [
    "roma",
    "london",
    "venice",
    "dubai",
    "paris",
    "istanbul",
    "madrid",
    "barcelona",
  ];

  // جلب بيانات المدن الحالية
  const fetchCitiesMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/uploads/cities");
      const data = await res.json();
      setCitiesMedia(data || {});
    } catch (error) {
      console.error("❌ Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesMedia();
  }, []);

  // رفع صورة لمدينة معينة
  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    city: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCity(city);

    const formData = new FormData();
    formData.append("city", city);
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads/cities", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      await fetchCitiesMedia();
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setUploadingCity(null);
    }
  };

  // حذف صورة مدينة
  const handleDelete = async (city: string) => {
    if (!confirm(`هل أنت متأكد من حذف صورة ${city}?`)) return;

    try {
      const res = await fetch("/api/uploads/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchCitiesMedia();
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  return (
    <div className="bg-[#0b0b0f] min-h-screen text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Cities Media Manager
      </h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const media = citiesMedia?.[city];
            const hasImage = media?.media_url;

            return (
              <div
                key={city}
                className="bg-[#14141a] rounded-2xl p-5 shadow-md flex flex-col items-center justify-between"
              >
                <h2 className="text-lg capitalize font-semibold mb-4">
                  {city}
                </h2>

                {hasImage ? (
                  <div className="w-full aspect-video overflow-hidden rounded-xl mb-4">
                    <img
                      src={media.media_url}
                      alt={`${city} preview`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center border border-gray-700 rounded-xl mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-600" />
                  </div>
                )}

                <div className="flex gap-3">
                  <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl cursor-pointer transition">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">
                      {uploadingCity === city ? "جارٍ الرفع..." : "رفع صورة"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e, city)}
                      accept="image/*"
                      disabled={uploadingCity === city}
                    />
                  </label>

                  {hasImage && (
                    <button
                      onClick={() => handleDelete(city)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-sm">حذف</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
