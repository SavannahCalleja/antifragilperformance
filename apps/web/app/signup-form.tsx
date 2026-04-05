"use client";

import { FormEvent } from "react";

export function SignupForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-14 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        className="min-h-12 flex-1 rounded-md border border-white/15 bg-black/20 px-4 text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 backdrop-blur-sm transition-[border-color,box-shadow] focus:border-[#FF69B4]/60 focus:outline-none focus:ring-2 focus:ring-[#FF69B4]/30"
      />
      <button type="submit" className="btn-join min-h-12 shrink-0 rounded-md px-8 text-sm font-semibold tracking-wide uppercase">
        Join the System
      </button>
    </form>
  );
}
