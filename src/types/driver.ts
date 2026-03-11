export interface Driver {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  isAvailable: boolean;
  role: "driver";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DriverLoginRequest {
  email: string;
  password: string;
}

export interface DriverRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  driver?: Omit<Driver, "password">;
}
