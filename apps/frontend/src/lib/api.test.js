import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from './api';
import { useAuthStore } from '../store/authStore';
// Mock the zustand store
vi.mock('../store/authStore', () => ({
    useAuthStore: {
        getState: vi.fn(),
    },
}));
describe('API Interceptor', () => {
    let mockFetch;
    beforeEach(() => {
        mockFetch = vi.fn();
        global.fetch = mockFetch;
        vi.clearAllMocks();
    });
    it('should refresh token and retry on 401', async () => {
        const setTokensMock = vi.fn();
        const clearAuthMock = vi.fn();
        // Initial state: token exists
        useAuthStore.getState.mockReturnValue({
            accessToken: 'old-access',
            refreshToken: 'valid-refresh',
            setTokens: setTokensMock,
            clearAuth: clearAuthMock,
        });
        // Mock 1: First request fails with 401
        // Mock 2: Refresh token succeeds with new tokens
        // Mock 3: Retry request succeeds with 200
        mockFetch
            .mockResolvedValueOnce({
            status: 401,
            ok: false,
            json: async () => ({ message: 'Unauthorized' }),
        })
            .mockResolvedValueOnce({
            status: 200,
            ok: true,
            json: async () => ({ success: true, data: { accessToken: 'new-access', refreshToken: 'new-refresh' } }),
        })
            .mockResolvedValueOnce({
            status: 200,
            ok: true,
            json: async () => ({ success: true, data: 'success data' }),
        });
        const result = await request('/api/test');
        expect(result).toEqual('success data');
        expect(mockFetch).toHaveBeenCalledTimes(3);
        // Check if refresh was called correctly
        expect(mockFetch.mock.calls[1][0]).toContain('/api/v1/auth/refresh');
        // Check if original request was retried with new token
        expect(mockFetch.mock.calls[2][1].headers.get('Authorization')).toBe('Bearer new-access');
        expect(setTokensMock).toHaveBeenCalledWith('new-access', 'new-refresh');
    });
});
