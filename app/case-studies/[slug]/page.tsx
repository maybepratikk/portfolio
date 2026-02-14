import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";
import CaseStudyBlocks from "@/components/case-studies/CaseStudyBlocks";
import Footer from "@/components/Footer";
import { getCaseStudyBySlug, getCaseStudies } from "@/content/case-studies";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  const isComingSoon = caseStudy?.status === "coming-soon";

  return (
    <PageShell mode="experimental" disableLayoutAnimation>
      <section className="opacity-0 animate-fade-in-up">
        {caseStudy && caseStudy.blocks.length > 0 && !isComingSoon ? (
          <CaseStudyBlocks
            title={caseStudy.title}
            summary={caseStudy.summary}
            blocks={caseStudy.blocks}
            header={<HeaderNav />}
          />
        ) : (
          <>
            <HeaderNav />
            <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--text)] mb-4 opacity-0 animate-fade-in-300">
              {caseStudy?.title ?? slug.replaceAll("-", " ")}
            </h1>
            <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
              new case study coming soon.
            </p>
            <Footer />
          </>
        )}
      </section>
    </PageShell>
  );
}
