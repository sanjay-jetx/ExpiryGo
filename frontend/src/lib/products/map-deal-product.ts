import type { DealProductCardProps } from "@/components/products/DealProductCard";
import type { ApiProduct } from "@/types/product";

import { computeDiscountPercent, formatExpiryDisplay, truncateText } from "./formatters";

export function buildDealProductCardProps(
  product: ApiProduct,
  index: number,
  playingId: number | null,
  onTogglePlay: (id: number, e: React.MouseEvent) => void
): DealProductCardProps {
  const expiry = formatExpiryDisplay(product.expiry_date);
  const expiryLabel = expiry.isExpired ? "Expired" : `Expires in ${expiry.compact}`;
  const discountPercent = computeDiscountPercent(product.original_price, product.discount_price);
  const shopName = product.shop?.name ?? "Unknown shop";
  const address = product.shop?.address?.trim() ?? "";
  const shopSubtitle = address
    ? `${truncateText(shopName, 22)} • ${truncateText(address, 24)}`
    : truncateText(shopName, 40);

  return {
    index,
    id: product.id,
    name: product.name,
    imageUrl: product.front_image_url || product.expiry_image_url,
    originalPrice: product.original_price,
    discountPrice: product.discount_price,
    discountPercent,
    expiryLabel,
    expiryIsExpired: expiry.isExpired,
    shopSubtitle,
    quantity: product.quantity,
    hasVoiceNote: Boolean(product.voice_note_url),
    playingId,
    onTogglePlay,
  };
}
