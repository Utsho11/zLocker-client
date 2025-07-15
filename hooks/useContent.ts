import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://zlocker-server.vercel.app/api";

// Create new content
export const useCreateContent = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();

      const { data } = await axios.post(
        `${BACKEND_URL}/text/create-content`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["text"] });
    },
  });
};

// Get all content
export const useGetAllContent = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["text"],
    queryFn: async () => {
      const token = await getToken();

      const { data } = await axios.get(`${BACKEND_URL}/text/get-all-content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.data;
    },
    retry: false,
    staleTime: 0,
  });
};

// Get single content by ID
export const useGetContent = (id: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["text", id],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await axios.get(
        `${BACKEND_URL}/text/get-content/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.data;
    },
    enabled: !!id,
    retry: false,
    staleTime: 0,
  });
};

// Update content
export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const token = await getToken();

      const { data } = await axios.put(
        `${BACKEND_URL}/text/update-content/${id}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
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
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const { data } = await axios.delete(
        `${BACKEND_URL}/text/delete-content/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["text"] });
    },
  });
};
