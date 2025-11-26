import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import { Moments } from "@/lib/db/models/moments";
import cloudinary from "@/lib/cloudinary";

//  المتغير المفتاحي: تحديد اسم المجلد الفريد في Cloudinary
const CLOUDINARY_FOLDER = "Moments_Gallery";

//  واجهة (Interface) لتأمين نتائج Cloudinary بواسطة TypeScript
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
  // يمكن إضافة المزيد من الحقول الضرورية هنا
}

// =======================================================
//  POST: رفع الصور والفيديوهات وحفظها في MongoDB (مُحسن)
// =======================================================
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("media") as File[];

    if (!files || files.length === 0)
      return NextResponse.json(
        { message: "No media uploaded" },
        { status: 400 }
      );

    const uploadPromises = [];
    const uploadedMedia = [];

    for (const file of files) {
      // قراءة الملف كـ Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type;

      // تحديد نوع الملف (صورة / فيديو)
      const resourceType = mimeType.startsWith("video") ? "video" : "image";

      // إنشاء Promise للرفع
      const uploadPromise = new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          //  تم تحديد نوع الحل هنا
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: CLOUDINARY_FOLDER,
              resource_type: resourceType,
            },
            (error, result) => {
              if (error) reject(error);
              // 🛠️ تأكد من أن result هو من النوع المتوقع
              else resolve(result as CloudinaryUploadResult);
            }
          );
          stream.end(buffer);
        }
      );
      uploadPromises.push(uploadPromise);
    }

    // الانتظار حتى اكتمال جميع عمليات الرفع
    const uploadResults = await Promise.all(uploadPromises);

    //  استخدام النوع المُعرف (CloudinaryUploadResult) لتجنب 'as any'
    for (const result of uploadResults) {
      uploadedMedia.push({
        url: result.secure_url,
        public_id: result.public_id,
        type: result.resource_type,
      });
    }

    const newMoment = await Moments.create({
      title,
      description,
      media: uploadedMedia,
    });

    return NextResponse.json(
      {
        message: `Moment uploaded successfully to folder "${CLOUDINARY_FOLDER}"`,
        data: newMoment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { message: "Error uploading moment", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  GET: جلب جميع اللحظات
// =======================================================
export async function GET() {
  try {
    await connectDB();
    const moments = await Moments.find().sort({ createdAt: -1 });
    return NextResponse.json(moments, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { message: "Error fetching moments", error },
      { status: 500 }
    );
  }
}

// =======================================================
//  DELETE: حذف لحظة واحدة (مُحسن للمرونة)
// =======================================================
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });

    const moment = await Moments.findById(id);
    if (!moment)
      return NextResponse.json(
        { message: "Moment not found" },
        { status: 404 }
      );

    //  إنشاء وعود الحذف
    const deletionPromises = moment.media.map((media: any) =>
      cloudinary.uploader.destroy(media.public_id, { resource_type: "auto" })
    );

    //  استخدام Promise.allSettled لضمان حذف السجل من MongoDB حتى لو فشلت بعض عمليات الحذف من Cloudinary
    const deletionResults = await Promise.allSettled(deletionPromises);

    // تسجيل أي عملية حذف فاشلة (اختياري لكن مفيد للمراقبة)
    deletionResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.warn(
          ` Cloudinary deletion failed for public_id: ${moment.media[index].public_id}. Error:`,
          result.reason
        );
      }
    });

    // حذف السجل من MongoDB (سيتم تنفيذه بغض النظر عن فشل حذف Cloudinary)
    await Moments.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Moment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { message: "Error deleting moment", error },
      { status: 500 }
    );
  }
}
