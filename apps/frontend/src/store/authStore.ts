import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: Record<string, unknown>) => void;
  setAuth: (token: string, user: Record<string, unknown>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  setAuth: (token, user) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
