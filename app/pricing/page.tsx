"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Check, Crown, Flame, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleUpgradePro = () => {
    Swal.fire({
      title: "🚀 Pro Tier Coming Soon!",
      text: "Unlimited tabs & uncompressed cloud file storage will be available with our upcoming Stripe integration.",
      icon: "success",
      confirmButtonText: "Got it!",
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles size={14} />
          <span>Transparent Limits & Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Simple Plans for Every Vault
        </h1>
        <p className="text-default-500 text-sm sm:text-base">
          Choose between disposable 24-hour guest lockers, permanent free member accounts, or unlimited Pro superpowers.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Plan 1: Guest Locker */}
        <Card className="border border-warning/30 shadow-sm flex flex-col justify-between p-2">
          <div>
            <CardHeader className="flex flex-col items-start gap-2 pb-0">
              <div className="p-2.5 bg-warning/10 text-warning rounded-xl">
                <Flame size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Guest Vault</h3>
                <p className="text-xs text-default-400">Instant disposable storage</p>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-extrabold">$0</span>
                <span className="text-xs text-default-400"> / instant access</span>
              </div>
            </CardHeader>

            <CardBody className="py-4 space-y-3">
              <div className="text-xs font-semibold text-warning">Strict Limits:</div>
              <ul className="space-y-2.5 text-xs text-default-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-warning flex-shrink-0" />
                  <span><strong>Max 3 Tabs</strong> per locker</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-warning flex-shrink-0" />
                  <span><strong>Max 3 Files</strong> (compressed images)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-warning flex-shrink-0" />
                  <span><strong>24-Hour Expiration</strong> (auto-purge)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-warning flex-shrink-0" />
                  <span>Zero-Knowledge AES-256 E2EE</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-warning flex-shrink-0" />
                  <span>No Registration or Email required</span>
                </li>
              </ul>
            </CardBody>
          </div>

          <CardFooter>
            <Button
              color="warning"
              variant="flat"
              className="w-full font-semibold"
              onPress={() => router.push("/guest")}
            >
              Open Guest Locker
            </Button>
          </CardFooter>
        </Card>

        {/* Plan 2: Registered Free Member (Popular) */}
        <Card className="border-2 border-primary shadow-md flex flex-col justify-between p-2 relative">
          <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Current Tier
          </div>
          <div>
            <CardHeader className="flex flex-col items-start gap-2 pb-0">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Registered Free</h3>
                <p className="text-xs text-default-400">Permanent personal vault</p>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-extrabold">$0</span>
                <span className="text-xs text-default-400"> / forever</span>
              </div>
            </CardHeader>

            <CardBody className="py-4 space-y-3">
              <div className="text-xs font-semibold text-primary">Member Features:</div>
              <ul className="space-y-2.5 text-xs text-default-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span><strong>Max 5 Tabs</strong> in permanent vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span><strong>Max 5 Files</strong> (compressed images)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span><strong>Permanent Lifetime Storage</strong> (no auto-purge)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span>Zero-Knowledge AES-256 Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span>Multi-Device Sync via Clerk Auth</span>
                </li>
              </ul>
            </CardBody>
          </div>

          <CardFooter>
            {isSignedIn ? (
              <Button
                color="primary"
                className="w-full font-semibold"
                onPress={() => router.push("/dashboard")}
              >
                Go to My Vault
              </Button>
            ) : (
              <SignInButton>
                <Button color="primary" className="w-full font-semibold">
                  Sign In / Create Free Account
                </Button>
              </SignInButton>
            )}
          </CardFooter>
        </Card>

        {/* Plan 3: Pro Subscriber */}
        <Card className="border border-secondary/40 shadow-sm flex flex-col justify-between p-2 bg-gradient-to-b from-secondary/5 to-transparent">
          <div>
            <CardHeader className="flex flex-col items-start gap-2 pb-0">
              <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
                <Crown size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pro Member</h3>
                <p className="text-xs text-default-400">Unlimited power & storage</p>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-extrabold">$4.99</span>
                <span className="text-xs text-default-400"> / month</span>
              </div>
            </CardHeader>

            <CardBody className="py-4 space-y-3">
              <div className="text-xs font-semibold text-secondary">Unlimited Superpowers:</div>
              <ul className="space-y-2.5 text-xs text-default-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-secondary flex-shrink-0" />
                  <span><strong>Unlimited Tabs</strong> per vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-secondary flex-shrink-0" />
                  <span><strong>Unlimited Files & Images</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-secondary flex-shrink-0" />
                  <span><strong>Full Original Resolution</strong> (lossless files)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-secondary flex-shrink-0" />
                  <span>Permanent Lifetime Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-secondary flex-shrink-0" />
                  <span>Priority Global CDN Speeds</span>
                </li>
              </ul>
            </CardBody>
          </div>

          <CardFooter>
            <Button
              color="secondary"
              variant="shadow"
              className="w-full font-semibold"
              startContent={<Zap size={16} />}
              onPress={handleUpgradePro}
            >
              Subscribe to Pro
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Subscription Rules Breakdown */}
      <div className="bg-default-50 rounded-2xl border border-default-200 p-6 space-y-4">
        <h3 className="text-lg font-bold">📋 Policy & Limit Enforcement Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-default-600 leading-relaxed">
          <div className="p-3 bg-background rounded-xl border border-default-200 space-y-1">
            <span className="font-bold text-foreground">1. Guest User Rules:</span>
            <p>
              Guest sessions can open up to <strong>3 tabs</strong> and upload up to <strong>3 compressed files/images</strong>. All guest data automatically expires and self-destructs from the database and Cloudinary storage after 24 hours.
            </p>
          </div>
          <div className="p-3 bg-background rounded-xl border border-default-200 space-y-1">
            <span className="font-bold text-foreground">2. Registered Free User Rules:</span>
            <p>
              Free accounts can manage up to <strong>5 tabs</strong> and store up to <strong>5 compressed files/images</strong> in their permanent vault. Data is never deleted automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
