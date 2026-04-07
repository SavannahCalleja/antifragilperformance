"use client";

import { FormEvent, useState } from "react";
import { getAuthRedirectTo } from "../lib/auth-redirect";
import { getSupabase } from "../lib/supabase";

export type AuthOverlayMode = "login" | "signup";

type Props = {
  mode: AuthOverlayMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthOverlayMode) => void;
};

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function AuthOverlay({ mode, onClose, onSwitchMode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY).");
      return;
    }

    if (!emailValid(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        // Password sign-in returns a session here; Supabase does not accept `redirectTo` on this call.
        // Dynamic `window.location.origin` is used on sign-up via `emailRedirectTo` for confirmation links.
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) {
          setError(err.message);
          return;
        }
        onClose();
      } else {
        if (!fullName.trim()) {
          setError("Enter your name.");
          return;
        }
        const redirectTo = getAuthRedirectTo();
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectTo || undefined,
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (err) {
          setError(err.message);
          return;
        }
        setSignupMessage("Check your email to confirm your account, then sign in.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-overlay-title"
    >
      <div className="hero-depth-bg absolute inset-0 opacity-95" aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-black/60 p-8 shadow-[0_0_60px_rgba(255,105,180,0.12)]">
        <p
          id="auth-overlay-title"
          className="mb-1 text-center font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]"
        >
          Antifragil Performance
        </p>
        <h2 className="mb-6 text-center font-sans text-xl font-bold tracking-[0.15em] text-[#E5E4E2]">
          {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {mode === "signup" ? (
            <>
              <label className="sr-only" htmlFor="auth-name">
                Name
              </label>
              <input
                id="auth-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="min-h-12 rounded-md border border-white/15 bg-black/40 px-4 text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 focus:border-[#FF69B4]/60 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/30"
              />
            </>
          ) : null}

          <label className="sr-only" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-12 rounded-md border border-white/15 bg-black/40 px-4 text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 focus:border-[#FF69B4]/60 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/30"
          />

          <label className="sr-only" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            className="min-h-12 rounded-md border border-white/15 bg-black/40 px-4 text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 focus:border-[#FF69B4]/60 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/30"
          />

          {error ? (
            <p className="text-center text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {signupMessage ? (
            <p className="text-center text-sm text-[#4ade80]" role="status">
              {signupMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-join mt-2 min-h-12 rounded-md text-sm font-semibold uppercase tracking-wide disabled:opacity-50"
          >
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setSignupMessage(null);
              onSwitchMode(mode === "login" ? "signup" : "login");
            }}
            className="font-semibold text-[#FF69B4] underline-offset-2 hover:underline"
          >
            {mode === "login" ? "Need an account? Create one" : "Already have an account? Login"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[#E5E4E2]/60 hover:text-[#E5E4E2]"
          >
            Back to site
          </button>
        </div>
      </div>
    </div>
  );
}
