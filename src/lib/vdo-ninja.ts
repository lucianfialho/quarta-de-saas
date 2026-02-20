const VDO_NINJA_BASE = "https://vdo.ninja";
const ROOM_NAME = "quarta_de_saas_live";

function generateStreamId(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  const suffix = Math.random().toString(36).slice(2, 5);
  return `${base}_${suffix}`;
}

export function getParticipantUrl(name: string): string {
  const label = encodeURIComponent(name.trim());
  const streamId = generateStreamId(name);
  return `${VDO_NINJA_BASE}/?room=${ROOM_NAME}&push=${streamId}&queue&mini&maxframerate=30&ln=pt-br&retry&webcam&label=${label}`;
}

export function getDirectorUrl(): string {
  return `${VDO_NINJA_BASE}/?director=${ROOM_NAME}&showdirector&notify&ln=pt-br`;
}

export function getSceneUrl(): string {
  return `${VDO_NINJA_BASE}/?scene=0&room=${ROOM_NAME}&codec=h264&cleanoutput&nocontrols`;
}
