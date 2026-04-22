import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
describe('AuthStore', () => {
    beforeEach(() => {
        useAuthStore.getState().clearAuth();
        vi.clearAllMocks();
    });
    it('should initialize with null tokens', () => {
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
    it('should set tokens and update auth state', () => {
        useAuthStore.getState().setTokens('access-token', 'refresh-token');
        expect(useAuthStore.getState().accessToken).toBe('access-token');
        expect(useAuthStore.getState().refreshToken).toBe('refresh-token');
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
        expect(localStorage.getItem('accessToken')).toBe('access-token');
    });
    it('should clear authentication state', () => {
        useAuthStore.getState().setTokens('access', 'refresh');
        useAuthStore.getState().clearAuth();
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
        expect(localStorage.getItem('accessToken')).toBeNull();
    });
});
