"use client";

import { MapPin, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

export type DealProductCardProps = {
  index: number;
  id: number;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  expiryLabel: string;
  expiryIsExpired: boolean;
  shopSubtitle: string;
  quantity: number;
  hasVoiceNote: boolean;
  playingId: number | null;
  onTogglePlay: (id: number, e: React.MouseEvent) => void;
};

export function DealProductCard({
  index,
  id,
  name,
  imageUrl,
  originalPrice,
  discountPrice,
  discountPercent,
  expiryLabel,
  expiryIsExpired,
  shopSubtitle,
  quantity,
  hasVoiceNote,
  playingId,
  onTogglePlay,
}: DealProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative group transition-all"
    >
      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
        -{discountPercent}%
      </div>

      {hasVoiceNote && (
        <button
          type="button"
          onClick={(e) => onTogglePlay(id, e)}
          className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full shadow-sm hover:scale-110 transition"
        >
          {playingId === id ? (
            <Pause size={14} className="fill-current" />
          ) : (
            <Play size={14} className="fill-current ml-0.5" />
          )}
        </button>
      )}

      <div className="h-36 sm:h-48 w-full bg-gray-200 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <div
          className={`flex items-center gap-1.5 text-xs font-bold mb-1.5 w-max px-2 py-0.5 rounded-md ${
            expiryIsExpired
              ? "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
              : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
          }`}
        >
          {!expiryIsExpired && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          {expiryLabel}
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">{name}</h4>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-1">
          <MapPin size={12} className="text-emerald-500 shrink-0" />
          <span className="truncate">{shopSubtitle}</span>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
          Qty: <span className="font-medium text-gray-600 dark:text-gray-400">{quantity}</span>
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white">
            ₹{discountPrice.toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
            ₹{originalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
