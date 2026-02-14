import CopyEmail from "./CopyEmail";

const BOOK_CALL_HREF = "mailto:your@email.com?subject=Book%20a%20Call";
const START_NOW_HREF = "mailto:your@email.com?subject=Start%20Project%20Immediately";
const TWITTER_HREF = "https://x.com/";
const LINKEDIN_HREF = "https://www.linkedin.com/";

export default function Footer() {
  return (
    <div className="footer-section mt-2 text-[22px] font-normal leading-[1.6] tracking-[-0.01em] text-[var(--text-secondary)] text-justify opacity-0 animate-fade-in-700">
      <p className="mb-5">-</p>

      <p className="mb-5">
        <a
          href={BOOK_CALL_HREF}
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          book a call
        </a>{" "}
        with me - i&apos;ll reach out to you.
      </p>

      <p className="mb-2">or</p>

      <p className="mb-5">
        you can reach out to me via{" "}
        <a
          href={TWITTER_HREF}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          twitter
        </a>
        ,{" "}
        <a
          href={LINKEDIN_HREF}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          linkedin
        </a>{" "}
        or <CopyEmail email="your@email.com" />
      </p>

      <p className="mb-5">want to get started immediately?</p>

      <p className="mb-5">
        <a
          href={START_NOW_HREF}
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          start immediately
        </a>{" "}
        without the call and get 10% off for the first month.
      </p>
      <div className="mt-2 text-[var(--text-tertiary)] text-lg">
        Last updated - 14th Feb, 2026
        <br />
        (i&apos;m single, so i worked on my portfolio)
      </div>
    </div>
  );
}
