import { apiRequest } from "@/api/client";
import type { ApiShopSummary } from "@/types/product";

export async function getShop(shopId: number = 1): Promise<ApiShopSummary & { description: string }> {
  return apiRequest<ApiShopSummary & { description: string }>(`/shops/${shopId}`);
}

export async function updateShop(shopId: number, data: any): Promise<ApiShopSummary & { description: string }> {
  return apiRequest<ApiShopSummary & { description: string }>(`/shops/${shopId}`, {
    method: "PUT",
    json: data,
  });
}
export async function createShop(data: any): Promise<ApiShopSummary & { description: string }> {
  return apiRequest<ApiShopSummary & { description: string }>(`/shops/`, {
    method: "POST",
    json: data,
  });
}
