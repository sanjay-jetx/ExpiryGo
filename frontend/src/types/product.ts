/**
 * Types aligned with FastAPI/Pydantic JSON (snake_case field names).
 */

export type ApiShopSummary = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type ApiProduct = {
  id: number;
  shop_id: number;
  name: string;
  original_price: number;
  discount_price: number;
  quantity: number;
  expiry_date: string;
  front_image_url: string;
  expiry_image_url: string;
  voice_note_url: string | null;
  is_active: boolean;
  created_at: string;
  shop: ApiShopSummary | null;
};

export type ApiProductCreate = Omit<ApiProduct, "id" | "created_at" | "shop" | "is_active" | "shop_id">;
