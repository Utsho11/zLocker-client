"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import { Card, CardBody } from "@heroui/card";
import { useEffect, useRef } from "react";

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
  const isInternalChange = useRef(false);

  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-6 my-2",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "my-1 leading-relaxed",
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
    content: content || "",
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[350px] sm:min-h-[450px] p-4 outline-none prose dark:prose-invert max-w-none text-foreground font-sans text-sm sm:text-base"
          : "min-h-[350px] sm:min-h-[450px] p-4 text-default-700 prose dark:prose-invert max-w-none text-sm sm:text-base",
      },
    },
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      if (onChange) {
        onChange(editor.getHTML());
      }
      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    },
    immediatelyRender: false,
  });

  // Only update editor if external change occurs (e.g. data loaded from backend or decrypted)
  useEffect(() => {
    if (!editor) return;

    if (!isInternalChange.current && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <Card className="w-full border border-default-200">
        <CardBody className="h-64 flex items-center justify-center text-default-400">
          Loading editor...
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-default-200 shadow-sm overflow-hidden">
      {isEditable && <MenuBar editor={editor} />}
      <CardBody className="p-0 overflow-y-auto">
        <EditorContent editor={editor} />
      </CardBody>
    </Card>
  );
}
