// 🛠️ ملف: app/api/courses/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import mongoose, { Types } from "mongoose";
// ⬅️ يجب استيراد Cloudinary وتكوينه في lib/cloudinary.ts
import cloudinary from "@/lib/cloudinary";
import "@/lib/db/models/courses";

import "@/lib/db/models/instructors"; // ⬅️ مهم
// افتراض أن هذا هو موديل الكورس
const Course = mongoose.models.Course || mongoose.model("Course");

// ---------------------------------------------
// 1. الواجهات المستخدمة في الـ Payload (كما كانت سابقاً)
// ---------------------------------------------
interface ILanguageData {
  name: string;
  nameSlug: string;
  section: string;
  city: string;
  price: string;
  duration: string;
  language: string;
  description: string;
  importance: string[];
  outcomes: string[];
  services: string[];
  objectives: string[];
  includes: string[];
  certificate: string;
  venue: string;
  modules: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  targetAudience: string[];
}

interface IRequestData {
  ar: ILanguageData;
  en: ILanguageData;
  trainerId: string;
}

// ---------------------------------------------
// GET ALL COURSES (باقي كما هو)
// ---------------------------------------------
// ---------------------------------------------
// 🔎 [GET] جلب جميع الكورسات
// ---------------------------------------------
export async function GET(req: Request) {
  try {
    await connectDB(); // 1. جلب جميع الكورسات مع ربط بيانات المدرب (populate('trainer'))

    // هذا ضروري لكي يعرض الكومبوننت الأمامي اسم المدرب
    const courses = await Course.find({})
      .populate("trainer")
      .sort({ createdAt: -1 });

    if (courses.length === 0) {
      return NextResponse.json(
        { success: false, message: "لا توجد كورسات في قاعدة البيانات." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error: any) {
    console.error("GET All Courses Error:", error);
    return NextResponse.json(
      { success: false, message: "فشل في جلب الكورسات من قاعدة البيانات." },
      { status: 500 }
    );
  }
}
// =============================================
// POST CREATE NEW COURSE (مع دمج رفع الصور)
// =============================================
export async function POST(req: Request) {
  try {
    await connectDB(); // 1. استقبال البيانات كـ FormData

    const formData = await req.formData(); // 2. استخلاص ملفات الصور (باستخدام المفتاح 'images')

    const imageFiles = formData.getAll("images") as File[]; // 3. استخلاص بيانات الكورس النصية (يجب إرسالها كـ JSON string تحت مفتاح 'courseData')

    const courseDataString = formData.get("courseData");

    if (!courseDataString) {
      return NextResponse.json(
        {
          success: false,
          message: "بيانات الكورس النصية (courseData) مطلوبة.",
        },
        { status: 400 }
      );
    }

    // 4. تحليل (Parse) بيانات الكورس النصية
    const data: IRequestData = JSON.parse(courseDataString.toString()); // 5. التحقق من الحقول الأساسية

    if (!data?.ar || !data?.en || !data.trainerId) {
      return NextResponse.json(
        { success: false, message: "بيانات اللغة والمدرب مطلوبة." },
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(data.trainerId)) {
      return NextResponse.json(
        { success: false, message: "Valid trainerId is required" },
        { status: 400 }
      );
    } // 6. رفع الصور إلى Cloudinary

    const imageURLs: string[] = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file: File) => {
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "course_images" },
            (error: any, result: any) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(bytes);
        });
      }); // انتظار انتهاء جميع عمليات الرفع

      imageURLs.push(...(await Promise.all(uploadPromises)));
    } // 7. بناء الـ Payload النهائي

    const payload = {
      trainer: data.trainerId,
      images: imageURLs, // ⬅️ إضافة روابط الصور المرفوعة
      slug: {
        ar: data.ar.nameSlug.toLowerCase().trim(),
        en: data.en.nameSlug.toLowerCase().trim(),
      },

      translations: {
        ar: {
          ...data.ar,
        },
        en: {
          ...data.en,
        },
      },
    }; // 8. إنشاء الكورس

    const newCourse = await Course.create(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully with images",
        data: newCourse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Course POST Error (with files):", error);

    // ... (معالجة الأخطاء كما كانت) ...
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "❗ This slug is already used. Change the Arabic or English slug.",
        },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation failed: " +
            Object.keys(error.errors)
              .map((key: string) => error.errors[key].message)
              .join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
