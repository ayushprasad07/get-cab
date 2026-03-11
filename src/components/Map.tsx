"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  pickupLocation?: { lat: number; lng: number };
  dropLocation?: { lat: number; lng: number };
  height?: string;
}

const MapComponent: React.FC<MapProps> = ({
  pickupLocation,
  dropLocation,
  height = "300px",
}) => {
  const mapRef        = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef   = useRef<L.Polyline | null>(null);
  const isClient      = typeof window !== "undefined";

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    /* ── Init map ── */
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([40.7128, -74.006], 13);

      /* Dark map tiles (CartoDB Dark Matter) */
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapInstanceRef.current);

      /* Custom zoom control — bottom right, styled */
      L.control
        .zoom({ position: "bottomright" })
        .addTo(mapInstanceRef.current);

      /* Minimal attribution — bottom left */
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    /* ── Clear existing markers & polyline ── */
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    /* ── Custom SVG icon factory ── */
    const makeIcon = (color: string, label: string) =>
      L.divIcon({
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
        html: `
          <div style="
            width:36px; height:36px; position:relative;
            filter: drop-shadow(0 4px 12px ${color}66);
          ">
            <svg viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:36px;height:44px;position:absolute;top:0;left:0;">
              <path d="M18 2C10.268 2 4 8.268 4 16c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"
                fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
              <text x="18" y="20" text-anchor="middle" dominant-baseline="middle"
                fill="black" font-size="12" font-weight="700"
                font-family="system-ui, sans-serif">${label}</text>
            </svg>
          </div>
        `,
      });

    const pickupIcon = makeIcon("#ffffff", "A");
    const dropIcon   = makeIcon("#e5e5e5", "B");

    /* ── Pickup marker ── */
    if (pickupLocation) {
      L.marker([pickupLocation.lat, pickupLocation.lng], {
        icon: pickupIcon,
        title: "Pickup",
      })
        .bindPopup(
          `<div style="
            font-family:'DM Sans',sans-serif;
            background:#111; color:#fff;
            border:1px solid rgba(255,255,255,0.12);
            border-radius:10px; padding:10px 14px;
            font-size:13px; min-width:120px;
          ">
            <div style="font-weight:600;margin-bottom:2px;">📍 Pickup</div>
            <div style="color:rgba(255,255,255,0.45);font-size:11px;">
              ${pickupLocation.lat.toFixed(4)}, ${pickupLocation.lng.toFixed(4)}
            </div>
          </div>`,
          {
            className: "custom-popup",
            closeButton: false,
            maxWidth: 220,
          }
        )
        .addTo(map);
    }

    /* ── Drop marker ── */
    if (dropLocation) {
      L.marker([dropLocation.lat, dropLocation.lng], {
        icon: dropIcon,
        title: "Drop-off",
      })
        .bindPopup(
          `<div style="
            font-family:'DM Sans',sans-serif;
            background:#111; color:#fff;
            border:1px solid rgba(255,255,255,0.12);
            border-radius:10px; padding:10px 14px;
            font-size:13px; min-width:120px;
          ">
            <div style="font-weight:600;margin-bottom:2px;">🏁 Drop-off</div>
            <div style="color:rgba(255,255,255,0.45);font-size:11px;">
              ${dropLocation.lat.toFixed(4)}, ${dropLocation.lng.toFixed(4)}
            </div>
          </div>`,
          {
            className: "custom-popup",
            closeButton: false,
            maxWidth: 220,
          }
        )
        .addTo(map);
    }

    /* ── Route polyline ── */
    if (pickupLocation && dropLocation) {
      polylineRef.current = L.polyline(
        [
          [pickupLocation.lat, pickupLocation.lng],
          [dropLocation.lat, dropLocation.lng],
        ],
        {
          color: "rgba(255,255,255,0.7)",
          weight: 2.5,
          dashArray: "6 6",
          lineCap: "round",
          lineJoin: "round",
        }
      ).addTo(map);

      /* Subtle glow duplicate under the dashed line */
      L.polyline(
        [
          [pickupLocation.lat, pickupLocation.lng],
          [dropLocation.lat, dropLocation.lng],
        ],
        {
          color: "rgba(255,255,255,0.12)",
          weight: 8,
          lineCap: "round",
        }
      ).addTo(map);

      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [dropLocation.lat, dropLocation.lng]
      );
      map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 0.8 });
    } else if (pickupLocation) {
      map.setView([pickupLocation.lat, pickupLocation.lng], 15, { animate: true, duration: 0.6 });
    } else if (dropLocation) {
      map.setView([dropLocation.lat, dropLocation.lng], 15, { animate: true, duration: 0.6 });
    }

  }, [pickupLocation, dropLocation, isClient]);

  if (!isClient) {
    return (
      <div
        style={{ height, width: "100%" }}
        className="bg-neutral-950 flex flex-col items-center justify-center gap-3"
      >
        <div style={{
          width: 28, height: 28,
          border: "2px solid rgba(255,255,255,0.07)",
          borderTopColor: "rgba(255,255,255,0.3)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }} />
        <p style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
          fontFamily: "DM Sans, sans-serif",
        }}>
          Loading map…
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ── Dark map tile overrides ── */
        .leaflet-container {
          background: #0a0a0a !important;
          font-family: 'DM Sans', sans-serif !important;
        }

        /* Zoom control */
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          margin: 0 12px 12px 0 !important;
        }
        .leaflet-control-zoom a {
          background: rgba(0,0,0,0.8) !important;
          backdrop-filter: blur(10px) !important;
          color: rgba(255,255,255,0.6) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          width: 32px !important; height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
          transition: background 0.2s, color 0.2s !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        .leaflet-control-zoom-out {
          border-bottom: none !important;
        }

        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(8px) !important;
          color: rgba(255,255,255,0.2) !important;
          font-size: 9px !important;
          padding: 3px 8px !important;
          border-radius: 6px 6px 0 0 !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-bottom: none !important;
          margin: 0 !important;
        }
        .leaflet-control-attribution a {
          color: rgba(255,255,255,0.35) !important;
        }

        /* Popup */
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .custom-popup .leaflet-popup-tip-container { display: none !important; }

        /* Disable default marker outline */
        .leaflet-marker-icon:focus { outline: none !important; }

        /* Smooth pan animation */
        .leaflet-zoom-anim .leaflet-zoom-animated {
          transition: transform 0.35s cubic-bezier(.16,1,.3,1) !important;
        }
      `}</style>

      <div
        ref={mapRef}
        style={{ height, width: "100%", display: "block" }}
      />
    </>
  );
};

export default MapComponent;