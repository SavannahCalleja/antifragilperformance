"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { profileNeedsSetup } from "@antifragil/shared-api";
import { resolveDashboardHref } from "../lib/dashboard-route";
import { AuthOverlay, type AuthOverlayMode } from "./auth-overlay";
import { MarketingLanding } from "./marketing-landing";
import { useAuth } from "./auth-provider";
import { WebOnboarding } from "./web-onboarding";

export function WebAppGate() {
  const router = useRouter();
  const { session, profile, authReady, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState<AuthOverlayMode | null>(null);

  const dashboardHref = useMemo(() => {
    if (!authReady || !session) return null;
    return resolveDashboardHref(profile);
  }, [authReady, session, profile]);

  useLayoutEffect(() => {
    if (!dashboardHref) return;
    router.replace(dashboardHref);
  }, [dashboardHref, router]);

  useEffect(() => {
    if (!session) return;
    queueMicrotask(() => setAuthOpen(null));
  }, [session]);

  /** `/?login=1` opens the login overlay (dashboard auth guard redirect). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("login") !== "1") return;
    queueMicrotask(() => setAuthOpen("login"));
    url.searchParams.delete("login");
    const qs = url.searchParams.toString();
    const path = qs ? `${url.pathname}?${qs}` : url.pathname;
    window.history.replaceState({}, "", path || "/");
  }, []);

  /**
   * Public shell: always show the marketing landing with Login / Create Account until we know
   * the user is signed in *and* auth has finished bootstrapping. No blocking “loading profile” layer.
   */
  if (!authReady || !session) {
    return (
      <>
        <MarketingLanding
          signedIn={false}
          userEmail={null}
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

  if (profileNeedsSetup(profile)) {
    return <WebOnboarding />;
  }

  if (profile && !resolveDashboardHref(profile)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#030303] px-6 text-center text-[#E5E4E2]">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
          Command Center
        </p>
        <h1 className="mb-4 max-w-md font-sans text-lg font-bold tracking-wide">Can’t open dashboard</h1>
        <p className="mb-8 max-w-md text-sm text-[#E5E4E2]/70">
          Your profile is complete, but the app couldn’t determine fighter vs coach routing. Check{" "}
          <span className="text-[#E5E4E2]">role</span> and <span className="text-[#E5E4E2]">mma_level</span>{" "}
          in Supabase.
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

  if (dashboardHref) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#030303] text-[#FF69B4]">
        <p className="text-sm font-semibold uppercase tracking-widest">Opening dashboard…</p>
      </div>
    );
  }

  return null;
}
