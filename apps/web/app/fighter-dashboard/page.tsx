"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { profileNeedsSetup } from "@antifragil/shared-api";
import { isCoachProfile, isFighterProfile, loginRedirectPath } from "../../lib/dashboard-route";
import { useAuth } from "../auth-provider";
import { DashboardGreeting } from "../dashboard-greeting";

export default function FighterDashboardPage() {
  const router = useRouter();
  const { session, profile, authReady, signOut } = useAuth();

  useEffect(() => {
    if (!authReady) return;
    if (!session) {
      router.replace(loginRedirectPath());
      return;
    }
    if (!profile || profileNeedsSetup(profile)) {
      router.replace("/");
      return;
    }
    if (isCoachProfile(profile)) {
      router.replace("/coach-dashboard");
      return;
    }
    if (!isFighterProfile(profile)) {
      router.replace("/");
    }
  }, [authReady, session, profile, router]);

  const blocked =
    !authReady ||
    !session ||
    !profile ||
    profileNeedsSetup(profile) ||
    !isFighterProfile(profile);

  if (blocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#030303] text-[#FF69B4]">
        <p className="text-sm font-semibold uppercase tracking-widest">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#030303] px-6 py-12 text-[#E5E4E2]">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
          Command Center
        </p>
        <DashboardGreeting variant="fighter" />

        <p className="mt-3 text-sm text-[#E5E4E2]/65">
          Your fighter dashboard on the web. Training assignments and streaks stay in sync with the
          mobile app.
        </p>

        <div className="mt-10 rounded-xl border border-white/10 bg-black/30 p-8">
          <p className="text-sm leading-relaxed text-[#E5E4E2]/75">
            Ground zero: use the Antifragil mobile app for today&apos;s session and consistency
            tracking until more web tools ship.
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
