"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STAGES = [
  { value: "idea", label: "Ideia" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Lançado" },
  { value: "traction", label: "Em tração" },
];

export function PitchRegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saasName, setSaasName] = useState("");
  const [url, setUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [stage, setStage] = useState("");

  const isValid = saasName.trim() && tagline.trim() && stage;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/pitches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        saasName: saasName.trim(),
        url: url.trim() || null,
        tagline: tagline.trim(),
        stage,
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar pitch");
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar seu Pitch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="saasName">Nome do SaaS</Label>
            <Input
              id="saasName"
              placeholder="Ex: MeuApp"
              value={saasName}
              onChange={(e) => setSaasName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL (opcional)</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://meuapp.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Elevator pitch</Label>
            <Textarea
              id="tagline"
              placeholder="Descreva seu SaaS em uma frase..."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Estágio</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger id="stage">
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={!isValid || loading}>
            {loading ? "Cadastrando..." : "Cadastrar pitch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
