"use client";

import { useEffect, useState } from "react";

import { getCategories } from "@/lib/api/products";
import { normalizeApiError, type ApiError } from "@/lib/api/errors";

interface CategoriesState {
  requestKey: number;
  status: "success" | "error";
  categories: string[];
  error: ApiError | null;
}

export function useProductCategories(retryKey: number) {
  const [state, setState] = useState<CategoriesState>({
    requestKey: -1,
    status: "success",
    categories: [],
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    getCategories({ signal: controller.signal })
      .then((categories) => setState({ requestKey: retryKey, status: "success", categories, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const normalizedError = normalizeApiError(error);
        if (normalizedError.code === "ERR_CANCELED") return;
        setState({ requestKey: retryKey, status: "error", categories: [], error: normalizedError });
      });

    return () => controller.abort();
  }, [retryKey]);

  return {
    status: state.requestKey === retryKey ? state.status : "loading",
    categories: state.categories,
    error: state.requestKey === retryKey ? state.error : null,
  };
}