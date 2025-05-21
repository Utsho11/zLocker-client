"use client";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ResetPassPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
      });
    }

    try {
      setIsLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        { email, password: newPassword },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password reset successful",
        text: "You can now log in with your new password.",
      });

      router.push("/");
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
      <h1 className={title()}>Reset Your Password</h1>
      <Card fullWidth isBlurred isHoverable className="my-8">
        <Form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              isRequired
              label="New Password"
              name="newPassword"
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
              type={isVisible ? "text" : "password"}
              variant="underlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              isRequired
              label="Confirm Password"
              name="confirmPassword"
              type={isVisible ? "text" : "password"}
              variant="underlined"
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
              color={confirmPassword && !passwordsMatch ? "danger" : "default"}
              errorMessage={
                confirmPassword && !passwordsMatch
                  ? "Passwords do not match"
                  : ""
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              isLoading={isLoading}
              type="submit"
              isDisabled={!passwordsMatch}
              size="sm"
            >
              Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
