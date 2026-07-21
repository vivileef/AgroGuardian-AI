import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) {
    return { userId: null as null, error: NextResponse.json({ detail: "No autorizado" }, { status: 401 }) };
  }
  return { userId, error: null };
}
