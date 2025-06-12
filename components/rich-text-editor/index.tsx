"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Card, CardBody } from "@heroui/card";
import Heading from "@tiptap/extension-heading";
import { useEffect } from "react";

import MenuBar from "./menu-bar";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  editable,
}: RichTextEditorProps) {
  const isEditable = editable ?? true;

  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[calc(100vh-60px)] p-3 outline-none"
          : "min-h-[calc(100vh-60px)] p-3 text-gray-700",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false prevents triggering onUpdate
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Card className="w-full">
      {isEditable && <MenuBar editor={editor} />}
      <CardBody className="space-y-2 w-full mx-auto">
        <EditorContent editor={editor} />
      </CardBody>
    </Card>
  );
}
