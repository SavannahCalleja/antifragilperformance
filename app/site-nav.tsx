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
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#800000]/82 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 md:gap-x-12 md:gap-y-3 md:px-8 md:py-6 lg:gap-x-14"
        aria-label="Primary"
      >
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="text-[0.8rem] font-semibold tracking-[0.22em] text-[#E5E4E2]/92 transition-colors hover:text-white sm:text-[0.85rem] md:text-[0.95rem] md:tracking-[0.28em]"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
