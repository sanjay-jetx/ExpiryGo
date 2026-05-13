"use client";

import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/api/errors";
import { getProducts } from "@/services/products";
import type { ApiProduct } from "@/types/product";

export type ProductsLoadStatus = "loading" | "success" | "empty" | "error";

export type UseProductsResult = {
  products: ApiProduct[];
  status: ProductsLoadStatus;
  errorMessage: string | null;
  refetch: () => Promise<void>;
};

export function useProducts(options?: { limit?: number }): UseProductsResult {
  const limit = options?.limit ?? 100;
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [status, setStatus] = useState<ProductsLoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const data = await getProducts({ limit });
      if (data.length === 0) {
        setProducts([]);
        setStatus("empty");
      } else {
        setProducts(data);
        setStatus("success");
      }
    } catch (e) {
      setProducts([]);
      setErrorMessage(getErrorMessage(e));
      setStatus("error");
    }
  }, [limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { products, status, errorMessage, refetch: load };
}
