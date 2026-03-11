import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DriverModel } from "@/models/Driver";
import { hashPassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, phone, vehicleNumber, licenseNumber } = await request.json();

    if (!name || !email || !password || !phone || !vehicleNumber || !licenseNumber) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingDriver = await DriverModel.findOne({ email });
    if (existingDriver) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const driver = await DriverModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      vehicleNumber,
      licenseNumber,
      role: "driver",
    });

    const token = signToken({
      userId: driver._id.toString(),
      email: driver.email,
      role: "driver",
    });

    const { password: _driverPassword, ...driverWithoutPassword } = driver.toObject();

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        token,
        driver: driverWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
