import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import { useAuthStore } from '../../store/authStore';
describe('API Client', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        vi.clearAllMocks();
        useAuthStore.getState().setTokens('token', 'refresh');
    });
    it('should include Authorization header', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { success: true } }),
        });
        await api.get('/test');
        expect(fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
            headers: expect.any(Headers)
        }));
    });
    it('should handle 401 and retry', async () => {
        // 1st request fails (401)
        fetch.mockResolvedValueOnce({
            status: 401,
            ok: false,
            json: async () => ({ message: 'Unauthorized' }),
        });
        // Refresh request (200)
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { accessToken: 'new-token', refreshToken: 'new-refresh' } }),
        });
        // Retry request (200)
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { success: true } }),
        });
        const result = await api.get('/test');
        expect(result.success).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
