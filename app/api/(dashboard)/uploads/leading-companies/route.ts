import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import {
  LeadingCompany,
  ILeadingCompany,
} from "@/lib/db/models/leading-companies";
import cloudinary from "@/lib/cloudinary";

// اسم المجلد في Cloudinary
const CLOUDINARY_FOLDER = "LeadingCompanies_Logos";

// =======================================================
//  POST: إضافة شركة جديدة ورفع الشعار
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
            resource_type: "image", // نحدد أنه صورة فقط للشعارات
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

    // 2. إنشاء الشركة وحفظ البيانات في MongoDB
    const newCompany = await LeadingCompany.create({
      name_ar,
      name_en,
      logo: {
        url: uploadedLogo.secure_url,
        public_id: uploadedLogo.public_id,
      },
    });

    return NextResponse.json(
      { message: "تمت إضافة الشركة بنجاح.", data: newCompany },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ POST Error:", error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return NextResponse.json(
        { message: "هذه الشركة (بالاسم العربي أو الإنجليزي) موجودة بالفعل." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "خطأ في معالجة طلب إضافة الشركة.", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  GET: جلب جميع الشركات الرائدة
// =======================================================
export async function GET() {
  try {
    await connectDB();
    const companies = await LeadingCompany.find().sort({ name_ar: 1 }); // الترتيب أبجديًا
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { message: "خطأ في جلب بيانات الشركات.", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  DELETE: حذف شركة (وحذف الشعار من Cloudinary)
// =======================================================
export async function DELETE(req: Request) {
  try {
    await connectDB();

    // نستقبل ID الشركة للحذف
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "مُعرّف الشركة مطلوب للحذف." },
        { status: 400 }
      );
    }

    // 1. البحث عن الشركة
    const company = await LeadingCompany.findById(id);
    if (!company) {
      return NextResponse.json(
        { message: "الشركة غير موجودة." },
        { status: 404 }
      );
    }

    // 2. حذف الشعار من Cloudinary إذا كان موجودًا
    if (company.logo && company.logo.public_id) {
      try {
        await cloudinary.uploader.destroy(company.logo.public_id, {
          resource_type: "image",
        });
        console.log(
          `Successfully deleted public_id: ${company.logo.public_id}`
        );
      } catch (cloudinaryError) {
        // نُسجل الخطأ ولكن نستمر في حذف السجل من MongoDB
        console.warn("Could not delete file from Cloudinary:", cloudinaryError);
      }
    }

    // 3. حذف السجل من MongoDB
    await LeadingCompany.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "تم حذف الشركة بنجاح (مع الشعار)." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { message: "خطأ في معالجة طلب حذف الشركة.", error },
      { status: 500 }
    );
  }
}
