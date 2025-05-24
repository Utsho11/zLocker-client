import { useMutation, useQuery } from "@tanstack/react-query";

import {
  fetchProfile,
  forgetAPI,
  loginAPI,
  registerAPI,
  verifyCodeAPI,
} from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAPI(email, password),
    onSuccess: ({ user, token }) => {
      login(user, token);
    },
  });
};

export const useRegister = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerAPI(email, password),
    onSuccess: ({ user, token }) => {
      login(user, token);
    },
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgetAPI(email),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchProfile,
    retry: false,
  });
};

export const useVerifyCode = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verifyCodeAPI(code, email),
    onSuccess: ({ user, token }) => {
      login(user, token);
    },
  });
};
