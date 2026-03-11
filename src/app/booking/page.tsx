"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center gap-3 min-h-[400px]">
      <div className="map-spinner" />
      <p className="text-neutral-600 text-xs tracking-widest uppercase">Loading map…</p>
    </div>
  ),
});

const mockLocationToCoords = (location: string): { lat: number; lng: number } | null => {
  const locations: Record<string, { lat: number; lng: number }> = {
    "times square":          { lat: 40.7580, lng: -73.9855 },
    "central park":          { lat: 40.7829, lng: -73.9654 },
    "brooklyn":              { lat: 40.6782, lng: -73.9442 },
    "wall street":           { lat: 40.7074, lng: -74.0113 },
    "statue of liberty":     { lat: 40.6892, lng: -74.0445 },
    "empire state building": { lat: 40.7484, lng: -73.9857 },
  };
  return locations[location.toLowerCase().trim()] || null;
};

export default function BookingPage() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation]     = useState("");
  const [pickupCoords, setPickupCoords]     = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading]               = useState(false);
  const [locating, setLocating]             = useState(false);
  const [mounted, setMounted]               = useState(false);
  const { createBooking, error }            = useBooking();
  const router                              = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPickupLocation(v);
    setPickupCoords(mockLocationToCoords(v));
  };

  const handleDropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDropLocation(v);
    setDropCoords(mockLocationToCoords(v));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPickupCoords({ lat: latitude, lng: longitude });
        // Only override the text field if it's empty
        setPickupLocation((prev) => prev || "Current location");
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to fetch current location. Please check permissions.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking({ pickupLocation, dropLocation });
      setTimeout(() => router.push("/dashboard/user"), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bothSelected = pickupCoords && dropCoords;

  return (
    <ProtectedRoute requiredRole="user">
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

          *, .page-font { font-family: 'DM Sans', sans-serif; }
          .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.06em; }

          /* ── Keyframes ── */
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes float {
            from { transform: translateY(0px) rotate(0deg); opacity: 0.05; }
            to   { transform: translateY(-22px) rotate(180deg); opacity: 0.12; }
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
          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%      { transform: translateX(-5px); }
            40%      { transform: translateX(5px); }
            60%      { transform: translateX(-3px); }
            80%      { transform: translateX(3px); }
          }
          @keyframes routePulse {
            0%, 100% { opacity: 0.4; }
            50%      { opacity: 1; }
          }
          @keyframes fareReveal {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* ── Animations ── */
          .a-nav   { animation: fadeIn  0.5s ease 0s both; }
          .a-left  { animation: fadeUp  0.7s cubic-bezier(.16,1,.3,1) 0.1s both; }
          .a-right { animation: fadeIn  0.8s ease 0.2s both; }
          .a-error { animation: errorShake 0.4s ease both; }
          .logo-dot { animation: pulse-ring 2.8s ease-in-out infinite; }

          .shimmer-text {
            background: linear-gradient(90deg,#fff 0%,#fff 35%,#777 50%,#fff 65%,#fff 100%);
            background-size: 200% auto;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 4s linear infinite;
          }

          /* ── Layout ── */
          .split-layout {
            display: grid;
            grid-template-columns: 420px 1fr;
            min-height: 100vh;
          }
          @media (max-width: 900px) {
            .split-layout { grid-template-columns: 1fr; }
            .map-panel { min-height: 400px; }
          }

          /* ── Left panel ── */
          .left-panel {
            background: #000;
            border-right: 1px solid rgba(255,255,255,0.06);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            position: relative;
          }

          /* ── Right panel (map) ── */
          .map-panel {
            background: #0a0a0a;
            position: relative;
            overflow: hidden;
          }
          .map-panel .leaflet-container,
          .map-panel > div { height: 100% !important; min-height: 100%; }

          /* ── Inputs ── */
          .input-field {
            background: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(255,255,255,0.09) !important;
            color: white !important;
            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
            border-radius: 10px !important;
            height: 46px;
            font-size: 14px !important;
          }
          .input-field::placeholder { color: rgba(255,255,255,0.18) !important; }
          .input-field:focus {
            border-color: rgba(255,255,255,0.32) !important;
            background: rgba(255,255,255,0.06) !important;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.04) !important;
            outline: none !important;
          }
          .input-field:disabled { opacity: 0.35; cursor: not-allowed; }

          /* Location input with leading icon */
          .location-input-wrap {
            position: relative;
          }
          .location-input-wrap .loc-icon {
            position: absolute;
            left: 13px; top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            pointer-events: none;
            z-index: 2;
          }
          .location-input-wrap .input-field {
            padding-left: 36px !important;
          }

          /* ── Route connector ── */
          .route-connector {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 38px;
            flex-shrink: 0;
            width: 24px;
          }
          .r-dot {
            width: 10px; height: 10px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.25);
            background: #000;
            transition: background 0.3s, border-color 0.3s;
          }
          .r-dot.active { background: white; border-color: white; }
          .r-line {
            width: 1px; flex: 1; min-height: 32px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.04));
            margin: 3px 0;
          }

          /* ── Fare breakdown ── */
          .fare-panel {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px;
            overflow: hidden;
            transition: border-color 0.4s;
          }
          .fare-panel.active { border-color: rgba(255,255,255,0.15); }

          .fare-row {
            display: flex; align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
          }
          .fare-row + .fare-row {
            border-top: 1px solid rgba(255,255,255,0.05);
          }
          .fare-total-row {
            background: rgba(255,255,255,0.04);
            border-top: 1px solid rgba(255,255,255,0.1) !important;
            padding: 14px 16px;
          }

          .fare-reveal { animation: fareReveal 0.4s cubic-bezier(.16,1,.3,1) both; }

          /* ── Primary CTA ── */
          .btn-book {
            border-radius: 14px !important;
            background: white !important;
            color: black !important;
            height: 52px;
            font-size: 14px !important;
            font-weight: 600 !important;
            letter-spacing: 0.04em;
            transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
            width: 100%;
          }
          .btn-book:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 40px rgba(255,255,255,0.14);
            background: #f0f0f0 !important;
          }
          .btn-book:disabled { opacity: 0.45; cursor: not-allowed; }
          .btn-book * { color: black !important; }

          /* ── Spinner ── */
          .spinner {
            width: 16px; height: 16px;
            border: 2px solid rgba(0,0,0,0.15);
            border-top-color: #000;
            border-radius: 50%;
            display: inline-block;
            animation: spin 0.7s linear infinite;
          }
          .map-spinner {
            width: 28px; height: 28px;
            border: 2px solid rgba(255,255,255,0.06);
            border-top-color: rgba(255,255,255,0.3);
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }

          /* ── Coord chip ── */
          .coord-chip {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 6px; padding: 3px 9px;
            color: rgba(255,255,255,0.3);
            font-size: 10px; font-family: monospace;
          }

          /* ── Map overlay UI ── */
          .map-overlay-top {
            position: absolute; top: 16px; left: 16px; right: 16px;
            z-index: 10;
            display: flex; align-items: center; justify-content: space-between;
            pointer-events: none;
          }
          .map-overlay-chip {
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px;
            padding: 6px 14px;
            color: rgba(255,255,255,0.6);
            font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
            display: flex; align-items: center; gap-6px;
            font-family: 'DM Sans', sans-serif;
          }
          .map-status-dot {
            width: 6px; height: 6px; border-radius: 50%;
            display: inline-block; margin-right: 7px;
          }

          /* ── Section label ── */
          .section-lbl {
            color: rgba(255,255,255,0.22);
            font-size: 10px; letter-spacing: 0.22em;
            text-transform: uppercase;
            font-family: 'DM Sans', sans-serif;
            margin-bottom: 10px;
          }

          /* ── Ghost back btn ── */
          .btn-back {
            color: rgba(255,255,255,0.35);
            background: none; border: none; cursor: pointer;
            font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
            font-family: 'DM Sans', sans-serif;
            transition: color 0.2s;
            padding: 0;
          }
          .btn-back:hover { color: white; }

          /* ── Step number ── */
          .step-num {
            width: 22px; height: 22px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.04);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; color: rgba(255,255,255,0.4);
            flex-shrink: 0;
          }
          .step-num.done {
            background: white; border-color: white; color: black;
          }
        `}</style>

        <div className="page-font min-h-screen bg-black text-white overflow-hidden">

          {/* Particles (left panel only) */}
          {mounted && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ width: "420px" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 3}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="split-layout">

            {/* ══════════════════════════════
                LEFT — Form Panel
            ══════════════════════════════ */}
            <div className="left-panel a-left">

              {/* Grid texture */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Radial glow top-right */}
              <div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col flex-1 p-8">

                {/* Nav */}
                <div className="flex items-center justify-between mb-10 a-nav">
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="logo-dot w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <span className="display text-xl text-white">GETCAB</span>
                  </Link>
                  <button className="btn-back" onClick={() => router.back()}>
                    ← Back
                  </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                  <Badge
                    variant="outline"
                    className="border-white/12 text-neutral-600 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                  >
                    🚕 New Booking
                  </Badge>
                  <h1 className="display text-6xl text-white leading-[0.95] mb-3">
                    <span className="shimmer-text">Book</span>
                    <br />
                    <span className="text-white/20">Your Ride</span>
                  </h1>
                  <p className="text-neutral-600 text-sm font-light leading-relaxed">
                    Tell us where to pick you up
                    <br />
                    and where you&apos;re headed.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="a-error mb-6 flex items-start gap-3 bg-red-500/8 border border-red-500/18 rounded-xl px-4 py-3">
                    <span className="text-red-400 text-sm mt-0.5">⚠</span>
                    <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">

                  {/* Route inputs */}
                  <div>
                    <p className="section-lbl">Route</p>
                    <div className="flex gap-3 items-stretch">

                      {/* Connector */}
                      <div className="route-connector">
                        <div className={`r-dot ${pickupCoords ? "active" : ""}`} />
                        <div className="r-line" />
                        <div className={`r-dot ${dropCoords ? "active" : ""}`} />
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 flex flex-col gap-3">
                        {/* Pickup */}
                        <div>
                          <Label className="text-neutral-600 text-[10px] tracking-widest uppercase block mb-1.5">
                            Pickup
                          </Label>
                          <div className="flex items-center gap-2">
                            <div className="location-input-wrap flex-1">
                              <span className="loc-icon">📍</span>
                              <Input
                                type="text"
                                placeholder="Times Square, Central Park…"
                                value={pickupLocation}
                                onChange={handlePickupChange}
                                required
                                disabled={loading}
                                className="input-field"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={loading || locating}
                              onClick={handleUseCurrentLocation}
                              className="text-[11px] px-3 py-1 text-neutral-400 hover:text-white"
                            >
                              {locating ? "Locating…" : "Use current"}
                            </Button>
                          </div>
                          {pickupCoords && (
                            <div className="coord-chip mt-1.5">
                              {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
                            </div>
                          )}
                        </div>

                        {/* Drop */}
                        <div>
                          <Label className="text-neutral-600 text-[10px] tracking-widest uppercase block mb-1.5">
                            Drop-off
                          </Label>
                          <div className="location-input-wrap">
                            <span className="loc-icon">🏁</span>
                            <Input
                              type="text"
                              placeholder="Brooklyn, Wall Street…"
                              value={dropLocation}
                              onChange={handleDropChange}
                              required
                              disabled={loading}
                              className="input-field"
                            />
                          </div>
                          {dropCoords && (
                            <div className="coord-chip mt-1.5">
                              {dropCoords.lat.toFixed(4)}, {dropCoords.lng.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fare */}
                  <div>
                    <p className="section-lbl">Fare Estimate</p>
                    <div className={`fare-panel ${bothSelected ? "active" : ""}`}>
                      {!bothSelected ? (
                        <div className="fare-row">
                          <span className="text-neutral-700 text-sm">Enter both locations</span>
                          <span className="display text-2xl text-neutral-700">—</span>
                        </div>
                      ) : (
                        <div className="fare-reveal">
                          <div className="fare-row">
                            <span className="text-neutral-500 text-xs">Base fare</span>
                            <span className="text-neutral-400 text-sm">₹50</span>
                          </div>
                          <div className="fare-row">
                            <span className="text-neutral-500 text-xs">Distance charge</span>
                            <span className="text-neutral-400 text-sm">₹80</span>
                          </div>
                          <div className="fare-row">
                            <span className="text-neutral-500 text-xs">Platform fee</span>
                            <span className="text-neutral-400 text-sm">₹20</span>
                          </div>
                          <div className="fare-row fare-total-row">
                            <span className="text-white text-sm font-medium">Total</span>
                            <div className="flex items-baseline gap-1">
                              <span className="display text-3xl text-white">₹150</span>
                              <span className="text-neutral-600 text-xs">approx.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* CTA */}
                  <div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-book"
                      style={{ color: "black" }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2.5" style={{ color: "black" }}>
                          <span className="spinner" />
                          Booking your ride…
                        </span>
                      ) : (
                        <span style={{ color: "black" }}>Confirm Booking →</span>
                      )}
                    </Button>
                    <p className="text-center text-neutral-700 text-xs mt-3">
                      Fare is estimated. Final charge may vary.
                    </p>
                  </div>

                </form>
              </div>
            </div>

            {/* ══════════════════════════════
                RIGHT — Map Panel
            ══════════════════════════════ */}
            <div className="map-panel a-right">

              {/* Map overlay chips */}
              <div className="map-overlay-top">
                <div className="map-overlay-chip">
                  <span
                    className="map-status-dot"
                    style={{
                      background: bothSelected ? "#4ade80" : "rgba(255,255,255,0.3)",
                      boxShadow: bothSelected ? "0 0 6px #4ade80" : "none",
                    }}
                  />
                  {bothSelected ? "Route found" : "Awaiting locations"}
                </div>

                {bothSelected && (
                  <div className="map-overlay-chip" style={{ pointerEvents: "none" }}>
                    🛣 ~4.2 km
                  </div>
                )}
              </div>

              {/* Dark map tint overlay (bottom gradient) */}
              <div
                className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              />

              {/* Map */}
              <div style={{ height: "100%", minHeight: "100vh" }}>
                <MapComponent
                  pickupLocation={pickupCoords || undefined}
                  dropLocation={dropCoords || undefined}
                  height="100%"
                />
              </div>
            </div>

          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}