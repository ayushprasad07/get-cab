import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DriverModel } from "@/models/Driver";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const driver = await DriverModel.findOne({ email });
    if (!driver) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, driver.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: driver._id.toString(),
      email: driver.email,
      role: "driver",
    });

    const { password: _driverPassword, ...driverWithoutPassword } = driver.toObject();

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        driver: driverWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
