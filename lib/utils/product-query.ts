import { DEFAULT_PRODUCT_QUERY, PRODUCT_PAGE_SIZES } from "@/lib/constants";

export interface ProductListUrlState {
  page: number;
  pageSize: number;
}

export function parseProductListUrl(searchParams: URLSearchParams): ProductListUrlState {
  return {
    page: parsePositiveInteger(searchParams.get("page"), DEFAULT_PRODUCT_QUERY.page),
    pageSize: parsePageSize(searchParams.get("pageSize")),
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
