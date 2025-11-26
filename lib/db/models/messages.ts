import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  date: string; // من الـ Select
  city: string; // من الـ Select
  name: string; // Input
  email: string; // Input
  phone?: number; // رقم التليفون
  veiwed: boolean; // هل تم قراءتها/عرضها
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    date: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: Number, // الآن رقم
    },
    veiwed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
