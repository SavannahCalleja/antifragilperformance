"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#why-antifragil", label: "Why Antifragil?" },
  { href: "#the-app", label: "The App" },
  { href: "#blog", label: "Blog" },
  { href: "#merch", label: "Merch" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#800000]/78 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 sm:justify-end sm:gap-x-8 sm:px-6 md:py-5"
        aria-label="Primary"
      >
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="text-[0.7rem] font-medium tracking-[0.14em] text-[#E5E4E2]/90 transition-colors hover:text-[#E5E4E2] sm:text-xs"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
