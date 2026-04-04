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
        className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-5 md:py-5"
        aria-label="Primary"
      >
        <ul className="m-0 grid w-full grid-cols-5 list-none gap-0 p-0">
          {links.map(({ href, label }, index) => (
            <li
              key={href}
              className={`min-w-0 ${index > 0 ? "border-l border-[#E5E4E2]/35" : ""}`}
            >
              <a
                href={href}
                className="flex min-h-[3rem] w-full items-center justify-center px-2 py-3 text-center text-[0.58rem] font-medium uppercase leading-tight tracking-widest text-[#E5E4E2] transition-[background-color,color] duration-200 sm:min-h-[3.25rem] sm:px-3 sm:text-[0.65rem] md:min-h-0 md:px-4 md:py-4 md:text-xs hover:bg-[#5c000e]/55 hover:text-[#E5E4E2]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
