"use client";

import { Bell, ArrowLeft, Clock, Tag, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Expiring Soon!",
      message: "Organic Bananas at Green Valley Market expire in 2 hours.",
      time: "10m ago",
      icon: Clock,
      color: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      unread: true,
    },
    {
      id: 2,
      type: "nearby",
      title: "New Deals Nearby",
      message: "Main Street Bakery just posted 5 new items at 70% off.",
      time: "1h ago",
      icon: MapPin,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      unread: true,
    },
    {
      id: 3,
      type: "category",
      title: "Category Alert: Dairy",
      message: "Fresh Milk is now available for ₹2.00 at Corner Store.",
      time: "3h ago",
      icon: Tag,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      unread: false,
    },
    {
      id: 4,
      type: "system",
      title: "Welcome to FreshSave",
      message: "Start saving food and money today. Check out the map to find deals.",
      time: "1d ago",
      icon: CheckCircle2,
      color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      unread: false,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-4 py-4 dark:text-white flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        </div>
        <button className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
          Mark all as read
        </button>
      </header>

      {/* Notifications List */}
      <main className="p-4 space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={notif.id}
            className={`bg-white dark:bg-gray-800 p-4 rounded-2xl flex gap-4 border transition hover:shadow-md cursor-pointer ${
              notif.unread 
              ? "border-emerald-200 dark:border-emerald-500/30 shadow-sm" 
              : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <div className={`p-3 rounded-full flex-shrink-0 self-start ${notif.color}`}>
              <notif.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-sm font-bold ${notif.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                  {notif.time}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                {notif.message}
              </p>
            </div>
            {notif.unread && (
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 self-center"></div>
            )}
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All caught up!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">You don&apos;t have any new notifications right now.</p>
          </div>
        )}
      </main>
    </div>
  );
}
