import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name_ar: {
      type: String,
      required: true,
      trim: true,
    },
    name_en: {
      type: String,
      required: true,
      trim: true,
    },
    experience_ar: {
      type: String,
      required: true,
      trim: true,
    },
    experience_en: {
      type: String,
      required: true,
      trim: true,
    },
    linkedin_url: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v),
        message: (props) => `${props.value} is not a valid LinkedIn URL`,
      },
    },
    image_url: {
      type: String, // رابط الصورة بعد الرفع على Cloudinary
      required: true,
    },
  },
  { timestamps: true }
);

const Instructor =
  mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);

export default Instructor;
