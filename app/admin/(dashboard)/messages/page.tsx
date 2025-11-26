"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Clock } from "lucide-react";

interface MessageType {
  _id: string;
  name: string; // اسم كامل
  email: string;
  phone?: string;
  trainingCity: string;
  message: string;
  veiwed: boolean; // هل تم قراءتها
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    if (!confirm("هل تريد حذف هذه الرسالة؟")) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("تم حذف الرسالة بنجاح");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } else {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const markAsViewed = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ veiwed: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, veiwed: true } : m))
        );
        return true;
      } else {
        alert("حدث خطأ أثناء تحديث حالة الرسالة");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث حالة الرسالة");
      return false;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        جارٍ التحميل...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <Mail className="w-6 h-6 text-indigo-400" />
        جميع الرسائل
      </h1>

      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">لا توجد رسائل حالياً</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 shadow-md rounded-xl">
            <thead>
              <tr className="bg-gray-700 text-gray-200 text-sm">
                <th className="p-3 text-right">الاسم</th>
                <th className="p-3 text-right">البريد الإلكتروني</th>
                <th className="p-3 text-right">المدينة</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">التاريخ</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className={`border-b hover:bg-gray-700 ${
                    msg.veiwed ? "text-gray-400" : "font-semibold text-white"
                  }`}
                >
                  <td className="p-3">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3">{msg.trainingCity}</td>
                  <td className="p-3 flex items-center gap-1">
                    {msg.veiwed ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        تمت قراءتها
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-400" />
                        جديدة
                      </>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(msg.createdAt).toLocaleString("ar-EG")}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/messages/${msg._id}`}
                      onClick={async (e) => {
                        e.preventDefault();

                        const success = await markAsViewed(msg._id);
                        if (success) {
                          window.location.href = `/admin/messages/${msg._id}`;
                        }
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      عرض
                    </Link>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
