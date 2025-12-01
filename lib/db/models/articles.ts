import { Schema, model, models } from "mongoose";

// تعريف سكيما فرعية لبيانات الصورة
// تحتوي على الرابط (url) والمعرف العام للحذف (public_id)
const ImageSchema = new Schema(
  {
    url: { type: String, required: true }, // رابط الصورة من Cloudinary
    public_id: { type: String, required: true, unique: true }, // المعرف العام للصورة
  },
  { _id: false }
);

const articlesSchema = new Schema(
  {
    arArticleTitle: { type: String, required: true },
    enArticleTitle: { type: String, required: true },
    arArticleDesc: { type: String, required: true },
    enArticleDesc: { type: String, required: true },
    arBlog: { type: String, required: true },
    enBlog: { type: String, required: true },
    // ** الحقول الجديدة: المؤلف بالعربية والإنجليزية
    arAuthor: { type: String, required: true }, // المؤلف بالعربية
    enAuthor: { type: String, required: true }, // المؤلف بالإنجليزية
    // تم إزالة حقل author الأصلي واضافة ار/ان
    // author: { type: String, required: true },

    categoryArticle: { type: String, required: true },
    specialTag: { type: Boolean, default: false },

    //  استخدام مصفوفة من السلاسل النصية للسماح بأكثر من كلمة مفتاحية (3 أو أكثر)
    arKeywords: {
      type: [String], // مصفوفة من السلاسل النصية
      required: true,
      // يمكنك إضافة حقل التحقق من الحجم الأدنى أو الأقصى إذا لزم الأمر
      // validate: [val => val.length >= 3, 'يجب إدخال 3 كلمات مفتاحية على الأقل.'],
    },
    enKeywords: {
      type: [String], // مصفوفة من السلاسل النصية
      required: true,
      // validate: [val => val.length >= 3, 'At least 3 keywords are required.'],
    },

    //  الحقل المعدل: تم استبدال `blogImage: { type: String }` بكائن الصورة
    blogImage: {
      type: ImageSchema,
      required: true, // الآن هو مطلوب ككائن
    },
  },
  { timestamps: true }
);

export default models.Article || model("Article", articlesSchema);
