"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import {
  FileUp,
  Upload,
  FileText,
  Presentation,
  Archive,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import Swal from "sweetalert2";

import { useStoreImage } from "@/hooks/useImageContent";

export default function ImageFileInputCardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending } = useStoreImage();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (selected) {
      setFile(selected);
      if (selected.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadImage(formData);
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: `"${file.name}" has been uploaded to your zLocker.`,
      });
      closeModal();
    } catch (error: any) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error?.response?.data?.message || "There was a problem uploading the file.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="w-12 h-12 text-red-500" />;
    if (ext === "pptx" || ext === "ppt")
      return <Presentation className="w-12 h-12 text-orange-500" />;
    if (ext === "docx" || ext === "doc")
      return <FileText className="w-12 h-12 text-blue-500" />;
    if (ext === "xlsx" || ext === "xls")
      return <FileSpreadsheet className="w-12 h-12 text-green-500" />;
    if (ext === "zip" || ext === "rar" || ext === "7z")
      return <Archive className="w-12 h-12 text-yellow-500" />;
    return <FileIcon className="w-12 h-12 text-primary" />;
  };

  return (
    <>
      <Card
        fullWidth
        isPressable
        className="p-4 w-full sm:w-[300px] border border-dashed border-default-300 hover:border-primary transition-all shadow-sm"
        onPress={openModal}
      >
        <CardBody className="flex h-60 items-center justify-center text-default-500">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <FileUp className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-foreground">Upload File</p>
            <p className="text-xs text-default-400">
              Images, PDFs, PPTX, Docs, ZIPs
            </p>
          </div>
        </CardBody>
      </Card>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onClose={closeModal}
      >
        <ModalContent>
          <ModalHeader>Upload to zLocker</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                accept="image/*,application/pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.zip,.rar,.7z,.txt,.csv"
                className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer border border-default-200 rounded-lg p-2"
                type="file"
                onChange={handleFileChange}
              />

              {file && (
                <div className="p-4 bg-default-100 rounded-xl flex items-center gap-4">
                  {previewUrl ? (
                    <Image
                      alt="Preview"
                      className="max-h-24 object-contain rounded"
                      src={previewUrl}
                    />
                  ) : (
                    getFileIcon(file.name)
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{file.name}</p>
                    <p className="text-xs text-default-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!file || isPending}
              isLoading={isPending}
              startContent={!isPending && <Upload size={16} />}
              onPress={handleSubmit}
            >
              {isPending ? "Uploading..." : "Upload File"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
