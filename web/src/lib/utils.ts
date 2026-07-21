import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function riskColor(level: string) {
  const n = level.toLowerCase();
  if (n.includes("critico") || n.includes("alto"))
    return "text-danger bg-danger/15 border-danger/40";
  if (n.includes("medio")) return "text-warn bg-warn/15 border-warn/40";
  return "text-mint bg-mint/15 border-mint/40";
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
