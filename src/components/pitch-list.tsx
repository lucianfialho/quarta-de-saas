"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Pitch {
  id: string;
  saasName: string;
  url: string | null;
  tagline: string;
  stage: string;
  createdAt: string;
  userName: string | null;
  userImage: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  launched: "Lançado",
  traction: "Em tração",
};

const STAGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  idea: "outline",
  mvp: "secondary",
  launched: "default",
  traction: "default",
};

export function PitchList() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPitches = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/pitches");
    if (res.ok) {
      setPitches(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPitches();
  }, [fetchPitches]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Pitches Cadastrados</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPitches}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </CardHeader>
      <CardContent>
        {pitches.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">
            Nenhum pitch cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>SaaS</TableHead>
                  <TableHead>Elevator pitch</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pitches.map((pitch) => (
                  <TableRow key={pitch.id}>
                    <TableCell className="font-medium">
                      {pitch.userName ?? "—"}
                    </TableCell>
                    <TableCell>{pitch.saasName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {pitch.tagline}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STAGE_VARIANTS[pitch.stage] ?? "outline"}>
                        {STAGE_LABELS[pitch.stage] ?? pitch.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pitch.url ? (
                        <a
                          href={pitch.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 underline"
                        >
                          Visitar
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
