"use client";

import { Card, CardBody, Spinner } from "@nextui-org/react"; // Make sure this matches your UI lib
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useDeleteContent, useGetAllContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/ContentCard";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const { data = [], isPending } = useGetAllContent();
  const { mutate: deleteContent } = useDeleteContent();

  if (isPending) {
    return (
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label="Loading..."
      />
    );
  }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/text/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        deleteContent(id as string);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        isHoverable
        isPressable
        className="w-full max-w-full sm:max-w-xl md:max-w-2xl border-dashed border-2 border-gray-300 dark:border-gray-600"
        onPress={() => handleNavigate("/dashboard/text/create")}
      >
        <CardBody className="flex items-center justify-center text-center h-[25vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Note
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
  );
};

export default Page;
