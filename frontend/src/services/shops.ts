import { apiRequest } from "@/api/client";
import type { ApiShopSummary } from "@/types/product";

export async function getShop(shopId: string | number): Promise<ApiShopSummary & { description: string }> {
  return apiRequest<ApiShopSummary & { description: string }>(`/shops/${shopId}`);
}

export async function updateShop(shopId: string | number, data: any): Promise<ApiShopSummary & { description: string }> {
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
