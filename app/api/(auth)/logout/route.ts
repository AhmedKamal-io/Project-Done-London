import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * معالج طلب POST لتسجيل الخروج.
 * يقوم بحذف الكوكي الخاص بالمصادقة.
 */
export async function POST() {
  // لحذف الكوكي، نستخدم نفس الاسم ('admin_auth_token') ونعيّن تاريخ انتهائه في الماضي (new Date(0)).
  cookies().set("admin_auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // تاريخ انتهاء صلاحية ماضٍ
    path: "/", // يجب أن يتطابق مع الـ path المستخدم عند إنشاء الكوكي في /api/login
  });

  return NextResponse.json({ success: true, message: "Logout successful" });
}
