import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import Article from "@/lib/db/models/articles";
import cloudinary from "@/lib/cloudinary"; // يجب استيراد إعدادات Cloudinary

const CLOUDINARY_FOLDER = "Blog_Images";

// =======================================================
// 🚀 GET: جلب مقال محدد (By ID)
// =======================================================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const article = await Article.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "المقال غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: `خطأ في جلب المقال: ${message}` },
      { status: 500 }
    );
  }
}

// =======================================================
// ✏️ PUT: تعديل مقال موجود (مع معالجة الصورة والكلمات المفتاحية)
// =======================================================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const formData = await req.formData();
    const articleId = params.id;

    const article = await Article.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, message: "المقال غير موجود." },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {}; // 1. معالجة البيانات النصية وتحويل الكلمات المفتاحية

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        // أ. التعامل مع الحقل المنطقي
        if (key === "specialTag") {
          updateData[key] = value === "true" || value === "on"; // ب. **التعامل مع حقول الكلمات المفتاحية الجديدة (تحويل إلى مصفوفة)**
        } else if (key === "arKeywords" || key === "enKeywords") {
          if (value) {
            // فصل السلسلة النصية إلى مصفوفة (مع إزالة المسافات والفراغات)
            updateData[key] = value
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k.length > 0);
          } else {
            // إذا أرسل الحقل فارغاً، يتم إرسال مصفوفة فارغة ليتم التحقق منها بواسطة Mongoose
            updateData[key] = [];
          } // ج. التعامل مع باقي الحقول النصية (بما في ذلك arAuthor و enAuthor)
        } else if (key !== "blogImage") {
          updateData[key] = value;
        }
      }
    });

    const file = formData.get("blogImage") as File;
    let uploadedImage: any = null; // 2. معالجة تحديث الصورة (إذا تم إرسال ملف جديد)

    if (file && file.size > 0) {
      // أ. حذف الصورة القديمة من Cloudinary
      if (article.blogImage && article.blogImage.public_id) {
        try {
          await cloudinary.uploader.destroy(article.blogImage.public_id, {
            resource_type: "image",
          });
        } catch (error) {
          console.warn("Could not delete old Cloudinary file:", error);
        }
      } // ب. رفع الصورة الجديدة إلى Cloudinary

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: CLOUDINARY_FOLDER, resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      }); // ج. إضافة بيانات الصورة الجديدة إلى كائن التحديث

      updateData.blogImage = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "لم يتم تقديم بيانات للتحديث." },
        { status: 400 }
      );
    } // 3. تحديث المقال في MongoDB

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      {
        new: true,
        runValidators: true, // مهم لتطبيق التحقق من الحقول المطلوبة (مثل الكلمات المفتاحية)
      }
    );

    return NextResponse.json(
      { success: true, data: updatedArticle },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if ((error as any).code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان المقال مكرر. يرجى اختيار عنوان مختلف.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: `خطأ في تحديث المقال: ${message}` },
      { status: 500 }
    );
  }
}

// =======================================================
// 🗑️ DELETE: حذف مقال (وحذف الصورة من Cloudinary)
// =======================================================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const articleId = params.id; // 1. البحث عن المقال لمعرفة الـ public_id

    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "المقال غير موجود." },
        { status: 404 }
      );
    } // 2. حذف الصورة من Cloudinary

    if (article.blogImage && article.blogImage.public_id) {
      try {
        await cloudinary.uploader.destroy(article.blogImage.public_id, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        // نسجل الخطأ ولكن نستمر في حذف السجل من MongoDB
        console.warn("Could not delete file from Cloudinary:", cloudinaryError);
      }
    } // 3. حذف السجل من MongoDB

    await Article.findByIdAndDelete(articleId);

    return NextResponse.json(
      {
        success: true,
        message: "تم حذف المقال والصورة المرتبطة بنجاح.",
        id: articleId,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: `خطأ في حذف المقال: ${message}` },
      { status: 500 }
    );
  }
}
