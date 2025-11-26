import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
import messages from "@/lib/db/models/messages";

interface Params {
  params: { id: string };
}

// 📌 جلب رسالة واحدة
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;

    const message = await messages.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "الرسالة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 📌 حذف رسالة
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await messages.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "الرسالة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الرسالة بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 📌 تعليم الرسالة كمقروءة
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;

    const updated = await messages.findByIdAndUpdate(
      id,
      { veiwed: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "الرسالة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تعليم الرسالة كمقروءة",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
