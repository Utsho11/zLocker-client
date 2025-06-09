import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchProfile,
  forgetAPI,
  registerAPI,
  resendCodeApi,
  verifyCodeAPI,
} from "@/api/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerAPI(email, password),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verifyCodeAPI(code, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useResendVerifyCode = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => resendCodeApi(email),
  });
};
