"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/config/api.config";

export interface GuestFileItem {
  _id: string;
  lockerId: string;
  link: string;
  publicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  resourceType: string;
  expiresAt: string;
  createdAt: string;
}

export interface GuestTextItem {
  _id: string;
  lockerId: string;
  content: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestLockerData {
  lockerId: string;
  texts: GuestTextItem[];
  files: GuestFileItem[];
  expiresAt: string;
}

// Fetch Guest Locker data
export const useGetGuestLocker = (lockerId: string) => {
  return useQuery<GuestLockerData>({
    queryKey: ["guestLocker", lockerId],
    queryFn: async () => {
      if (!lockerId) throw new Error("Locker ID is required");
      const res = await axios.get(`${BACKEND_URL}/guest/${lockerId}`);
      return res.data.data;
    },
    enabled: !!lockerId,
    refetchInterval: 30000, // refresh every 30 seconds
  });
};

// Save or Update Guest Note
export const useSaveGuestText = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lockerId,
      content,
    }: {
      lockerId: string;
      content: string;
    }) => {
      const res = await axios.post(`${BACKEND_URL}/guest/${lockerId}/text`, {
        content,
      });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["guestLocker", variables.lockerId],
      });
    },
  });
};

// Upload Guest File (PDF, PPTX, Image, Docs, ZIPs)
export const useUploadGuestFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lockerId,
      formData,
    }: {
      lockerId: string;
      formData: FormData;
    }) => {
      const res = await axios.post(
        `${BACKEND_URL}/guest/${lockerId}/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["guestLocker", variables.lockerId],
      });
    },
  });
};

// Delete specific Guest File
export const useDeleteGuestFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lockerId,
      fileId,
    }: {
      lockerId: string;
      fileId: string;
    }) => {
      const res = await axios.delete(
        `${BACKEND_URL}/guest/${lockerId}/file/${fileId}`
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["guestLocker", variables.lockerId],
      });
    },
  });
};

// Delete / Self-Destruct Guest Locker
export const useDeleteGuestLocker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lockerId: string) => {
      const res = await axios.delete(`${BACKEND_URL}/guest/${lockerId}`);
      return res.data.data;
    },
    onSuccess: (_, lockerId) => {
      queryClient.invalidateQueries({
        queryKey: ["guestLocker", lockerId],
      });
    },
  });
};
