import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pitches } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ParticipantForm } from "@/components/participant-form";
import { PitchRegistrationForm } from "@/components/pitch-registration-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Participar | Quarta de SaaS",
};

const STAGE_LABELS: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  launched: "Lançado",
  traction: "Em tração",
};

export default async function ParticiparPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [userPitch] = await db
    .select()
    .from(pitches)
    .where(eq(pitches.userId, session.user.id))
    .orderBy(desc(pitches.createdAt))
    .limit(1);

  const defaultName = session.user.name ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        &larr; Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-2">Participar</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        {userPitch
          ? "Seu pitch está cadastrado! Quando estiver pronto, entre na fila."
          : "Cadastre seu SaaS antes de entrar na fila."}
      </p>

      {userPitch ? (
        <>
          {/* Pitch summary */}
          <Card className="w-full max-w-md mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {userPitch.saasName}
                <Badge variant="secondary">
                  {STAGE_LABELS[userPitch.stage] ?? userPitch.stage}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {userPitch.tagline}
              </p>
              {userPitch.url && (
                <a
                  href={userPitch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 underline"
                >
                  {userPitch.url}
                </a>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="mb-8 max-w-md w-full space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Antes de entrar:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use fones de ouvido para evitar eco</li>
              <li>Se estiver no celular, use na horizontal</li>
              <li>Fique em um ambiente silencioso</li>
              <li>Tenha sua apresentação pronta (5 minutos)</li>
            </ul>
          </div>

          <ParticipantForm
            defaultName={defaultName}
            pitch={{
              saasName: userPitch.saasName,
              tagline: userPitch.tagline,
            }}
          />
        </>
      ) : (
        <PitchRegistrationForm />
      )}
    </main>
  );
}
