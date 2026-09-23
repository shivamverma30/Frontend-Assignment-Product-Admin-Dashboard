import { DEFAULT_PRODUCT_QUERY, PRODUCT_PAGE_SIZES } from "@/lib/constants";
import type { ProductSortField } from "@/types/product";

export interface ProductListUrlState {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sortBy: ProductSortField | "";
  sortOrder: "asc" | "desc";
}

export function parseProductListUrl(searchParams: URLSearchParams): ProductListUrlState {
  return {
    page: parsePositiveInteger(searchParams.get("page"), DEFAULT_PRODUCT_QUERY.page),
    pageSize: parsePageSize(searchParams.get("pageSize")),
    search: parseSearch(searchParams.get("search")),
    category: parseCategory(searchParams.get("category")),
    sortBy: parseSortField(searchParams.get("sortBy")),
    sortOrder: parseSortOrder(searchParams.get("sortOrder")),
  };
}

export function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function getPageRange(page: number, pageSize: number, total: number) {
  if (total === 0) return { start: 0, end: 0 };

  return {
    start: (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, total),
  };
}

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function parsePageSize(value: string | null) {
  const parsedValue = Number(value);
  return PRODUCT_PAGE_SIZES.includes(parsedValue as (typeof PRODUCT_PAGE_SIZES)[number])
    ? parsedValue
    : DEFAULT_PRODUCT_QUERY.pageSize;
}

function parseSearch(value: string | null) {
  return value?.trim().slice(0, 120) ?? DEFAULT_PRODUCT_QUERY.search;
}

function parseCategory(value: string | null) {
  return value?.trim().slice(0, 80) ?? DEFAULT_PRODUCT_QUERY.category;
}

function parseSortField(value: string | null): ProductSortField | "" {
  if (value === "price" || value === "rating" || value === "title") return value;
  return DEFAULT_PRODUCT_QUERY.sortBy;
}

function parseSortOrder(value: string | null) {
  return value === "desc" ? "desc" : DEFAULT_PRODUCT_QUERY.sortOrder;
}
