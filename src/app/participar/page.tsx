import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { pitches } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProjectList } from "@/components/project-list";

export const metadata = {
  title: "Participar | Quarta de SaaS",
};

export default async function ParticiparPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const userPitches = await db
    .select()
    .from(pitches)
    .where(eq(pitches.userId, session.user.id))
    .orderBy(desc(pitches.createdAt));

  const userName = session.user.name ?? "";

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle golden ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(200, 165, 70, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 w-full max-w-lg mb-10">
        <Link
          href="/"
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Voltar
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-lg mb-8">
        <h1 className="text-2xl font-bold text-white/90">Seus projetos</h1>
        <p className="text-sm text-white/40 mt-1">
          Gerencie seus SaaS e entre na fila quando estiver pronto.
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">
        {userPitches.length > 0 ? (
          <ProjectList pitches={userPitches} userName={userName} />
        ) : (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-white/50 mb-1">Nenhum projeto ainda</p>
            <p className="text-sm text-white/30 mb-6">
              Cadastre seu SaaS para participar do Quarta de SaaS.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-colors"
              style={{
                backgroundColor: "#c9a84c",
                color: "#111",
              }}
            >
              Cadastrar projeto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
