"use client";

import { useState } from "react";
import { Search, MapPin, Leaf, Bell, User, ShoppingBag, Loader2, AlertCircle, Package } from "lucide-react";
import Link from "next/link";

import { DealProductCard } from "@/components/products/DealProductCard";
import { useProducts } from "@/hooks/useProducts";
import { buildDealProductCardProps } from "@/lib/products/map-deal-product";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState("deals");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { products, status, errorMessage, refetch } = useProducts({ limit: 100 });
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  const togglePlay = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto">
      <header className="sticky top-0 z-50 glass px-4 py-4 dark:text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-500/20">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">FreshSave</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {!role && (
              <>
                <Link href="/auth" className="hidden sm:block text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition">
                  Become a Seller
                </Link>
                <Link href="/auth" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <User size={20} />
                </Link>
              </>
            )}
            {role === "shop_owner" && (
              <Link href="/shop" className="text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-800 transition">
                My Shop
              </Link>
            )}
            {role === "customer" && (
              <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for deals..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
          <button
            type="button"
            className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-3 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30"
          >
            <MapPin size={20} />
          </button>
        </div>
      </header>

      <main className="px-4 mt-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {["All Deals", "Fruits & Veg", "Bakery", "Dairy", "Meat"].map((category, i) => (
            <button
              key={category}
              type="button"
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-sm ${
                i === 0
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Nearby Deals <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">New</span>
          </h3>
          <span className="text-sm font-medium text-gray-500">Within 2 miles</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {status === "loading" && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20">
              <Loader2 size={32} className="animate-spin mb-3 text-emerald-500" />
              <p className="text-sm font-medium">Loading deals nearby…</p>
            </div>
          )}

          {status === "error" && (
            <div className="col-span-full rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 px-4 py-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={36} />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Could not load deals</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">{errorMessage}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {status === "empty" && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20 px-4">
              <Package size={40} className="mb-3 text-emerald-500/60" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No deals nearby yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">
                Check back soon — local shops will post discounted near-expiry items here.
              </p>
            </div>
          )}

          {status === "success" &&
            products.map((product, i) => (
              <DealProductCard
                key={product.id}
                {...buildDealProductCardProps(product, i, playingId, togglePlay)}
              />
            ))}
        </div>

        {status === "success" && products.length > 0 && (
          <div className="mt-8 mb-4 flex flex-col items-center justify-center text-gray-400 py-6">
            <p className="text-sm font-medium">You&apos;re all caught up for now.</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full max-w-5xl mx-auto glass border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-3 pb-safe z-50 rounded-t-3xl">
        <button
          type="button"
          onClick={() => setActiveTab("deals")}
          className={`flex flex-col items-center gap-1 w-16 transition ${activeTab === "deals" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          <div className={`${activeTab === "deals" ? "bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-xl" : "p-1.5"}`}>
            <Search size={22} strokeWidth={activeTab === "deals" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold">Deals</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center gap-1 w-16 transition ${activeTab === "map" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          <div className={`${activeTab === "map" ? "bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-xl" : "p-1.5"}`}>
            <MapPin size={22} strokeWidth={activeTab === "map" ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold">Map</span>
        </button>
        {(!role || role === "shop_owner") && (
          <Link
            href={role === "shop_owner" ? "/shop" : "/auth"}
            className={`flex flex-col items-center gap-1 w-16 transition ${activeTab === "shop" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <div className={`${activeTab === "shop" ? "bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-xl" : "p-1.5"}`}>
              <ShoppingBag size={22} strokeWidth={activeTab === "shop" ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">{role === "shop_owner" ? "My Shop" : "Sell"}</span>
          </Link>
        )}
        {role === "customer" && (
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 w-16 transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            <div className="p-1.5">
              <User size={22} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
