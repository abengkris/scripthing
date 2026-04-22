import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../../../../packages/shared/src/types/api.types";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>("/auth/register", data),
    onSuccess: (data: AuthResponse) => {
      useAuthStore
        .getState()
        .setAuth(data.token, data.user as unknown as Record<string, unknown>);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      api.post<AuthResponse>("/auth/login", data),
    onSuccess: (data: AuthResponse) => {
      useAuthStore
        .getState()
        .setAuth(data.token, data.user as unknown as Record<string, unknown>);
    },
  });
};

export const useLogout = () => {
  return () => {
    useAuthStore.getState().clearAuth();
    window.location.href = "/auth";
  };
};

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<AuthResponse>("/auth/me"),
    enabled: isAuthenticated,
    retry: false,
  });
};
