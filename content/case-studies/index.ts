import { caseStudies } from "./data";
import type { CaseStudy } from "./types";

export function getCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  return caseStudies.find((study) => study.slug === slug) ?? null;
}

export type { CaseStudy, CaseStudyBlock, CaseStudyBodyPart, CaseStudyMedia } from "./types";
