"use client";

import { useEffect, useState, FormEvent } from "react";
import Swal from "sweetalert2";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Plus, Unlock, X, KeyRound, ShieldCheck } from "lucide-react";

import { useGetContent, useUpdateContent } from "@/hooks/useContent";
import RichTextEditor from "@/components/rich-text-editor";
import NoteTabsManager from "@/components/NoteTabsManager";
import {
  isZeroKnowledgeCiphertext,
  decryptZeroKnowledge,
  encryptZeroKnowledge,
  NoteTab,
  parseNotePayload,
  serializeNotePayload,
} from "@/lib/crypto";

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isPending, isLoading } = useGetContent(id as string);

  // Multi-Tab State
  const [tabs, setTabs] = useState<NoteTab[]>([
    { id: "tab-1", title: "Tab 1", content: "" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");

  // Password & Decryption State
  const [passphrase, setPassphrase] = useState<string>("");
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
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
        setIsUnlocked(false);
      } else {
        const parsedTabs = parseNotePayload(data.content);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) setActiveTabId(parsedTabs[0].id);
        setIsUnlocked(true);
      }
    }
  }, [data]);

  // Tab operations
  const handleAddTab = () => {
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

  // Password verification & decryption
  const handleDecryptNote = async () => {
    if (!passphrase.trim()) {
      Swal.fire("Password Required", "Please enter your password to unlock.", "warning");
      return;
    }

    const res = await decryptZeroKnowledge(data.content, passphrase);
    if (res.success) {
      const parsedTabs = parseNotePayload(res.text);
      setTabs(parsedTabs);
      if (parsedTabs.length > 0) setActiveTabId(parsedTabs[0].id);
      setIsUnlocked(true);
      setEnableLock(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Note Decrypted & Verified!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Password Verification Failed", "Incorrect password. The note could not be decrypted.", "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const hasAnyContent = tabs.some((t) => t.content.trim().length > 0);
    if (!hasAnyContent) {
      Swal.fire("Empty Note", "Please write some content before updating.", "info");
      return;
    }

    setIsSubmitting(true);

    try {
      const serialized = serializeNotePayload(tabs);
      const payload =
        enableLock && passphrase
          ? await encryptZeroKnowledge(serialized, passphrase)
          : serialized;

      await updateContent({ id: id as string, content: payload });

      Swal.fire({
        title: "Updated!",
        text: enableLock && passphrase
          ? "Multi-tab note encrypted and saved successfully!"
          : "Note updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard/text");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong while updating the note.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-default-500">
        <p>Loading note...</p>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {isEncryptedOrigin && !isUnlocked ? (
        <div className="flex flex-col items-center justify-center p-8 bg-default-50 rounded-2xl text-center space-y-5 max-w-md mx-auto my-12 border border-warning/40 shadow-sm">
          <div className="p-4 bg-warning/10 text-warning rounded-full">
            <Lock size={36} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">This Note is Encrypted</h3>
            <p className="text-xs text-default-500 max-w-xs mx-auto">
              Enter your password to verify and decrypt the note and its tabs.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <div className="relative flex items-center">
              <input
                type={showPassphrase ? "text" : "password"}
                placeholder="Enter password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDecryptNote()}
                className="w-full px-3.5 py-2.5 pr-10 text-sm border border-default-300 rounded-xl bg-background outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-3 text-default-400 hover:text-foreground"
              >
                {showPassphrase ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              color="primary"
              className="w-full font-semibold"
              onPress={handleDecryptNote}
            >
              Decrypt & Open Note
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
                color={enableLock ? "success" : "default"}
                startContent={enableLock ? <ShieldCheck size={14} /> : <KeyRound size={14} />}
                onPress={() => setEnableLock(!enableLock)}
              >
                {enableLock ? "Password Protected" : "Add Password"}
              </Button>

              {enableLock && (
                <div className="relative flex items-center">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    placeholder="Passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="px-3 py-1.5 pr-8 rounded-lg border border-warning text-xs bg-background outline-none w-48"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-2 text-default-400 hover:text-foreground"
                  >
                    {showPassphrase ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Multi-Tab Note Container */}
          <div className="space-y-2">
            <NoteTabsManager
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
              onAddTab={handleAddTab}
              onDeleteTab={handleDeleteTab}
              onRenameTab={handleRenameTab}
            />

            <RichTextEditor
              key={activeTabId}
              content={currentTab?.content || ""}
              onChange={handleActiveTabContentChange}
            />
          </div>
        </form>
      )}
    </div>
  );
}
