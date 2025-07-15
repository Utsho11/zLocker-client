"use client";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { BookUser, LogIn } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="relative inline-block max-w-xl text-center justify-center">
        <span className={title()}>Store&nbsp;</span>
        <span className={title({ color: "blue" })}>notes&nbsp;</span>
        <span className={title()}>
          and{" "}
          <span className="bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd bg-clip-text text-transparent">
            images
          </span>{" "}
          <br /> with zlocker.
        </span>

        <div className={subtitle({ class: "mt-4" })}>
          A simple and modern platform for students to store text and images
          effortlessly.
        </div>
      </div>
      <div className="">
        <SignInButton>
          <Button
            className="hover:bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd hover:text-white transition-all duration-300 ease-in-out"
            color="primary"
            radius="full"
            startContent={<LogIn />}
            variant="bordered"
          >
            Open your locker
          </Button>
        </SignInButton>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Divider />
          <span>or</span>
          <Divider />
        </div>
      </div>
      <div className="">
        <p className="text-xl font-semibold">
          Are You{" "}
          <span className="bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd bg-clip-text text-transparent">
            New Here?
          </span>
        </p>
      </div>
      <SignUpButton>
        <Button
          color="primary"
          radius="full"
          startContent={<BookUser />}
          variant="solid"
        >
          Register Now!
        </Button>
      </SignUpButton>
    </section>
  );
}
