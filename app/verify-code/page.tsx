"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { InputOtp } from "@heroui/input-otp";

import { title } from "@/components/primitives";
import { useVerificationStore } from "@/store/useVerificationStore";
import { useVerifyCode } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const { email } = useVerificationStore();
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const { mutate: verifyCode, isPending: isSubmitting } = useVerifyCode();

  const handleVerify = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      Swal.fire({
        title: "Verifying...",
        text: "Please wait while we verify your code.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      verifyCode(
        { code: otp, email },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Verified successfully!",
              confirmButtonColor: "#3b82f6",
            }).then(() => {
              router.push("/profile");
            });
          },
          onError: (error: any) => {
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text:
                error.response?.data?.message ||
                "Verification failed. Please try again.",
              confirmButtonColor: "#3b82f6",
            });
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {};

  return (
    <div className="flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-xl  p-6 shadow-md">
        <h1 className={title()}>Verify Your Email</h1>

        <p className="text-sm text-gray-600 my-4">
          A verification code has been sent to{" "}
          <span className="font-medium">{email}</span>. Please check your inbox
          and spam folder.
        </p>

        <Form
          className="flex w-full justify-center items-center gap-4"
          onSubmit={handleVerify}
        >
          <InputOtp
            isRequired
            aria-label="OTP input field"
            errorMessage="Please enter valid otp."
            length={6}
            name="otp"
            placeholder="Enter code"
            size="lg"
            variant="underlined"
          />

          <div className="flex justify-between items-center w-[80%]">
            <Button
              color="primary"
              disabled={isResending}
              isLoading={isResending}
              variant="light"
              onPress={handleResend}
            >
              Resend code
            </Button>
            <Button
              color="primary"
              size="sm"
              type="submit"
              variant="solid"
              isLoading={isSubmitting}
            >
              Verify OTP
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
