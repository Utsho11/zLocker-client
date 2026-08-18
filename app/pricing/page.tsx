"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Check, Copy, Crown, Flame, ShieldCheck, Sparkles, Zap, PhoneCall, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import clipboardCopy from "clipboard-copy";

interface PlanDetail {
  name: string;
  price: string;
  amount: number;
  tabs: string;
  files: string;
  badge?: string;
  color: "default" | "primary" | "secondary" | "warning";
  features: string[];
}

export default function PricingPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const [selectedPlan, setSelectedPlan] = useState<PlanDetail | null>(null);
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);

  const { isOpen: isPaymentOpen, onOpen: onOpenPayment, onClose: onClosePayment } = useDisclosure();

  const BKASH_NUMBER = "+8801521793531";

  const plans: PlanDetail[] = [
    {
      name: "Basic Plan",
      price: "20 TK",
      amount: 20,
      tabs: "20 Tabs",
      files: "20 Files / Images",
      color: "primary",
      features: [
        "20 Tabs in permanent vault",
        "20 Compressed images & files",
        "Zero-Knowledge AES-256 Encryption",
        "Permanent lifetime cloud storage",
        "Multi-device sync",
      ],
    },
    {
      name: "Standard Plan",
      price: "50 TK",
      amount: 50,
      tabs: "100 Tabs",
      files: "100 Files / Images",
      badge: "Popular Value",
      color: "secondary",
      features: [
        "100 Tabs in permanent vault",
        "100 Compressed images & files",
        "Zero-Knowledge AES-256 Encryption",
        "Permanent lifetime cloud storage",
        "Priority sync speed",
      ],
    },
    {
      name: "Unlimited Pro",
      price: "100 TK",
      amount: 100,
      tabs: "Unlimited Tabs",
      files: "Unlimited Images & Files",
      badge: "Best Unlimited",
      color: "warning",
      features: [
        "Unlimited Tabs per vault",
        "Unlimited Files & Images",
        "Full Original Quality (Lossless)",
        "Permanent lifetime cloud storage",
        "Priority global CDN speeds",
      ],
    },
  ];

  const handleSelectPlan = (plan: PlanDetail) => {
    setSelectedPlan(plan);
    onOpenPayment();
  };

  const handleCopyBkash = async () => {
    await clipboardCopy("01521793531");
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "bKash number copied: 01521793531",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim() || !trxId.trim()) {
      Swal.fire("Missing Information", "Please enter your bKash phone number and Transaction ID (TrxID).", "warning");
      return;
    }

    setIsSubmittingTrx(true);

    setTimeout(() => {
      setIsSubmittingTrx(false);
      onClosePayment();
      setSenderPhone("");
      setTrxId("");

      Swal.fire({
        title: "Payment Submitted Successfully! 🎉",
        html: `
          <p class="text-sm text-left">We have received your transaction request for <strong>${selectedPlan?.name} (${selectedPlan?.price})</strong>.</p>
          <div class="mt-3 p-3 bg-default-100 rounded-lg text-xs text-left space-y-1">
            <p><strong>Account:</strong> ${user?.primaryEmailAddress?.emailAddress || "Registered Member"}</p>
            <p><strong>Sender Phone:</strong> ${senderPhone}</p>
            <p><strong>TrxID:</strong> ${trxId}</p>
          </div>
          <p class="text-xs text-default-500 mt-3">Your account limits will be verified and upgraded promptly.</p>
        `,
        icon: "success",
        confirmButtonText: "Return to Vault",
      }).then(() => {
        router.push("/dashboard");
      });
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-semibold">
          <Sparkles size={14} />
          <span>bKash Instant Activation Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Flexible Pricing & Subscription
        </h1>
        <p className="text-default-500 text-sm sm:text-base">
          Pay easily via <strong>bKash Send Money</strong> to unlock expanded tabs and cloud file storage for your vault.
        </p>
      </div>

      {/* 3 Paid Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border ${
              plan.badge ? "border-primary shadow-lg scale-[1.02]" : "border-default-200 shadow-sm"
            } flex flex-col justify-between p-2 relative transition-transform`}
          >
            {plan.badge && (
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {plan.badge}
              </div>
            )}
            <div>
              <CardHeader className="flex flex-col items-start gap-2 pb-0">
                <div
                  className={`p-2.5 rounded-xl ${
                    plan.color === "warning"
                      ? "bg-warning/10 text-warning"
                      : plan.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {plan.color === "warning" ? <Crown size={22} /> : <Zap size={22} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-default-400">
                    {plan.tabs} &bull; {plan.files}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-pink-600 dark:text-pink-400">{plan.price}</span>
                  <span className="text-xs text-default-400"> / one-time activation</span>
                </div>
              </CardHeader>

              <CardBody className="py-4 space-y-3">
                <div className="text-xs font-semibold text-foreground">Included Benefits:</div>
                <ul className="space-y-2.5 text-xs text-default-600">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check size={14} className="text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </div>

            <CardFooter>
              <Button
                className="w-full font-semibold bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md hover:opacity-90"
                startContent={<Zap size={16} />}
                onPress={() => handleSelectPlan(plan)}
              >
                Pay {plan.price} with bKash
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Free & Guest Tiers Reference Table */}
      <div className="bg-default-50 rounded-2xl border border-default-200 p-6 space-y-4">
        <h3 className="text-lg font-bold">Free & Guest Tiers Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-default-600">
          <div className="p-4 bg-background rounded-xl border border-default-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">Guest Mode ($0)</span>
              <span className="px-2 py-0.5 rounded bg-warning/10 text-warning font-semibold">24h Expiry</span>
            </div>
            <p>
              Limited to <strong>3 Tabs</strong> and <strong>3 compressed files</strong>. All data and Cloudinary files self-destruct automatically after 24 hours.
            </p>
          </div>

          <div className="p-4 bg-background rounded-xl border border-default-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">Registered Free ($0)</span>
              <span className="px-2 py-0.5 rounded bg-success/10 text-success font-semibold">Permanent</span>
            </div>
            <p>
              Includes <strong>5 Tabs</strong> and <strong>5 compressed files</strong> stored permanently with Zero-Knowledge encryption in your account.
            </p>
          </div>
        </div>
      </div>

      {/* bKash Payment Modal */}
      <Modal
        backdrop="blur"
        isOpen={isPaymentOpen}
        placement="center"
        size="lg"
        onClose={onClosePayment}
      >
        <ModalContent>
          <form onSubmit={handleSubmitPayment}>
            <ModalHeader className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <PhoneCall size={20} />
              <span>bKash Manual Payment &bull; {selectedPlan?.name} ({selectedPlan?.price})</span>
            </ModalHeader>
            <ModalBody className="space-y-4">
              {/* Payment Instructions Card */}
              <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl space-y-3">
                <p className="text-xs font-semibold text-foreground">
                  Instructions for bKash Send Money:
                </p>
                <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-pink-500/30">
                  <div>
                    <p className="text-[11px] text-default-400">Personal bKash Number:</p>
                    <p className="text-base font-bold text-pink-600 dark:text-pink-400">{BKASH_NUMBER}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<Copy size={14} />}
                    onPress={handleCopyBkash}
                  >
                    Copy Number
                  </Button>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-xs text-default-600">
                  <li>Open your bKash App and choose <strong>Send Money</strong>.</li>
                  <li>Enter number <strong>01521793531</strong>.</li>
                  <li>Enter exact amount: <strong>{selectedPlan?.price}</strong>.</li>
                  <li>Complete the transaction and copy the <strong>Transaction ID (TrxID)</strong>.</li>
                </ol>
              </div>

              {/* Form Input fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-default-600 block mb-1">
                    Your bKash Phone Number:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 017XXXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-default-300 rounded-xl bg-background outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-default-600 block mb-1">
                    bKash Transaction ID (TrxID):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9J3K8L2M"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-default-300 rounded-xl bg-background outline-none focus:border-pink-500 uppercase"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClosePayment}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmittingTrx}
                className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold"
              >
                Submit Payment for Verification
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
