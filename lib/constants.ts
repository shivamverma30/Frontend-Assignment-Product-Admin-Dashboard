export const API_BASE_URL = "https://dummyjson.com";

export const STORAGE_KEYS = {
  authSession: "product-admin.auth-session",
  createdProducts: "product-admin.created-products",
  productOverrides: "product-admin.product-overrides",
  deletedProductIds: "product-admin.deleted-product-ids",
} as const;

export const PRODUCT_PAGE_SIZES = [10, 20, 50] as const;

export const DEFAULT_PRODUCT_QUERY = {
  page: 1,
  pageSize: 20,
  search: "",
  category: "",
  sortBy: "",
  sortOrder: "asc" as const,
};