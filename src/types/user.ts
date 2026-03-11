export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, "password">;
}
