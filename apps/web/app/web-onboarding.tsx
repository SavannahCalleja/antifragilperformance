"use client";

import { FormEvent, useState } from "react";
import {
  MMA_LEVEL_AMATEUR,
  MMA_LEVEL_PROFESSIONAL,
  upsertCompletedProfile,
} from "@antifragil/shared-api";
import { getSupabase } from "../lib/supabase";
import { useAuth } from "./auth-provider";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

function parsePositiveInt(raw: string): number | null {
  const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parsePositiveFloat(raw: string): number | null {
  const n = parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function WebOnboarding() {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const userId = session?.user?.id;
  const metaName = session?.user?.user_metadata?.full_name;
  const initialName = typeof metaName === "string" ? metaName : "";

  const [step, setStep] = useState<"profile" | "mma">("profile");
  const [fullName, setFullName] = useState(initialName.trim());
  const [gender, setGender] = useState<string>(GENDERS[0]);
  const [ageStr, setAgeStr] = useState("");
  const [weightStr, setWeightStr] = useState("");
  const [heightStr, setHeightStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basicsValid =
    fullName.trim().length > 0 &&
    (() => {
      const age = parsePositiveInt(ageStr);
      const w = parsePositiveFloat(weightStr);
      const h = parsePositiveFloat(heightStr);
      return (
        age !== null &&
        age <= 120 &&
        w !== null &&
        w < 2000 &&
        h !== null &&
        h < 120
      );
    })();

  const goMma = (e: FormEvent) => {
    e.preventDefault();
    if (!basicsValid) return;
    setError(null);
    setStep("mma");
  };

  const saveMma = async (mma_level: typeof MMA_LEVEL_PROFESSIONAL | typeof MMA_LEVEL_AMATEUR) => {
    if (!userId || saving) return;
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    const age = parsePositiveInt(ageStr);
    const weightLb = parsePositiveFloat(weightStr);
    const heightIn = parsePositiveFloat(heightStr);
    if (!fullName.trim() || age === null || weightLb === null || heightIn === null) {
      setError("Complete all profile fields.");
      return;
    }

    setSaving(true);
    setError(null);
    const role =
      profile?.role === "coach" || profile?.role === "athlete" ? profile.role : "athlete";

    const { error: err } = await upsertCompletedProfile(supabase, userId, {
      full_name: fullName.trim(),
      gender,
      age,
      weight_lb: weightLb,
      height_in: heightIn,
      mma_level,
      role,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#030303] text-[#E5E4E2]">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
            Command Center
          </p>
          {step === "profile" ? (
            <>
              <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight">
                Build your fighter profile
              </h1>
              <p className="mb-8 text-sm text-[#E5E4E2]/65">
                Name, gender, age, weight, and height sync to your account.
              </p>
              <form onSubmit={goMma} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="wo-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#FF69B4]">
                    Name
                  </label>
                  <input
                    id="wo-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-[#E5E4E2] focus:border-[#FF69B4]/55 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/25"
                  />
                </div>
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#FF69B4]">
                    Gender
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                          gender === g
                            ? "border-[#FF69B4] bg-[#1a0a12] text-[#E5E4E2]"
                            : "border-white/15 bg-black/40 text-[#E5E4E2]/75"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="wo-age" className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#FF69B4]">
                    Age
                  </label>
                  <input
                    id="wo-age"
                    inputMode="numeric"
                    value={ageStr}
                    onChange={(e) => setAgeStr(e.target.value)}
                    placeholder="Years"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-[#E5E4E2] focus:border-[#FF69B4]/55 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/25"
                  />
                </div>
                <div>
                  <label htmlFor="wo-w" className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#FF69B4]">
                    Weight (lb)
                  </label>
                  <input
                    id="wo-w"
                    inputMode="decimal"
                    value={weightStr}
                    onChange={(e) => setWeightStr(e.target.value)}
                    placeholder="Pounds"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-[#E5E4E2] focus:border-[#FF69B4]/55 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/25"
                  />
                </div>
                <div>
                  <label htmlFor="wo-h" className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#FF69B4]">
                    Height (in)
                  </label>
                  <input
                    id="wo-h"
                    inputMode="decimal"
                    value={heightStr}
                    onChange={(e) => setHeightStr(e.target.value)}
                    placeholder="Total inches"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-[#E5E4E2] focus:border-[#FF69B4]/55 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/25"
                  />
                </div>
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                <button
                  type="submit"
                  disabled={!basicsValid}
                  className="btn-join min-h-12 rounded-md text-sm font-semibold uppercase tracking-wide disabled:opacity-40"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="mb-2 font-sans text-2xl font-black uppercase tracking-wide text-white">
                MMA level
              </h1>
              <p className="mb-8 text-sm text-white/55">
                Choose one. Values are saved in lowercase to match your database constraint.
              </p>
              {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveMma(MMA_LEVEL_PROFESSIONAL)}
                  className="min-h-[140px] rounded border-[3px] border-white bg-white px-6 py-8 text-left transition-opacity disabled:opacity-60"
                >
                  <span className="block font-sans text-xl font-black uppercase tracking-widest text-black">
                    Professional
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-black/55">
                    Paid bouts · pro ruleset · full contact career
                  </span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveMma(MMA_LEVEL_AMATEUR)}
                  className="min-h-[140px] rounded border-[3px] border-white bg-black px-6 py-8 text-left transition-opacity disabled:opacity-60"
                >
                  <span className="block font-sans text-xl font-black uppercase tracking-widest text-white">
                    Amateur
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white/55">
                    Development · sanctioned amateur · skill building
                  </span>
                </button>
              </div>
              {saving ? (
                <p className="mt-6 text-center text-sm text-[#E5E4E2]/60">Saving…</p>
              ) : null}
            </>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="mx-auto mt-10 block text-sm font-semibold text-[#E5E4E2]/50 hover:text-[#E5E4E2]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
