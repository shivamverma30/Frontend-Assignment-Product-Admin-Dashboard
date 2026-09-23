import { apiClient } from "@/lib/api/client";
import type { Product, ProductListResponse, ProductMutationInput, ProductSortField } from "@/types/product";

export async function getProducts(params: {
  limit: number;
  skip: number;
  sortBy?: ProductSortField;
  order?: "asc" | "desc";
}) {
  const response = await apiClient.get<ProductListResponse>("/products", { params });
  return response.data;
}

export async function searchProducts(query: string, params: { limit: number; skip: number }) {
  const response = await apiClient.get<ProductListResponse>("/products/search", {
    params: { q: query, ...params },
  });
  return response.data;
}

export async function getProductsByCategory(category: string, params: { limit: number; skip: number }) {
  const response = await apiClient.get<ProductListResponse>(`/products/category/${encodeURIComponent(category)}`, { params });
  return response.data;
}

export async function getProduct(id: number) {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await apiClient.get<string[]>("/products/categories");
  return response.data;
}

export async function createProduct(product: ProductMutationInput) {
  const response = await apiClient.post<Product>("/products/add", product);
  return response.data;
}

export async function updateProduct(id: number, product: Partial<ProductMutationInput>) {
  const response = await apiClient.put<Product>(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}