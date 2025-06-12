"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeClosed, KeyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

import { title } from "@/components/primitives";
import { useChangePass } from "@/hooks/useAuth";

export default function ChangePassPage() {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const router = useRouter();
  const { mutateAsync: changePass } = useChangePass();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await changePass({ oldPassword, newPassword });

      Swal.fire({
        icon: "success",
        title: "Password changed successfully.",
        text: "You can now log in with your new password.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className={title()}>Change Your Password</h1>
      <Card fullWidth isBlurred isHoverable className="my-8">
        <Form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Old Password"
              name="oldPassword"
              type={isVisible ? "text" : "password"}
              variant="underlined"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="New Password"
              name="newPassword"
              type={isVisible ? "text" : "password"}
              variant="underlined"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              startContent={<KeyIcon size={16} />}
              isLoading={isLoading}
              size="sm"
              type="submit"
            >
              Change Password
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
