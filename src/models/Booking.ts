import mongoose, { Schema, model } from "mongoose";
import { Booking } from "@/types/booking";

const bookingSchema = new Schema<Booking>(
  {
    userId: { type: String, required: true },
    driverId: { type: String },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    fare: { type: Number },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || model<Booking>("Booking", bookingSchema);
