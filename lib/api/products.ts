import { apiClient } from "@/lib/api/client";
import type { Product, ProductCategory, ProductListResponse, ProductMutationInput, ProductSortField } from "@/types/product";

interface ProductRequestOptions {
  signal?: AbortSignal;
}

export async function getProducts(params: {
  limit: number;
  skip: number;
  sortBy?: ProductSortField;
  order?: "asc" | "desc";
}, options?: ProductRequestOptions) {
  const response = await apiClient.get<ProductListResponse>("/products", { params, signal: options?.signal });
  return response.data;
}

export async function searchProducts(query: string, params: { limit: number; skip: number; sortBy?: ProductSortField; order?: "asc" | "desc" }, options?: ProductRequestOptions) {
  const response = await apiClient.get<ProductListResponse>("/products/search", {
    params: { q: query, ...params },
    signal: options?.signal,
  });
  return response.data;
}

export async function getProductsByCategory(category: string, params: { limit: number; skip: number; sortBy?: ProductSortField; order?: "asc" | "desc" }, options?: ProductRequestOptions) {
  const response = await apiClient.get<ProductListResponse>(`/products/category/${encodeURIComponent(category)}`, { params, signal: options?.signal });
  return response.data;
}

export async function getProductById(id: number, options?: ProductRequestOptions) {
  const response = await apiClient.get<Product>(`/products/${id}`, { signal: options?.signal });
  return response.data;
}

export async function getCategories(options?: ProductRequestOptions) {
  const response = await apiClient.get<ProductCategory[] | string[]>("/products/categories", { signal: options?.signal });
  return response.data.map((category) => (typeof category === "string" ? category : category.slug));
}

export async function createProduct(product: ProductMutationInput, options?: ProductRequestOptions) {
  const response = await apiClient.post<Product>("/products/add", product, { signal: options?.signal });
  return response.data;
}

export async function updateProduct(id: number, product: Partial<ProductMutationInput>, options?: ProductRequestOptions) {
  const response = await apiClient.put<Product>(`/products/${id}`, product, { signal: options?.signal });
  return response.data;
}

export async function deleteProduct(id: number, options?: ProductRequestOptions) {
  const response = await apiClient.delete<Product>(`/products/${id}`, { signal: options?.signal });
  return response.data;
}