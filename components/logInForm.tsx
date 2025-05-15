"use client";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

const LogInForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [errors, setErrors] = useState({});

  const onSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const result = data;

    console.log(result);

    setErrors(result.errors);
    setIsLoading(false);
  };

  return (
    <div className="">
      <Form onSubmit={onSubmit}>
        <Input
          isRequired
          errorMessage="Please enter a valid email or username"
          label="Email or Username"
          name="username"
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
          <Button color="primary" isLoading={isLoading} type="submit">
            Unlock
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LogInForm;
