"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { profileNeedsSetup } from "@antifragil/shared-api";
import { AuthOverlay, type AuthOverlayMode } from "./auth-overlay";
import { MarketingLanding } from "./marketing-landing";
import { useAuth } from "./auth-provider";
import { WebOnboarding } from "./web-onboarding";

export function WebAppGate() {
  const router = useRouter();
  const { session, profile, initializing, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState<AuthOverlayMode | null>(null);

  useEffect(() => {
    if (!session) return;
    queueMicrotask(() => setAuthOpen(null));
  }, [session]);

  /** Coaches with a completed profile use /coach-dashboard instead of the public home shell. */
  useEffect(() => {
    if (initializing) return;
    if (!session || !profile || profileNeedsSetup(profile)) return;
    if (profile.role === "coach") {
      router.replace("/coach-dashboard");
    }
  }, [initializing, session, profile, router]);

  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black text-[#FF69B4]">
        <p className="text-sm font-semibold uppercase tracking-widest">Loading…</p>
      </div>
    );
  }

  if (session && profileNeedsSetup(profile)) {
    return <WebOnboarding />;
  }

  if (session && profile) {
    const r = profile.role;
    if (r !== "coach" && r !== "athlete") {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-[#030303] px-6 text-center text-[#E5E4E2]">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
            Command Center
          </p>
          <h1 className="mb-4 max-w-md font-sans text-lg font-bold tracking-wide">
            Profile role not set
          </h1>
          <p className="mb-8 max-w-md text-sm text-[#E5E4E2]/70">
            Your account needs role <span className="text-[#E5E4E2]">coach</span> or{" "}
            <span className="text-[#E5E4E2]">athlete</span> in the database. Ask your admin, then sign
            in again.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="btn-join min-h-12 rounded-md px-10 text-sm font-semibold uppercase tracking-wide"
          >
            Sign out
          </button>
        </div>
      );
    }
  }

  const signedIn = Boolean(session);

  return (
    <>
      <MarketingLanding
        signedIn={signedIn}
        userEmail={session?.user?.email ?? null}
        onLogin={() => setAuthOpen("login")}
        onSignup={() => setAuthOpen("signup")}
        onSignOut={() => void signOut()}
      />
      {authOpen ? (
        <AuthOverlay
          mode={authOpen}
          onClose={() => setAuthOpen(null)}
          onSwitchMode={(m) => setAuthOpen(m)}
        />
      ) : null}
    </>
  );
}
