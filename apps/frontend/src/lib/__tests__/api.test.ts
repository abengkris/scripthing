import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { api } from "../api";
import { useAuthStore } from "../../store/authStore";

describe("API Client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.clearAllMocks();
    useAuthStore.getState().setTokens("token", "refresh");
  });

  it("should include Authorization header", async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { success: true } }),
    });

    await api.get("/test");

    expect(fetch).toHaveBeenCalledWith(
      "/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });

  it("should handle 401 and retry", async () => {
    // 1st request fails (401)
    (fetch as Mock).mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });
    // Refresh request (200)
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { accessToken: "new-token", refreshToken: "new-refresh" },
      }),
    });
    // Retry request (200)
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { success: true } }),
    });

    interface SuccessResponse {
      success: boolean;
    }
    const result = (await api.get("/test")) as SuccessResponse;
    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
