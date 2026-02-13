"use client";

import { useState } from "react";

interface CopyEmailProps {
  email: string;
}

export default function CopyEmail({ email }: CopyEmailProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setShowTooltip(true);
      window.setTimeout(() => setShowTooltip(false), 1400);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        className="text-[var(--text)] font-medium no-underline hover:underline"
        onClick={handleCopy}
        aria-label="Copy email to clipboard"
      >
        email
      </button>
      <span
        className={`absolute left-1/2 top-[-12px] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-[var(--border-hover)] bg-[var(--bg)] px-2 py-1 text-[12px] tracking-[0.02em] text-[var(--text-secondary)] transition-all duration-200 ${
          showTooltip
            ? "opacity-100 translate-y-[-2px]"
            : "pointer-events-none opacity-0"
        }`}
      >
        copied to clipboard
      </span>
    </span>
  );
}
