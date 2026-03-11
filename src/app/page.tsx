"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Floating particle component
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full bg-white opacity-10 pointer-events-none"
      style={style}
    />
  );
}

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => {
    const base = i + 1;
    const width = (base * 7) % 6 + 2; // 2px - 8px
    const height = (base * 11) % 6 + 2;
    const top = (base * 37) % 100; // 0% - 99%
    const left = (base * 53) % 100;
    const duration = 4 + ((base * 13) % 60) / 10; // 4s - 10s
    const delay = ((base * 17) % 30) / 10; // 0s - 3s

    return {
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}%`,
      left: `${left}%`,
      animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
    };
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { font-family: 'DM Sans', sans-serif; }

        .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }

        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); opacity: 0.06; }
          to   { transform: translateY(-24px) rotate(180deg); opacity: 0.14; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lineExpand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes borderSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .hero-title    { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .hero-sub      { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .hero-badge    { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.05s both; }
        .hero-cta      { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.45s both; }
        .hero-stats    { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.6s both; }
        .section-line  { animation: lineExpand 0.8s cubic-bezier(.16,1,.3,1) 0.2s both; transform-origin: left; }
        .card-1        { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .card-2        { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.25s both; }
        .card-3        { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.4s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #fff 40%, #888 50%, #fff 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        .feature-card {
          transition: transform 0.35s cubic-bezier(.16,1,.3,1), border-color 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.3) !important; }
        .feature-card:hover::before { opacity: 1; }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,255,255,0.15); }
        .btn-primary:hover::after { opacity: 1; }

        .marquee-track { animation: marquee 22s linear infinite; }

        .glow-dot { animation: pulse-ring 2.5s ease-in-out infinite; }

        .spotlight {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.08s, top 0.08s;
          z-index: 0;
        }

        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.15); }

        .cta-border {
          position: relative;
        }
        .cta-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05), rgba(255,255,255,0.2));
          z-index: -1;
        }
      `}</style>

      {/* Cursor spotlight */}
      <div
        className="spotlight"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navbar */}
      

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative">
            <div className="hero-badge mb-6">
              <Badge
                variant="outline"
                className="border-white/20 text-neutral-400 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
              >
                🚕 Now available in 50+ cities
              </Badge>
            </div>

            <h1 className="hero-title display text-[clamp(4rem,14vw,11rem)] leading-none mb-6 tracking-wide">
              <span className="block shimmer-text">Your Ride.</span>
              <span className="block text-white/20">Your Rules.</span>
            </h1>

            <p className="hero-sub text-neutral-400 text-lg md:text-xl max-w-lg mx-auto mb-10 font-light leading-relaxed">
              Book a cab in seconds or earn on your own schedule.
              <br />
              <span className="text-white/60">Simple. Transparent. Reliable.</span>
            </p>

            <div className="hero-cta flex flex-wrap gap-3 justify-center mb-16">
              <Link href="/auth/user-login">
                <Button
                  size="lg"
                  className="btn-primary bg-white text-zinc-950 hover:bg-white font-semibold rounded-full px-8 h-12 text-sm tracking-wide"
                >
                  Book a Ride →
                </Button>
              </Link>
              <Link href="/auth/driver-login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full px-8 h-12 text-sm tracking-wide transition-all"
                >
                  Become a Driver
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats flex items-center justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="display text-4xl md:text-5xl text-white">
                  <Counter target={50000} suffix="+" />
                </div>
                <div className="text-neutral-500 text-xs tracking-widest uppercase mt-1">
                  Rides Daily
                </div>
              </div>
              <div className="stat-divider" />
              <div className="text-center">
                <div className="display text-4xl md:text-5xl text-white">
                  <Counter target={12000} suffix="+" />
                </div>
                <div className="text-neutral-500 text-xs tracking-widest uppercase mt-1">
                  Drivers
                </div>
              </div>
              <div className="stat-divider" />
              <div className="text-center">
                <div className="display text-4xl md:text-5xl text-white">
                  <Counter target={98} suffix="%" />
                </div>
                <div className="text-neutral-500 text-xs tracking-widest uppercase mt-1">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <div className="w-px h-12 bg-white/40 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
              Scroll
            </span>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="border-y border-white/10 py-4 overflow-hidden bg-white/[0.02]">
          <div className="marquee-track flex items-center gap-12 whitespace-nowrap w-max">
            {[
              "Easy Booking",
              "Safe Drivers",
              "Live Tracking",
              "Upfront Pricing",
              "24/7 Support",
              "Instant Pickup",
              "No Hidden Fees",
              "Easy Booking",
              "Safe Drivers",
              "Live Tracking",
              "Upfront Pricing",
              "24/7 Support",
              "Instant Pickup",
              "No Hidden Fees",
            ].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-12 text-neutral-600 text-sm tracking-widest uppercase"
              >
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 inline-block" />
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="max-w-6xl mx-auto px-6 py-28">
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-5">
              <div className="section-line h-px bg-white/30 w-12" />
              <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
                Features
              </span>
            </div>
            <h2 className="display text-5xl md:text-7xl text-white leading-none">
              Why GetCab?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Easy Booking",
                sub: "Book a ride in seconds",
                body: "A clean, distraction-free interface gets you from tap to confirmed in under 30 seconds.",
                icon: "⚡",
                cls: "card-1",
              },
              {
                num: "02",
                title: "Reliable Drivers",
                sub: "Vetted & trusted",
                body: "Every driver passes thorough background checks, vehicle inspections, and ongoing performance reviews.",
                icon: "🛡",
                cls: "card-2",
              },
              {
                num: "03",
                title: "Great Rates",
                sub: "Transparent pricing",
                body: "See your exact fare before you confirm. No surge surprises, no hidden fees, ever.",
                icon: "💡",
                cls: "card-3",
              },
            ].map((f) => (
              <Card
                key={f.num}
                className={`feature-card bg-zinc-950 border border-white/10 rounded-xl ${f.cls}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{f.icon}</span>
                    <span className="display text-5xl text-white/5">
                      {f.num}
                    </span>
                  </div>
                  <CardTitle className="text-white text-xl font-semibold">
                    {f.title}
                  </CardTitle>
                  <CardDescription className="text-neutral-500 text-xs tracking-widest uppercase">
                    {f.sub}
                  </CardDescription>
                </CardHeader>
                <Separator className="bg-white/5 mx-6 mb-4 w-auto" />
                <CardContent>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {f.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-5">
              <div className="section-line h-px bg-white/30 w-12" />
              <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
                Process
              </span>
            </div>
            <h2 className="display text-5xl md:text-7xl text-white leading-none">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { step: "01", label: "Create account", desc: "Sign up in 60 seconds" },
              { step: "02", label: "Set destination", desc: "Enter where you're going" },
              { step: "03", label: "Match driver", desc: "We find your nearest driver" },
              { step: "04", label: "Enjoy your ride", desc: "Sit back and relax" },
            ].map((s, i) => (
              <div key={s.step} className="relative group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-7 left-full w-full h-px bg-white/10 z-10 -translate-x-1/2" />
                )}
                <div className="p-6 rounded-xl border border-white/0 group-hover:border-white/10 group-hover:bg-white/[0.02] transition-all duration-300">
                  <div className="display text-6xl text-white/5 mb-4 group-hover:text-white/10 transition-colors">
                    {s.step}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-white mb-4" />
                  <div className="text-white font-medium mb-1">{s.label}</div>
                  <div className="text-neutral-500 text-sm">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="cta-border bg-neutral-950 rounded-xl p-14 text-center relative overflow-hidden">
            {/* Radial glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-96 h-96 rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, white 0%, transparent 70%)",
                }}
              />
            </div>

            <div className="relative">
              <Badge
                variant="outline"
                className="border-white/20 text-neutral-500 text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-6"
              >
                Join the movement
              </Badge>

              <h2 className="display text-5xl md:text-8xl text-white mb-4 leading-none">
                Ready to
                <br />
                <span className="shimmer-text">Roll?</span>
              </h2>

              <p className="text-neutral-400 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                Join thousands who trust GetCab every day for safe, affordable,
                and on-time rides across the city.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/user-register">
                  <Button
                    size="lg"
                    className="btn-primary bg-white text-zinc-950 hover:bg-white font-semibold rounded-full px-10 h-12 text-sm tracking-wide"
                  >
                    Sign Up as Rider
                  </Button>
                </Link>
                <Link href="/auth/driver-register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full px-10 h-12 text-sm tracking-wide transition-all"
                  >
                    Sign Up as Driver
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 px-6 py-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <span className="display text-lg tracking-widest">GETCAB</span>
          </div>
          <p className="text-neutral-600 text-xs tracking-wider">
            © 2025 GetCab. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-neutral-600 hover:text-white text-xs tracking-wider transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}