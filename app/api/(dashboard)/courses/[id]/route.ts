import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import mongoose, { Types } from "mongoose";
import cloudinary from "@/lib/cloudinary"; // ⚠️ تأكد من وجود ملف تهيئة Cloudinary هنا
import "@/lib/db/models/courses"; // تسجيل الموديل

// افتراض أن هذا هو موديل الكورس
const Course = mongoose.models.Course || mongoose.model("Course");

// ---------------------------------------------
// واجهات البيانات (للتعديل)
// ---------------------------------------------
interface ILanguageData {
  // جعل الحقول اختيارية لأن التعديل قد لا يشملها كلها
  name?: string;
  nameSlug?: string;
  [key: string]: any; // يسمح بأي حقل ترجمة آخر
}

interface IRequestData {
  ar?: ILanguageData;
  en?: ILanguageData;
  trainerId?: string; // ID المدرب (اختياري في التعديل)
  images?: string[]; // مصفوفة روابط الصور (اختياري في التعديل)
}
// ---------------------------------------------

// ============================================================
// 🔎 GET ONE COURSE - جلب البيانات
// ============================================================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB(); // التحقق من صلاحية ID

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "صيغة معرّف الكورس (ID) غير صالحة." },
        { status: 400 }
      );
    } // جلب الدورة من قاعدة البيانات مع جلب تفاصيل المدرب

    const course = await Course.findById(params.id).populate("trainer");

    if (!course) {
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على الكورس." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error) {
    console.error("GET Course Error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ في الخادم أثناء جلب البيانات." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// ✍️ UPDATE COURSE (PUT) - تحديث البيانات
// -------------------------------------------------------------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "صيغة معرّف الكورس (ID) غير صالحة." },
        { status: 400 }
      );
    }

    const data: IRequestData = await req.json();
    const updatePayload: Record<string, any> = {}; // 1. تحديث حقل المدرب (trainer)

    if (data.trainerId) {
      if (!Types.ObjectId.isValid(data.trainerId)) {
        return NextResponse.json(
          { success: false, message: "صيغة معرّف المدرب غير صالحة." },
          { status: 400 }
        );
      }
      updatePayload["trainer"] = data.trainerId;
    } // 2. تحديث حقل الصور (images)

    if (data.images !== undefined) {
      updatePayload["images"] = data.images;
    } // 3. تحديث الـ Slugs والحقول المترجمة

    if (data.ar) {
      for (const key in data.ar) {
        // يتم تخزين الـ Slug في الحقل slug.ar
        const value = data.ar[key];
        if (key === "nameSlug") {
          // تحقق من أن القيمة نص قبل استدعاء الدوال الخاصة بالسلاسل
          if (typeof value === "string" && value.trim() !== "") {
            updatePayload["slug.ar"] = value.toLowerCase().trim();
          }
        } else {
          // تخزين باقي الحقول في translations.ar
          updatePayload[`translations.ar.${key}`] = value;
        }
      }
    }

    if (data.en) {
      for (const key in data.en) {
        const value = data.en[key];
        if (key === "nameSlug") {
          // تحقق من أن القيمة نص قبل استدعاء الدوال الخاصة بالسلاسل
          if (typeof value === "string" && value.trim() !== "") {
            updatePayload["slug.en"] = value.toLowerCase().trim();
          }
        } else {
          updatePayload[`translations.en.${key}`] = value;
        }
      }
    } // التحقق من وجود شيء للتحديث

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, message: "لم يتم تقديم أي بيانات للتحديث." },
        { status: 400 }
      );
    } // تنفيذ التحديث باستخدام $set

    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).populate("trainer");

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "الكورس غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث الكورس بنجاح.",
        data: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Course Error:", error); // معالجة خطأ التكرار (Duplicate Key Error)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "الـ Slug مستخدم بالفعل. يرجى التغيير." },
        { status: 409 }
      );
    } // معالجة أخطاء التحقق (Validation Error)
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors)
        .map((key: string) => error.errors[key].message)
        .join(", ");
      return NextResponse.json(
        { success: false, message: `فشل التحقق: ${validationErrors}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "خطأ في الخادم." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// 🗑️ DELETE COURSE - حذف البيانات (مع حذف الصور من Cloudinary)
// -------------------------------------------------------------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "صيغة معرّف الكورس (ID) غير صالحة." },
        { status: 400 }
      );
    } // 1. البحث عن الكورس قبل الحذف للحصول على مصفوفة الصور

    const courseToDelete = await Course.findById(params.id);

    if (!courseToDelete) {
      return NextResponse.json(
        { success: false, message: "الكورس غير موجود." },
        { status: 404 }
      );
    } // 2. حذف الصور من Cloudinary

    if (courseToDelete.images && courseToDelete.images.length > 0) {
      const deletionPromises = courseToDelete.images.map((imageUrl: string) => {
        // استخراج الـ public_id من الـ URL (يفترض أن الـ URL يحتوي على المجلد/الاسم)
        const urlParts = imageUrl.split("/"); // يأخذ آخر جزئين (المجلد والاسم) ويحذف الامتداد
        const publicIdWithFolder = urlParts.slice(-2).join("/").split(".")[0];
        return cloudinary.uploader.destroy(publicIdWithFolder);
      });

      await Promise.all(deletionPromises);
    } // 3. حذف سجل الكورس من قاعدة البيانات

    await Course.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: "تم حذف الكورس وصوره المرتبطة بنجاح." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Course Error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ في الخادم أثناء الحذف." },
      { status: 500 }
    );
  }
}
