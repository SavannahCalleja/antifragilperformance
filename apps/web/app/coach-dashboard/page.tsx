"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { profileNeedsSetup } from "@antifragil/shared-api";
import { useAuth } from "../auth-provider";

export default function CoachDashboardPage() {
  const router = useRouter();
  const { session, profile, initializing, signOut } = useAuth();

  useEffect(() => {
    if (initializing) return;
    if (!session) {
      router.replace("/");
      return;
    }
    if (!profile || profileNeedsSetup(profile)) {
      router.replace("/");
      return;
    }
    if (profile.role !== "coach") {
      router.replace("/");
    }
  }, [initializing, session, profile, router]);

  if (initializing || !session || !profile || profileNeedsSetup(profile) || profile.role !== "coach") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#030303] text-[#FF69B4]">
        <p className="text-sm font-semibold uppercase tracking-widest">Loading…</p>
      </div>
    );
  }

  const name = profile.full_name?.trim() || "Coach";

  return (
    <div className="min-h-dvh bg-[#030303] px-6 py-12 text-[#E5E4E2]">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
          Command Center
        </p>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Coach dashboard
        </h1>
        <p className="mt-3 text-sm text-[#E5E4E2]/65">
          Welcome, <span className="font-semibold text-[#E5E4E2]">{name}</span>. This is your team
          entry point on the web—roster and programming tools match what you use in the mobile app.
        </p>

        <div className="mt-10 rounded-xl border border-white/10 bg-black/30 p-8">
          <p className="text-sm leading-relaxed text-[#E5E4E2]/75">
            Ground zero: no legacy dashboards here. Use the Antifragil mobile app for full coach
            workflows until more web tools ship.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-[#FF69B4] underline-offset-2 hover:underline"
          >
            ← Marketing site
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-sm font-semibold text-[#E5E4E2]/55 hover:text-[#E5E4E2]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
