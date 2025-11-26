import mongoose, { Schema, Document } from "mongoose";

// الواجهة لتمثيل كل وسيط (صورة أو فيديو)
interface IMediaItem {
  url: string; // رابط الملف في Cloudinary
  public_id: string; // المعرّف العام للحذف
  type: "image" | "video" | "raw"; // نوع المورد (مهم للحذف والعرض)
}

// الواجهة لتمثيل وثيقة اللحظة بالكامل
export interface IMoment extends Document {
  title: string;
  description: string;
  media: IMediaItem[]; // مصفوفة لتخزين الصور والفيديوهات
  createdAt: Date;
  updatedAt: Date;
}

// تعريف السكيما الخاصة بالعناصر (الصور/الفيديوهات)
const MediaItemSchema = new Schema<IMediaItem>(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
    type: { type: String, enum: ["image", "video", "raw"], required: true },
  },
  { _id: false }
);

// تعريف السكيما الرئيسية (Moments)
const MomentSchema = new Schema<IMoment>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    media: { type: [MediaItemSchema], default: [] }, // مصفوفة الوسائط
  },
  { timestamps: true } // لإضافة createdAt و updatedAt
);

export const Moments =
  (mongoose.models.Moments as mongoose.Model<IMoment>) ||
  mongoose.model<IMoment>("Moments", MomentSchema);
