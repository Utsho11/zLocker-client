"use client";

import { useEffect, useState, FormEvent } from "react";
import Swal from "sweetalert2";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Spinner } from "@nextui-org/react";

import { useGetContent, useUpdateContent } from "@/hooks/useContent";
import RichTextEditor from "@/components/rich-text-editor";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isPending, isFetching, isLoading } = useGetContent(
    id as string,
  );
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: updateContent } = useUpdateContent();

  // Prefill content when data loads
  useEffect(() => {
    if (data?.content) {
      setContent(data.content ?? "");
    }
  }, [data, isFetching]);

  // console.log(content);

  if (isPending || isLoading) {
    return (
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label="Loading..."
      />
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateContent({ id: id as string, content });
      Swal.fire({
        title: "Success!",
        text: "Content updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard/text");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong while updating the content.",
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
            {isSubmitting ? "Updating..." : "Update Content"}
          </Button>
          <Link href="/dashboard/text">
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
