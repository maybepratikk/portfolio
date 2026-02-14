import Image from "next/image";
import type { CaseStudyMedia } from "@/content/case-studies";

type CaseStudyMediaProps = {
  media: CaseStudyMedia;
};

export default function CaseStudyMedia({ media }: CaseStudyMediaProps) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.posterSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-auto w-full rounded-md border border-[var(--border)] object-contain"
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={1600}
      height={900}
      className="h-auto w-full rounded-md border border-[var(--border)] object-contain"
    />
  );
}
