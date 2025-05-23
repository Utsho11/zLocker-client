"use client";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

import { useRegister } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const register = useRegister();
  const router = useRouter();

  const onSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const emailORusername = data.emailORusername as string;
    const password = data.password as string;

    try {
      register.mutate(
        { emailORusername, password },
        {
          onSuccess: () => {
            router.push("/profile");
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Locker created successfully!",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          },
          onError: () => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "Invalid credentials",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Create{" "}
          <span className="bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd bg-clip-text text-transparent">
            Your First Virtual Locker
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Register now to unlock personalized features, save your progress, and
          get access to exclusive content tailored just for you.
        </p>
      </div>

      <Form onSubmit={onSubmit}>
        <Input
          isRequired
          errorMessage="Please enter a valid email or username"
          label="Email or Username"
          name="emailORusername"
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
        <div className="my-4">
          <Button
            color="primary"
            isLoading={isLoading}
            radius="full"
            type="submit"
          >
            Create Locker
          </Button>
        </div>
      </Form>
      <p className="text-lg md:text-lg text-gray-600 max-w-2xl mx-auto">
        Note: By creating a locker, you agree to our terms of service and
        privacy. If you use email, a verification link will be sent to your
        email address. Please check your spam folder if you don&#39;t see it in
        your inbox.
      </p>
    </div>
  );
};

export default RegisterPage;
