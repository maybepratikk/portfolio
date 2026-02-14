"use client";

import { usePathname } from "next/navigation";
import { useLayout } from "./LayoutProvider";

type LayoutAlignment = "left" | "center" | "right";

const alignmentOrder: LayoutAlignment[] = ["left", "center", "right"];

const middleLineOffset: Record<LayoutAlignment, number> = {
  left: -3,
  center: 0,
  right: 3,
};

const bottomLineOffset: Record<LayoutAlignment, number> = {
  left: -1.5,
  center: 0,
  right: 1.5,
};

export default function LayoutToggle() {
  const { alignment, setAlignment, caseStudyMediaSide, setCaseStudyMediaSide } = useLayout();
  const pathname = usePathname();
  const isCaseStudyPage = pathname.startsWith("/case-studies");

  const toggleOrder: LayoutAlignment[] = isCaseStudyPage ? ["left", "right"] : alignmentOrder;

  const visualAlignment: LayoutAlignment = isCaseStudyPage
    ? (caseStudyMediaSide as LayoutAlignment)
    : (alignment as LayoutAlignment);

  const currentIndex = toggleOrder.indexOf(visualAlignment);
  const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextAlignment = toggleOrder[(resolvedIndex + 1) % toggleOrder.length];
  const middleOffset = middleLineOffset[visualAlignment];
  const bottomOffset = bottomLineOffset[visualAlignment];

  return (
    <button
      type="button"
      onClick={() => {
        if (isCaseStudyPage) {
          setCaseStudyMediaSide(nextAlignment as "left" | "right");
          return;
        }
        setAlignment(nextAlignment);
      }}
      aria-label={`switch layout to ${nextAlignment}`}
      className="inline-flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors duration-200"
      title={`layout: ${visualAlignment} (click for ${nextAlignment})`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line
          x1="6"
          y1="12"
          x2="18"
          y2="12"
          style={{
            transform: `translateX(${middleOffset}px)`,
            transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <line
          x1="4.5"
          y1="18"
          x2="19.5"
          y2="18"
          style={{
            transform: `translateX(${bottomOffset}px)`,
            transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
    </button>
  );
}
