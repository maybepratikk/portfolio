import type { ReactNode } from "react";
import type { CaseStudyBlock } from "@/content/case-studies";
import CaseStudyMedia from "./CaseStudyMedia";

type MediaContentBlockProps = {
  block: CaseStudyBlock;
  layoutMode: "media-left" | "media-right";
  header?: ReactNode;
  title?: string;
  summary?: string;
  footer?: ReactNode;
};

export default function MediaContentBlock({ block, layoutMode, header, title, summary, footer }: MediaContentBlockProps) {
  const mediaOnLeft =
    layoutMode === "media-left" ? !Boolean(block.invert) : Boolean(block.invert);
  const directionClass = mediaOnLeft ? "md:flex-row" : "md:flex-row-reverse";

  return (
    <article className={`mb-10 flex flex-col gap-8 md:gap-10 md:items-start ${directionClass}`}>
      <div className="w-full md:flex-1 md:min-w-0 md:sticky md:top-4 self-start">
        <CaseStudyMedia media={block.media} />
        {block.caption ? (
          <p className="mt-2 text-[16px] tracking-[-0.01em] text-[var(--text-tertiary)]">
            {block.caption}
          </p>
        ) : null}
      </div>

      <div className="w-full md:w-[450px] md:shrink-0">
        {header}

        {title ? (
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--text)] mb-4">
            {title}
          </h1>
        ) : null}

        {summary ? (
          <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)]">
            {summary}
          </p>
        ) : null}

        {block.body.map((parts, paragraphIndex) => (
          <p
            key={`${block.id}-paragraph-${paragraphIndex}`}
            className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)]"
          >
            {parts.map((part, partIndex) => {
              if (part.href) {
                return (
                  <a
                    key={`${block.id}-${paragraphIndex}-${partIndex}`}
                    href={part.href}
                    className="text-[var(--text)] font-medium no-underline hover:underline"
                  >
                    {part.text}
                  </a>
                );
              }

              return (
                <span
                  key={`${block.id}-${paragraphIndex}-${partIndex}`}
                  className={part.primary ? "text-[var(--text)]" : undefined}
                >
                  {part.text}
                </span>
              );
            })}
          </p>
        ))}

        {footer}
      </div>
    </article>
  );
}
