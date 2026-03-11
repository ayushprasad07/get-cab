import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { DriverModel } from "@/models/Driver";
import { verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
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
    if (!decoded || decoded.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId } = await params;

    const booking = await BookingModel.findOne({
      _id: new ObjectId(bookingId),
      userId: decoded.userId,
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // If booking is accepted, fetch driver details
    let driverDetails = null;
    if (booking.driverId && booking.status === "accepted") {
      const driver = await DriverModel.findById(new ObjectId(booking.driverId));
      if (driver) {
        driverDetails = {
          _id: driver._id,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          vehicleNumber: driver.vehicleNumber,
          licenseNumber: driver.licenseNumber,
          isAvailable: driver.isAvailable,
        };
      }
    }

    return NextResponse.json(
      {
        success: true,
        booking: booking.toObject(),
        driver: driverDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking details fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
