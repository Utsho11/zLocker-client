import { Spinner } from "@nextui-org/react";
import { Lock } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background z-50">
      <Lock className="animate-bounce text-primary" size={48} />
      <p className="text-xl font-bold">ZLocker is Loading...</p>
      <Spinner color="primary" size="lg" />
    </div>
  );
}
