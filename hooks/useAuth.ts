import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { signIn } from "next-auth/react";

import {
  addUsernameAPI,
  changedPassAPI,
  fetchProfile,
  forgetAPI,
  registerAPI,
  resendCodeApi,
  verifyCodeAPI,
} from "@/api/auth";

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: ({ email, password }: { email: string; password: string }) =>
//       signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       }),
//   });
// };

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
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verifyCodeAPI(code, email),
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
