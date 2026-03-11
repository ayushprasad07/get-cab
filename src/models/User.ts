import mongoose, { Schema, model } from "mongoose";
import { User } from "@/types/user";

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || model<User>("User", userSchema);
