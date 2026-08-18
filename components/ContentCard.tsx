import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/modal";
import clipboardCopy from "clipboard-copy";
import { ClipboardCheck, Copy, Edit, EyeIcon, Lock, Trash, Unlock } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { isZeroKnowledgeCiphertext, decryptZeroKnowledge } from "@/lib/crypto";

type ContentCardProps = {
  title: string;
  content: string; // HTML or Encrypted content
  onEdit: () => void;
  onDelete: () => void;
};

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  content,
  onEdit,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copied, setCopied] = useState(false);
  const [decryptedHtml, setDecryptedHtml] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const isEncrypted = isZeroKnowledgeCiphertext(content);

  const displayContent = decryptedHtml !== null ? decryptedHtml : content;

  const handleUnlock = async () => {
    if (!passphrase) {
      Swal.fire({
        title: "Passphrase Required",
        text: "Please enter the passphrase to decrypt this note.",
        icon: "warning",
      });
      return;
    }

    const res = await decryptZeroKnowledge(content, passphrase);
    if (res.success) {
      setDecryptedHtml(res.text);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Note Unlocked!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Decryption Failed",
        text: res.error || "Incorrect passphrase.",
        icon: "error",
      });
    }
  };

  const handleCopy = async () => {
    const rawText = displayContent.replace(/<[^>]+>/g, "");
    await clipboardCopy(rawText);
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Content copied to clipboard!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Remove HTML tags and truncate preview
  const plainPreview = isEncrypted && decryptedHtml === null
    ? "🔒 Encrypted Note (ProtectedText format). Click to unlock."
    : displayContent.replace(/<[^>]*>/g, "");

  const truncatedContent =
    plainPreview.length > 180
      ? plainPreview.slice(0, 180).trim() + "..."
      : plainPreview;

  return (
    <>
      <Card
        isPressable
        className="w-full shadow-sm hover:shadow-md border border-default-200 transition-all"
        onPress={onOpen}
      >
        <CardHeader className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            {isEncrypted && decryptedHtml === null ? (
              <Lock size={16} className="text-warning" />
            ) : isEncrypted ? (
              <Unlock size={16} className="text-success" />
            ) : null}
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
          <div className="flex gap-0.5">
            <Button
              isIconOnly
              color="primary"
              size="sm"
              variant="light"
              onPress={onOpen}
            >
              <EyeIcon size={16} />
            </Button>
            <Button
              isIconOnly
              color="secondary"
              size="sm"
              variant="light"
              onPress={onEdit}
            >
              <Edit size={16} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              size="sm"
              variant="light"
              onPress={onDelete}
            >
              <Trash size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-hidden max-h-[5.5rem] pt-1">
          <p className="text-sm text-default-500 leading-relaxed">{truncatedContent}</p>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="lg"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-6">
                {isEncrypted && decryptedHtml === null ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <div className="p-4 bg-warning/10 text-warning rounded-full">
                      <Lock size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Encrypted Zero-Knowledge Note</h4>
                      <p className="text-xs text-default-500 mt-1">
                        Enter the passphrase to decrypt this note in your browser.
                      </p>
                    </div>
                    <div className="flex gap-2 w-full max-w-sm">
                      <input
                        type="password"
                        placeholder="Enter Locker Passphrase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                        className="w-full border border-default-300 rounded-lg px-3 py-2 text-sm bg-default-50 outline-none focus:border-primary"
                      />
                      <Button color="primary" size="sm" onPress={handleUnlock}>
                        Unlock
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: displayContent }}
                      className="prose dark:prose-invert max-w-none"
                    />
                    <div className="flex justify-end pt-4">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        title="Copy Content"
                        variant="flat"
                        onPress={handleCopy}
                      >
                        {copied ? <ClipboardCheck size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
