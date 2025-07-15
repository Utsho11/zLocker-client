"use client";
import { SignIn } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : neobrutalism,
        }}
      />
    </div>
  );
}
