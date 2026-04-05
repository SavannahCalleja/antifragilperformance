"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * True only when the site is running as an installed PWA (e.g. opened from the home screen).
 * False in normal Safari, Chrome, or any in-browser tab, including “Add to Tab Group” / mobile web.
 */
function isInstalledPwa(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function WelcomeScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isInstalledPwa()) return;
    setVisible(true);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const dismiss = useCallback(() => {
    document.documentElement.style.overflow = "";
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black px-6"
      role="dialog"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-subtitle"
      aria-modal="true"
    >
      <div className="hero-depth-bg absolute inset-0 opacity-90" aria-hidden />
      <div className="relative z-10 mx-auto max-w-lg text-center">
        <p
          id="welcome-title"
          className="font-sans text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Hello
        </p>
        <p
          id="welcome-subtitle"
          className="mt-6 font-sans text-base font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#E5E4E2] sm:text-lg md:text-xl"
        >
          Welcome to Antifragil Performance
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="btn-join mt-12 min-h-12 rounded-md px-10 text-sm font-semibold tracking-wide uppercase"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
