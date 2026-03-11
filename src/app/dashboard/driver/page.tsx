"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

export default function DriverDashboardPage() {
  const { driver, toggleDriverAvailability } = useAuth();
  const { bookings, getBookings, loading } = useBooking();
  const [mounted, setMounted] = useState(false);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    getBookings();
    const interval = setInterval(getBookings, 5000);
    return () => clearInterval(interval);
  }, [getBookings]);

  const handleToggleAvailability = async () => {
    setTogglingAvail(true);
    await toggleDriverAvailability();
    setTogglingAvail(false);
  };

  const handleAcceptRide = async (bookingId: string) => {
    setAcceptingId(bookingId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/driver/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId }),
      });
      if (res.ok) getBookings();
    } catch (err) { console.error(err); }
    finally { setAcceptingId(null); }
  };

  const handleCompleteRide = async (bookingId: string) => {
    setCompletingId(bookingId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/driver/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId }),
      });
      if (res.ok) getBookings();
    } catch (err) { console.error(err); }
    finally { setCompletingId(null); }
  };

  const pendingBookings  = bookings.filter((b) => b.status === "pending");
  const activeBookings   = bookings.filter((b) => b.status === "accepted");
  const completedCount   = bookings.filter((b) => b.status === "completed").length;
  const isAvailable      = driver?.isAvailable;

  return (
    <ProtectedRoute requiredRole="driver">
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
            50%       { opacity: 0.25; }
          }
          @keyframes pulse-avail {
            0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.35); }
            70%  { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
            100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
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

          /* Ride card */
          .ride-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px;
            padding: 16px;
            transition: border-color 0.25s, background 0.25s;
          }
          .ride-card:hover {
            border-color: rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.04);
          }

          /* Available toggle */
          .avail-on {
            background: rgba(74,222,128,0.12) !important;
            border: 1px solid rgba(74,222,128,0.3) !important;
            color: #4ade80 !important;
            border-radius: 999px !important;
            transition: transform 0.2s, box-shadow 0.2s;
            animation: pulse-avail 2.5s ease-in-out infinite;
          }
          .avail-on:hover { transform: translateY(-1px); }

          .avail-off {
            background: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            color: rgba(255,255,255,0.5) !important;
            border-radius: 999px !important;
            transition: transform 0.2s, background 0.2s;
          }
          .avail-off:hover {
            background: rgba(255,255,255,0.08) !important;
            color: white !important;
            transform: translateY(-1px);
          }

          /* Accept button */
          .btn-accept {
            border-radius: 999px !important;
            background-color: white !important;
            color: black !important;
            transition: transform 0.2s, box-shadow 0.2s;
            font-size: 12px !important;
          }
          .btn-accept:not(:disabled):hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(255,255,255,0.15);
          }
          .btn-accept:disabled { opacity: 0.5; cursor: not-allowed; }
          .btn-accept * { color: black !important; }

          /* Complete button */
          .btn-complete {
            border-radius: 999px !important;
            background: rgba(74,222,128,0.1) !important;
            border: 1px solid rgba(74,222,128,0.25) !important;
            color: #4ade80 !important;
            transition: transform 0.2s, background 0.2s;
            font-size: 12px !important;
          }
          .btn-complete:not(:disabled):hover {
            background: rgba(74,222,128,0.18) !important;
            transform: translateY(-1px);
          }
          .btn-complete:disabled { opacity: 0.5; cursor: not-allowed; }

          /* Spinner */
          .spinner {
            width: 20px; height: 20px;
            border: 2px solid rgba(255,255,255,0.08);
            border-top-color: rgba(255,255,255,0.4);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
          .spinner-sm {
            width: 13px; height: 13px;
            border: 2px solid rgba(0,0,0,0.15);
            border-top-color: #000;
            border-radius: 50%;
            display: inline-block;
            animation: spin 0.7s linear infinite;
          }
          .spinner-sm-green {
            width: 13px; height: 13px;
            border: 2px solid rgba(74,222,128,0.2);
            border-top-color: #4ade80;
            border-radius: 50%;
            display: inline-block;
            animation: spin 0.7s linear infinite;
          }

          /* Live blink */
          .live-dot { animation: blink 1.2s ease-in-out infinite; }

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

          /* Info chip */
          .info-chip {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 4px 10px;
            color: rgba(255,255,255,0.4); font-size: 11px;
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

          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Navbar */}
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 mt-10">

            {/* Header */}
            <div className="mb-10 a1">
              <p className="text-neutral-600 text-xs tracking-[0.25em] uppercase mb-2">Driver Dashboard</p>
              <h1 className="display text-6xl md:text-7xl leading-none">
                <span className="shimmer-text">Hey, {driver?.name?.split(" ")[0]}.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="info-chip">🚗 {driver?.vehicleNumber}</span>
                <span className="info-chip">📋 {driver?.licenseNumber}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 a2">
              {[
                { label: "Available Rides", value: pendingBookings.length,  icon: "🟡", color: "text-yellow-400" },
                { label: "Active Rides",    value: activeBookings.length,   icon: "🔵", color: "text-blue-400"   },
                { label: "Completed",       value: completedCount,          icon: "✅", color: "text-emerald-400"},
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="text-xl mb-2">{s.icon}</div>
                  <div className={`display text-4xl ${s.color}`}>{s.value}</div>
                  <div className="text-neutral-600 text-xs tracking-widest uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Ride panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 a3">

              {/* ── Available rides ── */}
              <div>
                <div className="section-label">
                  <span>Available Rides</span>
                  {pendingBookings.length > 0 && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] flex items-center justify-center">
                      {pendingBookings.length}
                    </span>
                  )}
                </div>

                <Card className="bg-zinc-950 border border-white/8 rounded-2xl overflow-hidden">
                  <CardContent className="p-5">
                    {loading ? (
                      <div className="py-12 flex flex-col items-center gap-3">
                        <div className="spinner" />
                        <p className="text-neutral-600 text-xs tracking-widest uppercase">Checking for rides…</p>
                      </div>
                    ) : pendingBookings.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="text-3xl mb-3">🔍</div>
                        <p className="text-neutral-400 text-sm font-medium">No rides available</p>
                        <p className="text-neutral-600 text-xs mt-1">New requests appear automatically</p>
                        <div className="flex items-center justify-center gap-1.5 mt-3">
                          <span className="w-1 h-1 rounded-full bg-white/20 live-dot" />
                          <span className="text-neutral-700 text-xs">Refreshing every 5s</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingBookings.map((booking) => (
                          <div key={booking._id} className="ride-card">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex flex-col items-center pt-1 shrink-0">
                                <div className="w-2 h-2 rounded-full bg-white/60" />
                                <div className="w-px h-5 bg-white/10 my-0.5" />
                                <div className="w-2 h-2 rounded-full border border-white/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{booking.pickupLocation}</p>
                                <p className="text-neutral-500 text-sm mt-1.5 truncate">{booking.dropLocation}</p>
                                {booking.fare && (
                                  <p className="text-neutral-600 text-xs mt-2">
                                    Fare: <span className="text-neutral-300 font-medium">₹{booking.fare}</span>
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="border-yellow-500/20 text-yellow-400 text-[10px] rounded-full shrink-0">
                                Pending
                              </Badge>
                            </div>
                            <Button
                              onClick={() => handleAcceptRide(booking._id!)}
                              disabled={acceptingId === booking._id}
                              className="btn-accept w-full h-9"
                              style={{ color: "black" }}
                            >
                              {acceptingId === booking._id ? (
                                <span className="flex items-center justify-center gap-2" style={{ color: "black" }}>
                                  <span className="spinner-sm" />
                                  Accepting…
                                </span>
                              ) : (
                                <span style={{ color: "black" }}>Accept Ride →</span>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ── Active rides ── */}
              <div>
                <div className="section-label">
                  <span>Active Rides</span>
                  {activeBookings.length > 0 && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-blue-400/15 border border-blue-400/30 text-blue-400 text-[10px] flex items-center justify-center live-dot">
                      {activeBookings.length}
                    </span>
                  )}
                </div>

                <Card className="bg-zinc-950 p-8 border border-white/8 rounded-2xl overflow-hidden">
                  <CardContent className="p-5">
                    {activeBookings.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="text-3xl mb-3">🚗</div>
                        <p className="text-neutral-400 text-sm font-medium">No active rides</p>
                        <p className="text-neutral-600 text-xs mt-1">Accept a ride to see it here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeBookings.map((booking) => (
                          <div key={booking._id} className="ride-card" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 live-dot" />
                              <span className="text-blue-400 text-xs tracking-wider uppercase">In Progress</span>
                            </div>

                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex flex-col items-center pt-1 shrink-0">
                                <div className="w-2 h-2 rounded-full bg-white/60" />
                                <div className="w-px h-5 bg-white/10 my-0.5" />
                                <div className="w-2 h-2 rounded-full border border-white/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{booking.pickupLocation}</p>
                                <p className="text-neutral-500 text-sm mt-1.5 truncate">{booking.dropLocation}</p>
                                {booking.fare && (
                                  <p className="text-neutral-600 text-xs mt-2">
                                    Fare: <span className="text-neutral-300 font-medium">₹{booking.fare}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            <Separator className="bg-white/5 mb-3" />

                            <Button
                              onClick={() => handleCompleteRide(booking._id!)}
                              disabled={completingId === booking._id}
                              className="btn-complete w-full h-9"
                            >
                              {completingId === booking._id ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span className="spinner-sm-green" />
                                  Completing…
                                </span>
                              ) : (
                                "Mark as Completed ✓"
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}