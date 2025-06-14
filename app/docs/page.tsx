// app/docs/page.tsx

"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ShieldCheck, Image, LockKeyhole } from "lucide-react";

const features = [
  {
    icon: <LockKeyhole className="w-8 h-8 text-primary" />,
    title: "Encrypted Text Storage",
    description:
      "Your text data is securely encrypted before it is stored, ensuring privacy and protection from unauthorized access.",
  },
  {
    icon: <Image className="w-8 h-8 text-primary" />,
    title: "Image Support",
    description:
      "Easily upload, view, and manage images with fast and secure handling via cloud storage.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Authentication System",
    description:
      "Robust authentication with session handling and secure login to protect user data.",
  },
];

export default function DocsPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        📘 ZLocker Documentation
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition">
            <CardHeader className="flex gap-4 items-center">
              {feature.icon}
              <h2 className="text-xl font-semibold">{feature.title}</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-default-500">{feature.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
