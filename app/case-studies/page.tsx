import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";
import Link from "next/link";
import { getCaseStudies } from "@/content/case-studies";

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  return (
    <PageShell disableLayoutAnimation>
      <HeaderNav />

      <section className="opacity-0 animate-fade-in-up">
        <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--text)] mb-4 opacity-0 animate-fade-in-300">
          case studies
        </h1>

        <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
          selected product design work. each project shows the thinking,
          constraints, and outcomes.
        </p>

        {studies.length ? (
          studies.map((study) => (
            <p
              key={study.slug}
              className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-4 text-[var(--text-secondary)] opacity-0 animate-fade-in-500"
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className="text-[var(--text)] font-medium no-underline hover:underline"
              >
                {study.title}
              </Link>
              {study.summary ? ` - ${study.summary}` : ""}
              {study.status === "coming-soon" ? " (coming soon)" : ""}
            </p>
          ))
        ) : (
          <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-500">
            no case studies added yet. add one in local content and it will
            show up here.
          </p>
        )}
      </section>

      <Footer />
    </PageShell>
  );
}
