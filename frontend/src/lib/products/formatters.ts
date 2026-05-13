import { differenceInHours, differenceInMinutes, isBefore, parseISO } from "date-fns";

export function computeDiscountPercent(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0) return 0;
  const pct = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  return Math.max(0, Math.min(99, pct));
}

export type ExpiryDisplay = {
  /** e.g. "12h" or "45m" */
  compact: string;
  isExpired: boolean;
};

/**
 * Human-readable urgency label for badges (matches prior "Expires in Xh" style).
 */
export function formatExpiryDisplay(isoDate: string): ExpiryDisplay {
  const end = parseISO(isoDate);
  const now = new Date();
  if (isBefore(end, now)) {
    return { compact: "Expired", isExpired: true };
  }
  const hours = differenceInHours(end, now);
  if (hours >= 1) {
    return { compact: `${hours}h`, isExpired: false };
  }
  const minutes = Math.max(1, differenceInMinutes(end, now));
  return { compact: `${minutes}m`, isExpired: false };
}

export function truncateText(text: string, maxLen: number): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}
