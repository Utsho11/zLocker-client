"use client";
import { Card, CardBody } from "@heroui/card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="px-4 sm:px-8 h-screen">
      <div className="">
        <Card
          isHoverable
          isPressable
          className="w-full max-w-sm h-40 border-dashed border-2 border-gray-300 dark:border-gray-600"
          onPress={() => handleNavigate("/dashboard/text/create")}
        >
          <CardBody className="flex items-center justify-center text-center">
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
      </div>
    </div>
  );
};

export default Page;
