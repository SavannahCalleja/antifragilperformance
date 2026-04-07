"use client";

import { useAuth } from "./auth-provider";

type Props = {
  variant: "fighter" | "coach";
  className?: string;
};

/**
 * Header line from `profiles.full_name` (via auth context).
 */
export function DashboardGreeting({ variant, className }: Props) {
  const { profile } = useAuth();
  const raw = profile?.full_name?.trim();

  const text =
    variant === "coach"
      ? raw
        ? `Welcome back, Coach ${raw}`
        : "Welcome back, Coach"
      : raw
        ? `Welcome back, ${raw}`
        : "Welcome back, Fighter";

  return (
    <h1
      className={
        className ??
        "font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl"
      }
    >
      {text}
    </h1>
  );
}
