 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LayoutToggle from "./LayoutToggle";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "home" },
  { href: "/playground", label: "playground" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <header className="mb-12 opacity-0 animate-fade-in-100">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[18px] font-normal tracking-[0.02em] leading-[1.3]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`no-underline hover:underline ${
              pathname === link.href
                ? "text-[var(--text)] font-medium"
                : "text-[var(--text-secondary)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <LayoutToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
