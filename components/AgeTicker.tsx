"use client";

import { useEffect, useState } from "react";

const BIRTH_DATE_UTC = Date.UTC(2003, 6, 12, 0, 0, 0);
const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365.2425;

function getAgeValue() {
  const now = Date.now();
  return ((now - BIRTH_DATE_UTC) / YEAR_IN_MS).toFixed(11);
}

export default function AgeTicker() {
  const [age, setAge] = useState("22.00000000000");

  useEffect(() => {
    // Set initial age immediately after mount
    setAge(getAgeValue());

    // Then update every 120ms
    const interval = window.setInterval(() => {
      setAge(getAgeValue());
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <sup className="ml-1 align-super text-[10px] font-normal tracking-[0.02em] text-[var(--text-tertiary)]">
      {age}
    </sup>
  );
}
