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

export default function UserRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { registerUser, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      await registerUser({ name, email, password, phone });
      setTimeout(() => router.push("/dashboard/user"), 500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.7s linear infinite;
        }

        .show-btn {
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
          background: none; border: none; cursor: pointer;
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        .show-btn:hover { color: rgba(255,255,255,0.7); }

        .link-hover {
          color: rgba(255,255,255,0.55);
          transition: color 0.2s;
          text-decoration: none;
          font-weight: 500;
        }
        .link-hover:hover { color: white; }

        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 14px;
        }
        .section-label span {
          color: rgba(255,255,255,0.25);
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

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
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
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
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
              Get Started
            </h1>
            <p className="text-neutral-500 text-sm mt-2 font-light">
              Create your account and book rides in seconds
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
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-neutral-400 text-xs tracking-widest uppercase">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearError(); }}
                      required
                      disabled={loading}
                      className="input-field"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-neutral-400 text-xs tracking-widest uppercase">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      required
                      disabled={loading}
                      className="input-field"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-neutral-400 text-xs tracking-widest uppercase">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearError(); }}
                      required
                      disabled={loading}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* ── Security ── */}
                <div className="section-label"><span>Security</span></div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-neutral-400 text-xs tracking-widest uppercase">
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
                  style={{ color: "black" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5" style={{ color: "black" }}>
                      <span className="spinner" />
                      Creating account…
                    </span>
                  ) : (
                    <span style={{ color: "black" }}>Create Account →</span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="divider-line" />
                <span className="text-neutral-700 text-xs tracking-widest uppercase">or</span>
                <div className="divider-line" />
              </div>

              {/* Footer links */}
              <div className="space-y-3 text-center">
                <p className="text-neutral-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/user-login" className="link-hover">
                    Sign in
                  </Link>
                </p>
                <p className="text-neutral-600 text-sm">
                  Want to drive instead?{" "}
                  <Link href="/auth/driver-register" className="link-hover">
                    Register as driver
                  </Link>
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Bottom note */}
          <p className="text-center text-neutral-700 text-xs mt-6 tracking-wide">
            By signing up, you agree to our{" "}
            <a href="#" className="link-hover">Terms</a> &{" "}
            <a href="#" className="link-hover">Privacy Policy</a>
          </p>

        </div>
      </div>
    </>
  );
}