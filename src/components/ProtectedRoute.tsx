"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "driver";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { loading, token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const hasToken = !!token;

    // If no token at all, send to appropriate login
    if (!hasToken) {
      const target =
        requiredRole === "driver"
          ? "/auth/driver-login"
          : "/auth/user-login";
      console.log("ProtectedRoute: No token found, redirecting to", target);
      router.push(target);
      return;
    }

    // If a specific role is required but current role doesn't match, redirect
    if (requiredRole === "user" && role === "driver") {
      console.log("ProtectedRoute: User role required but driver token present");
      router.push("/auth/user-login");
      return;
    }

    if (requiredRole === "driver" && role === "user") {
      console.log("ProtectedRoute: Driver role required but user token present");
      router.push("/auth/driver-login");
    }
  }, [loading, token, role, requiredRole, router]);

  // Show loading while auth is initializing
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const hasToken = !!token;

  if (!hasToken) {
    return null;
  }

  if (requiredRole === "user" && role === "driver") {
    return null;
  }

  if (requiredRole === "driver" && role === "user") {
    return null;
  }

  return <>{children}</>;
};
