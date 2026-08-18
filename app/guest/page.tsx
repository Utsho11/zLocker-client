"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ArrowRight, Clock, Dices, Lock, Shield, Sparkles, KeyRound, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function GuestIndexPage() {
  const [customSlug, setCustomSlug] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleOpenLocker = (slugToUse?: string) => {
    const target = (slugToUse || customSlug).trim().toLowerCase();
    if (!target) {
      Swal.fire({
        title: "Locker Name Required",
        text: "Please choose a locker name or click 'Random Locker'.",
        icon: "warning",
      });
      return;
    }

    const sanitized = target.replace(/[^a-z0-9_-]/g, "-");
    
    // If user provided a password on this entry screen, pass it via sessionStorage so it pre-fills/auto-unlocks
    if (guestPassword) {
      sessionStorage.setItem(`zlocker_pass_${sanitized}`, guestPassword);
    }

    router.push(`/guest/${sanitized}`);
  };

  const handleCreateRandom = () => {
    const randomSlug =
      "vault-" + Math.random().toString(36).substring(2, 8);
    handleOpenLocker(randomSlug);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 text-center">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
          <Sparkles size={14} />
          <span>ProtectedText Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Instant Guest Locker
        </h1>
        <p className="text-default-500 text-sm sm:text-base max-w-lg mx-auto">
          Create or open a temporary, password-protected zero-knowledge locker for notes and files. No sign-up required.
        </p>
      </div>

      {/* Main Locker Input Card */}
      <Card className="border border-default-200 shadow-md p-6">
        <CardBody className="space-y-5">
          <div className="space-y-2 text-left">
            <label htmlFor="locker-slug-input" className="text-xs font-semibold text-default-600 block">
              1. Choose your Locker URL / Name:
            </label>
            <div className="flex items-center border border-default-300 rounded-xl px-3 py-2 focus-within:border-primary bg-default-50 transition-colors">
              <span className="text-default-400 text-sm font-mono select-none">
                zlocker.app/guest/
              </span>
              <input
                id="locker-slug-input"
                type="text"
                placeholder="my-secret-vault"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOpenLocker()}
                className="bg-transparent text-sm w-full outline-none px-1 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="locker-pass-input" className="text-xs font-semibold text-default-600 flex items-center justify-between">
              <span>2. Locker Password (Required to encrypt/decrypt):</span>
              <span className="text-[11px] text-default-400 font-normal">AES-256 E2EE</span>
            </label>
            <div className="relative flex items-center border border-default-300 rounded-xl px-3 py-2 focus-within:border-primary bg-default-50 transition-colors">
              <KeyRound size={16} className="text-default-400 mr-2 flex-shrink-0" />
              <input
                id="locker-pass-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter secret password"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOpenLocker()}
                className="bg-transparent text-sm w-full outline-none pr-8 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-default-400 hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold"
              endContent={<ArrowRight size={18} />}
              onPress={() => handleOpenLocker()}
            >
              Open / Create Guest Locker
            </Button>
            <Button
              variant="flat"
              size="lg"
              className="w-full sm:w-auto font-medium"
              startContent={<Dices size={18} />}
              onPress={handleCreateRandom}
            >
              Random
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
        <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 space-y-2">
          <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
            <Lock size={18} />
          </div>
          <h3 className="text-sm font-bold">Password Protected</h3>
          <p className="text-xs text-default-500">
            Encrypted with 256-bit AES-GCM directly in your browser.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 space-y-2">
          <div className="p-2 bg-warning/10 text-warning rounded-lg w-fit">
            <Clock size={18} />
          </div>
          <h3 className="text-sm font-bold">24-Hour TTL</h3>
          <p className="text-xs text-default-500">
            Auto-purged from database and Cloudinary storage after 24 hours.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 space-y-2">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg w-fit">
            <Shield size={18} />
          </div>
          <h3 className="text-sm font-bold">Multi-File Support</h3>
          <p className="text-xs text-default-500">
            Store PDFs, PowerPoint PPTX, Images, Word Docs, and ZIP files.
          </p>
        </div>
      </div>
    </div>
  );
}
