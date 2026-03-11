"use client";

import React, { createContext, useState, useCallback } from "react";
import { Booking } from "@/types/booking";
import { useAuth } from "@/hooks/useAuth";

interface BookingContextType {
  bookings: (Booking & { _id: string })[];
  loading: boolean;
  error: string | null;

  createBooking: (data: Record<string, unknown>) => Promise<void>;
  getBookings: () => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updateBooking: (bookingId: string, data: Record<string, unknown>) => Promise<void>;
  clearError: () => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<(Booking & { _id: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, logout } = useAuth();

  const createBooking = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        console.error("Booking creation unauthorized:", response);
        return;
      }

      if (!res.ok) {
        const errorMsg = response.message || "Booking creation failed";
        setError(errorMsg);
        console.error("Booking creation error:", errorMsg, response);
        return;
      }

      setBookings((prev) => [...prev, response.booking]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred during booking";
      setError(errorMsg);
      console.error("Booking creation exception:", error);
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  const getBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch("/api/booking/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        console.error("Get bookings unauthorized:", data);
        return;
      }

      if (!res.ok) {
        const errorMsg = data.message || "Failed to fetch bookings";
        setError(errorMsg);
        console.error("Get bookings error:", errorMsg, data);
        return;
      }

      setBookings(data.bookings);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred while fetching bookings";
      setError(errorMsg);
      console.error("Get bookings exception:", error);
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch(`/api/booking/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const response = await res.json();

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        console.error("Cancel booking unauthorized:", response);
        return;
      }

      if (!res.ok) {
        const errorMsg = response.message || "Cancellation failed";
        setError(errorMsg);
        console.error("Cancel booking error:", errorMsg, response);
        return;
      }

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred during cancellation";
      setError(errorMsg);
      console.error("Cancel booking exception:", error);
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  const updateBooking = useCallback(async (bookingId: string, data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        console.error("Update booking unauthorized:", response);
        return;
      }

      if (!res.ok) {
        const errorMsg = response.message || "Update failed";
        setError(errorMsg);
        console.error("Update booking error:", errorMsg, response);
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.booking : b))
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred during update";
      setError(errorMsg);
      console.error("Update booking exception:", error);
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: BookingContextType = {
    bookings,
    loading,
    error,
    createBooking,
    getBookings,
    cancelBooking,
    updateBooking,
    clearError,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
