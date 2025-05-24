"use client";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { title } from "@/components/primitives";
import { useForgetPassword } from "@/hooks/useAuth";

export default function ForgetPage() {
  const [isLoading, setIsLoading] = useState(false);

  const forget = useForgetPassword();
  const router = useRouter();

  const onSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const email = data.email as string;

    try {
      forget.mutate(
        { email },
        {
          onSuccess: () => {
            router.push("/");
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Email is sent to your gmail successfully!",
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
        },
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
    <div className="flex flex-col items-center justify-center space-y-8 md:space-y-24">
      <h1 className={title()}>Forget Password</h1>
      <Card fullWidth={true} isBlurred={true} isHoverable={true}>
        <Form onSubmit={onSubmit}>
          <CardBody>
            <Input
              isRequired
              errorMessage="Please enter a valid email"
              label="Enter email"
              name="email"
              type="text"
              variant="underlined"
              // eslint-disable-next-line no-console
              onClear={() => console.log("input cleared")}
            />
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              isLoading={isLoading}
              size="sm"
              type="submit"
            >
              Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
      <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">
            Please check both your <span className="font-semibold">inbox</span>{" "}
            and <span className="font-semibold">spam/junk folder</span> for our
            email.
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Sometimes, automated messages may be filtered by mistake. If you
            don’t receive it within a few minutes, try searching for our address
            or refreshing your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
