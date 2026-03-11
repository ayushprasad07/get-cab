import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DriverModel } from "@/models/Driver";
import { verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "driver") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const driver = await DriverModel.findById(new ObjectId(decoded.userId));
    if (!driver) {
      return NextResponse.json(
        { success: false, message: "Driver not found" },
        { status: 404 }
      );
    }

    const newAvailability = !driver.isAvailable;
    await DriverModel.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { isAvailable: newAvailability } }
    );

    const updatedDriver = await DriverModel.findById(new ObjectId(decoded.userId));

    return NextResponse.json(
      {
        success: true,
        message: `Driver is now ${newAvailability ? "available" : "unavailable"}`,
        isAvailable: newAvailability,
        driver: {
          _id: updatedDriver?._id,
          name: updatedDriver?.name,
          email: updatedDriver?.email,
          phone: updatedDriver?.phone,
          vehicleNumber: updatedDriver?.vehicleNumber,
          licenseNumber: updatedDriver?.licenseNumber,
          isAvailable: updatedDriver?.isAvailable,
          role: updatedDriver?.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Toggle availability error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
