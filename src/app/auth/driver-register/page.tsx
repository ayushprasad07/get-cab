"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DriverRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { registerDriver, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      await registerDriver({ name, email, password, phone, vehicleNumber, licenseNumber });
      setTimeout(() => router.push("/dashboard/driver"), 500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "name",          label: "Full Name",      type: "text",     placeholder: "John Doe",      value: name,          setter: setName },
    { id: "email",         label: "Email Address",  type: "email",    placeholder: "your@email.com",value: email,         setter: setEmail },
    { id: "phone",         label: "Phone Number",   type: "tel",      placeholder: "+91 98765 43210",value: phone,        setter: setPhone },
    { id: "vehicleNumber", label: "Vehicle Number", type: "text",     placeholder: "ABC 1234",      value: vehicleNumber, setter: setVehicleNumber },
    { id: "licenseNumber", label: "License Number", type: "text",     placeholder: "LIC 123456",    value: licenseNumber, setter: setLicenseNumber },
  ];

  return (
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

        .badge-animate { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.0s both; }
        .title-animate { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .card-animate  { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .form-animate  { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .error-shake   { animation: errorShake 0.4s ease both; }
        .logo-dot      { animation: pulse-ring 2.8s ease-in-out infinite; }

        /* ── Inputs - FIXED VISIBILITY ── */
        .input-field {
          background: rgba(255,255,255,0.08) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: white !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          border-radius: 10px !important;
          height: 44px;
        }
        .input-field::placeholder { 
          color: rgba(255,255,255,0.3) !important; 
          font-weight: 300 !important;
        }
        .input-field:focus {
          border-color: rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.12) !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08) !important;
          outline: none !important;
        }
        .input-field:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Make text input values visible */
        .input-field[type="text"], 
        .input-field[type="email"], 
        .input-field[type="tel"], 
        .input-field[type="password"] {
          color: white !important;
          -webkit-text-fill-color: white !important;
          opacity: 1 !important;
        }

        /* ── Labels - FIXED VISIBILITY ── */
        label {
          color: rgba(255,255,255,0.7) !important;
          font-weight: 500 !important;
        }

        /* ── Primary button ── */
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
        .btn-primary span { color: black !important; }

        /* ── Spinner ── */
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.7s linear infinite;
        }

        /* ── Show/hide button ── */
        .show-btn {
          color: rgba(255,255,255,0.5) !important;
          transition: color 0.2s;
          background: none; border: none; cursor: pointer;
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        .show-btn:hover { color: rgba(255,255,255,0.9) !important; }

        /* ── Links ── */
        .link-hover {
          color: rgba(255,255,255,0.6) !important;
          transition: color 0.2s;
          text-decoration: none;
          font-weight: 500;
        }
        .link-hover:hover { color: white !important; }

        /* ── Divider ── */
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

        /* ── Section separator ── */
        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 14px;
        }
        .section-label span {
          color: rgba(255,255,255,0.4) !important;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .section-label::before,
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
      `}</style>

      <div className="page-font min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Particles */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 5 + 2}px`,
                  height: `${Math.random() * 5 + 2}px`,
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
            background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-md py-10">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group badge-animate">
            <div className="logo-dot w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
            </div>
            <span className="display text-2xl text-white">GETCAB</span>
          </Link>

          {/* Heading */}
          <div className="text-center mb-8 title-animate">
            
            <h1 className="display text-5xl text-white leading-none">
              Join as Driver
            </h1>
            <p className="text-white/40 text-sm mt-2 font-light">
              Start earning with GetCab today
            </p>
          </div>

          {/* Card */}
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

                {/* ── Personal Info ── */}
                <div className="section-label"><span>Personal Info</span></div>

                <div className="space-y-4">
                  {fields.slice(0, 3).map(({ id, label, type, placeholder, value, setter }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id} className="text-white/60 text-xs tracking-widest uppercase">
                        {label}
                      </Label>
                      <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => { setter(e.target.value); clearError(); }}
                        required
                        disabled={loading}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                {/* ── Vehicle Info ── */}
                <div className="section-label"><span>Vehicle Info</span></div>

                <div className="space-y-4">
                  {fields.slice(3).map(({ id, label, type, placeholder, value, setter }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id} className="text-white/60 text-xs tracking-widest uppercase">
                        {label}
                      </Label>
                      <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => { setter(e.target.value); clearError(); }}
                        required
                        disabled={loading}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                {/* ── Password ── */}
                <div className="section-label"><span>Security</span></div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/60 text-xs tracking-widest uppercase">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="show-btn"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    required
                    disabled={loading}
                    className="input-field"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full font-semibold h-11 text-sm tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="spinner" />
                      Creating account…
                    </span>
                  ) : (
                    <span>Create Account →</span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="divider-line" />
                <span className="text-white/30 text-xs tracking-widest uppercase">or</span>
                <div className="divider-line" />
              </div>

              {/* Footer links */}
              <div className="space-y-3 text-center">
                <p className="text-white/40 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/driver-login" className="link-hover">
                    Sign in
                  </Link>
                </p>
                <p className="text-white/40 text-sm">
                  Looking for a ride instead?{" "}
                  <Link href="/auth/user-register" className="link-hover">
                    Register as user
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom note */}
          <p className="text-center text-white/30 text-xs mt-6 tracking-wide">
            By signing up, you agree to our{" "}
            <a href="#" className="link-hover">Terms</a> &{" "}
            <a href="#" className="link-hover">Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  );
}