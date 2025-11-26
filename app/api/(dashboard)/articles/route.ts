import connectDB from "@/lib/db/db";
import { NextResponse } from "next/server";
import Article from "@/lib/db/models/articles"; // السكيما المعدلة
import cloudinary from "@/lib/cloudinary";

// اسم المجلد في Cloudinary
const CLOUDINARY_FOLDER = "Blog_Images";

// =======================================================
//   GET: جلب كل المقالات
// =======================================================
export async function GET() {
  try {
    await connectDB(); // جلب كل المقالات وترتيبها حسب الأحدث

    const articles = await Article.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: articles.length,
        data: articles,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        message: `خطأ في جلب المقالات: ${message}`,
      },
      { status: 500 }
    );
  }
}

// =======================================================
//   POST: إنشاء مقال جديد مع رفع الصورة إلى Cloudinary (الكود المعدل)
// =======================================================
export async function POST(req: Request) {
  try {
    await connectDB(); // يجب استخدام FormData لاستقبال الملفات والبيانات

    const formData = await req.formData(); // 1. استخراج البيانات النصية

    const arArticleTitle = formData.get("arArticleTitle") as string;
    const enArticleTitle = formData.get("enArticleTitle") as string;
    const arArticleDesc = formData.get("arArticleDesc") as string;
    const enArticleDesc = formData.get("enArticleDesc") as string;
    const arBlog = formData.get("arBlog") as string;
    const enBlog = formData.get("enBlog") as string;
    const arAuthor = formData.get("arAuthor") as string;
    const enAuthor = formData.get("enAuthor") as string;
    const categoryArticle = formData.get("categoryArticle") as string;

    const specialTagValue = formData.get("specialTag") as string;
    const specialTag = specialTagValue === "true" || specialTagValue === "on";

    const arKeywordsString = formData.get("arKeywords") as string;
    const enKeywordsString = formData.get("enKeywords") as string;

    // تحويل سلاسل الكلمات المفتاحية إلى مصفوفة (بإزالة المسافات والفراغات)
    const arKeywords = arKeywordsString
      ? arKeywordsString
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];
    const enKeywords = enKeywordsString
      ? enKeywordsString
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    // استخراج ملف الصورة
    const file = formData.get("blogImage") as File;

    // =======================================================
    // 2. التحقق المفصل من الحقول المطلوبة (لرسائل خطأ واضحة) 🛠️
    // =======================================================
    if (!file) {
      return NextResponse.json(
        { message: "❌ يجب اختيار صورة رئيسية للمقال (blogImage)." },
        { status: 400 }
      );
    }
    if (
      !arArticleTitle ||
      !enArticleTitle ||
      !arArticleDesc ||
      !enArticleDesc
    ) {
      return NextResponse.json(
        { message: "❌ يرجى توفير العناوين والأوصاف باللغتين." },
        { status: 400 }
      );
    }
    if (!arBlog || !enBlog) {
      return NextResponse.json(
        { message: "❌ يرجى توفير محتوى المقال الكامل باللغتين." },
        { status: 400 }
      );
    }

    if (!arAuthor) {
      return NextResponse.json(
        { message: "❌ حقل اسم المؤلف باللغة العربية (arAuthor) مطلوب." },
        { status: 400 }
      );
    }
    if (!enAuthor) {
      return NextResponse.json(
        { message: "❌ حقل اسم المؤلف باللغة الإنجليزية (enAuthor) مطلوب." },
        { status: 400 }
      );
    }

    if (!categoryArticle) {
      return NextResponse.json(
        { message: "❌ يجب اختيار فئة المقال." },
        { status: 400 }
      );
    }

    if (arKeywords.length === 0) {
      return NextResponse.json(
        {
          message:
            "❌ يجب إدخال كلمة مفتاحية واحدة على الأقل باللغة العربية. (افصل بينها بفواصل)",
        },
        { status: 400 }
      );
    }
    if (enKeywords.length === 0) {
      return NextResponse.json(
        {
          message:
            "❌ You must enter at least one keyword in English. (Separate with commas)",
        },
        { status: 400 }
      );
    }
    // =======================================================

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadedImage: any = null; // 3. رفع الصورة إلى Cloudinary

    try {
      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            resource_type: "image",
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
        { message: "فشل في رفع الصورة إلى Cloudinary." },
        { status: 500 }
      );
    } // 4. تجميع بيانات المقال

    const articleData = {
      arArticleTitle,
      enArticleTitle,
      arArticleDesc,
      enArticleDesc,
      arBlog,
      enBlog,
      arAuthor, // الحقل الجديد
      enAuthor, // الحقل الجديد
      arKeywords, // الحقل الجديد
      enKeywords, // الحقل الجديد
      categoryArticle,
      specialTag, // حفظ بيانات الصورة ككائن جديد
      blogImage: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      },
    }; // 5. حفظ المقال في MongoDB

    const newArticle = await Article.create(articleData);

    return NextResponse.json(
      { success: true, data: newArticle },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    // 💡 معالجة خطأ Mongoose Validation Error لتحديد الحقل المفقود أو الخاطئ
    if (error && (error as any).name === "ValidationError") {
      // استخراج رسائل الخطأ من Mongoose
      const validationErrors = Object.values((error as any).errors)
        .map((err: any) => err.message)
        .join(" | ");
      return NextResponse.json(
        {
          success: false,
          message: `خطأ في التحقق من صحة البيانات (Schema Error): ${validationErrors}`,
        },
        { status: 400 } // استخدام 400 لخطأ التحقق من صحة البيانات
      );
    }

    // معالجة خطأ التكرار (Duplicate Key Error)
    if (error && (error as any).code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "خطأ في التكرار: قد يكون هناك حقل فريد مكرر (مثل Public ID للصورة).",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: `خطأ عام في إنشاء المقال: ${message}`,
      },
      { status: 500 }
    );
  }
}
