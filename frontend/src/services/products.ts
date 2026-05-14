import { apiRequest } from "@/api/client";
import type { ApiProduct } from "@/types/product";

export type GetProductsParams = {
  skip?: number;
  limit?: number;
  /** When true (default), backend omits products past expiry_date */
  hideExpired?: boolean;
};

/**
 * Fetches active products from the backend (includes nested shop when available).
 */
export async function getProducts(params: GetProductsParams = {}): Promise<ApiProduct[]> {
  const search = new URLSearchParams();
  if (params.skip != null) search.set("skip", String(params.skip));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.hideExpired === false) {
    search.set("hide_expired", "false");
  }
  const query = search.size > 0 ? `?${search.toString()}` : "";
  return apiRequest<ApiProduct[]>(`/products/${query}`);
}

/**
 * Creates a new product for a shop.
 */
export async function createProduct(product: import("@/types/product").ApiProductCreate): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(`/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
}
