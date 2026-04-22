import { useAuthStore } from "../store/authStore";
export class APIError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "APIError";
    }
}
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error)
            prom.reject(error);
        else
            prom.resolve(token);
    });
    failedQueue = [];
};
async function attemptTokenRefresh(refreshToken) {
    try {
        const res = await fetch("/api/v1/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok)
            return null;
        const body = await res.json();
        return body.data;
    }
    catch {
        return null;
    }
}
export async function request(url, options = {}) {
    const { accessToken, refreshToken, setTokens, clearAuth } = useAuthStore.getState();
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
                }
                else {
                    processQueue(new Error("Session expired"), null);
                    clearAuth();
                    if (typeof window !== "undefined")
                        window.location.href = "/auth";
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
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then((token) => {
            if (!token)
                throw new APIError("UNAUTHORIZED", "Session expired");
            const retryHeaders = new Headers(options.headers);
            retryHeaders.set("Authorization", `Bearer ${token}`);
            if (!retryHeaders.has("Content-Type") &&
                !(options.body instanceof FormData)) {
                retryHeaders.set("Content-Type", "application/json");
            }
            return fetch(url, { ...options, headers: retryHeaders }).then(async (r) => {
                const body = await r.json();
                if (!r.ok)
                    throw new APIError("RETRY_ERROR", body.message || "Retry failed");
                return body.data;
            });
        });
    }
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        throw new APIError("REQUEST_ERROR", body?.message || "Request failed");
    }
    return body?.data ?? body; // Return data if envelope, else body
}
export const api = {
    get: (url, options = {}) => request(url, { ...options, method: "GET" }),
    post: (url, body, options = {}) => request(url, {
        ...options,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    }),
    put: (url, body, options = {}) => request(url, {
        ...options,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
    }),
    delete: (url, options = {}) => request(url, { ...options, method: "DELETE" }),
};
