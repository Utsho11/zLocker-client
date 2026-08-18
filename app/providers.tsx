"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute fresh cache
            gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
            refetchOnWindowFocus: false, // Prevents laggy refetches when clicking around
            retry: 1,
          },
        },
      })
  );

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
