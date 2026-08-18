"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Plus, X, KeyRound } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import RichTextEditor from "@/components/rich-text-editor";
import NoteTabsManager from "@/components/NoteTabsManager";
import { useCreateContent } from "@/hooks/useContent";
import {
  encryptZeroKnowledge,
  NoteTab,
  serializeNotePayload,
} from "@/lib/crypto";

export default function CreateNotePage() {
  const [tabs, setTabs] = useState<NoteTab[]>([
    { id: "tab-1", title: "Tab 1", content: "" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");

  const [passphrase, setPassphrase] = useState<string>("");
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>("");
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [enableLock, setEnableLock] = useState<boolean>(false);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createContent } = useCreateContent();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const hasAnyContent = tabs.some((t) => t.content.trim().length > 0);
    if (!hasAnyContent) {
      Swal.fire("Empty Note", "Please write some content in at least one tab before saving.", "info");
      return;
    }

    if (enableLock && passphrase) {
      if (confirmPassphrase && passphrase !== confirmPassphrase) {
        Swal.fire("Password Mismatch", "Passwords do not match. Please re-type.", "error");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const serialized = serializeNotePayload(tabs);
      const encryptedPayload = enableLock && passphrase
        ? await encryptZeroKnowledge(serialized, passphrase)
        : serialized;

      await createContent(encryptedPayload);

      Swal.fire({
        title: "Success!",
        text: enableLock && passphrase
          ? "Multi-tab note encrypted and saved successfully!"
          : "Note stored successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard");
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

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

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
            <Link href="/dashboard">
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
              startContent={enableLock ? <Lock size={14} /> : <KeyRound size={14} />}
              onPress={() => setEnableLock(!enableLock)}
            >
              {enableLock ? "Password Protection Active" : "Lock with Password"}
            </Button>

            {enableLock && (
              <div className="relative flex items-center">
                <input
                  type={showPassphrase ? "text" : "password"}
                  placeholder="Set Password"
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
    </div>
  );
}
