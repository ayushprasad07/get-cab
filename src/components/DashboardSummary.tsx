import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardSummaryProps {
  totalRides: number;
  activeRides: number;
  completedRides: number;
}

export function DashboardSummary({
  totalRides,
  activeRides,
  completedRides,
}: DashboardSummaryProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .ds-font   { font-family: 'DM Sans', sans-serif; }
        .ds-display{ font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }

        @keyframes ds-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ds-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        @keyframes ds-pulse-btn {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); }
          70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }

        .ds-c1 { animation: ds-fadeUp 0.5s cubic-bezier(.16,1,.3,1) 0.05s both; }
        .ds-c2 { animation: ds-fadeUp 0.5s cubic-bezier(.16,1,.3,1) 0.13s both; }
        .ds-c3 { animation: ds-fadeUp 0.5s cubic-bezier(.16,1,.3,1) 0.21s both; }
        .ds-c4 { animation: ds-fadeUp 0.5s cubic-bezier(.16,1,.3,1) 0.29s both; }

        .ds-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px 22px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
        }
        .ds-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ds-card:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.05);
          transform: translateY(-3px);
        }
        .ds-card:hover::before { opacity: 1; }

        .ds-card-cta {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px 22px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .ds-card-cta:hover {
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-3px);
        }

        .ds-live { animation: ds-blink 1.3s ease-in-out infinite; }

        .ds-btn {
          border-radius: 999px !important;
          background-color: white !important;
          color: black !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: ds-pulse-btn 2.5s ease-in-out infinite;
          width: 100%;
        }
        .ds-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(255,255,255,0.15);
          background-color: #f0f0f0 !important;
        }
        .ds-btn * { color: black !important; }

        .ds-label {
          color: rgba(255,255,255,0.25);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="ds-font grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">

        {/* Total Rides */}
        <div className="ds-card ds-c1">
          <div className="text-lg mb-3">🚕</div>
          <div className="ds-display text-4xl text-white">{totalRides}</div>
          <div className="ds-label mt-1">Total Rides</div>
          <div className="text-neutral-700 text-xs mt-0.5">All time</div>
        </div>

        {/* Active Rides */}
        <div className="ds-card ds-c2">
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className="w-2 h-2 rounded-full bg-blue-400 ds-live"
            />
            <span className="text-blue-400 text-xs tracking-wider uppercase">Live</span>
          </div>
          <div className="ds-display text-4xl text-blue-400">{activeRides}</div>
          <div className="ds-label mt-1">Active Rides</div>
          <div className="text-neutral-700 text-xs mt-0.5">In progress</div>
        </div>

        {/* Completed */}
        <div className="ds-card ds-c3">
          <div className="text-lg mb-3">✅</div>
          <div className="ds-display text-4xl text-emerald-400">{completedRides}</div>
          <div className="ds-label mt-1">Completed</div>
          <div className="text-neutral-700 text-xs mt-0.5">Successfully finished</div>
        </div>

        {/* Quick Action */}
        <div className="ds-card-cta ds-c4">
          <div>
            <div className="text-lg mb-1">⚡</div>
            <div className="text-white text-sm font-medium mt-2">Quick Action</div>
            <div className="text-neutral-600 text-xs mt-0.5">Book a new ride instantly</div>
          </div>
          <div className="mt-4">
            <Link href="/booking">
              <Button
                size="sm"
                className="ds-btn h-9"
                style={{ color: "black" }}
              >
                <span style={{ color: "black" }}>Book Ride →</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}