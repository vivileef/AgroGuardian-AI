"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (!d.completed) router.replace("/onboarding");
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn, router]);

  return children;
}
