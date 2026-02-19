import Link from "next/link";
import { ParticipantForm } from "@/components/participant-form";

export const metadata = {
  title: "Participar | Quarta de SaaS",
};

export default function ParticiparPage() {
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
        Preencha seu nome para entrar na fila. Quando for sua vez, o host vai te
        chamar ao vivo.
      </p>

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

      <ParticipantForm />
    </main>
  );
}
