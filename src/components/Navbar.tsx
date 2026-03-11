"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const { user, driver, role, token, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [mounted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 20;
  const isUser = !!token && role === "user";
  const isDriver = !!token && role === "driver";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
        }
        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.1em;
        }

        @keyframes navFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-animate { animation: navFadeIn 0.6s cubic-bezier(.16,1,.3,1) both; }
        .nav-item { animation: navFadeIn 0.5s cubic-bezier(.16,1,.3,1) both; }
        .nav-item:nth-child(1) { animation-delay: 0.05s; }
        .nav-item:nth-child(2) { animation-delay: 0.12s; }
        .nav-item:nth-child(3) { animation-delay: 0.19s; }
        .nav-item:nth-child(4) { animation-delay: 0.26s; }

        .logo-dot { animation: pulse-ring 2.8s ease-in-out infinite; }

        .nav-btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nav-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,255,255,0.12);
        }
        .nav-btn-ghost {
          transition: color 0.2s, background 0.2s;
        }
        .nav-btn-ghost:hover {
          background: rgba(255,255,255,0.06) !important;
        }
        .nav-btn-danger {
          transition: transform 0.2s, background 0.2s;
        }
        .nav-btn-danger:hover {
          transform: translateY(-1px);
          background: rgba(255,50,50,0.15) !important;
          border-color: rgba(255,80,80,0.4) !important;
        }

        .mobile-menu {
          animation: slideDown 0.25s cubic-bezier(.16,1,.3,1) both;
        }

        .greeting-badge {
          transition: opacity 0.3s;
        }

        .hamburger-line {
          transition: transform 0.25s, opacity 0.25s;
          transform-origin: center;
        }
      `}</style>

      <nav
        className={`nav-root fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/85 backdrop-blur-xl border-b border-white/8"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{ borderBottomColor: isScrolled ? "rgba(255,255,255,0.07)" : "transparent" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group nav-animate">
              <div
                className="logo-dot w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              >
                <div className="w-2.5 h-2.5 bg-black rounded-full" />
              </div>
              <span className="nav-logo text-2xl text-white">GETCAB</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {mounted && (
                <>
                  {isUser ? (
                    <>
                      {/* Greeting */}
                      <div className="nav-item flex items-center gap-2 mr-2">
                        <Badge
                          variant="outline"
                          className="border-white/15 text-neutral-400 text-xs tracking-wider rounded-full px-3 py-1"
                        >
                          👤 {user?.name ?? "User"}
                        </Badge>
                      </div>

                      <div className="nav-item">
                        <Link href="/dashboard/user">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="nav-btn-ghost cursor-pointer text-neutral-400 hover:text-white text-xs tracking-widest uppercase h-9 px-4"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      </div>

                      <div className="nav-item">
                        <Link href="/booking">
                          <Button
                            size="sm"
                            className="nav-btn-primary bg-white text-zinc-900 cursor-pointer hover:bg-white font-semibold rounded-full text-xs tracking-wide h-9 px-5"
                          >
                            Book Ride →
                          </Button>
                        </Link>
                      </div>

                      <div className="nav-item">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={logout}
                          className="nav-btn-danger cursor-pointer border-white/10 text-red-400 hover:text-red-300 bg-transparent rounded-full text-xs tracking-wide h-9 px-4"
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : isDriver ? (
                    <>
                      <div className="nav-item flex items-center gap-2 mr-2">
                        <Badge
                          variant="outline"
                          className="border-white/15 text-neutral-400 text-xs tracking-wider rounded-full px-3 py-1"
                        >
                          🚗 {driver?.name ?? "Driver"}
                        </Badge>
                      </div>

                      <div className="nav-item">
                        <Link href="/dashboard/driver">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="nav-btn-ghost cursor-pointer text-neutral-400 hover:text-white text-xs tracking-widest uppercase h-9 px-4"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      </div>

                      <div className="nav-item">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={logout}
                          className="nav-btn-danger cursor-pointer border-white/10 text-red-400 hover:text-red-300 bg-transparent rounded-full text-xs tracking-wide h-9 px-4"
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="nav-item">
                        <Link href="/auth/user-login">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="nav-btn-ghost cursor-pointer text-neutral-400 hover:text-white text-xs tracking-widest uppercase h-9 px-4"
                          >
                            User Login
                          </Button>
                        </Link>
                      </div>

                      <div className="nav-item">
                        <Link href="/auth/driver-login">
                          <Button
                            size="sm"
                            className="nav-btn-primary bg-white text-zinc-900 cursor-pointer hover:bg-white font-semibold rounded-full text-xs tracking-wide h-9 px-5"
                          >
                            Driver Login
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span
                className="hamburger-line block w-5 h-px bg-white"
                style={menuOpen ? { transform: "translateY(4px) rotate(45deg)" } : {}}
              />
              <span
                className="hamburger-line block w-5 h-px bg-white"
                style={menuOpen ? { opacity: 0 } : {}}
              />
              <span
                className="hamburger-line block w-5 h-px bg-white"
                style={menuOpen ? { transform: "translateY(-4px) rotate(-45deg)" } : {}}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu md:hidden border-t border-white/8 bg-black/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-3">
            {mounted && (
              <>
                {isUser ? (
                  <>
                    <div className="flex items-center gap-2 pb-2 border-b border-white/8">
                      <Badge
                        variant="outline"
                        className="border-white/15 text-neutral-400 text-xs tracking-wider rounded-full px-3 py-1"
                      >
                        👤 {user?.name ?? "User"}
                      </Badge>
                    </div>
                    <Link href="/dashboard/user" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-400 hover:text-white text-xs tracking-widest uppercase">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/booking" onClick={() => setMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-white text-black hover:bg-white font-semibold rounded-full text-xs tracking-wide">
                        Book Ride →
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full border-white/10 text-red-400 bg-transparent rounded-full text-xs">
                      Logout
                    </Button>
                  </>
                ) : isDriver ? (
                  <>
                    <div className="flex items-center gap-2 pb-2 border-b border-white/8">
                      <Badge
                        variant="outline"
                        className="border-white/15 text-neutral-400 text-xs tracking-wider rounded-full px-3 py-1"
                      >
                        🚗 {driver?.name ?? "Driver"}
                      </Badge>
                    </div>
                    <Link href="/dashboard/driver" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-400 hover:text-white text-xs tracking-widest uppercase">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full border-white/10 text-red-400 bg-transparent rounded-full text-xs">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/user-login" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-400 hover:text-white text-xs tracking-widest uppercase">
                        User Login
                      </Button>
                    </Link>
                    <Link href="/auth/driver-login" onClick={() => setMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-white text-black hover:bg-white font-semibold rounded-full text-xs tracking-wide">
                        Driver Login
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};