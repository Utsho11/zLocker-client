"use client";
import { useState } from "react";

import RichTextEditor from "@/components/rich-text-editor";

const Page = () => {
  const [content, setContent] = useState<string>("");

  return (
    <div className="w-full px-4 sm:px-8">
      <div className="md:min-w-[900px] mx-auto space-y-2">
        <RichTextEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default Page;
