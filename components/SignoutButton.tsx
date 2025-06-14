"use client";

import { Button } from "@heroui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLogOut } from "@/hooks/useAuth";
import { useAuthstore } from "@/store/AuthStore";
export default function SignoutButton() {
  const { mutate: logOut } = useLogOut();
  const setLogin = useAuthstore((s) => s.setLogin);
  const router = useRouter();

  const handleLogOut = () => {
    logOut();
    setLogin(false);
    router.push("/");
  };

  return (
    <Button
      color="danger"
      size="sm"
      startContent={<LogOut size={16} />}
      variant="bordered"
      onPress={handleLogOut}
    >
      Sign Out
    </Button>
  );
}
