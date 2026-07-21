"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PwaRegister } from "@/components/pwa/PwaRegister";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: "#2d6a4f",
    colorBackground: "#f7faf7",
    colorText: "#122018",
    borderRadius: "0.75rem",
  },
  elements: {
    formButtonPrimary: "bg-leaf hover:bg-leaf-dark",
    card: "shadow-lg border border-forest/10",
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
