"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParticipantUrl } from "@/lib/vdo-ninja";

export function ParticipantForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    if (!fullName.trim()) return;
    window.location.href = getParticipantUrl(fullName);
  }

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Entrar na fila</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              placeholder="Seu nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Entrar na fila
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
