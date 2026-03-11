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
    if (!decoded || decoded.role !== "driver") {
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
      status: "pending",
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found or already accepted" },
        { status: 404 }
      );
    }

    await BookingModel.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: "accepted", driverId: decoded.userId } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Booking accepted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking acceptance error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
