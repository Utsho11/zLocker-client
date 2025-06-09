import { useMutation } from "@tanstack/react-query";

import { createContentAPI } from "@/api/text";

export const useCreateContent = () => {
  return useMutation({
    mutationFn: (content: string) => createContentAPI(content),
  });
};
