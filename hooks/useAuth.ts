import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchProfile, loginAPI, registerAPI } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({
      emailORusername,
      password,
    }: {
      emailORusername: string;
      password: string;
    }) => loginAPI(emailORusername, password),
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

export const useProfile = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchProfile,
    retry: false,
  });
};
