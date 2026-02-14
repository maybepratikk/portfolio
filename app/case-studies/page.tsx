import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <HeaderNav />

      <section className="opacity-0 animate-fade-in-up">
        <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--text)] mb-4 opacity-0 animate-fade-in-300">
          case studies
        </h1>

        <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
          selected product design work. each project shows the thinking,
          constraints, and outcomes.
        </p>

        <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-500">
          full case studies are being organized and will be published here
          shortly.
        </p>
      </section>

      <Footer />
    </PageShell>
  );
}
