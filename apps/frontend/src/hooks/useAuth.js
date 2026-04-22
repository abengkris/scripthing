import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
export const useRegister = () => {
    return useMutation({
        mutationFn: (data) => api.post("/auth/register", data),
        onSuccess: (data) => {
            useAuthStore
                .getState()
                .setAuth(data.token, data.user);
        },
    });
};
export const useLogin = () => {
    return useMutation({
        mutationFn: (data) => api.post("/auth/login", data),
        onSuccess: (data) => {
            useAuthStore
                .getState()
                .setAuth(data.token, data.user);
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
        queryFn: () => api.get("/auth/me"),
        enabled: isAuthenticated,
        retry: false,
    });
};
