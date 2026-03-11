export interface Booking {
  _id?: string;
  userId: string;
  driverId?: string;
  pickupLocation: string;
  dropLocation: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  fare?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingRequest {
  pickupLocation: string;
  dropLocation: string;
}

export interface BookingUpdateRequest {
  status: "pending" | "accepted" | "completed" | "cancelled";
  driverId?: string;
  fare?: number;
}
