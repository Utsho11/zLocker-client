"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/modal";
import clipboardCopy from "clipboard-copy";
import { ClipboardCheck, Copy, Edit, EyeIcon, Lock, Trash, Unlock, Layers } from "lucide-react";
import Swal from "sweetalert2";

import { isZeroKnowledgeCiphertext, decryptZeroKnowledge, parseNotePayload, NoteTab } from "@/lib/crypto";

type ContentCardProps = {
  title: string;
  content: string; // HTML, JSON, or Encrypted content
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
  const [decryptedRaw, setDecryptedRaw] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [activeModalTabId, setActiveModalTabId] = useState<string>("");

  const isEncrypted = isZeroKnowledgeCiphertext(content);
  const rawPayload = decryptedRaw !== null ? decryptedRaw : isEncrypted ? "" : content;
  const tabs: NoteTab[] = rawPayload ? parseNotePayload(rawPayload) : [];

  const currentTab = tabs.find((t) => t.id === activeModalTabId) || tabs[0];

  const handleUnlock = async () => {
    if (!passphrase.trim()) {
      Swal.fire({
        title: "Password Required",
        text: "Please enter the password to decrypt this note.",
        icon: "warning",
      });
      return;
    }

    const res = await decryptZeroKnowledge(content, passphrase);
    if (res.success) {
      setDecryptedRaw(res.text);
      const parsedTabs = parseNotePayload(res.text);
      if (parsedTabs.length > 0) setActiveModalTabId(parsedTabs[0].id);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Password Verified & Unlocked!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Decryption Failed",
        text: "Incorrect password. Unable to unlock note.",
        icon: "error",
      });
    }
  };

  const handleCopy = async () => {
    const rawText = currentTab ? currentTab.content.replace(/<[^>]+>/g, "") : "";
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

  // Preview text for card body
  const previewText = (() => {
    if (isEncrypted && decryptedRaw === null) {
      return "🔒 Encrypted Note (ProtectedText format). Click to verify password.";
    }
    if (tabs.length > 0) {
      const combined = tabs.map((t) => `${t.title}: ${t.content.replace(/<[^>]*>/g, " ")}`).join(" | ");
      return combined.trim() || "Empty note";
    }
    return content.replace(/<[^>]*>/g, " ").trim() || "Empty note";
  })();

  const truncatedContent =
    previewText.length > 180 ? previewText.slice(0, 180).trim() + "..." : previewText;

  return (
    <>
      <Card
        isPressable
        className="w-full shadow-sm hover:shadow-md border border-default-200 transition-all"
        onPress={onOpen}
      >
        <CardHeader className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            {isEncrypted && decryptedRaw === null ? (
              <Lock size={16} className="text-warning flex-shrink-0" />
            ) : isEncrypted ? (
              <Unlock size={16} className="text-success flex-shrink-0" />
            ) : tabs.length > 1 ? (
              <Layers size={16} className="text-primary flex-shrink-0" />
            ) : null}
            <h3 className="text-base font-semibold truncate max-w-[180px]">{title}</h3>
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
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="py-6 space-y-4">
                {isEncrypted && decryptedRaw === null ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <div className="p-4 bg-warning/10 text-warning rounded-full">
                      <Lock size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Password-Protected Note</h4>
                      <p className="text-xs text-default-500 mt-1">
                        Enter the password to verify and decrypt all tabs.
                      </p>
                    </div>
                    <div className="flex gap-2 w-full max-w-sm">
                      <input
                        type="password"
                        placeholder="Enter Locker Password"
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
                    {/* Tab Bar in Modal Preview */}
                    {tabs.length > 1 && (
                      <div className="flex items-center gap-1 border-b border-default-200 pb-1 overflow-x-auto">
                        {tabs.map((tab) => {
                          const isActive = (activeModalTabId || tabs[0].id) === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveModalTabId(tab.id)}
                              className={`px-3 py-1 text-xs font-semibold rounded-t-lg transition-colors border-t border-x ${
                                isActive
                                  ? "bg-background border-default-300 text-primary -mb-[1px] border-b-0"
                                  : "bg-default-100/70 border-transparent text-default-500 hover:bg-default-200/60"
                              }`}
                            >
                              {tab.title}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{ __html: currentTab?.content || "" }}
                      className="prose dark:prose-invert max-w-none min-h-[150px]"
                    />

                    <div className="flex justify-between items-center pt-4 border-t border-default-100">
                      <span className="text-xs text-default-400">
                        {tabs.length > 1 ? `Viewing Tab: ${currentTab?.title}` : ""}
                      </span>
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        title="Copy Tab Content"
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
