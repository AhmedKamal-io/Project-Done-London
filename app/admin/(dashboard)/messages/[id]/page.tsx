"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, User, Mail, Phone } from "lucide-react";

interface IBooking {
  _id: string;
  date: string;
  city: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/messages/${id}`);
        const data = await res.json();
        setBooking(data.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        جارٍ تحميل تفاصيل الحجز...
      </div>
    );

  if (!booking)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        لم يتم العثور على الحجز
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <button
        onClick={() => router.back()}
        className="mb-6 text-indigo-400 hover:underline text-sm"
      >
        ← رجوع إلى جميع الحجوزات
      </button>

      <div className="bg-gray-800 shadow-2xl rounded-xl p-8 max-w-3xl mx-auto border-l-4 border-indigo-500">
        {/* عنوان */}
        <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
          <Calendar className="w-8 h-8 text-indigo-500 mr-3" />
          <h2 className="text-2xl font-bold text-white">تفاصيل الحجز</h2>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200">
          {/* قسم تفاصيل الموعد */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-indigo-400 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> تفاصيل الموعد
            </h3>

            <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md">
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span className="font-semibold">تاريخ الحجز:</span> {booking.date}
            </p>

            <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md">
              <MapPin className="w-4 h-4 text-indigo-300" />
              <span className="font-semibold">المدينة:</span> {booking.city}
            </p>

            <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md text-sm text-gray-400">
              <span className="font-semibold">وقت إنشاء الطلب:</span>{" "}
              {new Date(booking.createdAt).toLocaleString("ar-EG", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          {/* قسم بيانات العميل */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-indigo-400 flex items-center gap-2">
              <User className="w-5 h-5" /> بيانات العميل
            </h3>

            <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md">
              <User className="w-4 h-4 text-indigo-300" />
              <span className="font-semibold">الاسم الكامل:</span>{" "}
              {booking.name}
            </p>

            <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md">
              <Mail className="w-4 h-4 text-indigo-300" />
              <span className="font-semibold">البريد الإلكتروني:</span>{" "}
              {booking.email}
            </p>

            {booking.phone && (
              <p className="flex items-center gap-2 bg-gray-700 p-3 rounded-md">
                <Phone className="w-4 h-4 text-indigo-300" />
                <span className="font-semibold">رقم الهاتف:</span>{" "}
                {booking.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
