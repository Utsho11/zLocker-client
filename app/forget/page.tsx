"use client";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";

import { title } from "@/components/primitives";

export default function ForgetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const result = data;

    console.log(result);

    setIsLoading(false);
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
    </div>
  );
}
