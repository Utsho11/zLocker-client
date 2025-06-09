import axios from "@/lib/axios";
export const loginAPI = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password });

  // console.log(res);

  return res.data;
};

export const registerAPI = async (email: string, password: string) => {
  const res = await axios.post("/users/register-user", {
    email,
    password,
  });

  return res.data;
};

export const forgetAPI = async (email: string) => {
  const res = await axios.post("/auth/forget-password", {
    email,
  });

  return res.data;
};

export const fetchProfile = async () => {
  const res = await axios.get("/auth/getMe");

  return res.data;
};

export const verifyCodeAPI = async (code: string, email: string) => {
  const res = await axios.post("/auth/verify-code", { code, email });

  // console.log(res);

  return res.data;
};

export const resendCodeApi = async (email: string) => {
  const res = await axios.post("/auth/resend-email-varification-code", {
    email,
  });

  return res.data;
};
