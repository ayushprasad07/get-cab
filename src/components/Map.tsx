"use client";

import React, { useEffect, useState, useRef } from "react";
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapRef, ViewState } from 'react-map-gl/maplibre';


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
  const mapRef = useRef<MapRef>(null);
  const isClient = typeof window !== "undefined";
  
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 13
  });

  const [activePopup, setActivePopup] = useState<'pickup' | 'drop' | null>(null);

  // Update map view when locations change
  useEffect(() => {
    if (!mapRef.current || (!pickupLocation && !dropLocation)) return;

    if (pickupLocation && dropLocation) {
      // Fit bounds to show both markers
      const bounds = {
        minLng: Math.min(pickupLocation.lng, dropLocation.lng),
        maxLng: Math.max(pickupLocation.lng, dropLocation.lng),
        minLat: Math.min(pickupLocation.lat, dropLocation.lat),
        maxLat: Math.max(pickupLocation.lat, dropLocation.lat),
      };

      mapRef.current.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat]
        ],
        { padding: 60, duration: 800 }
      );
    } else if (pickupLocation) {
      mapRef.current.flyTo({
        center: [pickupLocation.lng, pickupLocation.lat],
        zoom: 15,
        duration: 600
      });
    } else if (dropLocation) {
      mapRef.current.flyTo({
        center: [dropLocation.lng, dropLocation.lat],
        zoom: 15,
        duration: 600
      });
    }
  }, [pickupLocation, dropLocation]);

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

  // Custom marker component
  const CustomMarker = ({ 
    position, 
    color, 
    label, 
    type 
  }: { 
    position: { lat: number; lng: number }; 
    color: string; 
    label: string;
    type: 'pickup' | 'drop';
  }) => (
    <Marker
      longitude={position.lng}
      latitude={position.lat}
      onClick={e => {
        e.originalEvent.stopPropagation();
        setActivePopup(type);
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          position: 'relative',
          filter: `drop-shadow(0 4px 12px ${color}66)`,
          cursor: 'pointer',
          transform: 'translate(-50%, -100%)', // Anchor point at bottom center
        }}
        onMouseEnter={() => setActivePopup(type)}
        onMouseLeave={() => setActivePopup(null)}
      >
        <svg viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 36, height: 44 }}>
          <path
            d="M18 2C10.268 2 4 8.268 4 16c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"
            fill={color}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          />
          <text
            x="18"
            y="20"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            {label}
          </text>
        </svg>
      </div>
    </Marker>
  );

  return (
    <>
      <style>{`
        /* Dark theme overrides for maplibre */
        .maplibregl-map {
          font-family: 'DM Sans', sans-serif !important;
          background: #0a0a0a !important;
        }
        
        .maplibregl-canvas-container {
          background: #0a0a0a;
        }

        /* Navigation control styling */
        .maplibregl-ctrl-group {
          background: rgba(0,0,0,0.8) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          margin: 0 12px 12px 0 !important;
        }
        
        .maplibregl-ctrl-group button {
          background: transparent !important;
          color: rgba(255,255,255,0.6) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          width: 32px !important;
          height: 32px !important;
          transition: background 0.2s, color 0.2s !important;
        }
        
        .maplibregl-ctrl-group button:hover {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .maplibregl-ctrl-group button:last-child {
          border-bottom: none !important;
        }

        /* Attribution control */
        .maplibregl-ctrl-attrib {
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
        
        .maplibregl-ctrl-attrib a {
          color: rgba(255,255,255,0.35) !important;
        }

        /* Popup styling */
        .maplibregl-popup {
          max-width: 220px !important;
        }
        
        .maplibregl-popup-content {
          background: #111 !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 13px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
        }
        
        .maplibregl-popup-tip {
          border-top-color: #111 !important;
          border-bottom-color: #111 !important;
        }
        
        .maplibregl-popup-close-button {
          color: rgba(255,255,255,0.3) !important;
          font-size: 16px !important;
          padding: 5px !important;
        }
        
        .maplibregl-popup-close-button:hover {
          color: white !important;
          background: transparent !important;
        }

        /* Custom animation for smooth transitions */
        .maplibregl-canvas {
          transition: all 0.35s cubic-bezier(.16,1,.3,1) !important;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" // Dark theme
        attributionControl={false} // We'll add custom attribution
        reuseMaps
      >
        {/* Custom Navigation Control (bottom right) */}
        <NavigationControl position="bottom-right" showCompass={false} />
        
        {/* Custom Attribution (bottom left) */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}>
          <div className="maplibregl-ctrl-attrib">
            © OpenStreetMap, © CARTO
          </div>
        </div>

        {/* Pickup Marker */}
        {pickupLocation && (
          <CustomMarker
            position={pickupLocation}
            color="#ffffff"
            label="A"
            type="pickup"
          />
        )}

        {/* Drop Marker */}
        {dropLocation && (
          <CustomMarker
            position={dropLocation}
            color="#e5e5e5"
            label="B"
            type="drop"
          />
        )}

        {/* Pickup Popup */}
        {pickupLocation && activePopup === 'pickup' && (
          <Popup
            longitude={pickupLocation.lng}
            latitude={pickupLocation.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setActivePopup(null)}
            anchor="bottom"
            offset={[0, -36]} // Adjust for marker height
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>📍 Pickup</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        )}

        {/* Drop Popup */}
        {dropLocation && activePopup === 'drop' && (
          <Popup
            longitude={dropLocation.lng}
            latitude={dropLocation.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setActivePopup(null)}
            anchor="bottom"
            offset={[0, -36]} // Adjust for marker height
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>🏁 Drop-off</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {dropLocation.lat.toFixed(4)}, {dropLocation.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        )}

        {/* Route line between pickup and drop */}
        {pickupLocation && dropLocation && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [pickupLocation.lng, pickupLocation.lat],
                  [dropLocation.lng, dropLocation.lat]
                ]
              }
            }}
          >
            {/* Subtle glow layer */}
            <Layer
              id="route-glow"
              type="line"
              paint={{
                'line-color': 'rgba(255,255,255,0.12)',
                'line-width': 8,
                'line-opacity': 0.5
              }}
            />
            {/* Main dashed line */}
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': 'rgba(255,255,255,0.7)',
                'line-width': 2.5,
                'line-dasharray': [6, 6]
              }}
            />
          </Source>
        )}
      </Map>
    </>
  );
};

export default MapComponent;