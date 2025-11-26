import mongoose, { Schema, Document } from "mongoose";

// الواجهة لتمثيل بيانات جهة الاعتماد (لـ TypeScript)
export interface IAccreditation extends Document {
  name_ar: string; // اسم جهة الاعتماد باللغة العربية (مثل: الهيئة الوطنية للتقويم والاعتماد)
  name_en: string; // اسم جهة الاعتماد باللغة الإنجليزية (مثل: National Authority for Evaluation and Accreditation)
  logo: {
    url: string; // رابط الشعار من Cloudinary
    public_id: string; // المعرف العام للصورة (مهم للحذف)
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

// تعريف سكيما الشعار (Logo Schema)
const LogoSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
  },
  { _id: false }
);

// تعريف السكيما الرئيسية
const AccreditationSchema = new Schema<IAccreditation>(
  {
    name_ar: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      unique: true, // الاسم يجب أن يكون فريداً
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      unique: true,
    },
    logo: {
      type: LogoSchema,
      default: null,
    },
  },
  { timestamps: true } // لإضافة createdAt و updatedAt
);

// تصدير الموديل
export const Accreditation =
  (mongoose.models.Accreditation as mongoose.Model<IAccreditation>) ||
  mongoose.model<IAccreditation>("Accreditation", AccreditationSchema);
