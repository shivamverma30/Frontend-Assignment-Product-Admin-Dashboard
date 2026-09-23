import axios from "axios";

export interface ApiError {
  status: number | null;
  message: string;
  code?: string;
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (axios.isAxiosError(error)) {
    const responseMessage = getResponseMessage(error.response?.data);

    return {
      status: error.response?.status ?? null,
      message: responseMessage ?? getNetworkMessage(error.code),
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return { status: null, message: error.message };
  }

  return { status: null, message: "Something went wrong. Please try again." };
}

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== "object") return false;

  const candidate = error as Partial<ApiError>;
  return (typeof candidate.status === "number" || candidate.status === null) && typeof candidate.message === "string";
}

function getResponseMessage(data: unknown) {
  if (!data || typeof data !== "object") return null;

  const payload = data as { message?: unknown; error?: unknown };
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;

  return null;
}

function getNetworkMessage(code?: string) {
  if (code === "ERR_CANCELED") return "This request was canceled.";
  if (!code) return "Something went wrong. Please try again.";
  return "We could not reach the service. Please check your connection and try again.";
}
