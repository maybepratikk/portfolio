import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";

export default function ContentIConsumePage() {
  return (
    <PageShell>
      <HeaderNav />

      <section className="opacity-0 animate-fade-in-up">
        <h1 className="text-[22px] font-medium tracking-[0.02em] text-[var(--text)] mb-4 opacity-0 animate-fade-in-300">
          content i consume
        </h1>

        <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
          a curated list of essays, talks, products, and references that shape
          how i think about design.
        </p>

        <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-500">
          this section will be expanded in a later phase.
        </p>
      </section>

      <Footer />
    </PageShell>
  );
}
