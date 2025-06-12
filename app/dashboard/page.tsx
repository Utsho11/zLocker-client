"use client";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { EditIcon, FileText, ImageIcon } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { useProfile } from "@/hooks/useAuth";
import { Spinner } from "@nextui-org/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isFetching } = useProfile();

  const { email, name } = user?.data || {};

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full px-4 sm:px-8">
      {/* Profile Header */}

      {isFetching ? (
        <>
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            label="Loading..."
          />
        </>
      ) : (
        <div className="md:grid md:grid-cols-4 gap-4 text-center space-y-3 border-b-1 border-b-white">
          <div className="col-span-1 flex justify-center md:justify-start">
            <Avatar isBordered radius="sm" size="lg" src="/user.png" />
          </div>
          <div className="col-span-2 justify-center">
            <h1 className="text-xl sm:text-3xl font-semibold">
              Welcome, {name || email}
            </h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <div className="col-span-1 flex justify-center md:justify-end">
            <Button
              className="w-full sm:w-auto"
              size="sm"
              startContent={<EditIcon size={16} />}
              variant="flat"
              onPress={() => handleNavigate("/dashboard/editProfile")}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      )}

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-10 max-w-6xl mx-auto">
        {/* Text Card */}
        <Card
          isPressable
          className="hover:shadow-lg hover:shadow-gradientStart hover:scale-[1.02] transition-all duration-300"
          onPress={() => handleNavigate("/dashboard/text")}
        >
          <CardHeader className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">Text-Based Content</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 text-sm">
              Securely store and organize your plain text content for easy
              access anytime. Ideal for saving notes, snippets, and important
              written information.
            </p>
          </CardBody>
        </Card>

        {/* Image Card */}
        <Card
          isPressable
          className="hover:shadow-green-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          onPress={() => handleNavigate("/dashboard/image")}
        >
          <CardHeader className="flex items-center gap-3">
            <ImageIcon className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold">Image Gallery</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 text-sm">
              Upload and store beautiful images in your personalized gallery.
              Perfect for portfolios and collections.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
