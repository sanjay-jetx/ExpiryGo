"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Search, Navigation, Filter, MapPin } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the map component with SSR disabled because Leaflet uses the window object
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin size={32} className="text-emerald-500 mb-2" />
        <p className="text-gray-500 font-medium text-sm">Loading free map...</p>
      </div>
    </div>
  ),
});

// Default center: San Francisco for mockup
const defaultCenter: [number, number] = [37.7749, -122.4194];

export default function MapDiscovery() {
  type ShopType = { id: number; name: string; lat: number; lng: number; distance: string; deals: number };
  const [selectedShop, setSelectedShop] = useState<ShopType | null>(null);

  const mockShops = useMemo(() => [
    { id: 1, name: "Green Valley Market", lat: 37.7750, lng: -122.4180, distance: "0.2 mi", deals: 12 },
    { id: 2, name: "Main Street Bakery", lat: 37.7730, lng: -122.4210, distance: "0.5 mi", deals: 4 },
    { id: 3, name: "Corner Store", lat: 37.7765, lng: -122.4165, distance: "0.8 mi", deals: 8 },
  ], []);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-emerald-50 dark:bg-gray-900">
      {/* Top Header Floating */}
      <div className="absolute top-0 inset-x-0 z-[400] p-4 pt-safe flex items-center gap-3 pointer-events-none">
        <Link href="/" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 transition hover:scale-105 pointer-events-auto">
          <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
        </Link>
        <div className="flex-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center px-4 py-3 pointer-events-auto">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search neighborhood..."
            className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white"
          />
        </div>
        <button className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 transition hover:scale-105 pointer-events-auto">
          <Filter size={20} className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* 100% FREE Map Component (Leaflet + OpenStreetMap) */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          lat={defaultCenter[0]}
          lng={defaultCenter[1]}
          zoom={13}
        />
      </div>

      {/* Shop Popup Bottom Sheet */}
      <AnimatePresence>
        {selectedShop && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-[450]"
              onClick={() => setSelectedShop(null)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 z-[500] bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-800 p-6 pb-safe"
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedShop.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 text-sm font-medium">
                    <Navigation size={14} className="text-blue-500" />
                    {selectedShop.distance} away
                  </p>
                </div>
                <div className="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm">
                  {selectedShop.deals} Deals
                </div>
              </div>

              {/* Mini Product Scroller */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[140px] bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <div className="h-20 w-full bg-gray-200 rounded-xl mb-3 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1571501711181-e23112a9eb72?w=200&q=80&sig=${i}`} alt="Item" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">Organic Bananas</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">₹1.99</span>
                      <span className="text-[10px] text-gray-400 line-through">₹4.99</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
                View All Shop Deals
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
