import mongoose, { Schema, Document } from "mongoose";

// الواجهة لتمثيل بيانات الشركة الرائدة (لـ TypeScript)
export interface ILeadingCompany extends Document {
  name_ar: string; // اسم الشركة باللغة العربية
  name_en: string; // اسم الشركة باللغة الإنجليزية
  logo: {
    url: string; // رابط الصورة (الشعار) من Cloudinary
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
  { _id: false } // لا نحتاج لـ _id فريد لكل شعار داخل الوثيقة
);

// تعريف السكيما الرئيسية
const LeadingCompanySchema = new Schema<ILeadingCompany>(
  {
    name_ar: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true, // غالباً ما يكون اسم الشركة فريداً
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },
    logo: {
      type: LogoSchema,
      default: null,
    }, // يمكن أن يكون الشعار كائنًا أو null
  },
  { timestamps: true } // لإضافة createdAt و updatedAt
);

// تصدير الموديل
export const LeadingCompany =
  (mongoose.models.LeadingCompany as mongoose.Model<ILeadingCompany>) ||
  mongoose.model<ILeadingCompany>("LeadingCompany", LeadingCompanySchema);
