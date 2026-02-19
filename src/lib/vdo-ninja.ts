const VDO_NINJA_BASE = "https://vdo.ninja";
const ROOM_NAME = "quarta_de_saas_live";

export function getParticipantUrl(name: string): string {
  const label = encodeURIComponent(name.trim());
  return `${VDO_NINJA_BASE}/?room=${ROOM_NAME}&queue&mini&maxframerate=30&ln=pt-br&retry&webcam&label=${label}`;
}

export function getDirectorUrl(): string {
  return `${VDO_NINJA_BASE}/?director=${ROOM_NAME}&showdirector&queue&notify&ln=pt-br`;
}

export function getSceneUrl(): string {
  return `${VDO_NINJA_BASE}/?scene&room=${ROOM_NAME}&cleanoutput`;
}
