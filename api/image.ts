import axios from "@/lib/axios";

export const storeImageApi = async (file: FormData) => {
  const res = await axios.post("/image/add-image", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getAllImageApi = async () => {
  const res = await axios.get("/image/get-all-image");

  return res.data.data;
};

export const deleteImageApi = async (id: string) => {
  await axios.delete(`/image/delete-image/${id}`);
};
