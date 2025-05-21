import axios from "@/lib/axios";

export const loginAPI = async (emailORusername: string, password: string) => {
  const res = await axios.post("/auth/login", { emailORusername, password });

  // console.log(res);

  return res.data;
};

export const registerAPI = async (
  emailORusername: string,
  password: string
) => {
  const res = await axios.post("/users/register-user", {
    emailORusername,
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
  const res = await axios.get("/auth/me");

  return res.data;
};
