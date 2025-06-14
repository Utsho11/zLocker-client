"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeClosed, KeyIcon } from "lucide-react";

import { title } from "@/components/primitives";
import { useChangePass, useLogOut } from "@/hooks/useAuth";
import { useAuthstore } from "@/store/AuthStore";

export default function ChangePassPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOldVisible, setIsOldVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);

  const router = useRouter();
  const { mutate: changePass } = useChangePass();
  const setLogin = useAuthstore((s) => s.setLogin);
  const { mutate: logOut } = useLogOut();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    changePass(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Password changed successfully.",
            text: "You can now log in with your new password.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          logOut();
          setLogin(false);
          router.push("/");
        },
        onError: (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Failed to Change Password",
            text: error.response?.data?.message || "Give valid password.",
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
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
                  aria-label="toggle old password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsOldVisible((prev) => !prev)}
                >
                  {isOldVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Old Password"
              name="oldPassword"
              type={isOldVisible ? "text" : "password"}
              value={oldPassword}
              variant="underlined"
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <Input
              isRequired
              endContent={
                <button
                  aria-label="toggle new password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsNewVisible((prev) => !prev)}
                >
                  {isNewVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="New Password"
              name="newPassword"
              type={isNewVisible ? "text" : "password"}
              value={newPassword}
              variant="underlined"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </CardBody>

          <CardFooter>
            <Button
              color="primary"
              isLoading={isLoading}
              size="sm"
              startContent={<KeyIcon size={16} />}
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
