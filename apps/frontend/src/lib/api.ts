import { useAuthStore } from "../store/authStore";

export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

async function attemptTokenRefresh(refreshToken: string) {
  try {
    const res = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data;
  } catch {
    return null;
  }
}

export async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const { accessToken, refreshToken, setTokens, clearAuth } =
    useAuthStore.getState();

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions = { ...options, headers };

  const res = await fetch(url, fetchOptions);

  if (res.status === 401 && refreshToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      attemptTokenRefresh(refreshToken)
        .then((refreshed) => {
          if (refreshed) {
            setTokens(refreshed.accessToken, refreshed.refreshToken);
            processQueue(null, refreshed.accessToken);
          } else {
            processQueue(new Error("Session expired"), null);
            clearAuth();
            if (typeof window !== "undefined") window.location.href = "/auth";
          }
        })
        .catch((err) => {
          processQueue(err, null);
          clearAuth();
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    // Wait for the ongoing refresh to complete, then retry
    return new Promise<string | null>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (!token) throw new APIError("UNAUTHORIZED", "Session expired");

      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Authorization", `Bearer ${token}`);
      if (
        !retryHeaders.has("Content-Type") &&
        !(options.body instanceof FormData)
      ) {
        retryHeaders.set("Content-Type", "application/json");
      }

      return fetch(url, { ...options, headers: retryHeaders }).then(
        async (r) => {
          const body = await r.json();
          if (!r.ok)
            throw new APIError("RETRY_ERROR", body.message || "Retry failed");
          return body.data;
        },
      );
    });
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new APIError("REQUEST_ERROR", body?.message || "Request failed");
  }

  return body?.data ?? body; // Return data if envelope, else body
}

export const api = {
  get: <T>(url: string, options: RequestInit = {}) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(url: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string, options: RequestInit = {}) =>
    request<T>(url, { ...options, method: "DELETE" }),
  download: async (url: string, filename: string, options: RequestInit = {}) => {
    const { accessToken } = useAuthStore.getState();
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  },
};
