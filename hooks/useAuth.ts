import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { signIn } from "next-auth/react";

import {
  addUsernameAPI,
  changedPassAPI,
  fetchProfile,
  forgetAPI,
  loginAPI,
  logOutAPI,
  registerAPI,
  resendCodeApi,
  verifyCodeAPI,
} from "@/api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAPI(email, password),
  });
};

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
    staleTime: 0,
    refetchOnWindowFocus: true,
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
export const useLogOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logOutAPI(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useAddUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => addUsernameAPI(username),
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

export const useChangePass = () => {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => changedPassAPI(oldPassword, newPassword),
  });
};
