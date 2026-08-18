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
  EyeOff,
  FileText,
  FileUp,
  KeyRound,
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
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import clipboardCopy from "clipboard-copy";

import RichTextEditor from "@/components/rich-text-editor";
import NoteTabsManager from "@/components/NoteTabsManager";
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
  NoteTab,
  parseNotePayload,
  serializeNotePayload,
} from "@/lib/crypto";
import { compressImage } from "@/lib/imageCompressor";

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

  // Multi-Tab State
  const [tabs, setTabs] = useState<NoteTab[]>([
    { id: "tab-1", title: "Tab 1", content: "" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");

  // Password & Encryption State
  const [passphrase, setPassphrase] = useState<string>("");
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>("");
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [enableLock, setEnableLock] = useState<boolean>(false);
  const [isEncryptedOrigin, setIsEncryptedOrigin] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Password Setup / Change Modal
  const {
    isOpen: isPasswordModalOpen,
    onOpen: onOpenPasswordModal,
    onClose: onClosePasswordModal,
  } = useDisclosure();

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
        setIsUnlocked(false);
      } else {
        const parsedTabs = parseNotePayload(serverContent);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) setActiveTabId(parsedTabs[0].id);
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

  // Tab operations
  const handleAddTab = () => {
    if (tabs.length >= 3) {
      Swal.fire({
        title: "Guest Limit Reached (3 Tabs Max)",
        text: "Guest lockers support up to 3 tabs. Create a free member vault to unlock 5 tabs, or upgrade to Pro for unlimited tabs!",
        icon: "info",
        confirmButtonText: "Got it",
      });
      return;
    }
    const newId = "tab-" + Date.now();
    const newTabTitle = `Tab ${tabs.length + 1}`;
    const newTabs = [...tabs, { id: newId, title: newTabTitle, content: "" }];
    setTabs(newTabs);
    setActiveTabId(newId);
  };

  const handleDeleteTab = (tabId: string) => {
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleRenameTab = (tabId: string, newTitle: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, title: newTitle } : t))
    );
  };

  const handleActiveTabContentChange = (newContent: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, content: newContent } : t))
    );
  };

  // Decrypt Note with Password Verification
  const handleDecrypt = async () => {
    if (!passphrase.trim()) {
      Swal.fire("Password Required", "Enter your locker password to decrypt.", "warning");
      return;
    }

    if (data?.texts && data.texts.length > 0) {
      const res = await decryptZeroKnowledge(data.texts[0].content, passphrase);
      if (res.success) {
        const parsedTabs = parseNotePayload(res.text);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) setActiveTabId(parsedTabs[0].id);
        setIsUnlocked(true);
        setEnableLock(true);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Locker Decrypted & Verified!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Password Verification Failed", "Incorrect password. The data could not be decrypted.", "error");
      }
    }
  };

  // Apply new / changed password
  const handleApplyPassword = () => {
    if (!passphrase.trim()) {
      Swal.fire("Password Required", "Password cannot be empty.", "warning");
      return;
    }
    if (passphrase !== confirmPassphrase) {
      Swal.fire("Mismatch", "Passwords do not match. Please re-type carefully.", "error");
      return;
    }

    setEnableLock(true);
    onClosePasswordModal();
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Password Set Successfully!",
      text: "Remember to save your locker to apply encryption.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Save Note Handler
  const handleSaveText = async () => {
    try {
      const serialized = serializeNotePayload(tabs);
      const payload =
        enableLock && passphrase
          ? await encryptZeroKnowledge(serialized, passphrase)
          : serialized;

      await saveText({ lockerId: cleanLockerId, content: payload });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: enableLock && passphrase ? "Encrypted & Saved!" : "Locker Saved!",
        text: "24-hour timer refreshed.",
        timer: 2000,
        showConfirmButton: false,
      });
      refetch();
    } catch (err: any) {
      Swal.fire("Save Error", err?.message || "Failed to save note.", "error");
    }
  };

  // Upload File Handler (Compressed and max 3 files)
  const handleUploadSubmit = async () => {
    if (!selectedUploadFile) return;

    if ((data?.files?.length || 0) >= 3) {
      Swal.fire({
        title: "Guest Storage Limit (3 Files Max)",
        text: "Guest lockers support up to 3 files/images. Delete existing files or create an account for 5 files!",
        icon: "info",
        confirmButtonText: "Got it",
      });
      return;
    }

    try {
      // Auto-compress image before upload to optimize cloud storage
      const fileToUpload = await compressImage(selectedUploadFile);

      const formData = new FormData();
      formData.append("file", fileToUpload);

      await uploadFile({ lockerId: cleanLockerId, formData });
      Swal.fire({
        icon: "success",
        title: "Uploaded & Optimized!",
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
      text: "This will permanently destroy all notes, tabs, and Cloudinary files immediately.",
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

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

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
            ProtectedText Architecture &bull; Multi-Tab Notes &bull; 24h Auto-Purge
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
          <strong>24-Hour Privacy Guarantee:</strong> All tabs and files in this guest locker are valid for 24 hours. After expiration, they are automatically purged from the database and Cloudinary storage.
        </span>
      </div>

      {/* SECTION 1: Multi-Tab Zero-Knowledge Secret Note */}
      <Card className="border border-default-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-default-100 p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Encrypted Multi-Tab Notes</h2>
              <p className="text-xs text-default-400">
                {tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"} in Locker
              </p>
            </div>
          </div>

          {/* Password Management & Save Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isUnlocked && (
              <>
                <Button
                  size="sm"
                  variant={enableLock ? "flat" : "light"}
                  color={enableLock ? "success" : "default"}
                  startContent={enableLock ? <ShieldCheck size={14} /> : <KeyRound size={14} />}
                  onPress={() => {
                    setConfirmPassphrase(passphrase);
                    onOpenPasswordModal();
                  }}
                >
                  {enableLock ? "Password Active (Change)" : "Set Password"}
                </Button>

                <Button
                  color="primary"
                  size="sm"
                  isLoading={isSavingText}
                  startContent={!isSavingText && <Save size={15} />}
                  onPress={handleSaveText}
                >
                  Save All Tabs
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardBody className="p-4 space-y-4">
          {/* PASSWORD VERIFICATION SCREEN */}
          {isEncryptedOrigin && !isUnlocked ? (
            <div className="flex flex-col items-center justify-center p-8 bg-default-50 rounded-2xl text-center space-y-5 max-w-md mx-auto my-6 border border-warning/40 shadow-sm">
              <div className="p-4 bg-warning/10 text-warning rounded-full">
                <Lock size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">This Locker is Protected</h3>
                <p className="text-xs text-default-500 max-w-xs mx-auto">
                  Enter the locker password to verify and decrypt all notes and tabs.
                </p>
              </div>

              <div className="space-y-3 w-full">
                <div className="relative flex items-center">
                  <input
                    type={showPasswordInput ? "text" : "password"}
                    placeholder="Enter Locker Password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDecrypt()}
                    className="w-full px-3.5 py-2.5 pr-10 text-sm border border-default-300 rounded-xl bg-background outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInput(!showPasswordInput)}
                    className="absolute right-3 text-default-400 hover:text-foreground"
                  >
                    {showPasswordInput ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <Button
                  color="primary"
                  className="w-full font-semibold"
                  onPress={handleDecrypt}
                >
                  Decrypt & Open Locker
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Note Tabs Manager Bar */}
              <NoteTabsManager
                tabs={tabs}
                activeTabId={activeTabId}
                onSelectTab={setActiveTabId}
                onAddTab={handleAddTab}
                onDeleteTab={handleDeleteTab}
                onRenameTab={handleRenameTab}
              />

              {/* Active Tab Editor */}
              <RichTextEditor
                key={activeTabId}
                content={currentTab?.content || ""}
                onChange={handleActiveTabContentChange}
              />
            </>
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

      {/* Modal: Set / Change Password with Verification */}
      <Modal
        backdrop="blur"
        isOpen={isPasswordModalOpen}
        placement="center"
        onClose={onClosePasswordModal}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <KeyRound size={20} className="text-primary" />
            <span>Set Locker Password</span>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <p className="text-xs text-default-500">
              Your password will encrypt all tabs with 256-bit AES-GCM. We never store your password on our servers.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-default-600 block mb-1">
                  New Password:
                </label>
                <input
                  type="password"
                  placeholder="Enter secret password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-default-300 rounded-lg bg-background outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-default-600 block mb-1">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password for verification"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-default-300 rounded-lg bg-background outline-none focus:border-primary"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClosePasswordModal}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleApplyPassword}>
              Apply Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
