import axios from "axios";

import { API_BASE_URL, STORAGE_KEYS } from "@/lib/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const session = window.localStorage.getItem(STORAGE_KEYS.authSession);

    if (session) {
      try {
        const { accessToken } = JSON.parse(session) as { accessToken?: string };
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      } catch {
        window.localStorage.removeItem(STORAGE_KEYS.authSession);
      }
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.authSession);
      window.dispatchEvent(new Event("product-admin:unauthorized"));
    }

    return Promise.reject(error);
  },
);