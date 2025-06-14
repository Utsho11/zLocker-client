import { create } from "zustand";

type AuthStore = {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
};

export const useAuthstore = create<AuthStore>((set) => ({
  isLogin: false,
  setLogin: (value) => set({ isLogin: value }),
}));
