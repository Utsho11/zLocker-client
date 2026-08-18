"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Copy,
  Download,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Button, ButtonGroup } from "@heroui/button";
import Swal from "sweetalert2";
import clipboardCopy from "clipboard-copy";
import { useEffect, useState } from "react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const [, setUpdateTick] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setUpdateTick((prev) => prev + 1);
    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);
    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const plainText = editor.getText();
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  const handleExportText = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `zlocker-note-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-default-200 p-2 bg-default-50/70 z-10">
      {/* Action Buttons Group */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo / Redo */}
        <ButtonGroup radius="sm" variant="light" size="sm">
          <Button
            isIconOnly
            title="Undo"
            isDisabled={!editor.can().undo()}
            onPress={() => editor.chain().focus().undo().run()}
          >
            <Undo size={15} />
          </Button>
          <Button
            isIconOnly
            title="Redo"
            isDisabled={!editor.can().redo()}
            onPress={() => editor.chain().focus().redo().run()}
          >
            <Redo size={15} />
          </Button>
        </ButtonGroup>

        <div className="h-4 w-[1px] bg-default-300 mx-1 hidden sm:block" />

        {/* Headings */}
        <ButtonGroup radius="sm" variant="light" size="sm">
          <Button
            isIconOnly
            title="Heading 1"
            color={editor.isActive("heading", { level: 1 }) ? "primary" : "default"}
            variant={editor.isActive("heading", { level: 1 }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={15} />
          </Button>
          <Button
            isIconOnly
            title="Heading 2"
            color={editor.isActive("heading", { level: 2 }) ? "primary" : "default"}
            variant={editor.isActive("heading", { level: 2 }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={15} />
          </Button>
          <Button
            isIconOnly
            title="Heading 3"
            color={editor.isActive("heading", { level: 3 }) ? "primary" : "default"}
            variant={editor.isActive("heading", { level: 3 }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={15} />
          </Button>
        </ButtonGroup>

        <div className="h-4 w-[1px] bg-default-300 mx-1 hidden sm:block" />

        {/* Text Styling */}
        <ButtonGroup radius="sm" variant="light" size="sm">
          <Button
            isIconOnly
            title="Bold"
            color={editor.isActive("bold") ? "primary" : "default"}
            variant={editor.isActive("bold") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={15} />
          </Button>
          <Button
            isIconOnly
            title="Italic"
            color={editor.isActive("italic") ? "primary" : "default"}
            variant={editor.isActive("italic") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} />
          </Button>
          <Button
            isIconOnly
            title="Strikethrough"
            color={editor.isActive("strike") ? "primary" : "default"}
            variant={editor.isActive("strike") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={15} />
          </Button>
          <Button
            isIconOnly
            title="Highlight"
            color={editor.isActive("highlight") ? "primary" : "default"}
            variant={editor.isActive("highlight") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={15} />
          </Button>
          <Button
            isIconOnly
            title="Blockquote"
            color={editor.isActive("blockquote") ? "primary" : "default"}
            variant={editor.isActive("blockquote") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={15} />
          </Button>
          <Button
            isIconOnly
            title="Code Block"
            color={editor.isActive("codeBlock") ? "primary" : "default"}
            variant={editor.isActive("codeBlock") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={15} />
          </Button>
        </ButtonGroup>

        <div className="h-4 w-[1px] bg-default-300 mx-1 hidden sm:block" />

        {/* Alignment & Lists */}
        <ButtonGroup radius="sm" variant="light" size="sm">
          <Button
            isIconOnly
            title="Align Left"
            color={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
            variant={editor.isActive({ textAlign: "left" }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={15} />
          </Button>
          <Button
            isIconOnly
            title="Align Center"
            color={editor.isActive({ textAlign: "center" }) ? "primary" : "default"}
            variant={editor.isActive({ textAlign: "center" }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={15} />
          </Button>
          <Button
            isIconOnly
            title="Align Right"
            color={editor.isActive({ textAlign: "right" }) ? "primary" : "default"}
            variant={editor.isActive({ textAlign: "right" }) ? "solid" : "light"}
            onPress={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={15} />
          </Button>
          <Button
            isIconOnly
            title="Bullet List"
            color={editor.isActive("bulletList") ? "primary" : "default"}
            variant={editor.isActive("bulletList") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={15} />
          </Button>
          <Button
            isIconOnly
            title="Numbered List"
            color={editor.isActive("orderedList") ? "primary" : "default"}
            variant={editor.isActive("orderedList") ? "solid" : "light"}
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={15} />
          </Button>
        </ButtonGroup>
      </div>

      {/* Right Tools: Word Count & Export */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-default-400 font-mono hidden md:inline-block select-none">
          {wordCount} words &bull; {charCount} chars
        </span>

        <ButtonGroup radius="sm" variant="light" size="sm">
          <Button
            isIconOnly
            title="Copy Raw Text"
            onPress={async () => {
              await clipboardCopy(plainText);
              Swal.fire({
                toast: true,
                position: "top-end",
                title: "Text copied to clipboard!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }}
          >
            <Copy size={15} />
          </Button>
          <Button
            isIconOnly
            title="Download .txt"
            onPress={handleExportText}
          >
            <Download size={15} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
