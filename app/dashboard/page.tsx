"use client";
import { FileText, ImageIcon } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useAuthUser } from "@/lib/useAuthUser";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuthUser();
  const router = useRouter();

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <p>Please sign in to view profile.</p>;

  const handleNavigate = (path: string) => {
    // console.log(`Navigating to ${path}`);

    router.push(path);
  };

  return (
    <div className="w-full px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-center py-6">
        Welcome back, {user && user.firstName}!
      </h1>

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
