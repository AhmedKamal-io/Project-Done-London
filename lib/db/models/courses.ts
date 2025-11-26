import mongoose, { Schema, Document, Types } from "mongoose";

// نفترض أن لديك واجهة IInstructor في ملف Instructor.ts
// import { IInstructor } from "./Instructor";
// نستخدم Types.ObjectId هنا للربط في الواجهة

// ---------------------------------------------
// 1. واجهة TypeScript المُحدّثة (ICourse)
// ---------------------------------------------
export interface ICourse extends Document {
  // ⬅️ تم تغيير حقل المدرب ليصبح مفتاحاً خارجياً (Reference) إلى نموذج Instructor
  trainer: Types.ObjectId;
  // ⬅️ مصفوفة لروابط الصور (Cloudinary Links)
  images: string[];

  slug: {
    ar: string;
    en: string;
  };
  translations: {
    ar: {
      name: string;
      section: string;
      city: string;
      price: string;
      duration: string;
      language: string;
      description: string;
      importance: string[];
      outcomes: string[];
      services: string[];
      objectives: string[];
      targetAudience: string[];
      modules: {
        title: string;
        duration: string;
        topics: string[];
      }[];
      certificate: string;
      venue: string;
      includes: string[];
    };
    en: {
      name: string;
      section: string;
      city: string;
      price: string;
      duration: string;
      language: string;
      description: string;
      importance: string[];
      outcomes: string[];
      services: string[];
      objectives: string[];
      targetAudience: string[];
      modules: {
        title: string;
        duration: string;
        topics: string[];
      }[];
      certificate: string;
      venue: string;
      includes: string[];
    };
  };
}

// ---------------------------------------------
// 2. مخطط Mongoose المُحدّث (CourseSchema)
// ---------------------------------------------
const CourseSchema = new Schema<ICourse>(
  {
    // ⬅️ الربط بالمدرب: الآن هو مرجع (Reference) لنموذج 'Instructor'
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Instructor", // تأكد أن هذا الاسم يطابق اسم نموذج المدرب
      required: true,
    },

    // ⬅️ مصفوفة لروابط الصور (Cloudinary Links)
    images: {
      type: [String],
      default: [],
    },

    slug: {
      ar: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    },

    translations: {
      ar: {
        name: String,
        section: String,
        city: String,
        price: String,
        duration: String,
        language: String,
        description: String,
        importance: [String],
        outcomes: [String],
        services: [String],
        objectives: [String],
        targetAudience: [String],
        modules: [
          {
            title: String,
            duration: String,
            topics: [String],
          },
        ],
        certificate: String,
        venue: String,
        includes: [String],
      },

      en: {
        name: String,
        section: String,
        city: String,
        price: String,
        duration: String,
        language: String,
        description: String,
        importance: [String],
        outcomes: [String],
        services: [String],
        objectives: [String],
        targetAudience: [String],
        modules: [
          {
            title: String,
            duration: String,
            topics: [String],
          },
        ],
        certificate: String,
        venue: String,
        includes: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
