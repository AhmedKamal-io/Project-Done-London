import { Schema, model, models } from "mongoose";

const HomeMediaSchema = new Schema(
  {
    images: [
      {
        media_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const HomeMedia =
  models.HomeMedia || model("HomeMedia", HomeMediaSchema);
