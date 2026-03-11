import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "./jwt";

export const authMiddleware = (request: NextRequest) => {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  return null;
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  return verifyToken(token);
};

export const requireAuth = (role?: "user" | "driver") => {
  return (request: NextRequest) => {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (role && decoded.role !== role) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return null;
  };
};
