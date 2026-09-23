const DEVICE_ID_KEY = "laurea_sofia_device_id";
const NAME_KEY = "laurea_sofia_name";
const COLOR_KEY = "laurea_sofia_color";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback per browser molto vecchi
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getIdentity(): { name: string; color: string } | null {
  if (typeof window === "undefined") return null;
  const name = localStorage.getItem(NAME_KEY);
  const color = localStorage.getItem(COLOR_KEY);
  if (!name || !color) return null;
  return { name, color };
}

export function saveIdentity(name: string, color: string) {
  localStorage.setItem(NAME_KEY, name);
  localStorage.setItem(COLOR_KEY, color);
}

export const ELECTRIC_BLUE_PALETTE = [
  "#0057FF", // blu elettrico
  "#00D4FF", // ciano
  "#1DE9B6", // turchese
  "#00C853", // verde smeraldo
  "#C6FF00", // lime
  "#FFD600", // giallo
  "#FF6D00", // arancione
  "#FF1744", // rosso
  "#FF4081", // rosa
  "#D500F9", // fucsia
  "#7C4DFF", // viola
  "#304FFE", // indaco
];
