import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import mongoose from "mongoose";

// تأكد من استيراد الموديلات لضمان تسجيلها في Mongoose
// 🚨 هذا هو ملف تعريف الكورس والمدرب (يجب أن يكون المسار صحيحاً)
import "@/lib/db/models/courses";
import "@/lib/db/models/instructors";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. تأكيد الاتصال
    await connectDB(); // 2. ✅ تعريف الموديل داخل الدالة لضمان توفره بعد الاتصال

    const Course = mongoose.models.Course || mongoose.model("Course");

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    } // 3. 🔍 الاستعلام الأساسي (بدون Populate للاختبار) // إذا نجح هذا الاستعلام، فالمشكلة تكمن في موديل Instructors

    const course = await Course.findOne({
      $or: [
        { "slug.ar": slug.toLowerCase().trim() },
        { "slug.en": slug.toLowerCase().trim() },
      ],
    });
    // .populate("trainer"); // 🛑 تم تعطيل هذا السطر مؤقتاً للاختبار!

    if (!course) {
      // سيتم طباعة هذا الخطأ إذا فشل الاستعلام الأساسي
      console.error(`❌ Mongoose failed to find document for slug: ${slug}`);
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error: any) {
    console.error("Get Course By Slug Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
