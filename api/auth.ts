import axios from "@/lib/axios";

export const loginAPI = async (emailORusername: string, password: string) => {
  const res = await axios.post("/auth/login", { emailORusername, password });

  console.log(res);

  return res.data;
};

export const registerAPI = async (email: string, password: string) => {
  const res = await axios.post("/auth/register", { email, password });

  return res.data;
};

export const fetchProfile = async () => {
  const res = await axios.get("/auth/me");

  return res.data;
};
