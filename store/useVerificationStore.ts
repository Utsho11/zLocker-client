import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VerificationState {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: "" }),
    }),
    {
      name: "verification-storage", // this is the key in localStorage
    },
  ),
);
