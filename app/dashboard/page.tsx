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
        {/* Zero-Knowledge Notes Card */}
        <Card
          isPressable
          className="hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 border border-default-200"
          onPress={() => handleNavigate("/dashboard/text")}
        >
          <CardHeader className="flex items-center gap-3 pb-2">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Zero-Knowledge Notes</h3>
              <p className="text-xs text-default-400">Client-Side Encrypted (ProtectedText Style)</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600 text-sm leading-relaxed">
              Create and manage private rich-text notes encrypted directly in your browser.
              Protected with AES-GCM encryption so only you can unlock your notes.
            </p>
          </CardBody>
        </Card>

        {/* Multi-File Cloud Locker Card */}
        <Card
          isPressable
          className="hover:shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] transition-all duration-300 border border-default-200"
          onPress={() => handleNavigate("/dashboard/image")}
        >
          <CardHeader className="flex items-center gap-3 pb-2">
            <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
              <ImageIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cloud File Locker</h3>
              <p className="text-xs text-default-400">Images, PDFs, PPTX, Docs, ZIPs</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600 text-sm leading-relaxed">
              Store, view, and organize all your files in your dedicated Cloudinary locker.
              Supports image lightboxes, document downloads, and instant link sharing.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
