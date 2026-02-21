import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { pitches } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { saasName, url, tagline, stage } = body;

  if (!saasName || !tagline || !stage) {
    return NextResponse.json(
      { error: "Campos obrigatórios: saasName, tagline, stage" },
      { status: 400 }
    );
  }

  const validStages = ["idea", "mvp", "launched", "traction"];
  if (!validStages.includes(stage)) {
    return NextResponse.json({ error: "Stage inválido" }, { status: 400 });
  }

  const [pitch] = await db
    .insert(pitches)
    .values({
      userId: session.user.id,
      saasName,
      url: url || null,
      tagline,
      stage,
    })
    .returning();

  return NextResponse.json(pitch, { status: 201 });
}

export async function GET() {
  const allPitches = await db
    .select({
      id: pitches.id,
      saasName: pitches.saasName,
      url: pitches.url,
      tagline: pitches.tagline,
      stage: pitches.stage,
      createdAt: pitches.createdAt,
      userId: pitches.userId,
    })
    .from(pitches)
    .orderBy(desc(pitches.createdAt));

  return NextResponse.json(allPitches);
}
