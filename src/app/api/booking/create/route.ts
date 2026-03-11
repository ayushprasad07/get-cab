import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { verifyToken } from "@/lib/jwt";
import { calculateFare } from "@/lib/utils";

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
    if (!decoded || decoded.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { pickupLocation, dropLocation } = await request.json();

    if (!pickupLocation || !dropLocation) {
      return NextResponse.json(
        { success: false, message: "Pickup and drop locations are required" },
        { status: 400 }
      );
    }

    const booking = await BookingModel.create({
      userId: decoded.userId,
      pickupLocation,
      dropLocation,
      status: "pending",
      fare: calculateFare(5), // Default 5 km
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: booking.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
