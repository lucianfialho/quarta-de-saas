import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pitches, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
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
      userName: users.name,
      userImage: users.image,
    })
    .from(pitches)
    .leftJoin(users, eq(pitches.userId, users.id))
    .orderBy(desc(pitches.createdAt));

  return NextResponse.json(allPitches);
}
