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

type AuthContextValue = {
  session: Session | null;
  profile: ProfileRow | null;
  initializing: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [initializing, setInitializing] = useState(true);

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
      setInitializing(false);
      return;
    }

    /** False after this effect cleans up (incl. React Strict Mode remount). Avoids stuck loading. */
    let active = true;

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
        console.error("[AuthProvider] Initial session load failed", err);
        if (active) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (active) setInitializing(false);
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
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  /** After email verification in another tab, coming back re-fetches session + profile. */
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
    () => ({ session, profile, initializing, refreshProfile, signOut }),
    [session, profile, initializing, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
