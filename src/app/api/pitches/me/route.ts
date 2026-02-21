import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { pitches } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [pitch] = await db
    .select()
    .from(pitches)
    .where(eq(pitches.userId, session.user.id))
    .orderBy(desc(pitches.createdAt))
    .limit(1);

  return NextResponse.json(pitch ?? null);
}

export async function DELETE() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  await db.delete(pitches).where(eq(pitches.userId, session.user.id));

  return NextResponse.json({ ok: true });
}
