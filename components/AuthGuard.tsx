"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useProfile } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (data && !data.data?.isVerified) {
      const email = data.data.email;

      router.push(`/verify-code?email=${email}`);
    }
  }, [data, router]);

  if (isLoading || !data) return null;

  return <>{children}</>;
}
