import { apiClient } from "@/lib/api/client";
import type { AuthSession, LoginCredentials } from "@/types/auth";

export async function login(credentials: LoginCredentials) {
  const response = await apiClient.post<AuthSession>("/auth/login", credentials);
  return response.data;
}