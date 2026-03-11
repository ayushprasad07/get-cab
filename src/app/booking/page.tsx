"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full bg-neutral-900 flex flex-col items-center justify-center gap-3">
      <div className="map-spinner" />
      <p className="text-neutral-600 text-xs tracking-widest uppercase">Loading map…</p>
    </div>
  ),
});

const mockLocationToCoords = (location: string): { lat: number; lng: number } | null => {
  const locations: Record<string, { lat: number; lng: number }> = {
    "times square":         { lat: 40.7580, lng: -73.9855 },
    "central park":         { lat: 40.7829, lng: -73.9654 },
    "brooklyn":             { lat: 40.6782, lng: -73.9442 },
    "wall street":          { lat: 40.7074, lng: -74.0113 },
    "statue of liberty":    { lat: 40.6892, lng: -74.0445 },
    "empire state building":{ lat: 40.7484, lng: -73.9857 },
  };
  return locations[location.toLowerCase().trim()] || null;
};

export default function BookingPage() {
  const [pickupLocation, setPickupLocation]   = useState("");
  const [dropLocation, setDropLocation]       = useState("");
  const [pickupCoords, setPickupCoords]       = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords]           = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading]                 = useState(false);
  const [mounted, setMounted]                 = useState(false);
  const { createBooking, error }              = useBooking();
  const router                                = useRouter();

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
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

          .page-font { font-family: 'DM Sans', sans-serif; }
          .display   { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            from { transform: translateY(0px) rotate(0deg); opacity: 0.06; }
            to   { transform: translateY(-20px) rotate(180deg); opacity: 0.13; }
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
          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%      { transform: translateX(-6px); }
            40%      { transform: translateX(6px); }
            60%      { transform: translateX(-4px); }
            80%      { transform: translateX(4px); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }

          .title-animate { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.05s both; }
          .card-animate  { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.15s both; }
          .form-animate  { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.25s both; }
          .error-shake   { animation: errorShake 0.4s ease both; }
          .logo-dot      { animation: pulse-ring 2.8s ease-in-out infinite; }

          /* Inputs */
          .input-field {
            background: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: white !important;
            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
            border-radius: 10px !important;
            height: 44px;
          }
          .input-field::placeholder { color: rgba(255,255,255,0.2) !important; }
          .input-field:focus {
            border-color: rgba(255,255,255,0.35) !important;
            background: rgba(255,255,255,0.07) !important;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.05) !important;
            outline: none !important;
          }
          .input-field:disabled { opacity: 0.4; cursor: not-allowed; }

          /* Primary button */
          .btn-primary {
            position: relative;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            border-radius: 999px !important;
            background-color: white !important;
            color: black !important;
          }
          .btn-primary:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(255,255,255,0.15);
            background-color: #f0f0f0 !important;
          }
          .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
          .btn-primary * { color: black !important; }

          /* Ghost button */
          .btn-ghost {
            transition: color 0.2s, background 0.2s;
            border-radius: 999px !important;
          }
          .btn-ghost:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }

          /* Spinner */
          .spinner {
            width: 15px; height: 15px;
            border: 2px solid rgba(0,0,0,0.2);
            border-top-color: #000;
            border-radius: 50%;
            display: inline-block;
            animation: spin 0.7s linear infinite;
          }
          .map-spinner {
            width: 28px; height: 28px;
            border: 2px solid rgba(255,255,255,0.07);
            border-top-color: rgba(255,255,255,0.3);
            border-radius: 50%;
            animation: spin 0.9s linear infinite;
          }

          /* Link */
          .link-hover {
            color: rgba(255,255,255,0.55);
            transition: color 0.2s;
            text-decoration: none;
            font-weight: 500;
          }
          .link-hover:hover { color: white; }

          /* Section label */
          .section-label {
            display: flex; align-items: center; gap: 10px;
            margin: 20px 0 14px;
          }
          .section-label span {
            color: rgba(255,255,255,0.25);
            font-size: 10px; letter-spacing: 0.2em;
            text-transform: uppercase; white-space: nowrap;
            font-family: 'DM Sans', sans-serif;
          }
          .section-label::before,
          .section-label::after {
            content: ''; flex: 1; height: 1px;
            background: rgba(255,255,255,0.07);
          }

          /* Coords badge */
          .coord-chip {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px; padding: 3px 8px;
            color: rgba(255,255,255,0.35);
            font-size: 10px; font-family: monospace; letter-spacing: 0.04em;
          }
          .coord-dot {
            width: 5px; height: 5px; border-radius: 50%;
            display: inline-block;
          }

          /* Fare card */
          .fare-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 16px;
            transition: border-color 0.3s;
          }
          .fare-card.active {
            border-color: rgba(255,255,255,0.18);
            background: rgba(255,255,255,0.05);
          }

          /* Step dot connector */
          .step-line {
            width: 1px; height: 28px; margin: 2px auto;
            background: linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.05));
          }
          .step-dot {
            width: 10px; height: 10px; border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.4);
            background: black;
            margin: 0 auto;
          }
          .step-dot.filled {
            background: white;
            border-color: white;
          }

          /* Map container */
          .map-wrap {
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.08);
          }
          .map-header {
            background: rgba(255,255,255,0.03);
            border-bottom: 1px solid rgba(255,255,255,0.07);
            padding: 10px 16px;
            display: flex; align-items: center; justify-content: space-between;
          }
        `}</style>

        <div className="page-font min-h-screen bg-black text-white relative overflow-x-hidden">

          {/* Grid background */}
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
              background: "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          
          <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

            {/* Heading */}
            <div className="mb-8 title-animate">
              <Badge
                variant="outline"
                className="border-white/15 text-neutral-500 text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-4"
              >
                🚕 New Booking
              </Badge>
              <h1 className="display text-6xl text-white leading-none">
                Book a Ride
              </h1>
              <p className="text-neutral-500 text-sm mt-2 font-light">
                Enter your pickup and drop-off to get started
              </p>
            </div>

            {/* Main card */}
            <Card className="card-animate bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden">
              <CardContent className="p-7">

                {/* Error */}
                {error && (
                  <div className="error-shake mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="form-animate">
                  <div className="section-label"><span>Route</span></div>

                  {/* Location inputs with visual connector */}
                  <div className="flex gap-4">
                    {/* Step dots */}
                    <div className="flex flex-col items-center pt-9 shrink-0">
                      <div className={`step-dot ${pickupCoords ? "filled" : ""}`} />
                      <div className="step-line" />
                      <div className={`step-dot ${dropCoords ? "filled" : ""}`} />
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-4">
                      {/* Pickup */}
                      <div className="space-y-2">
                        <Label className="text-neutral-400 text-xs tracking-widest uppercase">
                          Pickup Location
                        </Label>
                        <Input
                          id="pickup"
                          type="text"
                          placeholder="e.g., Times Square, Central Park"
                          value={pickupLocation}
                          onChange={handlePickupChange}
                          required
                          disabled={loading}
                          className="input-field"
                        />
                        {pickupCoords && (
                          <div className="coord-chip">
                            <span className="coord-dot" style={{ background: "rgba(255,255,255,0.5)" }} />
                            {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
                          </div>
                        )}
                      </div>

                      {/* Drop */}
                      <div className="space-y-2">
                        <Label className="text-neutral-400 text-xs tracking-widest uppercase">
                          Drop-off Location
                        </Label>
                        <Input
                          id="drop"
                          type="text"
                          placeholder="e.g., Brooklyn, Wall Street"
                          value={dropLocation}
                          onChange={handleDropChange}
                          required
                          disabled={loading}
                          className="input-field"
                        />
                        {dropCoords && (
                          <div className="coord-chip">
                            <span className="coord-dot" style={{ background: "rgba(255,255,255,0.8)" }} />
                            {dropCoords.lat.toFixed(4)}, {dropCoords.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fare estimate */}
                  <div className="section-label"><span>Fare Estimate</span></div>

                  <div className={`fare-card ${bothSelected ? "active" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">Estimated Total</p>
                        <p className="text-neutral-500 text-xs mt-0.5">
                          {bothSelected
                            ? "Based on selected route distance"
                            : "Enter both locations to see estimate"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="display text-3xl text-white">
                          {bothSelected ? "₹150" : "—"}
                        </span>
                        {bothSelected && (
                          <p className="text-neutral-600 text-xs mt-0.5">approx.</p>
                        )}
                      </div>
                    </div>

                    {bothSelected && (
                      <>
                        <Separator className="bg-white/5 my-3" />
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span>Base fare</span><span className="text-neutral-400">₹50</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-600 mt-1">
                          <span>Distance charge</span><span className="text-neutral-400">₹80</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-600 mt-1">
                          <span>Platform fee</span><span className="text-neutral-400">₹20</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full font-semibold h-11 text-sm tracking-wide mt-6"
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
                </form>
              </CardContent>
            </Card>

            {/* Map card */}
            <div className="card-animate mt-5">
              <div className="map-wrap">
                <div className="map-header">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-neutral-400 text-xs tracking-widest uppercase">
                      Route Preview
                    </span>
                  </div>
                  {bothSelected ? (
                    <Badge
                      variant="outline"
                      className="border-white/15 text-neutral-500 text-xs rounded-full px-2 py-0.5"
                    >
                      Route found
                    </Badge>
                  ) : (
                    <span className="text-neutral-700 text-xs">Enter locations above</span>
                  )}
                </div>
                <MapComponent
                  pickupLocation={pickupCoords || undefined}
                  dropLocation={dropCoords || undefined}
                  height="350px"
                />
              </div>
            </div>

          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}