import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { isDbMissingError } from "@/lib/server/demo-data";
import {
  createFarmFromOnboarding,
  getAdminClient,
  userHasFarm,
} from "@/lib/server/supabase-admin";
import type { OnboardingPayload } from "@/types/api";

async function markOnboardingComplete(userId: string, farmName: string) {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { onboardingComplete: true, farmName },
  });
}

export async function GET() {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (user.publicMetadata?.onboardingComplete) {
    return NextResponse.json({ completed: true, mode: "clerk-metadata" });
  }

  const cfg = getConfig();
  const db = getAdminClient(cfg);
  if (!db) {
    return NextResponse.json({ completed: false, mode: "demo" });
  }

  try {
    const completed = await userHasFarm(db, userId);
    return NextResponse.json({ completed, mode: "supabase" });
  } catch (e) {
    if (isDbMissingError(e)) {
      return NextResponse.json({ completed: false, mode: "demo-fallback", dbReady: false });
    }
    return NextResponse.json({ completed: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const body = (await req.json()) as OnboardingPayload;
  const cfg = getConfig();
  const db = getAdminClient(cfg);

  try {
    if (db) {
      await createFarmFromOnboarding(db, userId, body);
    }
    await markOnboardingComplete(userId, body.farmName);
    return NextResponse.json({ ok: true, mode: db ? "supabase" : "clerk-metadata" });
  } catch (e) {
    if (isDbMissingError(e)) {
      await markOnboardingComplete(userId, body.farmName);
      return NextResponse.json({
        ok: true,
        mode: "clerk-metadata",
        message: "Finca registrada. Ejecuta migraciones SQL en Supabase para persistencia completa.",
      });
    }
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
