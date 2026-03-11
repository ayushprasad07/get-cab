"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSummary } from "@/components/DashboardSummary";

interface DriverDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
  isAvailable: boolean;
}

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  completed: { label: "Completed",  dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/8",  border: "border-emerald-500/20" },
  accepted:  { label: "Accepted",   dot: "bg-blue-400",    text: "text-blue-400",   bg: "bg-blue-500/8",     border: "border-blue-500/20"   },
  cancelled: { label: "Cancelled",  dot: "bg-red-400",     text: "text-red-400",    bg: "bg-red-500/8",      border: "border-red-500/20"    },
  pending:   { label: "Pending",    dot: "bg-yellow-400",  text: "text-yellow-400", bg: "bg-yellow-500/8",   border: "border-yellow-500/20" },
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { bookings, getBookings, loading } = useBooking();
  const [driverDetails, setDriverDetails] = useState<Record<string, DriverDetails>>({});
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { getBookings(); }, [getBookings]);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const accepted = bookings.filter((b) => b.status === "accepted");
      if (accepted.length === 0) return;
      setLoadingDrivers(true);
      const token = localStorage.getItem("token");
      try {
        for (const booking of accepted) {
          if (booking._id && !driverDetails[booking._id]) {
            const res = await fetch(`/api/booking/${booking._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (data.driver) {
                setDriverDetails((prev) => ({ ...prev, [booking._id!]: data.driver }));
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDrivers(false);
      }
    };
    fetchDriverDetails();
  }, [bookings, driverDetails]);

  return (
    <ProtectedRoute requiredRole="user">
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

          .page-font { font-family: 'DM Sans', sans-serif; }
          .display   { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            from { transform: translateY(0px) rotate(0deg); opacity: 0.06; }
            to   { transform: translateY(-20px) rotate(180deg); opacity: 0.12; }
          }
          @keyframes pulse-ring {
            0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
            70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
          }

          .a1 { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.05s both; }
          .a2 { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.15s both; }
          .a3 { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.25s both; }
          .a4 { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.35s both; }

          .logo-dot { animation: pulse-ring 2.8s ease-in-out infinite; }

          .shimmer-text {
            background: linear-gradient(90deg, #fff 0%, #fff 40%, #888 50%, #fff 60%, #fff 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 4s linear infinite;
          }

          /* Stat card */
          .stat-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 20px 24px;
            transition: border-color 0.25s, background 0.25s, transform 0.25s;
          }
          .stat-card:hover {
            border-color: rgba(255,255,255,0.18);
            background: rgba(255,255,255,0.05);
            transform: translateY(-3px);
          }

          /* Booking card */
          .booking-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px;
            padding: 18px;
            transition: border-color 0.25s, background 0.25s;
          }
          .booking-card:hover {
            border-color: rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.04);
          }

          /* Driver detail row */
          .driver-field {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px;
            padding: 10px 14px;
          }

          /* Primary button */
          .btn-primary {
            border-radius: 999px !important;
            background-color: white !important;
            color: black !important;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(255,255,255,0.15);
            background-color: #f0f0f0 !important;
          }
          .btn-primary * { color: black !important; }

          /* Ghost */
          .btn-ghost-sm {
            color: rgba(255,255,255,0.4);
            transition: color 0.2s;
            background: none; border: none; cursor: pointer;
            font-size: 12px; letter-spacing: 0.06em;
            font-family: 'DM Sans', sans-serif;
            text-decoration: none;
          }
          .btn-ghost-sm:hover { color: white; }

          /* Spinner */
          .spinner {
            width: 20px; height: 20px;
            border: 2px solid rgba(255,255,255,0.08);
            border-top-color: rgba(255,255,255,0.4);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }

          /* Live blink */
          .live-dot { animation: blink 1.4s ease-in-out infinite; }

          /* Section label */
          .section-label {
            display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
          }
          .section-label span {
            color: rgba(255,255,255,0.25); font-size: 10px;
            letter-spacing: 0.22em; text-transform: uppercase; white-space: nowrap;
            font-family: 'DM Sans', sans-serif;
          }
          .section-label::after {
            content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06);
          }
        `}</style>

        <div className="page-font min-h-screen bg-black text-white relative overflow-x-hidden">

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Particles */}
          {mounted && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${4 + Math.random() * 5}s ease-in-out ${Math.random() * 3}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          

          <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 mt-10">

            {/* Header */}
            <div className="mb-10 a1">
              <p className="text-neutral-600 text-xs tracking-[0.25em] uppercase mb-2">Rider Dashboard</p>
              <h1 className="display text-6xl md:text-7xl leading-none">
                <span className="shimmer-text">Hey, {user?.name?.split(" ")[0]}.</span>
              </h1>
              <p className="text-neutral-500 text-sm mt-3 font-light">
                Here's an overview of your rides and activity.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 a2 bg-zinc-950">
              {[
                { label: "Total Rides",     value: bookings.length,                                          icon: "🚕" },
                { label: "Active Rides",    value: bookings.filter((b) => b.status === "accepted").length,   icon: "🟢" },
                { label: "Completed",       value: bookings.filter((b) => b.status === "completed").length,  icon: "✅" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="text-xl mb-2">{s.icon}</div>
                  <div className="display text-4xl text-white">{s.value}</div>
                  <div className="text-neutral-600 text-xs tracking-widest uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* DashboardSummary (original component kept) */}
            <div className="mb-6 a2">
              <DashboardSummary
                totalRides={bookings.length}
                activeRides={bookings.filter((b) => b.status === "accepted").length}
                completedRides={bookings.filter((b) => b.status === "completed").length}
              />
            </div>

            {/* CTA */}
            <div className="mb-10 a3">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="btn-primary font-semibold h-12 px-8 text-sm tracking-wide"
                  style={{ color: "black" }}
                >
                  <span style={{ color: "black" }}>+ Book New Ride</span>
                </Button>
              </Link>
            </div>

            {/* Bookings */}
            <div className="a4">
              <div className="section-label"><span>Your Bookings</span></div>

              <Card className="bg-zinc-950 pt-8 border border-white/8 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  {loading || loadingDrivers ? (
                    <div className="py-16 flex flex-col items-center gap-4">
                      <div className="spinner" />
                      <p className="text-neutral-600 text-xs tracking-widest uppercase">
                        Loading bookings…
                      </p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="text-4xl mb-4">🚕</div>
                      <p className="text-neutral-400 font-medium">No rides yet</p>
                      <p className="text-neutral-600 text-sm mt-1">Book your first ride to get started</p>
                      <Link href="/booking">
                        <Button
                          size="sm"
                          className="btn-primary mt-6 px-6 text-xs tracking-wide"
                          style={{ color: "black" }}
                        >
                          <span style={{ color: "black" }}>Book a Ride →</span>
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => {
                        const driver = driverDetails[booking._id!];
                        const status = statusConfig[booking.status] ?? statusConfig.pending;

                        return (
                          <div key={booking._id} className="booking-card">

                            {/* Top row */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {/* Route */}
                                <div className="flex items-start gap-3">
                                  <div className="flex flex-col items-center pt-1 shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-white/60" />
                                    <div className="w-px h-5 bg-white/10 my-0.5" />
                                    <div className="w-2 h-2 rounded-full border border-white/30" />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium truncate">
                                      {booking.pickupLocation}
                                    </p>
                                    <p className="text-neutral-500 text-sm mt-2 truncate">
                                      {booking.dropLocation}
                                    </p>
                                  </div>
                                </div>

                                {booking.fare && (
                                  <p className="text-neutral-600 text-xs mt-3">
                                    Fare:{" "}
                                    <span className="text-neutral-300 font-medium">₹{booking.fare}</span>
                                  </p>
                                )}
                              </div>

                              {/* Status badge */}
                              <div
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${status.text} ${status.bg} ${status.border}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                                    booking.status === "accepted" ? "live-dot" : ""
                                  }`}
                                />
                                {status.label}
                              </div>
                            </div>

                            {/* Driver details (accepted) */}
                            {booking.status === "accepted" && driver && (
                              <>
                                <Separator className="bg-white/5 my-4" />
                                <p className="text-white text-xs tracking-widest uppercase mb-3 opacity-50">
                                  Your Driver
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { label: "Name",    value: driver.name },
                                    { label: "Contact", value: driver.phone },
                                    { label: "Vehicle", value: driver.vehicleNumber },
                                    { label: "License", value: driver.licenseNumber },
                                  ].map((f) => (
                                    <div key={f.label} className="driver-field">
                                      <p className="text-neutral-600 text-xs mb-0.5">{f.label}</p>
                                      <p className="text-white text-sm font-medium">{f.value}</p>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            {booking.status === "accepted" && !driver && !loadingDrivers && (
                              <>
                                <Separator className="bg-white/5 my-4" />
                                <p className="text-neutral-600 text-xs">Fetching driver details…</p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}