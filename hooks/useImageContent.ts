"use client";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { BACKEND_URL } from "@/config/api.config";

// Create new content

export const useStoreImage = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<AxiosResponse<StoreImageResponse>, Error, FormData>({
    mutationFn: async (file: FormData) => {
      const token = await getToken();

      return axios.post(`${BACKEND_URL}/image/add-image`, file, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });
};

// Get all content
export const useGetAllImage = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["image"],
    queryFn: async () => {
      const token = await getToken();

      const res = await axios.get(`${BACKEND_URL}/image/get-all-image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(res.data);

      return res.data.data;
    },
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();

      const response = await axios.delete(
        `${BACKEND_URL}/image/delete-image/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });
};
