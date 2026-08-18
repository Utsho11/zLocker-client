"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Plus, Search, ShieldCheck, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { useDeleteContent, useGetAllContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/ContentCard";
import { isZeroKnowledgeCiphertext } from "@/lib/crypto";

const extractNoteTitle = (htmlContent: string, index: number): string => {
  if (isZeroKnowledgeCiphertext(htmlContent)) {
    return `Encrypted Note #${index + 1}`;
  }
  const plain = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return `Note #${index + 1}`;
  return plain.length > 28 ? plain.slice(0, 28) + "..." : plain;
};

export default function NotesDashboardPage() {
  const router = useRouter();
  const { data = [], isPending } = useGetAllContent();
  const { mutateAsync: deleteContent } = useDeleteContent();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item: any) => {
      const text = item.content ? item.content.toLowerCase() : "";
      return text.includes(q);
    });
  }, [data, searchQuery]);

  const encryptedCount = useMemo(() => {
    return data.filter((n: any) => isZeroKnowledgeCiphertext(n.content)).length;
  }, [data]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-24 text-default-500">
        <p>Loading your secret notes...</p>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/text/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteContent(id as string);
        Swal.fire({
          title: "Deleted!",
          text: "Your note has been deleted.",
          icon: "success",
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to delete note.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-default-50 p-5 rounded-2xl border border-default-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Zero-Knowledge Notes</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-default-500">
            <span className="flex items-center gap-1">
              <FileText size={14} className="text-primary" /> {data.length} Total Notes
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-success" /> {encryptedCount} Passphrase Protected
            </span>
          </div>
        </div>

        {/* Real-time Search Input */}
        <div className="w-full md:w-72">
          <div className="flex items-center border border-default-300 rounded-xl px-3 py-1.5 bg-background focus-within:border-primary transition-colors">
            <Search size={16} className="text-default-400 mr-2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          isPressable
          className="border-dashed border-2 border-default-300 hover:border-primary transition-all min-h-[140px]"
          onPress={() => handleNavigate("/dashboard/text/create")}
        >
          <CardBody className="flex items-center justify-center text-center p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Add New Note
              </p>
              <p className="text-xs text-default-400">
                Supports optional Zero-Knowledge Passphrase
              </p>
            </div>
          </CardBody>
        </Card>

        {filteredNotes.map((ele: any, i: number) => (
          <ContentCard
            key={ele._id}
            content={ele.content}
            title={extractNoteTitle(ele.content, i)}
            onDelete={() => handleDelete(ele._id)}
            onEdit={() => handleEdit(ele._id)}
          />
        ))}
      </div>

      {filteredNotes.length === 0 && searchQuery && (
        <div className="text-center py-12 text-default-400 text-sm">
          No notes match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </div>
  );
}
