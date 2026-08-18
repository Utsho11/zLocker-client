"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Plus, X, Edit2, Check } from "lucide-react";
import Swal from "sweetalert2";

import { NoteTab } from "@/lib/crypto";

interface NoteTabsManagerProps {
  tabs: NoteTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAddTab: () => void;
  onDeleteTab: (tabId: string) => void;
  onRenameTab: (tabId: string, newTitle: string) => void;
  isEditable?: boolean;
}

export default function NoteTabsManager({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onDeleteTab,
  onRenameTab,
  isEditable = true,
}: NoteTabsManagerProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const handleStartRename = (tab: NoteTab, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    setEditingTabId(tab.id);
    setEditTitle(tab.title);
  };

  const handleSaveRename = (tabId: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRenameTab(tabId, trimmed);
    }
    setEditingTabId(null);
  };

  const handleDelete = (tab: NoteTab, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    if (tabs.length <= 1) {
      Swal.fire({
        title: "Cannot Delete",
        text: "You must have at least one tab in your locker.",
        icon: "info",
      });
      return;
    }

    Swal.fire({
      title: `Delete "${tab.title}"?`,
      text: "All text inside this tab will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Tab",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteTab(tab.id);
      }
    });
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-default-200 select-none scrollbar-thin">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`group relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl cursor-pointer transition-all border-t border-x ${
              isActive
                ? "bg-background border-default-300 text-primary shadow-sm -mb-[1px] border-b-0"
                : "bg-default-100/70 border-transparent text-default-500 hover:bg-default-200/60 hover:text-foreground"
            }`}
          >
            {isEditing ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRename(tab.id);
                    if (e.key === "Escape") setEditingTabId(null);
                  }}
                  className="bg-background border border-primary px-1.5 py-0.5 rounded text-xs outline-none w-24"
                />
                <button
                  type="button"
                  onClick={() => handleSaveRename(tab.id)}
                  className="text-success hover:scale-110"
                >
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => handleStartRename(tab, e)}
                  title="Double click to rename"
                  className="truncate max-w-[120px]"
                >
                  {tab.title || "Untitled Tab"}
                </span>

                {isEditable && isActive && (
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(tab, e)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                    title="Rename tab"
                  >
                    <Edit2 size={11} />
                  </button>
                )}

                {isEditable && tabs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(tab, e)}
                    className="opacity-40 hover:opacity-100 hover:text-danger transition-opacity ml-1"
                    title="Delete tab"
                  >
                    <X size={12} />
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Add Tab Button */}
      {isEditable && (
        <Button
          size="sm"
          variant="light"
          isIconOnly
          title="Add New Tab"
          onPress={onAddTab}
          className="rounded-t-lg text-default-400 hover:text-primary h-8 min-w-8"
        >
          <Plus size={16} />
        </Button>
      )}
    </div>
  );
}
