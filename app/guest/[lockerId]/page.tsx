"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  FileUp,
  Lock,
  Presentation,
  Save,
  Share2,
  Trash2,
  Unlock,
  Upload,
  Archive,
  FileSpreadsheet,
  File as FileIcon,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Swal from "sweetalert2";
import clipboardCopy from "clipboard-copy";

import RichTextEditor from "@/components/rich-text-editor";
import {
  useDeleteGuestFile,
  useDeleteGuestLocker,
  useGetGuestLocker,
  useSaveGuestText,
  useUploadGuestFile,
  GuestFileItem,
} from "@/hooks/useGuestLocker";
import {
  decryptZeroKnowledge,
  encryptZeroKnowledge,
  isZeroKnowledgeCiphertext,
} from "@/lib/crypto";

export default function GuestLockerPage() {
  const { lockerId } = useParams<{ lockerId: string }>();
  const router = useRouter();

  const cleanLockerId = (lockerId || "").toLowerCase();

  const { data, isLoading, refetch } = useGetGuestLocker(cleanLockerId);
  const { mutateAsync: saveText, isPending: isSavingText } = useSaveGuestText();
  const { mutateAsync: uploadFile, isPending: isUploadingFile } =
    useUploadGuestFile();
  const { mutateAsync: deleteFile, isPending: isDeletingFile } =
    useDeleteGuestFile();
  const { mutateAsync: deleteLocker, isPending: isDeletingLocker } =
    useDeleteGuestLocker();

  // State for note editor
  const [content, setContent] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [enableLock, setEnableLock] = useState<boolean>(false);
  const [isEncryptedOrigin, setIsEncryptedOrigin] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // State for file upload modal
  const {
    isOpen: isUploadOpen,
    onOpen: onOpenUpload,
    onClose: onCloseUpload,
  } = useDisclosure();
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null
  );
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

  // State for image lightbox
  const {
    isOpen: isLightboxOpen,
    onOpen: onOpenLightbox,
    onOpenChange: onOpenChangeLightbox,
  } = useDisclosure();
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    name: string;
  }>({ url: "", name: "" });

  // Time remaining countdown state
  const [timeLeft, setTimeLeft] = useState<string>("24h 00m 00s");

  // Synchronize initial text content from server
  useEffect(() => {
    if (data?.texts && data.texts.length > 0) {
      const serverContent = data.texts[0].content;
      if (isZeroKnowledgeCiphertext(serverContent)) {
        setIsEncryptedOrigin(true);
        setEnableLock(true);
      } else {
        setContent(serverContent);
        setIsUnlocked(true);
      }
    } else {
      setIsUnlocked(true);
    }
  }, [data]);

  // Live countdown timer for 24-hour expiration
  useEffect(() => {
    if (!data?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(data.expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft("Expired (Self-Destructed)");
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.expiresAt]);

  // Decrypt Note Handler
  const handleDecrypt = async () => {
    if (!passphrase) {
      Swal.fire("Passphrase Required", "Enter your passphrase to unlock.", "warning");
      return;
    }

    if (data?.texts && data.texts.length > 0) {
      const res = await decryptZeroKnowledge(data.texts[0].content, passphrase);
      if (res.success) {
        setContent(res.text);
        setIsUnlocked(true);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Note Unlocked!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Decryption Failed", res.error || "Incorrect passphrase.", "error");
      }
    }
  };

  // Save Note Handler
  const handleSaveText = async () => {
    try {
      const payload =
        enableLock && passphrase
          ? await encryptZeroKnowledge(content, passphrase)
          : content;

      await saveText({ lockerId: cleanLockerId, content: payload });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: enableLock && passphrase ? "Encrypted & Saved!" : "Note Saved!",
        text: "24-hour timer refreshed.",
        timer: 2000,
        showConfirmButton: false,
      });
      refetch();
    } catch (err: any) {
      Swal.fire("Save Error", err?.message || "Failed to save note.", "error");
    }
  };

  // Upload File Handler
  const handleUploadSubmit = async () => {
    if (!selectedUploadFile) return;

    const formData = new FormData();
    formData.append("file", selectedUploadFile);

    try {
      await uploadFile({ lockerId: cleanLockerId, formData });
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: `"${selectedUploadFile.name}" stored in guest locker.`,
      });
      onCloseUpload();
      setSelectedUploadFile(null);
      setUploadPreviewUrl(null);
      refetch();
    } catch (err: any) {
      Swal.fire("Upload Failed", err?.response?.data?.message || "Error uploading file.", "error");
    }
  };

  // Delete specific File Handler
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    const confirm = await Swal.fire({
      title: "Delete File?",
      text: `"${fileName}" will be deleted from Cloudinary immediately.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteFile({ lockerId: cleanLockerId, fileId });
        Swal.fire("Deleted", "File destroyed successfully.", "success");
        refetch();
      } catch (err: any) {
        Swal.fire("Error", "Failed to delete file.", "error");
      }
    }
  };

  // Self-Destruct Entire Locker
  const handleSelfDestruct = async () => {
    const confirm = await Swal.fire({
      title: "Self-Destruct Locker?",
      text: "This will permanently destroy all notes and delete all Cloudinary files immediately.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Self-Destruct Now",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteLocker(cleanLockerId);
        Swal.fire("Destruction Complete", "All data and Cloudinary files were destroyed.", "success");
        router.push("/");
      } catch (err) {
        Swal.fire("Error", "Failed to delete locker.", "error");
      }
    }
  };

  // Copy Locker URL
  const handleShareLocker = async () => {
    if (typeof window !== "undefined") {
      await clipboardCopy(window.location.href);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Guest Locker URL copied!",
        text: "Valid on any browser for 24 hours.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Helper for file type icons & previews
  const getFileCategoryIcon = (file: GuestFileItem) => {
    const type = file.fileType || "file";
    if (type === "image") {
      return (
        <Image
          alt={file.fileName}
          className="object-cover h-40 w-full rounded-lg hover:scale-105 transition-transform"
          src={file.link}
        />
      );
    }
    if (type === "pdf") {
      return (
        <div className="h-40 w-full flex flex-col items-center justify-center bg-red-500/10 text-red-500 rounded-lg gap-2">
          <FileText size={44} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/20">
            PDF Document
          </span>
        </div>
      );
    }
    if (type === "pptx") {
      return (
        <div className="h-40 w-full flex flex-col items-center justify-center bg-orange-500/10 text-orange-500 rounded-lg gap-2">
          <Presentation size={44} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20">
            PowerPoint
          </span>
        </div>
      );
    }
    if (type === "docx") {
      return (
        <div className="h-40 w-full flex flex-col items-center justify-center bg-blue-500/10 text-blue-500 rounded-lg gap-2">
          <FileText size={44} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20">
            Word Document
          </span>
        </div>
      );
    }
    if (type === "xlsx") {
      return (
        <div className="h-40 w-full flex flex-col items-center justify-center bg-green-500/10 text-green-500 rounded-lg gap-2">
          <FileSpreadsheet size={44} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-500/20">
            Excel Sheet
          </span>
        </div>
      );
    }
    if (type === "zip") {
      return (
        <div className="h-40 w-full flex flex-col items-center justify-center bg-yellow-500/10 text-yellow-500 rounded-lg gap-2">
          <Archive size={44} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-500/20">
            ZIP Archive
          </span>
        </div>
      );
    }
    return (
      <div className="h-40 w-full flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg gap-2">
        <FileIcon size={44} />
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20">
          Document File
        </span>
      </div>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <Lock className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-lg font-medium">Opening Guest Locker /{cleanLockerId}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-6">
      {/* Top Banner with Countdown and Locker Controls */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-primary/20 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-primary/20 text-primary border border-primary/30">
              Guest Mode
            </span>
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              zLocker /{cleanLockerId}
            </h1>
          </div>
          <p className="text-xs text-default-500">
            Zero-Knowledge Encrypted &bull; 100% Client-Side &bull; No Login Required
          </p>
        </div>

        {/* 24-Hour Countdown and Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs font-semibold">
            <Clock size={16} className="animate-spin" />
            <span>Expires in: {timeLeft}</span>
          </div>

          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Share2 size={15} />}
            onPress={handleShareLocker}
          >
            Share Link
          </Button>

          <Button
            size="sm"
            variant="light"
            color="danger"
            isLoading={isDeletingLocker}
            startContent={<Trash2 size={15} />}
            onPress={handleSelfDestruct}
          >
            Self-Destruct
          </Button>
        </div>
      </div>

      {/* Auto-Deletion Notice */}
      <div className="flex items-center gap-2 p-3 bg-default-100/80 rounded-xl border border-default-200 text-xs text-default-600">
        <ShieldAlert size={16} className="text-primary flex-shrink-0" />
        <span>
          <strong>24-Hour Privacy Guarantee:</strong> All notes and Cloudinary files uploaded in this guest locker are strictly valid for 24 hours. After expiration, files are automatically destroyed from Cloudinary and the database.
        </span>
      </div>

      {/* SECTION 1: Zero-Knowledge Secret Note */}
      <Card className="border border-default-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-default-100 p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Secret Note</h2>
              <p className="text-xs text-default-400">
                ProtectedText client-side encrypted note
              </p>
            </div>
          </div>

          {/* Encryption / Passphrase Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant={enableLock ? "flat" : "light"}
              color={enableLock ? "warning" : "default"}
              startContent={enableLock ? <Lock size={14} /> : <Unlock size={14} />}
              onPress={() => setEnableLock(!enableLock)}
            >
              {enableLock ? "Passphrase Enabled" : "Add Passphrase"}
            </Button>

            {enableLock && (
              <input
                type="password"
                placeholder="Set Passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="px-3 py-1 text-xs rounded-lg border border-warning bg-background outline-none w-40"
              />
            )}

            {isUnlocked && (
              <Button
                color="primary"
                size="sm"
                isLoading={isSavingText}
                startContent={!isSavingText && <Save size={15} />}
                onPress={handleSaveText}
              >
                Save Note
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="p-4">
          {isEncryptedOrigin && !isUnlocked ? (
            <div className="flex flex-col items-center justify-center p-8 bg-default-50 rounded-xl text-center space-y-4 max-w-sm mx-auto my-6 border border-warning/30">
              <div className="p-3 bg-warning/10 text-warning rounded-full">
                <Lock size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold">This Note is Encrypted</h3>
                <p className="text-xs text-default-500 mt-1">
                  Enter the locker passphrase to decrypt and view the note.
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <input
                  type="password"
                  placeholder="Enter Passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDecrypt()}
                  className="w-full px-3 py-2 text-xs border border-default-300 rounded-lg bg-background outline-none focus:border-primary"
                />
                <Button color="primary" size="sm" onPress={handleDecrypt}>
                  Unlock
                </Button>
              </div>
            </div>
          ) : (
            <RichTextEditor content={content} onChange={setContent} />
          )}
        </CardBody>
      </Card>

      {/* SECTION 2: Multi-Format Cloud File Locker */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Cloud File Locker</h2>
            <p className="text-xs text-default-500">
              Upload Images, PDFs, PPTX, Word, Excel & ZIPs ({data?.files?.length || 0} files)
            </p>
          </div>
          <Button
            color="primary"
            size="sm"
            startContent={<FileUp size={16} />}
            onPress={onOpenUpload}
          >
            Upload File
          </Button>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Upload Button Card */}
          <Card
            isPressable
            className="border-dashed border-2 border-default-300 hover:border-primary transition-all h-60 flex items-center justify-center p-4 text-center"
            onPress={onOpenUpload}
          >
            <div className="flex flex-col items-center gap-2 text-default-500">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FileUp size={24} />
              </div>
              <p className="text-sm font-semibold text-foreground">Upload to Guest Locker</p>
              <p className="text-xs text-default-400">
                PDF, PPTX, Images, Docs, ZIPs
              </p>
            </div>
          </Card>

          {/* Rendered Uploaded Files */}
          {data?.files?.map((file) => (
            <Card
              key={file._id}
              className="border border-default-200 hover:border-primary/50 transition-all shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <CardHeader className="p-3 pb-0 flex flex-col items-start gap-0.5">
                <p className="text-sm font-semibold truncate w-full" title={file.fileName}>
                  {file.fileName}
                </p>
                <p className="text-xs text-default-400">
                  {formatFileSize(file.fileSize)}
                </p>
              </CardHeader>

              <CardBody
                className="p-3 cursor-pointer"
                onClick={() => {
                  if (file.fileType === "image") {
                    setLightboxImage({ url: file.link, name: file.fileName });
                    onOpenLightbox();
                  } else {
                    window.open(file.link, "_blank");
                  }
                }}
              >
                {getFileCategoryIcon(file)}
              </CardBody>

              <CardFooter className="flex justify-between items-center p-2 pt-0 border-t border-default-100">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  title={file.fileType === "image" ? "Preview" : "Open in tab"}
                  onPress={() => {
                    if (file.fileType === "image") {
                      setLightboxImage({ url: file.link, name: file.fileName });
                      onOpenLightbox();
                    } else {
                      window.open(file.link, "_blank");
                    }
                  }}
                >
                  {file.fileType === "image" ? <Eye size={16} /> : <ExternalLink size={16} />}
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  title="Copy Direct Link"
                  onPress={async () => {
                    await clipboardCopy(file.link);
                    Swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "success",
                      title: "File link copied!",
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  }}
                >
                  <Copy size={16} />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  title="Download File"
                  onPress={() => {
                    const link = document.createElement("a");
                    link.href = file.link;
                    link.download = file.fileName || "file";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={16} />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  title="Delete File"
                  isLoading={isDeletingFile}
                  onPress={() => handleDeleteFile(file._id, file.fileName)}
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal: Upload File */}
      <Modal
        backdrop="blur"
        isOpen={isUploadOpen}
        placement="center"
        onClose={onCloseUpload}
      >
        <ModalContent>
          <ModalHeader>Upload to Guest Locker</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                accept="image/*,application/pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.zip,.rar,.7z,.txt,.csv"
                className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer border border-default-200 rounded-lg p-2"
                type="file"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) {
                    setSelectedUploadFile(selected);
                    if (selected.type.startsWith("image/")) {
                      setUploadPreviewUrl(URL.createObjectURL(selected));
                    } else {
                      setUploadPreviewUrl(null);
                    }
                  }
                }}
              />

              {selectedUploadFile && (
                <div className="p-4 bg-default-100 rounded-xl flex items-center gap-4">
                  {uploadPreviewUrl ? (
                    <Image
                      alt="Preview"
                      className="max-h-20 object-contain rounded"
                      src={uploadPreviewUrl}
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-primary" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {selectedUploadFile.name}
                    </p>
                    <p className="text-xs text-default-500">
                      {formatFileSize(selectedUploadFile.size)} &bull; 24h Expiration
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseUpload}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!selectedUploadFile || isUploadingFile}
              isLoading={isUploadingFile}
              startContent={!isUploadingFile && <Upload size={16} />}
              onPress={handleUploadSubmit}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal: Image Lightbox */}
      <Modal
        isOpen={isLightboxOpen}
        placement="center"
        size="4xl"
        onOpenChange={onOpenChangeLightbox}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-4 flex flex-col items-center">
                <Image
                  alt={lightboxImage.name}
                  className="max-h-[75vh] object-contain rounded-lg"
                  src={lightboxImage.url}
                />
                <p className="text-sm font-medium text-default-500 mt-2">
                  {lightboxImage.name}
                </p>
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
}
