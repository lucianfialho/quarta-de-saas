import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          Toda quarta-feira
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          Quarta de SaaS
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          Pitches de 5 minutos ao vivo. Apresente seu SaaS, receba feedback da
          comunidade e conheça outros builders.
        </p>
        <Button asChild size="lg" className="text-base px-8">
          <Link href="/participar">Participar</Link>
        </Button>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Como funciona
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <Step
              number="1"
              title="Entre na fila"
              description="Acesse a página de participação, informe seu nome e entre na fila de espera."
            />
            <Step
              number="2"
              title="Aguarde sua vez"
              description="Você verá sua câmera em miniatura enquanto espera ser chamado pelo host."
            />
            <Step
              number="3"
              title="Faça seu pitch"
              description="Quando for sua vez, você terá 5 minutos para apresentar seu SaaS ao vivo."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        Quarta de SaaS
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
        {number}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
