"use client";

import { FormEvent, useState } from "react";
import { Lock, Plus, X } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import RichTextEditor from "@/components/rich-text-editor";
import { useCreateContent } from "@/hooks/useContent";
import { encryptZeroKnowledge } from "@/lib/crypto";

const Page = () => {
  const [content, setContent] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [enableLock, setEnableLock] = useState<boolean>(false);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createContent } = useCreateContent();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      Swal.fire("Empty Note", "Please write some content before saving.", "info");
      return;
    }

    setIsSubmitting(true);

    try {
      // Client-Side Zero-Knowledge Encryption
      const encryptedPayload = enableLock && passphrase
        ? await encryptZeroKnowledge(content, passphrase)
        : content;

      await createContent(encryptedPayload);

      Swal.fire({
        title: "Success!",
        text: enableLock && passphrase
          ? "Note encrypted and saved successfully!"
          : "Note stored successfully.",
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
    <div className="max-w-5xl mx-auto space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-default-100/60 p-4 rounded-2xl border border-default-200">
          <div className="flex items-center gap-2">
            <Button
              color="primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              size="sm"
              startContent={!isSubmitting && <Plus size={16} />}
              type="submit"
              variant="solid"
            >
              {isSubmitting ? "Saving..." : "Save Note"}
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

          <div className="flex items-center gap-2 text-xs">
            <Button
              size="sm"
              variant={enableLock ? "flat" : "light"}
              color={enableLock ? "warning" : "default"}
              startContent={<Lock size={14} />}
              onPress={() => setEnableLock(!enableLock)}
            >
              {enableLock ? "Passphrase Protection Active" : "Lock with Passphrase"}
            </Button>

            {enableLock && (
              <input
                type="password"
                placeholder="Set Passphrase (Zero-Knowledge)"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-warning text-xs bg-background outline-none w-52"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </form>
    </div>
  );
};

export default Page;
