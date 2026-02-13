"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";
const THEME_FADE_MS = 140;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const switchTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const clearThemeTimers = () => {
    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  const applyTheme = (nextTheme: Theme, { animate }: { animate: boolean }) => {
    const root = document.documentElement;
    clearThemeTimers();

    if (!animate) {
      root.removeAttribute("data-theme-fade");
      root.removeAttribute("data-theme-switching");
      root.setAttribute("data-theme", nextTheme);
      return;
    }

    root.setAttribute("data-theme-fade", "out");

    switchTimerRef.current = window.setTimeout(() => {
      root.setAttribute("data-theme-switching", "true");
      root.setAttribute("data-theme", nextTheme);
      root.setAttribute("data-theme-fade", "in");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.removeAttribute("data-theme-switching");
        });
      });

      settleTimerRef.current = window.setTimeout(() => {
        root.removeAttribute("data-theme-fade");
      }, THEME_FADE_MS);
    }, THEME_FADE_MS);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const resolvedTheme = storedTheme === "light" ? "light" : "dark";
    setTheme(resolvedTheme);
    applyTheme(resolvedTheme, { animate: false });

    return () => {
      clearThemeTimers();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme, { animate: true });
    localStorage.setItem("theme", nextTheme);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`switch to ${isLight ? "dark" : "light"} theme`}
      className="inline-flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors duration-200"
      title={isLight ? "switch to dark mode" : "switch to light mode"}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: isLight ? 1 : 0,
            transform: isLight ? "scale(1) rotate(0deg)" : "scale(0.62) rotate(-35deg)",
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
        </g>
        <g
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: isLight ? 0 : 1,
            transform: isLight ? "scale(0.62) rotate(30deg)" : "scale(1) rotate(0deg)",
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        >
          <path d="M21 13.4A9 9 0 1 1 10.6 3a7.2 7.2 0 1 0 10.4 10.4Z" />
        </g>
      </svg>
    </button>
  );
}
