"use client";

import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

type Props = {
  onResend: () => void;
};

export default function ResendCodeButton({ onResend }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleClick = () => {
    onResend();
    setSecondsLeft(20);
  };

  return (
    <Button
      color="primary"
      disabled={secondsLeft > 0}
      size="sm"
      variant="bordered"
      onPress={handleClick}
    >
      {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend Code"}
    </Button>
  );
}
