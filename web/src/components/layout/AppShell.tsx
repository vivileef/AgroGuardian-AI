"use client";

import { MobileNav, Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { OnboardingGuard } from "@/components/layout/OnboardingGuard";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard>
      <div className="app-shell flex min-h-dvh bg-app text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-3 py-4 sm:px-4 lg:px-5 pb-28 lg:pb-6">{children}</main>
          <MobileNav />
        </div>
      </div>
    </OnboardingGuard>
  );
}
