import { Button } from "@heroui/button";
import { LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";

export default function SignoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });

    await getSession();
  };

  return (
    <Button
      color="danger"
      size="sm"
      startContent={<LogOut size={16} />}
      variant="bordered"
      onPress={handleLogout}
    >
      Sign Out
    </Button>
  );
}
