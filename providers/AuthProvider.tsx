// providers/AuthProvider.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Optional: Auto restore token and validate (e.g., using /me)
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          if (!res.ok) throw new Error("Invalid session");

          const user = await res.json();
          login(user, token);
        } catch {
          logout();
        }
      }
    };

    restoreSession();
  }, [token, login, logout]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
