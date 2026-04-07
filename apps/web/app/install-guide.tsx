"use client";

import { useCallback, useEffect, useState } from "react";
import { SafariShareIcon } from "./safari-share-icon";

const STORAGE_KEY = "antifragil-install-guide-dismissed";

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPod|iPad/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

export function InstallGuide() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        if (!isIOS() || isStandaloneApp()) {
          setOpen(false);
          return;
        }
        if (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
          setOpen(false);
          return;
        }
        setOpen(true);
      } catch {
        setOpen(false);
      }
    });
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  if (open !== true) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6"
      role="dialog"
      aria-labelledby="install-guide-title"
      aria-modal="false"
    >
      <div className="pointer-events-auto relative mx-auto max-w-lg overflow-hidden rounded-t-2xl border border-[#FF69B4]/90 bg-[#0a0305]/55 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-[#E5E4E2]/70 transition-colors hover:bg-white/10 hover:text-[#E5E4E2]"
          aria-label="Dismiss install guide"
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>

        <div className="px-5 pb-6 pt-5 pr-12 sm:px-6 sm:pb-7 sm:pt-6">
          <h2
            id="install-guide-title"
            className="mb-5 font-sans text-xs font-bold uppercase leading-snug tracking-[0.14em] text-[#E5E4E2] sm:text-sm sm:tracking-[0.16em]"
          >
            Install Antifragil Performance
          </h2>

          <ol className="list-none space-y-4 pl-0 font-sans text-sm leading-relaxed text-[#E5E4E2]/88 sm:text-[0.95rem]">
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-[#E5E4E2]">1</span>
              <span className="flex flex-1 items-start gap-3">
                <SafariShareIcon className="mt-0.5 h-7 w-7 shrink-0 text-[#E5E4E2]" />
                <span>Tap the Share icon in your browser.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-[#E5E4E2]">2</span>
              <span>Scroll down and select &apos;Add to Home Screen&apos;.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
