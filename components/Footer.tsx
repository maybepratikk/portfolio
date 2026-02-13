import CopyEmail from "./CopyEmail";

export default function Footer() {
  return (
    <div className="footer-section mt-12 text-xl font-normal leading-[1.7] tracking-[0.02em] text-[var(--text-secondary)] opacity-0 animate-fade-in-700">
      if you&apos;re building something serious and need a design that stands out -
      let&apos;s work
      <br />
      <br></br>
      you can also reach out to me on{" "}
      <a
        href="#"
        className="text-[var(--text)] font-medium no-underline hover:underline"
      >
        linkedin
      </a>
      ,{" "}
      <a
        href="#"
        className="text-[var(--text)] font-medium no-underline hover:underline"
      >
        twitter
      </a>{" "}
      or{" "}
      <CopyEmail email="your@email.com" />
      <div className="mt-2 text-[var(--text-tertiary)] text-lg">last updated february 2026</div>
    </div>
  );
}
