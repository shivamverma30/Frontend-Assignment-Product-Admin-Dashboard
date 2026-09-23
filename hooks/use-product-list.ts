"use client";

import { useEffect, useRef, useState } from "react";

import { getProducts, getProductsByCategory, searchProducts } from "@/lib/api/products";
import { normalizeApiError, type ApiError } from "@/lib/api/errors";
import type { ProductListResponse } from "@/types/product";

interface UseProductListOptions {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sortBy: "" | "price" | "rating" | "title";
  sortOrder: "asc" | "desc";
  retryKey: number;
}

interface ProductListState {
  requestKey: string;
  status: "success" | "error";
  data: ProductListResponse | null;
  error: ApiError | null;
}

export function useProductList({ page, pageSize, search, category, sortBy, sortOrder, retryKey }: UseProductListOptions) {
  const [state, setState] = useState<ProductListState>({
    requestKey: "",
    status: "success",
    data: null,
    error: null,
  });
  const requestKey = `${page}:${pageSize}:${search}:${category}:${sortBy}:${sortOrder}:${retryKey}`;
  const requestSequence = useRef(0);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    let controller: AbortController | null = null;
    const debounceDelay = search ? 400 : 0;
    const timeoutId = window.setTimeout(() => {
      controller = new AbortController();
      const requestParams = {
        limit: pageSize,
        skip: (page - 1) * pageSize,
        ...(sortBy ? { sortBy, order: sortOrder } : {}),
      };
      const request = search
        ? searchProducts(search, requestParams, { signal: controller.signal })
        : category
          ? getProductsByCategory(category, requestParams, { signal: controller.signal })
          : getProducts(requestParams, { signal: controller.signal });

      request
        .then((data) => {
          if (sequence !== requestSequence.current || controller?.signal.aborted) return;
          setState({ requestKey, status: "success", data, error: null });
        })
        .catch((error: unknown) => {
          if (sequence !== requestSequence.current || controller?.signal.aborted) return;

          const normalizedError = normalizeApiError(error);
          if (normalizedError.code === "ERR_CANCELED") return;
          setState({ requestKey, status: "error", data: null, error: normalizedError });
        });
    }, debounceDelay);

    return () => {
      window.clearTimeout(timeoutId);
      controller?.abort();
    };
  }, [category, page, pageSize, requestKey, retryKey, search, sortBy, sortOrder]);

  return {
    status: state.requestKey === requestKey ? state.status : "loading",
    data: state.data,
    error: state.requestKey === requestKey ? state.error : null,
  };
}
