"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Spinner } from "@nextui-org/react";
import { Download, Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { useDeleteImage, useGetAllImage } from "@/hooks/useImageContent";
import ImageInputCard from "@/components/ImageInputCard";

const Page = () => {
  const { data, isLoading } = useGetAllImage();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This image will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteImage(id);
        Swal.fire("Deleted!", "Your image has been deleted.", "success");
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.message || "Failed to delete image.",
          "error",
        );
      }
    }
  };

  const handleDownload = async (url: string, name: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");

    link.href = window.URL.createObjectURL(blob);
    link.download = name || "image.jpg";
    link.click();
  };

  const handleView = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  if (isLoading) return <Spinner label="Loading images..." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      <ImageInputCard />
      {data?.map((image: { _id: string; link: string }) => (
        <Card
          key={image._id}
          isPressable
          radius="lg"
          shadow="md"
          onPress={() => handleView(image.link)}
        >
          <CardBody className="overflow-hidden p-0">
            <Image
              alt="Uploaded image"
              className="object-cover h-60"
              radius="none"
              src={image.link}
              width={300}
            />
          </CardBody>
          <CardFooter className="flex justify-between gap-3">
            <Button
              isIconOnly
              title="View"
              variant="light"
              onPress={() => handleView(image.link)}
            >
              <Eye size={20} />
            </Button>
            <Button
              isIconOnly
              title="Download"
              variant="light"
              onPress={() =>
                handleDownload(image.link, `image-${image._id}.jpg`)
              }
            >
              <Download size={20} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              isLoading={isDeleting}
              title="Delete"
              variant="light"
              onPress={() => handleDelete(image._id)}
            >
              <Trash2 size={20} />
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Modal
        isOpen={isOpen}
        placement="center"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Image
                  alt="Uploaded image"
                  className="object-cover"
                  radius="none"
                  src={selectedImage}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" size="sm" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
