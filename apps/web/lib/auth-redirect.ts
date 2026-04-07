/**
 * Dynamic auth redirect base: localhost in dev, production origin on Vercel.
 * Use for Supabase `emailRedirectTo` (and OAuth `redirectTo` when you add it).
 */
export function getAuthRedirectTo(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin;
}

/** Unauthenticated dashboard visits → `/?login=1` opens the login overlay (see `WebAppGate`). */
export { loginRedirectPath } from "./dashboard-route";
