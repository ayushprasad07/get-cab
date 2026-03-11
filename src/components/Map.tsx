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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.006], 13);

      // Add tile layer from OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add pickup location marker
    if (pickupLocation) {
      L.marker([pickupLocation.lat, pickupLocation.lng], {
        title: "Pickup Location",
        icon: L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup("Pickup Location")
        .addTo(map);
    }

    // Add drop location marker
    if (dropLocation) {
      L.marker([dropLocation.lat, dropLocation.lng], {
        title: "Drop Location",
        icon: L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup("Drop Location")
        .addTo(map);
    }

    // Fit map to show both markers
    if (pickupLocation && dropLocation) {
      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [dropLocation.lat, dropLocation.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupLocation) {
      map.setView([pickupLocation.lat, pickupLocation.lng], 15);
    } else if (dropLocation) {
      map.setView([dropLocation.lat, dropLocation.lng], 15);
    }
  }, [pickupLocation, dropLocation, isClient]);

  if (!isClient) {
    return (
      <div
        style={{ height, width: "100%", borderRadius: "8px" }}
        className="bg-gray-100 flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height, width: "100%", borderRadius: "8px" }} />;
};

export default MapComponent;
