"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { BookUser, LogIn } from "lucide-react";
import Link from "next/link";

import { title, subtitle } from "@/components/primitives";
import LogInForm from "@/components/logInForm";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="relative inline-block max-w-xl text-center justify-center">
        <span className={title()}>Share&nbsp;</span>
        <span className={title({ color: "blue" })}>ideas&nbsp;</span>
        <span className={title()}>
          and{" "}
          <span className="bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd bg-clip-text text-transparent">
            creativity
          </span>{" "}
          <br /> with your classmates.
        </span>

        <div className={subtitle({ class: "mt-4" })}>
          A simple and modern platform for students to post text and images
          effortlessly.
        </div>
      </div>
      <div className="">
        <Button
          className="hover:bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd hover:text-white transition-all duration-300 ease-in-out"
          color="primary"
          radius="full"
          startContent={<LogIn />}
          variant="bordered"
          onPress={onOpen}
        >
          Open your locker
        </Button>
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
      <Link href="/register">
        <Button
          color="primary"
          radius="full"
          startContent={<BookUser />}
          variant="solid"
        >
          Register Now!
        </Button>
      </Link>
      <Modal isOpen={isOpen} placement="center" size={"xl"} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex justify-between items-center gap-1">
            Open Your Locker
          </ModalHeader>
          <ModalBody>
            <LogInForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
