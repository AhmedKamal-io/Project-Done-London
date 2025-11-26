"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  FileText,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import Logout from "@/app/admin/components/Logout";

// Placeholder for admin details (you'd likely fetch this from an auth context)
const adminInfo = {
  name: "Admin",
  role: "London Academy",
  avatarUrl: "/placeholder-avatar.jpg", // Replace with a real image path or use a component like <User size={40} />
};

const links = [
  { href: "/admin/", label: "Home Page", icon: Home },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
  },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  // Add more links here if needed to test the scroll
  // { href: "/admin/users", label: "Users", icon: User },
  // { href: "/admin/settings", label: "Settings", icon: Home },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 shadow-md flex flex-col border-e border-gray-200 h-screen">
      {" "}
      {/* h-screen added to ensure scrolling works */}
      {/* 1. Header & Admin Info */}
      <div>
        {/* الشعار - Logo */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600 text-center">
            Admin Dashboard
          </h2>
        </div>

        {/* معلومات الادمن - Admin Info */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          {/* الافتار - Avatar */}
          {/* Note: I'm using a placeholder <User /> icon here. If you have an image, replace this block with an <img> tag */}
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
            <User size={20} />
            {/* If you have a real image:
            <img src={adminInfo.avatarUrl} alt={adminInfo.name} className="w-full h-full object-cover rounded-full" /> */}
          </div>

          {/* الاسم والرتبة - Name and Role */}
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">
              {adminInfo.name}
            </p>
            <p className="text-xs text-gray-300">{adminInfo.role}</p>
          </div>
        </div>
      </div>
      {/* 2. Sticky/Scrollable Navigation Content */}
      {/* Added `flex-1 overflow-y-auto` to make this area take up remaining space and allow scrolling */}
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-4 flex flex-col gap-1 pb-4">
          {" "}
          {/* pb-4 for bottom padding before scroll ends */}
          {links.map(({ href, label, icon: Icon }) => {
            // Check for active link: exact match or if current path starts with the link's href (for nested routes)
            const active =
              pathname === href ||
              (pathname.startsWith(href) && href !== "/admin/");

            // Adjust active check for the base admin path
            const isActive =
              href === "/admin/"
                ? pathname === "/admin/" || pathname === "/admin"
                : active;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-5 py-2 text-white hover:bg-blue-200 hover:text-blue-800 transition-colors",
                  isActive && "bg-blue-100 text-blue-700 font-semibold"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* 3. Log Out Button (Fixed at the bottom) */}
      <div className="border-t border-gray-100 p-4 flex-shrink-0">
        {" "}
        {/* flex-shrink-0 keeps it from being pushed up */}
        <button className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors w-full">
          <Logout />
        </button>
      </div>
    </aside>
  );
}
