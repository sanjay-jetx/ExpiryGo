"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Heart, Bell, Settings, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { role, logout, name, email } = useAuth();
  const router = useRouter();

  if (role !== "customer") {
    return null; // Middleware will catch this anyway, but just in case
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const displayName = name || "Customer";
  const displayEmail = email || "customer@example.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 max-w-2xl mx-auto pb-20">
      <header className="sticky top-0 z-50 glass px-4 py-4 dark:text-white flex items-center border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight ml-2">Profile</h1>
      </header>

      <main className="p-4 sm:p-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-2xl">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{displayName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs">{displayEmail}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              Customer
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 text-left">
            <Heart size={20} className="text-rose-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Saved Deals</span>
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 text-left">
            <Bell size={20} className="text-blue-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Notification Preferences</span>
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left">
            <Settings size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Account Settings</span>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 py-4 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </main>
    </div>
  );
}
