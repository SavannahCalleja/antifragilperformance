"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MMA_LEVEL_AMATEUR,
  MMA_LEVEL_COACH,
  MMA_LEVEL_PROFESSIONAL,
  upsertCompletedProfile,
} from "@antifragil/shared-api";
import { getSupabase } from "../lib/supabase";
import { useAuth } from "./auth-provider";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

type MmaChoice =
  | typeof MMA_LEVEL_PROFESSIONAL
  | typeof MMA_LEVEL_AMATEUR
  | typeof MMA_LEVEL_COACH;

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
  const router = useRouter();
  const { session, profile, refreshProfile, signOut } = useAuth();
  const userId = session?.user?.id;
  const metaName = session?.user?.user_metadata?.full_name;
  const initialName = typeof metaName === "string" ? metaName : "";

  const [step, setStep] = useState<"mma" | "profile">("mma");
  const [mmaChoice, setMmaChoice] = useState<MmaChoice | null>(null);
  const [fullName, setFullName] = useState(initialName.trim());
  const [gender, setGender] = useState<string>(GENDERS[0]);
  const [ageStr, setAgeStr] = useState("");
  const [weightStr, setWeightStr] = useState("");
  const [heightStr, setHeightStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCoach = mmaChoice === MMA_LEVEL_COACH;

  const pickMma = (level: MmaChoice) => {
    setError(null);
    setMmaChoice(level);
    setStep("profile");
  };

  const basicsValid = useMemo(() => {
    if (mmaChoice === null) return false;
    const age = parsePositiveInt(ageStr);
    const basics =
      fullName.trim().length > 0 && age !== null && age <= 120;
    if (!basics) return false;
    if (mmaChoice === MMA_LEVEL_COACH) return true;
    const w = parsePositiveFloat(weightStr);
    const h = parsePositiveFloat(heightStr);
    return w !== null && w < 2000 && h !== null && h < 120;
  }, [mmaChoice, fullName, ageStr, weightStr, heightStr]);

  const saveBio = async (e: FormEvent) => {
    e.preventDefault();
    if (!mmaChoice) {
      setError("Choose your role first.");
      setStep("mma");
      return;
    }
    if (!userId || saving) return;
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    const age = parsePositiveInt(ageStr);
    const weightLb = isCoach ? null : parsePositiveFloat(weightStr);
    const heightIn = isCoach ? null : parsePositiveFloat(heightStr);
    if (!fullName.trim() || age === null) {
      setError("Complete your name, gender, and age.");
      return;
    }
    if (!isCoach && (weightLb === null || heightIn === null)) {
      setError("Enter weight and height.");
      return;
    }

    setSaving(true);
    setError(null);
    const roleHint =
      profile?.role === "coach" || profile?.role === "athlete" ? profile.role : undefined;

    const { error: err } = await upsertCompletedProfile(supabase, userId, {
      full_name: fullName.trim(),
      gender,
      age,
      weight_lb: weightLb,
      height_in: heightIn,
      mma_level: mmaChoice,
      role: roleHint,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
    if (mmaChoice === MMA_LEVEL_COACH) {
      router.replace("/coach-dashboard");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#030303] text-[#E5E4E2]">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#FF69B4]">
            Command Center
          </p>
          {step === "mma" ? (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                Step 1
              </p>
              <h1 className="mb-2 font-sans text-2xl font-black uppercase tracking-wide text-white">
                Your role
              </h1>
              <p className="mb-8 text-sm text-white/55">
                Fighter tier or coach. Coaches skip weight and height. Finishing setup sets{" "}
                <span className="text-white/80">profile_setup_complete</span> and opens the right
                dashboard.
              </p>
              {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => pickMma(MMA_LEVEL_PROFESSIONAL)}
                  className="min-h-[132px] rounded border-[3px] border-white bg-white px-6 py-8 text-left transition-opacity"
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
                  onClick={() => pickMma(MMA_LEVEL_AMATEUR)}
                  className="min-h-[132px] rounded border-[3px] border-white bg-black px-6 py-8 text-left transition-opacity"
                >
                  <span className="block font-sans text-xl font-black uppercase tracking-widest text-white">
                    Amateur
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white/55">
                    Development · sanctioned amateur · skill building
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => pickMma(MMA_LEVEL_COACH)}
                  className="min-h-[132px] rounded border-[3px] border-[#FF69B4] bg-[#0a0508] px-6 py-8 text-left transition-opacity"
                >
                  <span className="block font-sans text-xl font-black uppercase tracking-widest text-[#FF69B4]">
                    Coach
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white/55">
                    Team dashboard · no fighter weight/height in the lab
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("mma");
                  setMmaChoice(null);
                  setError(null);
                }}
                className="mb-6 text-left text-sm font-semibold text-[#FF69B4] hover:underline"
              >
                ← Change role
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                Step 2
              </p>
              <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight">
                {isCoach ? "Coach profile" : "Your bio"}
              </h1>
              <p className="mb-8 text-sm text-[#E5E4E2]/65">
                {isCoach
                  ? "Name, gender, and age only. Saving unlocks the coach dashboard."
                  : "Name, gender, age, weight, and height. Saving unlocks the main app."}
              </p>
              <form onSubmit={(e) => void saveBio(e)} className="flex flex-col gap-5">
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
                {!isCoach ? (
                  <>
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
                  </>
                ) : null}
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                <button
                  type="submit"
                  disabled={!basicsValid || saving}
                  className="btn-join min-h-12 rounded-md text-sm font-semibold uppercase tracking-wide disabled:opacity-40"
                >
                  {saving
                    ? "Saving…"
                    : isCoach
                      ? "Save & open coach dashboard"
                      : "Save & enter Command Center"}
                </button>
              </form>
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
