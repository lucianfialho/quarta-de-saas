"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PITCH_DURATION = 5 * 60; // 5 minutes in seconds

export function PitchTimer() {
  const [timeLeft, setTimeLeft] = useState(PITCH_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playAlarm = useCallback(() => {
    try {
      const ctx = audioRef.current || new AudioContext();
      audioRef.current = ctx;

      // Play 3 beeps
      for (let i = 0; i < 3; i++) {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = "square";
        gain.gain.value = 0.3;
        const startTime = ctx.currentTime + i * 0.3;
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      }
    } catch {
      // Audio not supported
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playAlarm]);

  function reset() {
    setIsRunning(false);
    setTimeLeft(PITCH_DURATION);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((PITCH_DURATION - timeLeft) / PITCH_DURATION) * 100;
  const isFinished = timeLeft === 0;
  const isWarning = timeLeft <= 60 && timeLeft > 0;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Timer do Pitch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${
              isFinished
                ? "bg-destructive"
                : isWarning
                  ? "bg-yellow-500"
                  : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Time display */}
        <div
          className={`text-center font-mono text-6xl font-bold tabular-nums ${
            isFinished
              ? "text-destructive animate-pulse"
              : isWarning
                ? "text-yellow-500"
                : ""
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1"
            variant={isRunning ? "secondary" : "default"}
            disabled={isFinished}
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button onClick={reset} variant="outline" className="flex-1">
            Resetar
          </Button>
        </div>

        {isFinished && (
          <p className="text-center text-sm font-medium text-destructive">
            Tempo esgotado!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
