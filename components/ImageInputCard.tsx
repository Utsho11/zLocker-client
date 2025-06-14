"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Spinner,
} from "@nextui-org/react";
import { ImagePlus, Upload } from "lucide-react";
import Swal from "sweetalert2";

import { useStoreImage } from "@/hooks/useImageContent";

export default function ImageFileInputCardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending } = useStoreImage();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      await uploadImage(formData);
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Your image has been uploaded successfully.",
      });
      closeModal();
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was a problem uploading the image.",
      });
    }
  };

  return (
    <>
      <Card
        fullWidth
        isPressable
        className="p-4 w-[300px] border border-dashed border-default-300 hover:border-primary transition-all"
        onPress={openModal}
      >
        <CardBody className="flex h-60 items-center justify-center text-default-500">
          <div className="flex flex-col items-center">
            <ImagePlus className="w-8 h-8 mb-2" />
            <p className="text-sm">Click to upload image</p>
          </div>
        </CardBody>
      </Card>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onClose={closeModal}
      >
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalBody>
            <input
              accept="image/*"
              className="border p-2 rounded w-full"
              type="file"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <Image
                  alt="Preview"
                  className="max-h-60 object-contain"
                  src={previewUrl}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!file || isPending}
              startContent={isPending ? <Spinner size="sm" /> : <Upload />}
              onPress={handleSubmit}
            >
              {isPending ? "Uploading..." : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
