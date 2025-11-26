import mongoose, { Schema, model, models } from "mongoose";

const CityMediaSchema = new Schema(
  {
    // كل مدينة تحتوي على كائن فيه رابط الصورة و الـ public_id من Cloudinary
    roma: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    london: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    venice: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    dubai: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    paris: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    istanbul: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    madrid: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    barcelona: {
      media_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const CitiesMedia =
  models.CitiesMedia || model("CitiesMedia", CityMediaSchema);
