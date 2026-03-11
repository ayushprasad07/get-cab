import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let bookings;

    if (decoded.role === "user") {
      // Users see only their own bookings
      bookings = await BookingModel.find({
        userId: decoded.userId,
      });
    } else if (decoded.role === "driver") {
      // Drivers see:
      // 1. Pending bookings (available rides to accept)
      // 2. Accepted bookings assigned to them
      // 3. Completed bookings they've done
      const pendingBookings = await BookingModel.find({
        status: "pending",
      });

      const assignedBookings = await BookingModel.find({
        driverId: decoded.userId,
      });

      // Combine and remove duplicates
      const bookingMap = new Map();
      [...pendingBookings, ...assignedBookings].forEach((booking) => {
        bookingMap.set(booking._id.toString(), booking);
      });

      bookings = Array.from(bookingMap.values());
    } else {
      bookings = [];
    }

    return NextResponse.json(
      {
        success: true,
        bookings: bookings.map((b) => b.toObject()),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
