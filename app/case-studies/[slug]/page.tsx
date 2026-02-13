import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";

const caseStudyMeta: Record<string, { title: string; status: string }> = {
  niakai: { title: "niakai", status: "case study in progress" },
  shopninja: { title: "shopninja", status: "case study in progress" },
  savari: { title: "savari", status: "case study in progress" },
  "shadow-interviewer": {
    title: "shadow interviewer",
    status: "case study in progress",
  },
  attenfi: { title: "attenfi", status: "case study in progress" },
};

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudyMeta[slug] ?? {
    title: slug.replaceAll("-", " "),
    status: "new case study coming soon",
  };

  return (
    <PageShell>
      <HeaderNav />

      <section className="opacity-0 animate-fade-in-up">
        <h1 className="text-[22px] font-medium tracking-[0.02em] text-[var(--text)] mb-4 opacity-0 animate-fade-in-300">
          {caseStudy.title}
        </h1>

        <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
          {caseStudy.status}.
        </p>
      </section>

      <Footer />
    </PageShell>
  );
}
