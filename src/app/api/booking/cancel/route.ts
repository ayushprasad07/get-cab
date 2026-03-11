import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
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
    if (!decoded || decoded.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

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

    if (booking.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Only pending bookings can be cancelled" },
        { status: 400 }
      );
    }

    await BookingModel.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Booking cancelled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking cancellation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
