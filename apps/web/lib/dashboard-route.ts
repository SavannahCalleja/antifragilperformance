import type { ProfileRow } from "@antifragil/shared-api";
import { profileNeedsSetup } from "@antifragil/shared-api";

export type DashboardHref = "/coach-dashboard" | "/fighter-dashboard";

/** Query param that opens the login overlay on `/`. */
export const LOGIN_QUERY = "login=1" as const;

export function loginRedirectPath(): string {
  return `/?${LOGIN_QUERY}`;
}

/**
 * Route completed profiles by `mma_level` first, then `role`.
 * - coach → coach dashboard
 * - professional | amateur → fighter dashboard
 */
export function resolveDashboardHref(profile: ProfileRow | null): DashboardHref | null {
  if (!profile || profileNeedsSetup(profile)) return null;
  const m = (profile.mma_level ?? "").toString().trim().toLowerCase();
  if (m === "coach") return "/coach-dashboard";
  if (m === "professional" || m === "amateur") return "/fighter-dashboard";
  if (profile.role === "coach") return "/coach-dashboard";
  if (profile.role === "athlete") return "/fighter-dashboard";
  return null;
}

export function isCoachProfile(profile: ProfileRow | null): boolean {
  if (!profile) return false;
  const m = (profile.mma_level ?? "").toString().trim().toLowerCase();
  return m === "coach" || profile.role === "coach";
}

export function isFighterProfile(profile: ProfileRow | null): boolean {
  if (!profile || profileNeedsSetup(profile)) return false;
  if (isCoachProfile(profile)) return false;
  const m = (profile.mma_level ?? "").toString().trim().toLowerCase();
  return m === "professional" || m === "amateur" || profile.role === "athlete";
}
