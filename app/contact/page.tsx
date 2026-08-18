"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import axios from "axios";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { BACKEND_URL } from "@/config/api.config";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/send-email`, {
        name: form.name,
        email: form.email,
        message: form.message,
      });

      if (response.status === 200 || response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "Thank you for contacting us!",
        });

        // Reset form fields
        setForm({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Contact form error:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <p className="text-lg font-medium">
            We’d love to hear from you! Fill out the form below.
          </p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Textarea
              isRequired
              label="Message"
              minRows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
            />
            <Button
              color="primary"
              startContent={<Send className="w-4 h-4" />}
              type="submit"
            >
              Send Message
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div>
          <Mail className="mx-auto text-primary" />
          <p className="font-semibold mt-2">Email</p>
          <p className="text-default-500 text-sm">zlocker2025@gmail.com</p>
        </div>
        <div>
          <Phone className="mx-auto text-primary" />
          <p className="font-semibold mt-2">Phone</p>
          <p className="text-default-500 text-sm">+880 15217 93531</p>
        </div>
        <div>
          <MapPin className="mx-auto text-primary" />
          <p className="font-semibold mt-2">Location</p>
          <p className="text-default-500 text-sm">Dhaka, Bangladesh</p>
        </div>
      </div>
    </section>
  );
}
