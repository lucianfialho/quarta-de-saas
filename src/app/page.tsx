"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playDing() {
    if (!audioRef.current) {
      audioRef.current = new Audio("/elevator-ding.mp3");
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function handleLogin() {
    playDing();
    signIn("github", { callbackUrl: "/participar" });
  }

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const triggerEnd = window.innerHeight * 11;
      const p = Math.min(Math.max(scrollY / triggerEnd, 0), 1);
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phase 1: Zoom into elevator (0 → 0.25) — slow entrance
  const zoomP = easeOutCubic(clamp(progress / 0.25));
  const compositionScale = 1 + zoomP * 4.5;
  const textFade = 1 - easeInCubic(clamp(progress / 0.10));
  const bottomFade = 1 - easeInCubic(clamp(progress / 0.07));
  const doorOpen = easeOutCubic(clamp(progress / 0.20));
  const glowIntensity = easeOutCubic(clamp(progress / 0.25));
  const frameOpacity = 1 - easeInCubic(clamp((progress - 0.06) / 0.14));

  // Phase 2-4: Floor content (each floor: fade in → hold → fade out)
  const floor1 = floorAnim(progress, 0.38, 0.14);
  const floor2 = floorAnim(progress, 0.55, 0.14);
  const floor3 = floorAnim(progress, 0.72, 0.14);

  // Phase 5: Final CTA (0.85 → 1.0)
  const finalFade = easeOutCubic(clamp((progress - 0.85) / 0.12));

  return (
    <div className="bg-[#111] text-white">
      {/* Total scroll height */}
      <div style={{ height: "1200vh" }}>
        <section className="sticky top-0 h-screen flex flex-col overflow-hidden">
          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
              opacity: 1 - glowIntensity * 0.5,
            }}
          />

          {/* Elevator interior background */}
          <div
            className="absolute inset-0 z-[6]"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, rgba(200, 165, 70, ${glowIntensity * 0.12}) 0%, rgba(17, 17, 17, 1) 70%)`,
              opacity: glowIntensity,
            }}
          />

          {/* Nav */}
          <nav
            className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-4 sm:py-6"
            style={{ opacity: textFade }}
          >
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/60">
              Quarta de SaaS
            </span>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/participar"
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
              >
                Participar
              </Link>
              <Link
                href="/host"
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
              >
                Host
              </Link>
            </div>
          </nav>

          {/* Zoom composition */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
            <div
              className="relative w-full max-w-6xl mx-auto"
              style={{
                transform: `scale(${compositionScale})`,
                willChange: "transform",
              }}
            >
              {/* Mobile: centered elevator with overlaid text */}
              {/* Desktop: 3-column grid */}
              <div className="flex items-center justify-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-12">

                {/* Left text — hidden on mobile, visible on lg */}
                <div className="hidden lg:block text-left" style={{ opacity: textFade }}>
                  <p className="text-8xl font-bold italic leading-[0.95] tracking-tight">
                    Elevator
                    <br />
                    <span className="text-white/40">pitch</span>
                  </p>
                  <div className="mt-8 max-w-xs">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80 font-medium">
                      Sua chance de brilhar
                    </p>
                    <div className="w-8 h-[2px] bg-white/30 my-3" />
                    <p className="text-sm text-white/50 leading-relaxed">
                      5 minutos ao vivo pra apresentar seu SaaS, receber feedback
                      da comunidade e conhecer outros builders.
                    </p>
                  </div>
                </div>

                {/* Center: Elevator doors + mobile text overlay */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Mobile text — top left of elevator */}
                    <div
                      className="lg:hidden absolute -left-2 -top-24 sm:-top-28 z-10"
                      style={{ opacity: textFade }}
                    >
                      <p className="text-[2.5rem] sm:text-5xl font-bold italic leading-[0.95] tracking-tight">
                        Elevator
                        <br />
                        <span className="text-white/40">pitch</span>
                      </p>
                    </div>

                    {/* Mobile text — bottom right of elevator */}
                    <div
                      className="lg:hidden absolute -right-2 -bottom-20 sm:-bottom-24 z-10 text-right"
                      style={{ opacity: textFade }}
                    >
                      <p className="text-3xl sm:text-4xl font-bold leading-[0.95] tracking-tight">
                        5 min
                        <br />
                        <span className="italic text-white/40">ao vivo</span>
                      </p>
                      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30 mt-2 inline-block">
                        toda quarta-feira
                      </span>
                    </div>

                    <div
                      className="relative w-[220px] h-[380px] sm:w-[280px] sm:h-[440px] lg:w-[320px] lg:h-[480px] rounded-xl overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)",
                        boxShadow: `0 0 ${80 + glowIntensity * 120}px rgba(180, 140, 60, ${0.08 + glowIntensity * 0.2}), inset 0 1px 0 rgba(255,255,255,0.06), 0 25px 60px rgba(0,0,0,0.6)`,
                      }}
                    >
                      {/* Golden glow inside */}
                      <div
                        className="absolute inset-3 rounded-lg overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse at center, rgba(200, 165, 70, ${0.06 + glowIntensity * 0.15}) 0%, rgba(20, 18, 12, ${0.95 - glowIntensity * 0.3}) 70%)`,
                        }}
                      />

                      {/* Doors */}
                      <div
                        className="absolute inset-3 rounded-lg border border-white/[0.06] pointer-events-none"
                        style={{ opacity: frameOpacity }}
                      >
                        <div className="absolute inset-1 flex overflow-hidden">
                          <div
                            className="flex-1 rounded-l-md relative"
                            style={{
                              background:
                                "linear-gradient(90deg, #383838 0%, #4a4a4a 40%, #555 60%, #4a4a4a 100%)",
                              transform: `translateX(-${doorOpen * 105}%)`,
                            }}
                          >
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[2px] h-12 bg-white/10 rounded-full" />
                          </div>
                          <div
                            className="relative flex-shrink-0"
                            style={{ width: `${3 + doorOpen * 20}px` }}
                          >
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `rgba(180, 140, 60, ${0.3 - doorOpen * 0.3})`,
                              }}
                            />
                          </div>
                          <div
                            className="flex-1 rounded-r-md relative"
                            style={{
                              background:
                                "linear-gradient(90deg, #555 0%, #4a4a4a 40%, #383838 100%)",
                              transform: `translateX(${doorOpen * 105}%)`,
                            }}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[2px] h-12 bg-white/10 rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Floor indicator */}
                      <div
                        className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-20"
                        style={{ opacity: frameOpacity }}
                      >
                        <div
                          className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-b-lg text-center"
                          style={{
                            background: "linear-gradient(180deg, #1a1a1a, #222)",
                          }}
                        >
                          <span
                            className="text-[10px] sm:text-xs font-mono tracking-widest"
                            style={{
                              color: "#c9a84c",
                              textShadow: "0 0 8px rgba(180, 140, 60, 0.6)",
                            }}
                          >
                            4F
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Floor buttons */}
                    <div
                      className="absolute -right-8 sm:-right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3"
                      style={{ opacity: bottomFade }}
                    >
                      {["5", "4", "3", "2", "1"].map((f) => (
                        <div
                          key={f}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-mono border ${
                            f === "4"
                              ? "border-amber-600/60 text-amber-400 bg-amber-900/20"
                              : "border-white/10 text-white/25 bg-white/[0.02]"
                          }`}
                          style={
                            f === "4"
                              ? { boxShadow: "0 0 6px rgba(180, 140, 60, 0.3)" }
                              : {}
                          }
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right text — hidden on mobile, visible on lg */}
                <div className="hidden lg:block text-right" style={{ opacity: textFade }}>
                  <p className="text-7xl font-bold leading-[0.95] tracking-tight">
                    5 min
                    <br />
                    <span className="italic text-white/40">ao vivo</span>
                  </p>
                  <div className="mt-12 inline-flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                      toda quarta-feira
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-8"
            style={{ opacity: bottomFade }}
          >
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/30">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="animate-bounce"
              >
                <path d="M6 8L2 4h8L6 8Z" fill="currentColor" />
              </svg>
              <span className="uppercase tracking-[0.2em]">Scroll down</span>
            </div>
            <button
              onClick={handleLogin}
              className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-[#111] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors mx-auto sm:mx-0 cursor-pointer"
            >
              Cadastrar seu pitch
              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#111] text-white">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 10L10 2M10 2H4M10 2V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <span className="hidden sm:inline uppercase tracking-[0.2em] text-xs text-white/30">
              Apresente seu SaaS
            </span>
          </div>

          {/* ══════ OVERLAY CONTENT (inside the elevator) ══════ */}

          {/* Floor 1 */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{
              opacity: floor1.opacity,
              transform: `translateY(${floor1.y}px)`,
            }}
          >
            <div className="text-center px-6">
              <span
                className="text-xs sm:text-sm font-mono tracking-widest mb-4 sm:mb-6 inline-block"
                style={{ color: "#c9a84c", textShadow: "0 0 8px rgba(180, 140, 60, 0.6)" }}
              >
                1F
              </span>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold italic leading-[0.95] tracking-tight">
                Cadastre
                <br />
                <span className="text-white/40">seu pitch</span>
              </p>
              <div className="w-8 h-[2px] bg-white/20 mx-auto my-4 sm:my-6" />
              <p className="text-sm sm:text-base text-white/40 leading-relaxed max-w-xs mx-auto">
                Login com GitHub, nome do SaaS,
                elevator pitch e estágio atual.
              </p>
            </div>
          </div>

          {/* Floor 2 */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{
              opacity: floor2.opacity,
              transform: `translateY(${floor2.y}px)`,
            }}
          >
            <div className="text-center px-6">
              <span
                className="text-xs sm:text-sm font-mono tracking-widest mb-4 sm:mb-6 inline-block"
                style={{ color: "#c9a84c", textShadow: "0 0 8px rgba(180, 140, 60, 0.6)" }}
              >
                2F
              </span>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold italic leading-[0.95] tracking-tight">
                Entre
                <br />
                <span className="text-white/40">na fila</span>
              </p>
              <div className="w-8 h-[2px] bg-white/20 mx-auto my-4 sm:my-6" />
              <p className="text-sm sm:text-base text-white/40 leading-relaxed max-w-xs mx-auto">
                Quando estiver pronto, entre ao vivo.
                Sua câmera fica em miniatura enquanto espera.
              </p>
            </div>
          </div>

          {/* Floor 3 */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{
              opacity: floor3.opacity,
              transform: `translateY(${floor3.y}px)`,
            }}
          >
            <div className="text-center px-6">
              <span
                className="text-xs sm:text-sm font-mono tracking-widest mb-4 sm:mb-6 inline-block"
                style={{ color: "#c9a84c", textShadow: "0 0 8px rgba(180, 140, 60, 0.6)" }}
              >
                3F
              </span>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold italic leading-[0.95] tracking-tight">
                5 minutos
                <br />
                <span className="text-white/40">ao vivo</span>
              </p>
              <div className="w-8 h-[2px] bg-white/20 mx-auto my-4 sm:my-6" />
              <p className="text-sm sm:text-base text-white/40 leading-relaxed max-w-xs mx-auto">
                As portas abrem e é sua vez. Apresente,
                receba feedback e conecte com a comunidade.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: finalFade }}
          >
            <div className="text-center pointer-events-auto px-6">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/30 mb-3 sm:mb-4">
                Pronto pra subir?
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 sm:mb-8">
                Seu SaaS merece
                <br />
                <span className="italic text-amber-400/70">5 minutos de palco</span>
              </p>
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-2 sm:gap-3 bg-white text-[#111] px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:bg-white/90 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Entrar com GitHub
              </button>
              <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-white/20">
                Quarta de SaaS — toda quarta-feira
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Floor animation: slides up from below, holds, then slides up and out
function floorAnim(progress: number, center: number, duration: number) {
  const fadeIn = duration * 0.35;
  const hold = duration * 0.3;
  const fadeOut = duration * 0.35;

  const start = center - duration / 2;
  const inEnd = start + fadeIn;
  const holdEnd = inEnd + hold;
  const end = holdEnd + fadeOut;

  if (progress < start || progress > end) {
    return { opacity: 0, y: progress < start ? 60 : -60 };
  }

  if (progress <= inEnd) {
    const t = easeOutCubic(clamp((progress - start) / fadeIn));
    return { opacity: t, y: 60 * (1 - t) };
  }

  if (progress <= holdEnd) {
    return { opacity: 1, y: 0 };
  }

  const t = easeInCubic(clamp((progress - holdEnd) / fadeOut));
  return { opacity: 1 - t, y: -60 * t };
}

function clamp(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number) {
  return t * t * t;
}
