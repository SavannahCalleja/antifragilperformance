"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { fetchProfile, type ProfileRow } from "@antifragil/shared-api";
import { getSupabase } from "../lib/supabase";

const BOOTSTRAP_TIMEOUT_MS = 18_000;

type AuthContextValue = {
  session: Session | null;
  profile: ProfileRow | null;
  /** True after the first Supabase session (+ profile when signed in) bootstrap finishes or times out. */
  authReady: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      setProfile(null);
      return;
    }
    const { data } = await fetchProfile(supabase, userId);
    setProfile(data);
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    const forceTimer =
      typeof window !== "undefined"
        ? window.setTimeout(() => {
            if (!active) return;
            console.warn(
              "[AuthProvider] Bootstrap exceeded timeout; releasing UI. Check Supabase env and network.",
            );
            setAuthReady(true);
          }, BOOTSTRAP_TIMEOUT_MS)
        : undefined;

    void (async () => {
      try {
        const {
          data: { session: s },
        } = await supabase.auth.getSession();
        if (!active) return;
        setSession(s);
        if (s?.user?.id) {
          await loadProfile(s.user.id);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("[AuthProvider] Bootstrap failed", err);
        if (active) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (typeof forceTimer !== "undefined") window.clearTimeout(forceTimer);
        if (active) setAuthReady(true);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user?.id) {
        await loadProfile(s.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      if (typeof forceTimer !== "undefined") window.clearTimeout(forceTimer);
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || typeof document === "undefined") return;

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      queueMicrotask(() => {
        void (async () => {
          const {
            data: { session: s },
          } = await supabase.auth.getSession();
          setSession(s);
          if (s?.user?.id) await loadProfile(s.user.id);
          else setProfile(null);
        })();
      });
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadProfile]);

  /** Always reads the current Supabase session — avoids a stale React `session` after slow init or timeouts. */
  const refreshProfile = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const {
      data: { session: s },
    } = await supabase.auth.getSession();
    const uid = s?.user?.id;
    if (!uid) return;
    await loadProfile(uid);
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, profile, authReady, refreshProfile, signOut }),
    [session, profile, authReady, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
