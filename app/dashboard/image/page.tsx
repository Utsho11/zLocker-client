import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import {
  Download,
  Eye,
  Trash2,
  FileText,
  Presentation,
  Archive,
  FileSpreadsheet,
  File as FileIcon,
  Copy,
  ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import clipboardCopy from "clipboard-copy";

import { useDeleteImage, useGetAllImage } from "@/hooks/useImageContent";
import ImageInputCard from "@/components/ImageInputCard";

interface FileItem {
  _id: string;
  link: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  resourceType?: string;
  createdAt?: string;
}

const Page = () => {
  const { data, isLoading } = useGetAllImage();
  const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteImage();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleDelete = async (id: string, name?: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `"${name || "This file"}" will be permanently deleted from zLocker!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteImage(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.response?.data?.message || error?.message || "Failed to delete file.",
          "error"
        );
      }
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = name || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  const handleCopyLink = async (url: string) => {
    await clipboardCopy(url);
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Direct link copied!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleView = (item: FileItem) => {
    if (item.fileType === "image" || (!item.fileType && item.link)) {
      setSelectedImage(item.link);
      setSelectedFileName(item.fileName || "Image Preview");
      onOpen();
    } else {
      window.open(item.link, "_blank");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderFileThumbnail = (item: FileItem) => {
    const type = item.fileType || "image";

    if (type === "image") {
      return (
        <Image
          alt={item.fileName || "Uploaded image"}
          className="object-cover h-48 w-full transition-transform hover:scale-105"
          radius="none"
          src={item.link}
          width={320}
        />
      );
    }

    if (type === "pdf") {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-red-500/10 text-red-500 gap-2">
          <FileText size={48} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/20">
            PDF Document
          </span>
        </div>
      );
    }

    if (type === "pptx") {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-orange-500/10 text-orange-500 gap-2">
          <Presentation size={48} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20">
            PowerPoint
          </span>
        </div>
      );
    }

    if (type === "docx") {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-blue-500/10 text-blue-500 gap-2">
          <FileText size={48} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20">
            Word Document
          </span>
        </div>
      );
    }

    if (type === "xlsx") {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-green-500/10 text-green-500 gap-2">
          <FileSpreadsheet size={48} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-500/20">
            Excel Sheet
          </span>
        </div>
      );
    }

    if (type === "zip") {
      return (
        <div className="h-48 w-full flex flex-col items-center justify-center bg-yellow-500/10 text-yellow-500 gap-2">
          <Archive size={48} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-500/20">
            Compressed Archive
          </span>
        </div>
      );
    }

    return (
      <div className="h-48 w-full flex flex-col items-center justify-center bg-primary/10 text-primary gap-2">
        <FileIcon size={48} />
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20">
          File
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-default-500">
        <p>Loading your zLocker files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold">Cloud File Locker</h2>
          <p className="text-sm text-default-500">
            Securely stored in Cloudinary ({data?.length || 0} files)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ImageInputCard />
        {data?.map((file: FileItem) => (
          <Card
            key={file._id}
            isPressable
            className="overflow-hidden border border-default-200 hover:border-primary/50 transition-all shadow-sm"
            radius="lg"
            onPress={() => handleView(file)}
          >
            <CardHeader className="p-3 pb-0 flex flex-col items-start gap-0.5">
              <p className="text-sm font-semibold truncate w-full" title={file.fileName || "File"}>
                {file.fileName || "Uploaded File"}
              </p>
              {file.fileSize && (
                <p className="text-xs text-default-400">
                  {formatFileSize(file.fileSize)}
                </p>
              )}
            </CardHeader>
            <CardBody className="overflow-hidden p-3 pt-2 flex items-center justify-center">
              <div className="w-full rounded-lg overflow-hidden border border-default-100">
                {renderFileThumbnail(file)}
              </div>
            </CardBody>
            <CardFooter className="flex justify-between gap-1 p-2 pt-0 border-t border-default-100">
              <Button
                isIconOnly
                size="sm"
                title={file.fileType === "image" ? "Preview" : "Open in new tab"}
                variant="light"
                onPress={() => handleView(file)}
              >
                {file.fileType === "image" ? <Eye size={16} /> : <ExternalLink size={16} />}
              </Button>
              <Button
                isIconOnly
                size="sm"
                title="Copy Link"
                variant="light"
                onPress={() => handleCopyLink(file.link)}
              >
                <Copy size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                title="Download"
                variant="light"
                onPress={() =>
                  handleDownload(file.link, file.fileName || `file-${file._id}`)
                }
              >
                <Download size={16} />
              </Button>
              <Button
                isIconOnly
                color="danger"
                isLoading={isDeleting}
                size="sm"
                title="Delete"
                variant="light"
                onPress={() => handleDelete(file._id, file.fileName)}
              >
                <Trash2 size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        placement="center"
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-4 flex flex-col items-center">
                <Image
                  alt={selectedFileName}
                  className="max-h-[75vh] object-contain rounded-lg"
                  src={selectedImage}
                />
                <p className="text-sm font-medium text-default-500 mt-2">{selectedFileName}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" size="sm" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
