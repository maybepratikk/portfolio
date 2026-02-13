"use client";

import Footer from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";

const showcaseItems = [
  "min-h-[240px] md:min-h-[280px]",
  "min-h-[180px] md:min-h-[220px]",
  "min-h-[210px] md:min-h-[250px]",
  "min-h-[280px] md:min-h-[330px]",
  "min-h-[190px] md:min-h-[230px]",
  "min-h-[220px] md:min-h-[270px]",
  "min-h-[160px] md:min-h-[210px]",
  "min-h-[250px] md:min-h-[300px]",
  "min-h-[200px] md:min-h-[240px]",
];

export default function PlaygroundPage() {
  return (
    <PageShell>
      <HeaderNav />

      <section className="opacity-0 animate-fade-in-up">
        <div className="grid grid-cols-1 gap-4 md:gap-5 opacity-0 animate-fade-in-400 transition-all duration-500 ease-out">
          {showcaseItems.map((sizeClass, index) => (
            <article
              key={`${sizeClass}-${index}`}
              className={`rounded-[14px] border border-[var(--border-hover)] bg-[var(--surface)] transition-all duration-500 ease-out ${sizeClass}`}
            >
              <div className="w-full h-full p-5 md:p-6 flex items-end">
                <span className="text-[16px] md:text-[17px] tracking-[0.02em] text-[var(--text-tertiary)]">
                  showcase {index + 1}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
