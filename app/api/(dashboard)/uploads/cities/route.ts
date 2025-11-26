import { NextResponse } from "next/server";
import connectDB from "@/lib/db/db";
// @ts-ignore: module path alias resolution can fail in some tooling/environments
import { CitiesMedia } from "@/lib/db/models/citiesMedia";
import { uploadMedia, deleteMedia } from "@/lib/upload";

export async function GET() {
  try {
    await connectDB();
    const citiesMedia = await CitiesMedia.findOne(); // لأن فيه سجل واحد فقط
    return NextResponse.json(citiesMedia, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching cities media", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const city = formData.get("city") as string; // اسم المدينة (roma, london,...)
    const file = formData.get("file") as File;

    if (!city || !file)
      return NextResponse.json(
        { message: "City name and file are required" },
        { status: 400 }
      );

    const uploaded: any = await uploadMedia(file, "CitiesMedia");

    // نجيب السجل الوحيد (لو مش موجود نعمله)
    let citiesMedia = await CitiesMedia.findOne();
    if (!citiesMedia) citiesMedia = new CitiesMedia();

    // نحط الصورة الجديدة للمدينة المطلوبة
    citiesMedia[city] = {
      media_url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    await citiesMedia.save();

    return NextResponse.json(
      { message: `${city} media uploaded successfully`, data: citiesMedia },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading city media", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { city } = await req.json();
    if (!city)
      return NextResponse.json(
        { message: "City name is required" },
        { status: 400 }
      );

    const citiesMedia = await CitiesMedia.findOne();
    if (!citiesMedia || !citiesMedia[city])
      return NextResponse.json(
        { message: `No media found for ${city}` },
        { status: 404 }
      );

    // نحذف الصورة من Cloudinary
    const publicId = citiesMedia[city].public_id;
    if (publicId) await deleteMedia(publicId);

    // نحذف الصورة من قاعدة البيانات فقط (مش باقي المدن)
    citiesMedia[city] = { media_url: null, public_id: null };
    await citiesMedia.save();

    return NextResponse.json(
      { message: `${city} media deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting city media", error },
      { status: 500 }
    );
  }
}
