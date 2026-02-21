"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getParticipantUrl } from "@/lib/vdo-ninja";

function getFaviconUrl(siteUrl: string): string | null {
  try {
    const { hostname } = new URL(siteUrl);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

const STAGE_LABELS: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  launched: "Lançado",
  traction: "Em tração",
};

interface Pitch {
  id: string;
  saasName: string;
  url: string | null;
  tagline: string;
  stage: string;
}

interface ProjectListProps {
  pitches: Pitch[];
  userName: string;
}

export function ProjectList({ pitches, userName }: ProjectListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const nameParts = (userName ?? "").split(" ");
  const defaultFirst = nameParts[0] ?? "";
  const defaultLast = nameParts.slice(1).join(" ") || "";

  const [firstName, setFirstName] = useState(defaultFirst);
  const [lastName, setLastName] = useState(defaultLast);

  function handleToggle(pitchId: string) {
    if (expandedId === pitchId) {
      setExpandedId(null);
    } else {
      setExpandedId(pitchId);
      setFirstName(defaultFirst);
      setLastName(defaultLast);
    }
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) return;
    window.location.href = getParticipantUrl(fullName);
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      {pitches.map((pitch) => (
        <div
          key={pitch.id}
          className="rounded-2xl p-6 transition-all"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {pitch.url && getFaviconUrl(pitch.url) ? (
                <Image
                  src={getFaviconUrl(pitch.url)!}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded shrink-0"
                  unoptimized
                />
              ) : (
                <div
                  className="w-5 h-5 rounded shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: "rgba(201, 168, 76, 0.15)",
                    color: "#c9a84c",
                  }}
                >
                  {pitch.saasName.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-base font-semibold text-white/90 truncate">
                {pitch.saasName}
              </h3>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
              style={{
                backgroundColor: "rgba(201, 168, 76, 0.15)",
                color: "#c9a84c",
                border: "1px solid rgba(201, 168, 76, 0.3)",
              }}
            >
              {STAGE_LABELS[pitch.stage] ?? pitch.stage}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-white/50 mb-1">{pitch.tagline}</p>

          {/* URL */}
          {pitch.url && (
            <a
              href={pitch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-2"
            >
              {pitch.url}
            </a>
          )}

          {/* Join button or expanded form */}
          {expandedId === pitch.id ? (
            <form onSubmit={handleJoin} className="mt-5">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-xs text-white/40 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nome"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors text-sm"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/40 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sobrenome"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="px-4 py-2 rounded-full text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!firstName.trim() || !lastName.trim()}
                  className="flex-1 py-2 rounded-full font-medium text-sm transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor:
                      firstName.trim() && lastName.trim()
                        ? "#c9a84c"
                        : "rgba(201, 168, 76, 0.3)",
                    color: "#111",
                  }}
                >
                  Entrar
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 10L10 2M10 2H4M10 2V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => handleToggle(pitch.id)}
              className="mt-4 w-full py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: "rgba(201, 168, 76, 0.12)",
                color: "#c9a84c",
                border: "1px solid rgba(201, 168, 76, 0.25)",
              }}
            >
              Entrar na fila
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      ))}

      {/* New project button */}
      <button
        onClick={() => router.push("/onboarding")}
        className="w-full py-4 rounded-2xl text-sm text-white/30 hover:text-white/50 border border-dashed transition-colors cursor-pointer"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        + Cadastrar novo projeto
      </button>
    </div>
  );
}
