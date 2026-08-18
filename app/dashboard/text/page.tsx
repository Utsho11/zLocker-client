"use client";

import { Card, CardBody } from "@heroui/card";
import { Lock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { useDeleteContent, useGetAllContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/ContentCard";

const Page = () => {
  const router = useRouter();
  const { data = [], isPending } = useGetAllContent();
  const { mutateAsync: deleteContent } = useDeleteContent();

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-20 text-default-500">
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold">Zero-Knowledge Notes</h2>
          <p className="text-sm text-default-500">
            ProtectedText-style client-side encryption ({data.length} notes)
          </p>
        </div>
      </div>

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

        {data.map((ele: any, i: number) => (
          <ContentCard
            key={ele._id}
            content={ele.content}
            title={`Note ${i + 1}`}
            onDelete={() => handleDelete(ele._id)}
            onEdit={() => handleEdit(ele._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
