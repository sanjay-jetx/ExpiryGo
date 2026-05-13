"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navigation } from "lucide-react";

// Fix leaflet marker icon issue in Next.js
const createCustomIcon = (deals: number, isSelected: boolean) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${isSelected ? '#059669' : '#10B981'};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-family: sans-serif;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        transform: scale(${isSelected ? 1.1 : 1});
      ">
        ${deals}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const userIcon = L.divIcon({
  className: "custom-div-icon",
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <span style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 50%; background-color: #60A5FA; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <span style="position: relative; display: inline-flex; border-radius: 50%; height: 24px; width: 24px; background-color: #3B82F6; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle map centering
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

interface Shop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: string;
  deals: number;
}

interface MapComponentProps {
  mockShops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  defaultCenter: [number, number];
}

export default function MapComponent({ mockShops, selectedShop, setSelectedShop, defaultCenter }: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const centerMapToUser = () => {
    setMapCenter([defaultCenter[0], defaultCenter[1]]);
  };

  return (
    <>
      <MapContainer 
        center={defaultCenter} 
        zoom={14} 
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapController center={mapCenter} />
        
        {/* FREE OpenStreetMap CartoDB Positron theme (Clean, modern look similar to Google Maps) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* User Marker */}
        <Marker position={defaultCenter} icon={userIcon} />

        {/* Shop Markers */}
        {mockShops.map((shop: Shop) => (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lng]}
            icon={createCustomIcon(shop.deals, selectedShop?.id === shop.id)}
            eventHandlers={{
              click: () => {
                setSelectedShop(shop);
                setMapCenter([shop.lat, shop.lng]);
              },
            }}
          />
        ))}
      </MapContainer>

      {/* Center Button */}
      <button 
        onClick={centerMapToUser}
        className="absolute bottom-32 right-4 z-[400] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 transition hover:scale-105 active:scale-95"
      >
        <Navigation size={20} className="text-blue-500 fill-blue-500" />
      </button>
    </>
  );
}
