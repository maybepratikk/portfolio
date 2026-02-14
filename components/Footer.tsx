import CopyEmail from "./CopyEmail";

export default function Footer() {
  return (
    <div className="footer-section mt-2 text-[22px] font-normal leading-[1.6] tracking-[-0.01em] text-[var(--text-secondary)] text-justify opacity-0 animate-fade-in-700">
      <p className="mb-2">or</p>
      <p className="mb-5">
        you can reach out to me via{" "}
        <a
          href="#"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          twitter
        </a>
        ,{" "}
        <a
          href="#"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          linkedin
        </a>{" "}
        or <CopyEmail email="your@email.com" />
      </p>
      <p className="mb-5">want to get started immediately?</p>
      <p className="mb-5">
        <a
          href="#"
          className="text-[var(--text)] font-medium no-underline hover:underline"
        >
          start
        </a>{" "}
        without the call and get{" "}
        <span className="font-medium text-[var(--text)]">
          10% off for the first month
        </span>
        .
      </p>
      <div className="mt-2 text-[var(--text-tertiary)] text-lg">
        Last updated - 14th Feb, 2026
        <br />
        (i&apos;m single, so i worked on my portfolio)
      </div>
    </div>
  );
}
