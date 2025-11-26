"use client";

import Link from "next/link";
import {
  Image,
  Camera,
  Building2,
  BadgeCheck,
  LinkIcon,
  MapPin,
  User,
} from "lucide-react";

export default function AdminDashboardPage() {
  const cards = [
    {
      title: "Home Images",
      description: "إدارة صور الصفحة الرئيسية",
      href: "/admin/home/home-images",
      icon: <Image className="w-8 h-8 text-blue-400" />,
      color: "bg-blue-950 hover:bg-blue-900",
    },

    {
      title: "Moments",
      description: "إدارة لحظات الأكاديمية",
      href: "/admin/home/moments",
      icon: <Camera className="w-8 h-8 text-purple-400" />,
      color: "bg-purple-950 hover:bg-purple-900",
    },
    {
      title: "Leading Companies",
      description: "الشركات الرائدة المتعاونة",
      href: "/admin/home/leading-companies",
      icon: <Building2 className="w-8 h-8 text-green-400" />,
      color: "bg-green-950 hover:bg-green-900",
    },
    {
      title: "Accreditations",
      description: "الاعتمادات والشهادات",
      href: "/admin/home/accreditations",
      icon: <BadgeCheck className="w-8 h-8 text-yellow-400" />,
      color: "bg-yellow-950 hover:bg-yellow-900",
    },
    {
      title: "Cities Images",
      description: "إدارة صور المدن",
      href: "/admin/home/cities",
      icon: <MapPin className="w-8 h-8 text-cyan-400" />,
      color: "bg-cyan-950 hover:bg-cyan-900",
    },
    {
      title: "General Links",
      description: "إدارة الروابط العامة للموقع",
      href: "/admin/home/generalLinks",
      icon: <LinkIcon className="w-8 h-8 text-pink-400" />,
      color: "bg-pink-950 hover:bg-pink-900",
    },
    {
      title: "Instructors",
      description: "إدارة المدربين",
      href: "/admin/home/instructors",
      icon: <User className="w-8 h-8 text-teal-400" />,
      color: "bg-teal-950 hover:bg-teal-900",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-12 text-gray-100 bg-gray-950">
      <h1 className="mb-10 text-3xl font-bold text-center text-blue-400">
        لوحة التحكم الإدارية
      </h1>

      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`rounded-2xl ${card.color} transition duration-300 p-6 shadow-lg border border-gray-800 hover:scale-105 flex flex-col items-center justify-center text-center`}
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="mb-2 text-xl font-semibold">{card.title}</h2>
            <p className="text-sm text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
