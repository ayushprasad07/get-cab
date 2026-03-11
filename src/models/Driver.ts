import mongoose, { Schema, model } from "mongoose";
import { Driver } from "@/types/driver";

const driverSchema = new Schema<Driver>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    role: { type: String, default: "driver" },
  },
  { timestamps: true }
);

export const DriverModel = mongoose.models.Driver || model<Driver>("Driver", driverSchema);
