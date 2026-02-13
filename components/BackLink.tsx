"use client";

import { useRouter } from "next/navigation";

type BackLinkProps = {
  fallbackHref?: string;
};

export default function BackLink({ fallbackHref = "/" }: BackLinkProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors duration-200"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
