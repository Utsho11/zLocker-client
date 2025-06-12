"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { Pencil, Check, Key } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

import { useAddUsername, useProfile } from "@/hooks/useAuth";

export default function EditPage() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useProfile();
  const { email, name } = user.data?.data || {};
  const [editedName, setEditedName] = useState(name);

  const { mutate: addUsername } = useAddUsername();

  const handleSaveName = async () => {
    setIsEditing(false);
    const username = editedName;

    try {
      await addUsername(username, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Username updated successfully!",
            showConfirmButton: false,
          });
        },
        onError: (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error?.response?.data?.message || "Failed to update username",
          });
        },
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Info</h3>
        {!isEditing ? (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>
        ) : (
          <Button isIconOnly size="sm" variant="light" onPress={handleSaveName}>
            <Check size={16} />
          </Button>
        )}
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <div>
          <h1 className="text-sm text-gray-500">Name</h1>
          {!isEditing ? (
            <p className="text-medium">{name ? name : "Add Your Name"}</p>
          ) : (
            <Input
              className="mt-1"
              placeholder="Enter name"
              size="sm"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          )}
        </div>

        <div>
          <h1 className="text-sm text-gray-500">Email</h1>
          <p className="text-medium">{email}</p>
        </div>

        <div className="w-full">
          <Link href="/dashboard/changePassword">
            <Button
              className="w-full sm:w-auto"
              size="sm"
              startContent={<Key size={16} />}
              variant="flat"
            >
              Change Password
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
