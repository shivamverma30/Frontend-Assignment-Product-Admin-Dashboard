"use client";

import { useEffect, useState } from "react";

import { getProducts } from "@/lib/api/products";
import { normalizeApiError, type ApiError } from "@/lib/api/errors";
import type { ProductListResponse } from "@/types/product";

interface UseProductListOptions {
  page: number;
  pageSize: number;
  retryKey: number;
}

interface ProductListState {
  requestKey: string;
  status: "success" | "error";
  data: ProductListResponse | null;
  error: ApiError | null;
}

export function useProductList({ page, pageSize, retryKey }: UseProductListOptions) {
  const [state, setState] = useState<ProductListState>({
    requestKey: "",
    status: "success",
    data: null,
    error: null,
  });
  const requestKey = `${page}:${pageSize}:${retryKey}`;

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    getProducts(
      { limit: pageSize, skip: (page - 1) * pageSize },
      { signal: controller.signal },
    )
      .then((data) => {
        if (!isCurrentRequest) return;
        setState({ requestKey, status: "success", data, error: null });
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest || controller.signal.aborted) return;

        const normalizedError = normalizeApiError(error);
        if (normalizedError.code === "ERR_CANCELED") return;
        setState({ requestKey, status: "error", data: null, error: normalizedError });
      });

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [page, pageSize, requestKey, retryKey]);

  return {
    status: state.requestKey === requestKey ? state.status : "loading",
    data: state.requestKey === requestKey ? state.data : null,
    error: state.requestKey === requestKey ? state.error : null,
  };
}
