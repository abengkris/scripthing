import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest, LoginRequest, AuthResponse } from '@shared/types/api.types';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
    onSuccess: (res) => useAuthStore.getState().setAuth(res.data.token, res.data.user)
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
    onSuccess: (res) => useAuthStore.getState().setAuth(res.data.token, res.data.user)
  });
};

export const useLogout = () => {
  return () => useAuthStore.getState().clearAuth();
};
