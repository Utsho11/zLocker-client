"use client";

import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import {
  Lock,
  Image as ImageIcon,
  ShieldCheck,
  Info,
  Code,
} from "lucide-react";

export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About ZLocker</h1>
        <p className="text-default-500 text-lg max-w-2xl mx-auto">
          ZLocker is a modern, privacy-first web application built to securely
          store and manage your sensitive data.
        </p>
      </div>

      <Card className="mb-12 shadow-md">
        <CardHeader className="flex gap-4 items-center">
          <Info className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            In an age of growing digital threats, ZLocker provides a safe and
            simple solution to protect your text and image data. Our mission is
            to ensure your data remains private, secure, and always accessible
            to you — and only you.
          </p>
        </CardBody>
      </Card>

      <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Encrypted Text</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-sm text-default-500">
              All text data is encrypted before storage, ensuring
              confidentiality and zero unauthorized access.
            </p>
          </CardBody>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Image Upload</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-sm text-default-500">
              Upload and store images securely with a user-friendly interface
              and reliable backend.
            </p>
          </CardBody>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Authentication</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-sm text-default-500">
              Secure user login and registration system with session handling
              and protected routes.
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Code className="mx-auto text-primary mb-2" />
        <p className="text-sm text-default-500">
          Designed and developed with ❤️ by{" "}
          <span className="font-semibold text-primary">Utsho Roy</span>
        </p>
      </div>
    </section>
  );
}
