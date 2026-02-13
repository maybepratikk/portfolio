import Link from "next/link";
import AgeTicker from "./AgeTicker";
import Footer from "./Footer";

const featuredCompanies = [
  { label: "niakai", slug: "niakai" },
  { label: "shopninja", slug: "shopninja" },
  { label: "savari", slug: "savari" },
  { label: "shadow interviewer", slug: "shadow-interviewer" },
  { label: "attenfi", slug: "attenfi" },
];

export default function PortfolioContent() {
  return (
    <div className="max-w-[450px] md:max-w-[450px] w-full opacity-0 animate-fade-in-up">
      <h1 className="text-[22px] font-medium tracking-[0.02em] text-[var(--text)] mb-1 opacity-0 animate-fade-in-100">
        hi i&apos;m pratik
        <span className="hidden">
          <AgeTicker />
        </span>
      </h1>
      <br />

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-300">
        i&apos;m a product designer.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
        i work with startups and founders who care about building real
        products, not just launching fast, but building something that lasts.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-500">
        i&apos;ve worked with companies like{" "}
        {featuredCompanies.map((company, index) => (
          <span key={company.slug}>
            <Link
              href={`/case-studies/${company.slug}`}
              className="text-[var(--text)] font-medium no-underline hover:underline"
            >
              {company.label}
            </Link>
            {index < featuredCompanies.length - 1 ? ", " : " "}
          </span>
        ))}
        and 25+ more.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-600">
        mostly early-stage work. 0 → 1 products. messy ideas. tight timelines.
        where every design decision matters.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        here&apos;s what they&apos;ve said.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        what i do is simple. i design products. structure the thinking. make
        them usable.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        i work on a monthly basis.{" "}
        <span className="font-medium text-[var(--text)]">
          $4,853 / month
        </span>
        .
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.7] tracking-[0.02em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        i take on a limited number of projects.
      </p>

      <Footer />
    </div>
  );
}
