import { Schema, model, models } from "mongoose";
const GeneralLinksSchema = new Schema({
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  twitter: { type: String, default: null },
  linkedin: { type: String, default: null },
  youtube: { type: String, default: null },
});

export const GeneralLinks =
  models.GeneralLinks || model("GeneralLinks", GeneralLinksSchema);
