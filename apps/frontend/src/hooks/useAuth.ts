import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest, LoginRequest, AuthResponse } from '@packages/shared/types/api.types';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data).then(r => r.data),
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, data.user);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data).then(r => r.data),
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, data.user);
    },
  });
};

export const useLogout = () => {
  return () => {
    useAuthStore.getState().clearAuth();
    window.location.href = '/auth';
  };
};

export const useMe = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    enabled: isAuthenticated,
    retry: false,
  });
};
