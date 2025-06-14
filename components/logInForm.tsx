"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeClosed } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { useLogin } from "@/hooks/useAuth";

const LogInForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const { mutate: login } = useLogin();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const email = data.email as string;
    const password = data.password as string;

    try {
      setIsLoading(true);
      login(
        { email, password },
        {
          onSuccess: (data) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Login Successful",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            setIsLoading(false);
            // console.log("Login success:", data);
            const isVerified = data.data.isVerified;

            if (isVerified) {
              router.push("/dashboard");
            } else {
              router.push(`verify-code?email=${data.data.email}`);
            }
          },
          onError: (error: any) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: error || "Login Failed",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            setIsLoading(false);
          },
        },
      );
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Login Failed!!!",
        text: error || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Form onSubmit={onSubmit}>
        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          name="email"
          type="text"
          variant="underlined"
          // eslint-disable-next-line no-console
          onClear={() => console.log("input cleared")}
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
          errorMessage="Please enter a password"
          label="Password"
          name="password"
          type={isVisible ? "text" : "password"}
          variant="underlined"
        />
        <div className="my-4 flex justify-between items-center w-full">
          <Button color="primary" isLoading={isLoading} type="submit">
            Unlock
          </Button>
          <>
            <Link href="/forget">
              <span className="hover:text-blue-500 hover:underline">
                Forget Password?
              </span>
            </Link>
          </>
        </div>
      </Form>
    </div>
  );
};

export default LogInForm;
