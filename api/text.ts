import axios from "@/lib/axios";

export const createContentAPI = async (content: string) => {
  const res = await axios.post("/text/create-content", {
    content,
  });

  return res.data;
};

export const getAllContentApi = async () => {
  const res = await axios.get("/text/get-all-content");

  return res.data.data;
};

export const getContentApi = async (id: string) => {
  const res = await axios.get(`/text/get-content/${id}`);

  return res.data.data;
};

export const deleteContentApi = async (id: string) => {
  await axios.delete(`/text/delete-content/${id}`);
};

export const updateContentApi = async (id: string, content: string) => {
  await axios.put(`/text/update-content/${id}`, {
    content,
  });
};
