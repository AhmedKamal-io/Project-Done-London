import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Course from "@/lib/db/models/courses";
import { Types } from "mongoose";

// تعريف الواجهة (Interfaces)
interface CourseDocument {
  _id: Types.ObjectId;
  slug: {
    ar: string;
    en: string;
  };
  trainer: any;
  images: any;
  translations: {
    ar: any;
    en: any;
  };
}

export async function GET(request: any, { params }: any) {
  try {
    await dbConnect();

    // 1. معالجة الترميز وفك التشفير (الجهد المبذول في التجهيز)
    let requestSlug = params.slug;

    // محاولة فك الترميز الأساسي
    try {
      requestSlug = decodeURIComponent(params.slug);
    } catch (e) {
      // نستخدم القيمة الأصلية إذا فشل الفك
    }

    // محاولة فك الترميز مرة أخرى لحالات الترميز المزدوج
    if (requestSlug.includes("%")) {
      try {
        requestSlug = decodeURIComponent(requestSlug);
      } catch (e) {
        // نترك السلاج كما هو إذا فشل
      }
    }

    // تنظيف السلاج من أي مسافات زائدة قد تكون في النهاية/البداية
    requestSlug = requestSlug.trim();

    // 📢 الطباعة هنا: طباعة السلاج النهائي الذي تم تجهيزه للبحث في قاعدة البيانات
    console.log("========================================");
    console.log(`💡 السلاج النهائي المُجهَّز للبحث (الجهد): ${requestSlug}`);
    console.log("========================================");

    // 2. فحص حالة البحث بالـ ID
    if (Types.ObjectId.isValid(requestSlug)) {
      return NextResponse.json(
        {
          message:
            "البحث بالـ ID غير مدعوم في هذا المسار. استخدم المسار السليم.",
        },
        { status: 400 }
      );
    }

    // 3. بناء الاستعلام المرن (Regex) والبحث بـ Collation
    const searchPattern = new RegExp(requestSlug.replace(/-/g, "[ -]"), "i");

    const course = (await Course.findOne({
      $or: [
        { "slug.ar": { $regex: searchPattern } },
        { "slug.en": { $regex: searchPattern } },
      ],
    })
      .collation({ locale: "ar", strength: 1 }) // فرض إعدادات المقارنة العربية
      .lean()) as CourseDocument | null;

    if (!course) {
      console.log(`❌ فشل البحث عن كورس بالسلاج: ${requestSlug}`);
      return NextResponse.json(
        { message: "Course not found", attemptedSlug: requestSlug },
        { status: 404 }
      );
    }

    // 4. تحديد لغة الكورس وتجهيز البيانات
    let currentLang: "ar" | "en" = "en";

    if (course.slug.ar === requestSlug) {
      currentLang = "ar";
    }

    // 5. تجهيز الداتا للفرونت إند (Flattening)
    const responseData = {
      _id: course._id,
      slug: requestSlug,
      lang: currentLang,
      trainer: course.trainer,
      images: course.images,
      ...course.translations[currentLang],

      alternates: {
        ar: course.slug.ar,
        en: course.slug.en,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
