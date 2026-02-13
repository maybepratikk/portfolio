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
        className={`pointer-events-none absolute left-1/2 top-[-12px] -translate-x-1/2 -translate-y-full whitespace-nowrap transition-all duration-300 ease-out motion-reduce:transition-none ${
          showTooltip
            ? "translate-y-[-4px] scale-100 opacity-100"
            : "translate-y-[2px] scale-95 opacity-0"
        }`}
        aria-hidden="true"
      >
        <span className="relative block rounded-lg border border-[var(--border-hover)] bg-[color-mix(in_oklab,var(--bg)_92%,white_8%)] px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] text-[var(--text)] shadow-[0_10px_25px_rgba(0,0,0,0.12)] backdrop-blur-sm">
          Copied to clipboard
          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[var(--border-hover)] bg-[color-mix(in_oklab,var(--bg)_92%,white_8%)]" />
        </span>
      </span>
    </span>
  );
}
