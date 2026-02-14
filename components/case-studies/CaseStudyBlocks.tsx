"use client";

import type { ReactNode } from "react";
import type { CaseStudyBlock } from "@/content/case-studies";
import { useLayout } from "@/components/LayoutProvider";
import Footer from "@/components/Footer";
import MediaContentBlock from "./MediaContentBlock";

type CaseStudyBlocksProps = {
  title: string;
  summary?: string;
  blocks: CaseStudyBlock[];
  header?: ReactNode;
};

export default function CaseStudyBlocks({ title, summary, blocks, header }: CaseStudyBlocksProps) {
  const { caseStudyMediaSide } = useLayout();
  const layoutMode = caseStudyMediaSide === "left" ? "media-left" : "media-right";
  const lastIndex = blocks.length - 1;

  return (
    <>
      {blocks.map((block, index) => (
        <MediaContentBlock
          key={block.id}
          block={block}
          layoutMode={layoutMode}
          header={index === 0 ? header : undefined}
          title={index === 0 ? title : undefined}
          summary={index === 0 ? summary : undefined}
          footer={index === lastIndex ? <Footer /> : undefined}
        />
      ))}
    </>
  );
}
