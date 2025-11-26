"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Trash2,
  Video,
  Image,
  Loader,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

//  متغير ثابت لمسار API Route
const API_MOMENTS_PATH = "/api/uploads/moments";

// =======================================================
// تعاريف TypeScript للبيانات
// =======================================================

interface Media {
  url: string;
  public_id: string;
  type: "image" | "video";
}

interface Moment {
  _id: string;
  title: string;
  description: string;
  media: Media[];
  createdAt: string;
}

// =======================================================
//  مكون فرعي: MediaPreview
// =======================================================
const MediaPreview = ({ media }: { media: Media }) => (
  <div className="relative w-full h-32 overflow-hidden rounded-t-lg bg-gray-700">
    {media.type === "image" ? (
      <img
        src={media.url}
        alt="Moment Image"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <video
        src={media.url}
        controls={false}
        autoPlay={true}
        muted={true}
        loop={true}
        className="w-full h-full object-cover"
      />
    )}
    <div className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full text-white text-xs">
      {media.type === "image" ? <Image size={14} /> : <Video size={14} />}
    </div>
  </div>
);

// =======================================================
// المكون الرئيسي: MomentsAdminPage
// =======================================================

export default function MomentsAdminPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const fetchMoments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_MOMENTS_PATH, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch moments");
      }
      const data: Moment[] = await response.json();
      setMoments(data);
    } catch (err: any) {
      showNotification(err.message || "Error fetching moments", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!title || !files || files.length === 0) {
      showNotification(
        "Please provide a title and select at least one file.",
        "error"
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    try {
      const response = await fetch(API_MOMENTS_PATH, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();

      setMoments((prev) => [result.data, ...prev]);
      setTitle("");
      setDescription("");
      setFiles(null);
      (document.getElementById("media-upload") as HTMLInputElement).value = "";
      showNotification("Moment uploaded successfully!", "success");
    } catch (err: any) {
      showNotification(
        err.message || "An unknown error occurred during upload.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this moment and all its media from Cloudinary?"
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(API_MOMENTS_PATH, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      setMoments((prev) => prev.filter((moment) => moment._id !== id));
      showNotification("Moment deleted successfully!", "success");
    } catch (err: any) {
      showNotification(
        err.message || "An unknown error occurred during deletion.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------
  // واجهة المستخدم المُحسنة (مُحمل داخلي)
  // ------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <h1 className="text-4xl font-extrabold mb-10 border-b border-gray-700 pb-4 text-indigo-400">
        إدارة اللحظات (صور وفيديوهات)
      </h1>

      {/*  منطقة التحميل/الإشعار المُحسنة */}
      {isLoading && (
        <div className="flex items-center justify-center p-3 mb-4 bg-indigo-900/40 border border-indigo-700 rounded-lg shadow-lg">
          <Loader className="animate-spin text-indigo-400 h-5 w-5 ml-3" />
          <span className="text-sm font-medium text-indigo-300">
            جاري معالجة طلبك، الرجاء الانتظار...
          </span>
        </div>
      )}

      {/* منطقة الإشعارات */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-4 flex items-center shadow-lg">
          <AlertTriangle className="ml-2 h-5 w-5" />
          <span>خطأ: {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative mb-4 flex items-center shadow-lg">
          <CheckCircle className="ml-2 h-5 w-5" />
          <span>نجاح: {success}</span>
        </div>
      )}

      {/* 1. نموذج الرفع */}
      <div className="bg-gray-800 shadow-2xl rounded-xl p-6 mb-10 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">
          رفع لحظة جديدة
        </h2>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              العنوان
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              الوصف
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="media-upload"
              className="block text-sm font-medium text-gray-300"
            >
              الملفات (صور أو فيديوهات)
            </label>
            <input
              id="media-upload"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              accept="image/*,video/*"
              required
              className="mt-2 block w-full text-sm text-gray-300
                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                      file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-indigo-400"
          >
            <Upload className="ml-2 h-4 w-4" />
            {isLoading ? "جاري الرفع..." : "رفع وحفظ"}
          </button>
        </form>
      </div>

      {/* 2. عرض اللحظات */}
      <h2 className="text-2xl font-semibold mb-6 text-white">
        اللحظات الحالية ({moments.length})
      </h2>

      {moments.length === 0 && !isLoading && !error && (
        <p className="text-gray-400">لا توجد لحظات لعرضها.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {moments.map((moment) => (
          <div
            key={moment._id}
            className="bg-gray-800 shadow-xl rounded-xl overflow-hidden transition transform hover:scale-[1.03] hover:shadow-indigo-500/30 border border-gray-700"
          >
            {moment.media.length > 0 && (
              <MediaPreview media={moment.media[0]} />
            )}

            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">
                {moment.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                {moment.description || "لا يوجد وصف."}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                تاريخ الإنشاء: {new Date(moment.createdAt).toLocaleDateString()}
              </p>

              {/* زر الحذف */}
              <button
                onClick={() => handleDelete(moment._id)}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:bg-red-400"
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف اللحظة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
