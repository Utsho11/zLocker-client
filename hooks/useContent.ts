import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createContentAPI,
  deleteContentApi,
  getAllContentApi,
  getContentApi,
  updateContentApi,
} from "@/api/text";

// Create new content
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createContentAPI(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["text"] });
    },
  });
};

// Get all content
export const useGetAllContent = () => {
  return useQuery({
    queryKey: ["text"],
    queryFn: getAllContentApi,
    retry: false,
    staleTime: 0,
  });
};

// Get single content by ID
export const useGetContent = (id: string) => {
  return useQuery({
    queryKey: ["text", id],
    queryFn: () => getContentApi(id),
    enabled: !!id,
    retry: false,
    staleTime: 0,
  });
};

// Update content
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateContentApi(id, content),
    onSuccess: (_data, variables) => {
      // Invalidate both the list and individual item cache
      queryClient.invalidateQueries({ queryKey: ["text"] });
      queryClient.invalidateQueries({ queryKey: ["text", variables.id] });
    },
  });
};

// Delete content
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["text"] });
    },
  });
};
