import axios from "@/lib/axios";

export const createContentAPI = async (content: string) => {
  const res = await axios.post("/text/create-content", {
    content,
  });

  return res.data;
};
