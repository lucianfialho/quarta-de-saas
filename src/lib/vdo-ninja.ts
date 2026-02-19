const VDO_NINJA_BASE = "https://vdo.ninja";
const ROOM_NAME = "quarta_de_saas_live";

function generateStreamId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function getParticipantUrl(name: string): string {
  const label = encodeURIComponent(name.trim());
  const streamId = generateStreamId(name);
  return `${VDO_NINJA_BASE}/?room=${ROOM_NAME}&push=${streamId}&queue&mini&maxframerate=30&ln=pt-br&retry&webcam&label=${label}`;
}

export function getSoloViewUrl(name: string): string {
  const streamId = generateStreamId(name);
  return `${VDO_NINJA_BASE}/?view=${streamId}&solo&room=${ROOM_NAME}`;
}

export function getDirectorUrl(): string {
  return `${VDO_NINJA_BASE}/?director=${ROOM_NAME}&showdirector&queue&notify&ln=pt-br`;
}

export function getSceneUrl(): string {
  return `${VDO_NINJA_BASE}/?scene&room=${ROOM_NAME}&cleanoutput`;
}
