"use client";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { InputOtp } from "@heroui/input-otp";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

import { title } from "@/components/primitives";
import { useResendVerifyCode, useVerifyCode } from "@/hooks/useAuth";
import ResendCodeButton from "@/components/ResendCodeButton";

export default function VerifyCodePage() {
  const email = useSearchParams().get("email") || "";

  const router = useRouter();

  const { mutate: verifyCode, isPending: isSubmitting } = useVerifyCode();
  const { mutate: resendVerifyCode } = useResendVerifyCode();
  const queryClient = useQueryClient();
  const { update } = useSession();

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
          onSuccess: async (res) => {
            console.log(res.data.accessToken);

            const newToken = res.data.accessToken;

            Swal.close();
            await Swal.fire({
              icon: "success",
              title: "Email Verified!",
              text: "Your email has been successfully verified.",
              confirmButtonText: "Ok",
              confirmButtonColor: "#3085d6",
            });

            await update({
              accessToken: newToken,
            });

            await queryClient.invalidateQueries({ queryKey: ["me"] });

            router.push("/dashboard");
          },

          onError: (error: unknown) => {
            let errorMessage = "Verification failed. Please try again.";

            if (
              typeof error === "object" &&
              error !== null &&
              "response" in error &&
              typeof (error as any).response === "object" &&
              (error as any).response !== null &&
              "data" in (error as any).response &&
              typeof (error as any).response.data === "object" &&
              (error as any).response.data !== null &&
              "message" in (error as any).response.data
            ) {
              errorMessage = (error as any).response.data.message;
            }
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: errorMessage,
              confirmButtonColor: "#3b82f6",
            });
          },
        },
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const handleResend = async () => {
    try {
      await resendVerifyCode({ email });

      Swal.fire({
        icon: "success",
        title: "Code Resent!",
        text: "A new verification code has been sent to your email.",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: "Failed to resend the verification code. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

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
            <ResendCodeButton onResend={handleResend} />
            <Button
              color="primary"
              isLoading={isSubmitting}
              size="sm"
              type="submit"
              variant="solid"
            >
              Verify OTP
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
