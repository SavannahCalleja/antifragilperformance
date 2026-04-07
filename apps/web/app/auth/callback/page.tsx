"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "../../../lib/supabase";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your session…");

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setMessage("Configuration error.");
        router.replace("/");
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          router.replace("/");
          return;
        }
      }

      await supabase.auth.getSession();
      router.replace("/");
    };

    void run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center text-[#E5E4E2]">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#FF69B4]">Antifragil</p>
      <p className="mt-4 text-sm text-[#E5E4E2]/80">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-[#FF69B4]">
          <p className="text-sm font-semibold uppercase tracking-widest">Loading…</p>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
