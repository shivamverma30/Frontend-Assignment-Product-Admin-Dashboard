"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { getProductById } from "@/lib/api/products";
import { normalizeApiError, type ApiError } from "@/lib/api/errors";
import { getLocalProduct, getProductStoreServerSnapshot, getProductStoreSnapshot, isProductDeleted, mergeProduct, subscribeToProductStore } from "@/lib/product-store";
import type { Product } from "@/types/product";

interface DetailState {
  requestKey: string;
  status: "loading" | "success" | "error";
  product: Product | null;
  error: ApiError | null;
}

export function useProductDetail(id: number, retryKey: number) {
  const store = useSyncExternalStore(subscribeToProductStore, getProductStoreSnapshot, getProductStoreServerSnapshot);
  const localProduct = getLocalProduct(id);
  const hasLocalProduct = Boolean(localProduct);
  const isDeleted = isProductDeleted(id);
  const requestKey = `${id}:${retryKey}`;
  const [state, setState] = useState<DetailState>({ requestKey: "", status: "loading", product: null, error: null });

  useEffect(() => {
    if (hasLocalProduct || isDeleted) {
      return;
    }

    const controller = new AbortController();
    getProductById(id, { signal: controller.signal })
      .then((product) => setState({ requestKey, status: "success", product: mergeProduct(product), error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const normalizedError = normalizeApiError(error);
        if (normalizedError.code === "ERR_CANCELED") return;
        setState({ requestKey, status: "error", product: null, error: normalizedError });
      });

    return () => controller.abort();
  }, [hasLocalProduct, id, isDeleted, requestKey, retryKey, store]);

  if (localProduct) return { status: "success" as const, product: localProduct, error: null };
  if (isDeleted) return { status: "error" as const, product: null, error: { status: 404, message: "This product is no longer available." } };
  return state.requestKey === requestKey ? state : { status: "loading" as const, product: null, error: null };
}