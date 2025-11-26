import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import { GeneralLinks } from "@/lib/db/models/generalLinks";

// 💡 واجهة نموذجية لكائن الروابط الفارغ
const defaultLinks = {
  facebook: null,
  instagram: null,
  twitter: null,
  linkedin: null,
  youtube: null,
};

//  GET - جلب كائن الروابط الواحدة مباشرةً
export async function GET() {
  try {
    await connectDB();

    // 💡 استخدام findOne() لضمان جلب وثيقة واحدة فقط
    const links = await GeneralLinks.findOne();

    if (!links) {
      // إذا لم يتم العثور على أي وثيقة، نرجع كائن الروابط الفارغ
      return NextResponse.json(defaultLinks, { status: 200 });
    }

    // 💡 نرجع كائن الروابط مباشرة (المطابق لواجهة SocialLinks في الكومبوننت)
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { message: "Error fetching links", error },
      { status: 500 }
    );
  }
}

//  POST - إنشاء أو استبدال كل الروابط (تم التعديل)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // 💡 استخدام findOneAndUpdate مع خيار upsert: true
    // هذا يضمن تحديث الوثيقة الموجودة (إن وُجدت) أو إنشاء وثيقة جديدة (إن لم توجد).
    // استخدام deleteMany ثم create يسبب مشاكل في حالة السباق (race condition).
    const newLinks = await GeneralLinks.findOneAndUpdate(
      {}, // الشرط: ابحث عن أي وثيقة
      { $set: data }, // التحديث: عيّن البيانات الجديدة
      {
        new: true, // أرجع الوثيقة بعد التحديث
        upsert: true, // أنشئ الوثيقة إذا لم توجد
        runValidators: true, // تشغيل الـ Validators في Mongoose
      }
    );

    return NextResponse.json(
      { message: "Links saved successfully", links: newLinks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving links:", error);
    return NextResponse.json(
      { message: "Error saving links", error },
      { status: 500 }
    );
  }
}

//  PUT - تحديث رابط واحد فقط بناءً على key (مثلاً: facebook, instagram...)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { key, value } = await req.json();

    if (!key) {
      return NextResponse.json(
        { message: "Missing key parameter" },
        { status: 400 }
      );
    }

    // 💡 البحث عن وثيقة واحدة فقط وتحديث الحقل المطلوب
    const updatedLinks = await GeneralLinks.findOneAndUpdate(
      {},
      { $set: { [key]: value } },
      { new: true } // أرجع الوثيقة بعد التحديث
    );

    if (!updatedLinks) {
      return NextResponse.json(
        { message: "No links found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Updated ${key} successfully`, links: updatedLinks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { message: "Error updating link", error },
      { status: 500 }
    );
  }
}

// DELETE - حذف كل الروابط
export async function DELETE() {
  try {
    await connectDB();
    await GeneralLinks.deleteMany({});
    return NextResponse.json(
      { message: "All links deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting links:", error);
    return NextResponse.json(
      { message: "Error deleting links", error },
      { status: 500 }
    );
  }
}
