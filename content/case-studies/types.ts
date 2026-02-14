export type CaseStudyBodyPart = {
  text: string;
  primary?: boolean;
  href?: string;
};

export type CaseStudyMediaImage = {
  kind: "image";
  src: string;
  alt: string;
};

export type CaseStudyMediaVideo = {
  kind: "video";
  src: string;
  posterSrc?: string;
};

export type CaseStudyMedia = CaseStudyMediaImage | CaseStudyMediaVideo;

export type CaseStudyBlock = {
  id: string;
  body: CaseStudyBodyPart[][];
  caption?: string;
  invert?: boolean;
  media: CaseStudyMedia;
};

export type CaseStudy = {
  title: string;
  slug: string;
  summary?: string;
  status?: "live" | "coming-soon";
  blocks: CaseStudyBlock[];
};
