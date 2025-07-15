"use client";

import { useUser } from "@clerk/nextjs";

export const useAuthUser = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  return {
    isSignedIn,
    isLoaded,
    user,
  };
};
