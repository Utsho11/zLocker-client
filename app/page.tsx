"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
  ArrowRight,
  Clock,
  Dices,
  FileText,
  Flame,
  Lock,
  Presentation,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const [guestSlug, setGuestSlug] = useState("");
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleOpenGuestLocker = (slug?: string) => {
    const target = (slug || guestSlug).trim().toLowerCase();
    if (target) {
      const clean = target.replace(/[^a-z0-9_-]/g, "-");
      router.push(`/guest/${clean}`);
    } else {
      router.push("/guest");
    }
  };

  const handleRandomLocker = () => {
    const randomSlug = "locker-" + Math.random().toString(36).substring(2, 8);
    handleOpenGuestLocker(randomSlug);
  };

  return (
    <div className="space-y-16 py-8 md:py-12 max-w-6xl mx-auto px-4">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles size={14} />
          <span>Zero-Knowledge Encrypted &bull; ProtectedText Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Your Private Locker for{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-warning bg-clip-text text-transparent">
            Notes & Files
          </span>
        </h1>

        <p className="text-default-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Store rich-text notes and multi-format documents (PDFs, PPTX, Images, ZIPs). 
          Encrypted directly in your browser. Choose between permanent account storage or 24-hour self-destructing guest lockers.
        </p>

        {/* QUICK GUEST LOCKER INPUT */}
        <div className="pt-4 max-w-xl mx-auto">
          <Card className="border border-primary/30 shadow-lg bg-background/80 backdrop-blur-md p-2">
            <CardBody className="p-3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center border border-default-300 rounded-xl px-3 py-2 flex-grow bg-default-50 focus-within:border-primary transition-colors">
                  <span className="text-default-400 text-xs sm:text-sm font-mono select-none">
                    zlocker.app/guest/
                  </span>
                  <input
                    type="text"
                    placeholder="my-secret-vault"
                    value={guestSlug}
                    onChange={(e) => setGuestSlug(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleOpenGuestLocker()}
                    className="bg-transparent text-sm w-full outline-none px-1 font-medium"
                  />
                </div>

                <Button
                  color="primary"
                  className="font-semibold shadow-md"
                  endContent={<ArrowRight size={16} />}
                  onPress={() => handleOpenGuestLocker()}
                >
                  Open Locker
                </Button>
              </div>

              <div className="flex justify-between items-center px-1 text-xs text-default-400">
                <span>⚡ No registration required (24h auto-expiry)</span>
                <button
                  onClick={handleRandomLocker}
                  className="text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <Dices size={14} /> Random Locker
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* AUTH BUTTONS FOR REGISTERED USERS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isSignedIn ? (
            <Button
              color="secondary"
              radius="full"
              size="lg"
              className="font-semibold"
              startContent={<UserCheck size={18} />}
              onPress={() => router.push("/dashboard")}
            >
              Go to Member Dashboard
            </Button>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant="bordered"
                  color="primary"
                  radius="full"
                  size="md"
                  className="font-medium"
                >
                  Member Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  color="primary"
                  radius="full"
                  size="md"
                  className="font-medium"
                >
                  Create Permanent Account
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </section>

      {/* FEATURE BENTO GRID */}
      <section className="space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Engineered for Security & Speed</h2>
          <p className="text-default-500 text-sm">
            Everything you need for effortless, ultra-secure digital locker management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border border-default-200 shadow-sm p-4 hover:border-primary/50 transition-all">
            <CardBody className="space-y-3">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold">Zero-Knowledge E2EE</h3>
              <p className="text-default-500 text-sm leading-relaxed">
                Like ProtectedText, your notes are encrypted locally in your browser using AES-GCM 256-bit with PBKDF2 before sending to our servers. Only your passphrase can unlock them.
              </p>
            </CardBody>
          </Card>

          {/* Card 2 */}
          <Card className="border border-default-200 shadow-sm p-4 hover:border-warning/50 transition-all">
            <CardBody className="space-y-3">
              <div className="p-3 bg-warning/10 text-warning rounded-xl w-fit">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold">24-Hour Guest Mode</h3>
              <p className="text-default-500 text-sm leading-relaxed">
                Need temporary storage? Open an instant guest locker with zero signup. All notes and Cloudinary files are automatically purged after 24 hours.
              </p>
            </CardBody>
          </Card>

          {/* Card 3 */}
          <Card className="border border-default-200 shadow-sm p-4 hover:border-secondary/50 transition-all">
            <CardBody className="space-y-3">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl w-fit">
                <Presentation size={24} />
              </div>
              <h3 className="text-lg font-bold">Multi-Format Cloud Locker</h3>
              <p className="text-default-500 text-sm leading-relaxed">
                Upload PowerPoint presentations (.pptx), PDFs, Images, Word documents, and ZIP archives directly into your dedicated Cloudinary folder with 1-click sharing.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="bg-default-50/70 border border-default-200 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Choose Your Locker Type</h2>
          <p className="text-default-500 text-xs sm:text-sm">
            Instant freedom or long-term permanence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Option */}
          <div className="p-6 bg-background rounded-2xl border border-warning/30 space-y-4">
            <div className="flex items-center gap-2 text-warning font-bold text-lg">
              <Flame size={20} />
              <span>Instant Guest Locker</span>
            </div>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="flex items-center gap-2">✓ No registration or email required</li>
              <li className="flex items-center gap-2">✓ Custom URL (e.g. zlocker.app/guest/my-vault)</li>
              <li className="flex items-center gap-2">✓ Zero-knowledge encrypted text & file uploads</li>
              <li className="flex items-center gap-2">⏱️ <strong>Strict 24-hour auto-expiration</strong></li>
              <li className="flex items-center gap-2">✓ Automatic Cloudinary file purge</li>
            </ul>
            <Button
              color="warning"
              variant="flat"
              className="w-full font-semibold"
              onPress={() => router.push("/guest")}
            >
              Launch Guest Locker
            </Button>
          </div>

          {/* Member Option */}
          <div className="p-6 bg-background rounded-2xl border border-primary/30 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <ShieldCheck size={20} />
              <span>Registered Member Vault</span>
            </div>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="flex items-center gap-2">✓ Permanent lifetime encrypted cloud locker</li>
              <li className="flex items-center gap-2">✓ Unlimited notes and rich text formatting</li>
              <li className="flex items-center gap-2">✓ Multi-format Cloudinary file gallery</li>
              <li className="flex items-center gap-2">✓ Secure authentication via Clerk</li>
              <li className="flex items-center gap-2">✓ Manage, edit, and organize multiple notes</li>
            </ul>
            {isSignedIn ? (
              <Button
                color="primary"
                className="w-full font-semibold"
                onPress={() => router.push("/dashboard")}
              >
                Go to My Vault
              </Button>
            ) : (
              <SignUpButton>
                <Button color="primary" className="w-full font-semibold">
                  Create Member Vault
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
