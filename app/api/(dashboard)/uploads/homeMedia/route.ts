import connectDB from "@/lib/db/db";
import { HomeMedia } from "@/lib/db/models/homeMedia";
// نفترض أن هذه الدوال المساعدة موجودة في مسار $lib/upload
import { uploadMedia, deleteMedia } from "@/lib/upload";
import { NextResponse } from "next/server";

//  المتغير المفتاحي: تحديد اسم المجلد الفريد في Cloudinary
// جميع الصور المرفوعة من هذا الملف ستذهب إلى هذا المسار فقط.
const CLOUDINARY_FOLDER = "Home_Page_Assets";

// =======================================================
//  GET: جلب الصور فقط
// =======================================================
export async function GET() {
  try {
    await connectDB();
    // جلب المستند الوحيد الذي يحتوي على كل ميديا الصفحة الرئيسية
    const mediaDoc = await HomeMedia.findOne({});

    if (!mediaDoc) {
      return NextResponse.json(
        { message: "No media found", images: [] },
        { status: 200 }
      );
    }

    const images = mediaDoc.images;

    return NextResponse.json(
      {
        message: "✅ Media fetched successfully",
        images,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { message: "Error fetching media", error },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------------

// =======================================================
//  POST: رفع صور جديدة إلى مجلد "Home_Page_Assets"
// =======================================================
export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const files = formData.getAll("homeMedia") as File[];

    // جلب أو إنشاء مستند الميديا
    let homeMedia = await HomeMedia.findOne({});
    if (!homeMedia) {
      homeMedia = new HomeMedia({ images: [] });
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No new media files detected." },
        { status: 200 }
      );
    }

    // ========= رفع الصور إلى Cloudinary =========
    const uploadedImages: { media_url: string; public_id: string }[] = [];
    for (const file of files) {
      let uploaded: any = null;
      try {
        //  تمرير اسم المجلد الفريد (CLOUDINARY_FOLDER) إلى دالة الرفع
        uploaded = await uploadMedia(file, CLOUDINARY_FOLDER);
      } catch (uploadError: any) {
        console.error(`❌ Upload failed for file ${file.name}:`, uploadError);
        // نتابع الرفع للملفات المتبقية حتى لو فشل ملف واحد
        continue;
      }

      if (uploaded && uploaded.secure_url && uploaded.public_id) {
        uploadedImages.push({
          media_url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // إضافة الصور الجديدة وحفظ التغييرات
    homeMedia.images.push(...uploadedImages);
    await homeMedia.save();

    return NextResponse.json(
      {
        message: `✅ تم رفع ${uploadedImages.length} صورة جديدة بنجاح إلى المجلد "${CLOUDINARY_FOLDER}".`,
        count: uploadedImages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء الرفع", error },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------------

// =======================================================
//  DELETE: حذف صورة من Cloudinary و MongoDB
// =======================================================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json(
        { message: "Missing public_id in request body" },
        { status: 400 }
      );
    }

    // 1. حذف الصورة من Cloudinary (public_id يحتوي على مسار المجلد)
    await deleteMedia(public_id);

    // 2. إزالة الكائن من مصفوفة images في MongoDB
    const updatedDoc = await HomeMedia.findOneAndUpdate(
      {},
      {
        $pull: {
          images: { public_id: public_id },
        },
      },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { message: "Media document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `✅ Deleted image with public_id: ${public_id} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 }
    );
  }
}
