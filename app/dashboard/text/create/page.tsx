"use client";
import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import RichTextEditor from "@/components/rich-text-editor";
import { useCreateContent } from "@/hooks/useContent";

const Page = () => {
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createContent } = useCreateContent();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createContent(content); // assuming this returns a promise and handles errors internally
      Swal.fire({
        title: "Success!",
        text: "Content stored successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard/text");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong while storing the content.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:min-w-[900px] mx-auto space-y-2">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <Button
            className="mb-4"
            color="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            size="sm"
            startContent={<Plus size={16} />}
            type="submit"
            variant="solid"
          >
            {isSubmitting ? "Creating..." : "Add Content"}
          </Button>
          <Link className="text-sm" href="/dashboard/text">
            <Button
              color="danger"
              size="sm"
              startContent={<X size={16} />}
              variant="bordered"
            >
              Cancel
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </form>
    </div>
  );
};

export default Page;
