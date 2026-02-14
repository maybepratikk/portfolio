import Link from "next/link";
import AgeTicker from "./AgeTicker";
import Footer from "./Footer";

const featuredCompanies = [
  { label: "niakai", slug: "niakai" },
  { label: "savari", slug: "savari" },
  { label: "attenfi", slug: "attenfi" },
  { label: "kismetai", slug: "kismetai" },
  { label: "shadow interviewer", slug: "shadow-interviewer" },
];

export default function PortfolioContent() {
  return (
    <div className="max-w-[450px] md:max-w-[450px] w-full text-justify opacity-0 animate-fade-in-up">
      <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--text)] mb-1 opacity-0 animate-fade-in-100">
        hi i&apos;m pratik
        <span className="hidden">
          <AgeTicker />
        </span>
      </h1>
      <br />

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-300">
        i&apos;m a freelance product designer.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-400">
        i work with startups and founders in ai and b2b, helping them with
        their product, website, and pitch decks - to make sure they stand
        out and look serious for fundraising.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-500">
        i&apos;ve worked with startups like{" "}
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
        and 25+ others.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-600">
        i&apos;ve also worked as a design partner with blissful, where i worked
        under steve, the founder of blissful. i led multiple projects,
        including assurean, ankor, rocketquote, and daoco.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        my clients have said some really good things about me - you should
        definitely{" "}
        <a
          href="#"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          hear
        </a>{" "}
        what they say.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        i take on limited projects - i believe in serving quality over
        quantity.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        starting from{" "}
        <span className="text-highlight">
          $4578/m
        </span>
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        a simple goal - create good shit, help clients raise millions, and
        repeat.
      </p>

      <p className="portfolio-text text-[22px] font-normal leading-[1.6] tracking-[-0.01em] mb-5 text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
        are you ready to take your product to the next level?
      </p>

      <Footer />
    </div>
  );
}
