import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import { Accreditation, IAccreditation } from "@/lib/db/models/accreditations"; // استخدام الموديل الجديد
import cloudinary from "@/lib/cloudinary";

// اسم المجلد في Cloudinary
const CLOUDINARY_FOLDER = "Accreditations_Logos";

// =======================================================
//  POST: إضافة جهة اعتماد جديدة ورفع الشعار
// =======================================================
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const file = formData.get("logo") as File;

    if (!name_ar || !name_en || !file) {
      return NextResponse.json(
        { message: "يجب توفير الاسم العربي والإنجليزي والشعار." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadedLogo: any = null;

    // 1. رفع الشعار إلى Cloudinary
    try {
      uploadedLogo = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            resource_type: "image", // نحدد أنه صورة
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return NextResponse.json(
        { message: "فشل في رفع الشعار إلى Cloudinary." },
        { status: 500 }
      );
    }

    // 2. إنشاء الاعتماد وحفظ البيانات في MongoDB
    const newAccreditation = await Accreditation.create({
      name_ar,
      name_en,
      logo: {
        url: uploadedLogo.secure_url,
        public_id: uploadedLogo.public_id,
      },
    });

    return NextResponse.json(
      { message: "تمت إضافة جهة الاعتماد بنجاح.", data: newAccreditation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ POST Error:", error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return NextResponse.json(
        {
          message:
            "جهة الاعتماد هذه (بالاسم العربي أو الإنجليزي) موجودة بالفعل.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "خطأ في معالجة طلب إضافة جهة الاعتماد.", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  GET: جلب جميع جهات الاعتماد
// =======================================================
export async function GET() {
  try {
    await connectDB();
    const accreditations = await Accreditation.find().sort({ name_ar: 1 }); // الترتيب أبجديًا
    return NextResponse.json(accreditations, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات الاعتمادات.", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  DELETE: حذف جهة اعتماد (وحذف الشعار من Cloudinary)
// =======================================================
export async function DELETE(req: Request) {
  try {
    await connectDB();

    // نستقبل ID جهة الاعتماد للحذف
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "مُعرّف جهة الاعتماد مطلوب للحذف." },
        { status: 400 }
      );
    }

    // 1. البحث عن جهة الاعتماد
    const accreditation = await Accreditation.findById(id);
    if (!accreditation) {
      return NextResponse.json(
        { message: "جهة الاعتماد غير موجودة." },
        { status: 404 }
      );
    }

    // 2. حذف الشعار من Cloudinary إذا كان موجودًا
    if (accreditation.logo && accreditation.logo.public_id) {
      try {
        await cloudinary.uploader.destroy(accreditation.logo.public_id, {
          resource_type: "image",
        });
        console.log(
          `Successfully deleted public_id: ${accreditation.logo.public_id}`
        );
      } catch (cloudinaryError) {
        // نسجل الخطأ ولكن نستمر في حذف السجل من MongoDB
        console.warn("Could not delete file from Cloudinary:", cloudinaryError);
      }
    }

    // 3. حذف السجل من MongoDB
    await Accreditation.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "تم حذف جهة الاعتماد بنجاح (مع الشعار)." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { message: "خطأ في معالجة طلب حذف جهة الاعتماد.", error },
      { status: 500 }
    );
  }
}
