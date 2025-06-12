import axios from "@/lib/axios";

export const loginAPI = async (email: string, password: string) => {
  try {
    const res = await axios.post("/auth/login", { email, password });
    return res.data; // assumed to include accessToken and user info
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
};

export const registerAPI = async (email: string, password: string) => {
  try {
    const res = await axios.post("/users/register-user", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgetAPI = async (email: string) => {
  try {
    const res = await axios.post("/auth/forget-password", {
      email,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProfile = async () => {
  try {
    const res = await axios.get("/auth/getMe");

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addUsernameAPI = async (username: string) => {
  try {
    const res = await axios.post("/auth/add-username", {
      username,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const verifyCodeAPI = async (code: string, email: string) => {
  try {
    const res = await axios.post("/auth/verify-code", { code, email });

    // console.log(res);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const resendCodeApi = async (email: string) => {
  try {
    const res = await axios.post("/auth/resend-email-varification-code", {
      email,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changedPassAPI = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const res = await axios.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });

    return res;
  } catch (error) {
    throw error;
  }
};
