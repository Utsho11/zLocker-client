"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { deleteImageApi, getAllImageApi, storeImageApi } from "@/api/image";

// Create new content
type StoreImageResponse = {
  url: string;
  message: string;
};

export const useStoreImage = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<StoreImageResponse>, Error, FormData>({
    mutationFn: (file: FormData) => storeImageApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });
};

// Get all content
export const useGetAllImage = () => {
  return useQuery({
    queryKey: ["image"],
    queryFn: getAllImageApi,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteImageApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });
};
