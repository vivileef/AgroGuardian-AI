"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PwaRegister } from "@/components/pwa/PwaRegister";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: "#b6ff00",
    colorBackground: "#0a1220",
    colorText: "#e8f0ff",
    colorInputBackground: "#101c30",
    colorInputText: "#e8f0ff",
    borderRadius: "0.75rem",
  },
  elements: {
    formButtonPrimary: "bg-[#b6ff00] text-[#05080f] hover:bg-[#8fcc00]",
    card: "shadow-lg border border-white/10 bg-[#101c30]",
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  const tree = (
    <QueryClientProvider client={client}>
      {children}
      <PwaRegister />
    </QueryClientProvider>
  );

  if (!clerkKey) return tree;

  return (
    <ClerkProvider publishableKey={clerkKey} appearance={clerkAppearance} afterSignOutUrl="/">
      {tree}
    </ClerkProvider>
  );
}
