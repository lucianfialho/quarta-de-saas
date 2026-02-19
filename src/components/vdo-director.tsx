"use client";

import { getDirectorUrl } from "@/lib/vdo-ninja";

export function VdoDirector() {
  return (
    <div className="w-full rounded-lg border overflow-hidden" style={{ height: "70vh" }}>
      <iframe
        src={getDirectorUrl()}
        className="h-full w-full"
        allow="camera;microphone;display-capture;autoplay"
        allowFullScreen
      />
    </div>
  );
}
