"use client";

import React, { createContext, useState, useCallback, useEffect } from "react";
import { User } from "@/types/user";
import { Driver } from "@/types/driver";

interface AuthContextType {
  user: (User & { _id: string }) | null;
  driver: (Driver & { _id: string }) | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  role: "user" | "driver" | null;

  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (data: Record<string, unknown>) => Promise<void>;
  loginDriver: (email: string, password: string) => Promise<void>;
  registerDriver: (data: Record<string, unknown>) => Promise<void>;
  toggleDriverAvailability: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { _id: string }) | null>(null);
  const [driver, setDriver] = useState<(Driver & { _id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
   const [role, setRole] = useState<"user" | "driver" | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Add a small delay to ensure localStorage is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role") as "user" | "driver" | null;
        const storedUser = localStorage.getItem("user");
        const storedDriver = localStorage.getItem("driver");

        console.log("Auth: Initializing from localStorage", { role: storedRole, hasToken: !!storedToken });

        if (storedToken && storedRole) {
          setToken(storedToken);
          setRole(storedRole);
          
          // Restore user or driver data from localStorage
          if (storedRole === "user" && storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              console.log("Auth: User data restored successfully");
            } catch (err) {
              console.error("Error parsing stored user data:", err);
              // Clear invalid data
              localStorage.removeItem("user");
            }
          } else if (storedRole === "driver" && storedDriver) {
            try {
              const driverData = JSON.parse(storedDriver);
              setDriver(driverData);
              console.log("Auth: Driver data restored successfully");
            } catch (err) {
              console.error("Error parsing stored driver data:", err);
              // Clear invalid data
              localStorage.removeItem("driver");
            }
          }
        } else {
          console.log("Auth: No stored session found");
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginUser = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setUser(data.user);
      setToken(data.token);
      setRole("user");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/; max-age=604800`; // 7 days
    } catch {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        setError(response.message || "Registration failed");
        return;
      }

      setUser(response.user);
      setToken(response.token);
      setRole("user");
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(response.user));
      document.cookie = `token=${response.token}; path=/; max-age=604800`; // 7 days
    } catch {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginDriver = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setDriver(data.driver);
      setToken(data.token);
      setRole("driver");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "driver");
      localStorage.setItem("driver", JSON.stringify(data.driver));
      document.cookie = `token=${data.token}; path=/; max-age=604800`; // 7 days
    } catch {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }, []);

  const registerDriver = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        setError(response.message || "Registration failed");
        return;
      }

      setDriver(response.driver);
      setToken(response.token);
      setRole("driver");
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "driver");
      localStorage.setItem("driver", JSON.stringify(response.driver));
      document.cookie = `token=${response.token}; path=/; max-age=604800`; // 7 days
    } catch {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDriverAvailability = useCallback(async () => {
    if (!driver || !token) {
      setError("No driver logged in");
      return;
    }

    try {
      const res = await fetch("/api/driver/toggle-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to toggle availability");
        return;
      }

      // Update local driver state
      const updatedDriver = { ...driver, isAvailable: data.isAvailable };
      setDriver(updatedDriver);
      localStorage.setItem("driver", JSON.stringify(updatedDriver));
      console.log("Driver availability toggled:", data.isAvailable);
    } catch (err) {
      setError("An error occurred while toggling availability");
      console.error(err);
    }
  }, [driver, token]);

  const logout = useCallback(() => {
    setUser(null);
    setDriver(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("driver");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    driver,
    loading,
    error,
    token,
    role,
    loginUser,
    registerUser,
    loginDriver,
    registerDriver,
    toggleDriverAvailability,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
