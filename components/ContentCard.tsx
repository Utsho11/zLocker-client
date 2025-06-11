"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/modal";
import clipboardCopy from "clipboard-copy";
import { ClipboardCheck, Copy, Edit, EyeIcon, Trash } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

type ContentCardProps = {
  title: string;
  content: string; // HTML content
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

  const handleCopy = async () => {
    await clipboardCopy(content.replace(/<[^>]+>/g, ""));
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Content copied to clipboard!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  // Remove HTML tags and truncate to 100 characters
  const textContent = content.replace(/<[^>]*>/g, "");
  const truncatedContent =
    textContent.length > 200
      ? textContent.slice(0, 200).trim() + "..."
      : textContent;

  return (
    <>
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-md">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex">
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
        <CardBody className="overflow-hidden max-h-[6rem]">
          <p className="text-sm leading-relaxed">{truncatedContent}</p>
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
              <ModalBody>
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="prose dark:prose-invert py-6"
                />
                <div className="flex justify-end px-6 pt-4">
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
