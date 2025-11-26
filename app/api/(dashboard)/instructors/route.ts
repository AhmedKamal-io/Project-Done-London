import Instructor from "@/lib/db/models/instructors";
import connectDB from "@/lib/db/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server"; // استخدام NextResponse من Next/Server لرموز الحالة

// واجهة لضمان نوع البيانات المُعادة من Cloudinary (تحسين TypeScript)
interface UploadResult {
  secure_url: string;
  public_id: string; // يُفضل تخزين الـ public_id للحذف لاحقاً
}

/**
 * 📚 [GET] /api/instructors
 * جلب جميع المدربين
 */
export async function GET() {
  try {
    await connectDB();
    const instructors = await Instructor.find().sort({ createdAt: -1 });

    // إرجاع رمز 200 الصريح
    return NextResponse.json(instructors, { status: 200 });
  } catch (error: any) {
    console.error("GET Instructors Error:", error);
    return NextResponse.json(
      { message: "فشل في جلب قائمة المدربين.", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * ✍️ [POST] /api/instructors
 * إنشاء مدرب جديد (يتطلب بيانات Form Data وصورة)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const experience_ar = formData.get("experience_ar") as string;
    const experience_en = formData.get("experience_en") as string;
    const linkedin_url = formData.get("linkedin_url") as string;
    const image = formData.get("image") as File;

    // 🛑 التحقق من الحقول الإلزامية قبل الرفع والإنشاء (Server-side validation)
    if (!name_ar || !name_en || !experience_ar || !experience_en || !image) {
      return NextResponse.json(
        { message: "الاسم والخبرة (عربي وإنجليزي) والصورة مطلوبة." },
        { status: 400 }
      );
    }

    // 1. تحويل ملف الصورة إلى Buffer
    const buffer = await image.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // 2. رفع الصورة إلى Cloudinary باستخدام Stream
    const uploadedImage = await new Promise<UploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "instructors" },
        (error: any, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) {
            return reject(
              new Error("Cloudinary upload failed or returned no secure_url")
            );
          }
          // حفظ الـ public_id للرجوع إليه عند الحذف
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      stream.end(bytes);
    });

    // 3. إنشاء المدرب في قاعدة البيانات
    const instructor = await Instructor.create({
      name_ar,
      name_en,
      experience_ar,
      experience_en,
      linkedin_url,
      image_url: uploadedImage.secure_url,
      // (يُفضل إضافة image_public_id إلى الـ Schema لتسهيل الحذف)
    });

    // إرجاع رمز 201 Created
    return NextResponse.json(
      { message: "تم إنشاء المدرب بنجاح.", instructor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Instructor Error:", error);

    // يمكن تمييز خطأ التحقق من Mongoose (مثل خطأ LinkedIn URL) وإرجاع 400
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "فشل التحقق من صحة البيانات المدخلة.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "حدث خطأ غير متوقع أثناء إنشاء المدرب." },
      { status: 500 }
    );
  }
}
