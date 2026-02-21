"use client";

import { useState } from "react";
import { PitchTimer } from "@/components/pitch-timer";
import { PitchList } from "@/components/pitch-list";
import { VdoDirector } from "@/components/vdo-director";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSceneUrl } from "@/lib/vdo-ninja";

export default function HostPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/host-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("Senha incorreta");
    }
    setLoading(false);
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Painel do Host</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verificando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const sceneUrl = getSceneUrl();

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel do Host</h1>
        </div>

        {/* Pitch list */}
        <PitchList />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Director */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">VDO.Ninja Director</h2>
            <VdoDirector />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PitchTimer />

            {/* Queue flow instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fluxo do Pitch</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1.5">
                  <li>No OBS, adicione sua <strong className="text-foreground">webcam como fonte separada</strong> (Video Capture Device)</li>
                  <li>Participante entra e fica na <strong className="text-foreground">fila (queue)</strong></li>
                  <li>No Director, clique <strong className="text-foreground">&quot;Activate Guest&quot;</strong> quando for a vez dele</li>
                  <li>O vídeo aparece no OBS automaticamente</li>
                  <li>Inicie o timer de 5 min</li>
                  <li>Quando acabar, remova o participante e ative o próximo</li>
                </ol>
              </CardContent>
            </Card>

            {/* OBS Scene URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Link para OBS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Adicione como Browser Source no OBS:
                </p>
                <code className="block rounded bg-muted p-2 text-xs break-all">
                  {sceneUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigator.clipboard.writeText(sceneUrl)}
                >
                  Copiar link
                </Button>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium">Como configurar:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>No OBS, adicione uma fonte &quot;Browser&quot;</li>
                    <li>Cole o link acima na URL</li>
                    <li>Largura: 1920, Altura: 1080</li>
                    <li>Marque &quot;Controlar áudio via OBS&quot;</li>
                    <li>Em Settings &gt; Advanced, teste ligar/desligar &quot;Browser Source Hardware Acceleration&quot;</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
