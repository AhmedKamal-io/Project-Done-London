import Instructor from "@/lib/db/models/instructors";
import connectDB from "@/lib/db/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}
interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * 🔎 [GET] /api/instructors/[id] - جلب مدرب واحد
 */
export async function GET(_: any, { params }: RouteParams) {
  try {
    await connectDB();
    const instructor = await Instructor.findById(params.id);

    if (!instructor) {
      return NextResponse.json(
        { message: "المدرب غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب المدرب.", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * 🔄 [PUT] /api/instructors/[id] - تحديث مدرب
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const formData = await req.formData();
    const id = params.id;

    const oldInstructor = await Instructor.findById(id);
    if (!oldInstructor) {
      return NextResponse.json(
        { message: "المدرب غير موجود للتحديث." },
        { status: 404 }
      );
    }

    const updateData: any = {};
    for (const [key, value] of Array.from(formData.entries())) {
      if (key !== "image" && value !== null) {
        updateData[key] = value;
      }
    }

    const image = formData.get("image") as File;

    // 1. معالجة الصورة الجديدة: رفع، حذف القديمة
    if (image && typeof image !== "string" && image.size > 0) {
      const buffer = await image.arrayBuffer();
      const bytes = Buffer.from(buffer);

      const uploaded: UploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "instructors" },
          (error, result) => {
            if (error) reject(error);
            if (!result || !result.secure_url)
              return reject(new Error("Cloudinary upload failed."));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        stream.end(bytes);
      });

      updateData.image_url = uploaded.secure_url;
      updateData.image_public_id = uploaded.public_id; // 💡 تحديث الـ public_id الجديد

      // 🛑 حذف الصورة القديمة من Cloudinary لتنظيف الموارد
      if (oldInstructor.image_public_id) {
        await cloudinary.uploader.destroy(oldInstructor.image_public_id);
      }
    }

    // 2. تحديث المدرب
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "تم تحديث المدرب بنجاح.", instructor: updatedInstructor },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Instructor Error:", error);
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
      { message: "حدث خطأ غير متوقع أثناء تحديث المدرب." },
      { status: 500 }
    );
  }
}

/**
 * 🗑️ [DELETE] /api/instructors/[id] - حذف مدرب
 */
export async function DELETE(_: any, { params }: RouteParams) {
  try {
    await connectDB();

    const instructorToDelete = await Instructor.findById(params.id);

    if (!instructorToDelete) {
      return NextResponse.json(
        { message: "المدرب غير موجود للحذف." },
        { status: 404 }
      );
    }

    // 🛑 حذف الصورة من Cloudinary قبل حذف الوثيقة من Mongoose
    if (instructorToDelete.image_public_id) {
      await cloudinary.uploader.destroy(instructorToDelete.image_public_id);
    }

    await Instructor.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "تم حذف المدرب بنجاح." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Instructor Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع أثناء حذف المدرب." },
      { status: 500 }
    );
  }
}
