"use client";

import { useEffect, useState, FormEvent } from "react";
import Swal from "sweetalert2";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, Plus, Unlock, X } from "lucide-react";

import { useGetContent, useUpdateContent } from "@/hooks/useContent";
import RichTextEditor from "@/components/rich-text-editor";
import {
  isZeroKnowledgeCiphertext,
  decryptZeroKnowledge,
  encryptZeroKnowledge,
} from "@/lib/crypto";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isPending, isLoading } = useGetContent(id as string);
  const [content, setContent] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [enableLock, setEnableLock] = useState<boolean>(false);
  const [isEncryptedOrigin, setIsEncryptedOrigin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: updateContent } = useUpdateContent();

  // Prefill content when data loads
  useEffect(() => {
    if (data?.content) {
      if (isZeroKnowledgeCiphertext(data.content)) {
        setIsEncryptedOrigin(true);
        setEnableLock(true);
      } else {
        setContent(data.content);
        setIsUnlocked(true);
      }
    }
  }, [data]);

  const handleDecryptNote = async () => {
    if (!passphrase) {
      Swal.fire("Passphrase Required", "Please enter your passphrase.", "warning");
      return;
    }

    const res = await decryptZeroKnowledge(data.content, passphrase);
    if (res.success) {
      setContent(res.text);
      setIsUnlocked(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Note Decrypted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Decryption Failed", res.error || "Incorrect passphrase.", "error");
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-default-500">
        <p>Loading note...</p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = enableLock && passphrase
        ? await encryptZeroKnowledge(content, passphrase)
        : content;

      await updateContent({ id: id as string, content: payload });
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
    <div className="max-w-5xl mx-auto space-y-4">
      {isEncryptedOrigin && !isUnlocked ? (
        <div className="flex flex-col items-center justify-center p-8 bg-default-100/70 border border-default-200 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
          <div className="p-4 bg-warning/10 text-warning rounded-full">
            <Lock size={36} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Encrypted Zero-Knowledge Note</h3>
            <p className="text-xs text-default-500 mt-1">
              Enter your passphrase to decrypt and edit this note.
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <input
              type="password"
              placeholder="Enter Passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDecryptNote()}
              className="w-full px-3 py-2 text-sm border border-default-300 rounded-lg bg-background outline-none focus:border-primary"
            />
            <Button color="primary" onPress={handleDecryptNote}>
              Decrypt
            </Button>
          </div>
          <Link href="/dashboard/text">
            <Button size="sm" variant="light">
              Back to Notes
            </Button>
          </Link>
        </div>
      ) : (
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
                {isSubmitting ? "Updating..." : "Update Note"}
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
                startContent={enableLock ? <Lock size={14} /> : <Unlock size={14} />}
                onPress={() => setEnableLock(!enableLock)}
              >
                {enableLock ? "Protected with Passphrase" : "No Passphrase"}
              </Button>

              {enableLock && (
                <input
                  type="password"
                  placeholder="Passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-warning text-xs bg-background outline-none w-48"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </form>
      )}
    </div>
  );
};

export default Page;
