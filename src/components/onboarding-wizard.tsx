"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const FLOORS = ["T", "1F", "2F", "3F", "4F"] as const;

const STAGES = [
  { value: "idea", label: "Ideia" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Lançado" },
  { value: "traction", label: "Em tração" },
];

const STAGE_LABELS: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  launched: "Lançado",
  traction: "Em tração",
};

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [formData, setFormData] = useState({
    saasName: "",
    url: "",
    tagline: "",
    stage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedPitch, setSavedPitch] = useState<typeof formData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playDing() {
    if (!audioRef.current) {
      audioRef.current = new Audio("/elevator-ding.mp3");
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function goNext() {
    playDing();
    setDirection("up");
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setDirection("down");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function savePitchAndAdvance() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/pitches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        saasName: formData.saasName.trim(),
        url: formData.url.trim() || null,
        tagline: formData.tagline.trim(),
        stage: formData.stage,
      }),
    });

    if (res.ok) {
      setSavedPitch({ ...formData });
      playDing();
      setDirection("up");
      setStep(3);
    } else {
      try {
        const data = await res.json();
        setError(data.error || "Erro ao cadastrar pitch");
      } catch {
        setError("Erro ao cadastrar pitch");
      }
    }
    setLoading(false);
  }

  function handleViewProjects() {
    router.push("/participar");
  }

  const currentFloor = FLOORS[step];

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle golden ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(200, 165, 70, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floor indicator badge */}
      <div className="relative z-10 mb-6">
        <div
          className="px-5 py-2 rounded-lg text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,28,22,0.9), rgba(20,18,14,0.95))",
            boxShadow:
              "0 0 20px rgba(180, 140, 60, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="text-lg font-mono tracking-widest font-bold"
            style={{
              color: "#c9a84c",
              textShadow: "0 0 12px rgba(180, 140, 60, 0.8)",
            }}
          >
            {currentFloor}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center gap-3 mb-8">
        {FLOORS.map((floor, i) => (
          <div key={floor} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={
                i < step
                  ? { backgroundColor: "#c9a84c" }
                  : i === step
                    ? {
                        backgroundColor: "transparent",
                        border: "2px solid #c9a84c",
                        boxShadow: "0 0 8px rgba(201, 168, 76, 0.4)",
                      }
                    : {
                        backgroundColor: "transparent",
                        border: "2px solid rgba(255,255,255,0.15)",
                      }
              }
            />
            {i < FLOORS.length - 1 && (
              <div
                className="w-6 h-[1px] transition-all duration-300"
                style={{
                  backgroundColor:
                    i < step
                      ? "rgba(201, 168, 76, 0.4)"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl p-8 sm:p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Step content with slide animation */}
        <div
          key={step}
          className="animate-slide-up"
          style={{
            animation:
              direction === "up"
                ? "slideUp 300ms ease-out"
                : "slideDown 300ms ease-out",
          }}
        >
          {step === 0 && <StepWelcome onNext={goNext} />}
          {step === 1 && (
            <StepSaaS
              formData={formData}
              setFormData={setFormData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <StepPitch
              formData={formData}
              setFormData={setFormData}
              onNext={savePitchAndAdvance}
              onBack={goBack}
              loading={loading}
              error={error}
            />
          )}
          {step === 3 && <StepPrep onNext={goNext} onBack={goBack} />}
          {step === 4 && (
            <StepReady
              pitch={savedPitch || formData}
              userName={userName}
              onViewProjects={handleViewProjects}
              onBack={goBack}
            />
          )}
        </div>
      </div>

      {/* Inline keyframes */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Step 0: Welcome ─── */

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <span
          className="text-4xl sm:text-5xl font-bold italic leading-[0.95] tracking-tight"
        >
          Bem-vindo ao
          <br />
          <span style={{ color: "#c9a84c" }}>Quarta de SaaS</span>
        </span>
      </div>
      <div className="w-8 h-[2px] mx-auto my-6" style={{ backgroundColor: "rgba(201, 168, 76, 0.3)" }} />
      <p className="text-white/60 leading-relaxed mb-2">
        Toda quarta-feira, builders apresentam seus SaaS ao vivo.
      </p>
      <p className="text-white/60 leading-relaxed mb-8">
        <strong className="text-white/80">5 minutos de pitch</strong> + feedback
        da comunidade. Simples assim.
      </p>
      <p className="text-white/30 text-sm mb-8">
        Vamos preparar tudo em poucos passos.
      </p>
      <button
        onClick={onNext}
        className="w-full py-3 rounded-full font-medium text-sm transition-colors cursor-pointer"
        style={{
          backgroundColor: "#c9a84c",
          color: "#111",
        }}
      >
        Começar
      </button>
    </div>
  );
}

/* ─── Step 1: SaaS Info ─── */

function StepSaaS({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: { saasName: string; url: string };
  setFormData: (fn: (prev: typeof formData & { tagline: string; stage: string }) => typeof formData & { tagline: string; stage: string }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canAdvance = formData.saasName.trim().length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Seu SaaS</h2>
      <p className="text-white/40 text-sm mb-6">Conta pra gente o que você está construindo.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            Nome do SaaS <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: MeuApp"
            value={formData.saasName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, saasName: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            URL <span className="text-white/30">(opcional)</span>
          </label>
          <input
            type="url"
            placeholder="https://meuapp.com"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-full text-sm text-white/40 hover:text-white/60 transition-colors cursor-pointer"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="flex-1 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canAdvance ? "#c9a84c" : "rgba(201, 168, 76, 0.3)",
            color: "#111",
          }}
        >
          Próximo andar ↑
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: Elevator Pitch ─── */

function StepPitch({
  formData,
  setFormData,
  onNext,
  onBack,
  loading,
  error,
}: {
  formData: { tagline: string; stage: string; saasName: string; url: string };
  setFormData: (fn: (prev: typeof formData) => typeof formData) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}) {
  const canAdvance =
    formData.tagline.trim().length > 0 && formData.stage.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Elevator Pitch</h2>
      <p className="text-white/40 text-sm mb-6">
        Como você descreveria seu SaaS em uma frase?
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            Descrição / Tagline <span className="text-red-400">*</span>
          </label>
          <textarea
            placeholder="Descreva seu SaaS em uma frase..."
            value={formData.tagline}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tagline: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            Estágio <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, stage: s.value }))
                }
                className="px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                style={
                  formData.stage === s.value
                    ? {
                        backgroundColor: "rgba(201, 168, 76, 0.15)",
                        border: "1px solid rgba(201, 168, 76, 0.4)",
                        color: "#c9a84c",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                      }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-full text-sm text-white/40 hover:text-white/60 transition-colors cursor-pointer"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance || loading}
          className="flex-1 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor:
              canAdvance && !loading
                ? "#c9a84c"
                : "rgba(201, 168, 76, 0.3)",
            color: "#111",
          }}
        >
          {loading ? "Salvando..." : "Próximo andar ↑"}
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Preparation ─── */

function StepPrep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const checks = [
    { icon: "🎧", text: "Fones de ouvido para evitar eco" },
    { icon: "🤫", text: "Ambiente silencioso" },
    { icon: "📱", text: "Celular na horizontal (se mobile)" },
    { icon: "📊", text: "Apresentação pronta (5 minutos)" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Preparação</h2>
      <p className="text-white/40 text-sm mb-6">
        Confira antes de entrar ao vivo.
      </p>

      <div className="space-y-3">
        {checks.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm text-white/70">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-full text-sm text-white/40 hover:text-white/60 transition-colors cursor-pointer"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer"
          style={{
            backgroundColor: "#c9a84c",
            color: "#111",
          }}
        >
          Próximo andar ↑
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Ready ─── */

function StepReady({
  pitch,
  userName,
  onViewProjects,
  onBack,
}: {
  pitch: { saasName: string; url: string; tagline: string; stage: string };
  userName: string;
  onViewProjects: () => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <span
          className="text-3xl sm:text-4xl font-bold italic leading-tight"
        >
          Projeto
          <br />
          <span style={{ color: "#c9a84c" }}>cadastrado!</span>
        </span>
      </div>

      <div className="w-8 h-[2px] mx-auto my-6" style={{ backgroundColor: "rgba(201, 168, 76, 0.3)" }} />

      {/* Pitch summary */}
      <div
        className="text-left rounded-lg p-4 mb-6 space-y-2"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white/90">
            {pitch.saasName}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(201, 168, 76, 0.15)",
              color: "#c9a84c",
              border: "1px solid rgba(201, 168, 76, 0.3)",
            }}
          >
            {STAGE_LABELS[pitch.stage] ?? pitch.stage}
          </span>
        </div>
        <p className="text-sm text-white/50">{pitch.tagline}</p>
        {pitch.url && (
          <p className="text-xs text-white/30">{pitch.url}</p>
        )}
      </div>

      <p className="text-sm text-white/40 mb-6">
        Cadastrado por <strong className="text-white/70">{userName}</strong>
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onViewProjects}
          className="w-full py-3 rounded-full font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          style={{
            backgroundColor: "#c9a84c",
            color: "#111",
          }}
        >
          Ver meus projetos
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
        <button
          onClick={onBack}
          className="text-sm text-white/30 hover:text-white/50 transition-colors cursor-pointer"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
