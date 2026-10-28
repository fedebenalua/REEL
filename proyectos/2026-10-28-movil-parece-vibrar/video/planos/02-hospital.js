// El estudio del hospital: una médica enorme mira el móvil, la pantalla negra, y sale el 68 %.
import * as k from "#kit";
import { v } from "#voz";
import { persona, velo } from "../mundo.js";

export const desde = (v) => v.frase(3).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(3);
const Tocho = f.t("ocho");
const fondo = [
  { x: 180, y: 860, h: 420, s: 31, mira: 1 },
  { x: 420, y: 820, h: 380, s: 32, mira: 1 },
  { x: 680, y: 880, h: 400, s: 33, mira: 0 },
  { x: 900, y: 900, h: 360, s: 34, mira: 1 },
  { x: 260, y: 1180, h: 300, s: 35, mira: 1 },
  { x: 860, y: 1200, h: 280, s: 36, mira: 0 },
];

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, f.inicio - 0.04, f.inicio + 0.45));
  const num = k.suave(k.tramo(t, Tocho - 0.05, Tocho + 0.28));
  const pulso = k.pulso(t, Tocho + 0.05, 0.16) * (1 - k.suave(k.tramo(t, Tocho + 0.45, f.fin - 0.15)));
  g.fillStyle = "#071418";
  g.fillRect(0, 0, 1080, 1920);
  const pared = g.createLinearGradient(0, 0, 0, 1920);
  pared.addColorStop(0, "#0e3a40");
  pared.addColorStop(0.45, "#123038");
  pared.addColorStop(1, "#081014");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  // luces del pasillo
  k.brillo(g, 200, 560, 420, "sodio", 0.28);
  k.brillo(g, 860, 640, 360, "cian", 0.18);
  g.fillStyle = "#163038";
  g.beginPath();
  g.moveTo(80, 1500);
  g.lineTo(1000, 1420);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.fill();
  for (const p of fondo) {
    persona(g, p.x, p.y, p.h * (0.92 + 0.08 * entra), p.s, {
      bata: true,
      ropa: "#e8f2f0",
      pantalon: "#1a3338",
      mira: p.mira * entra,
      pulso: p.mira ? pulso * 0.7 : 0,
      t,
    });
  }
  persona(g, 400, 1720, 980, 7, {
    bata: true,
    ropa: "#f4f7f6",
    pantalon: "#24383c",
    piel: "#f3c7a6",
    pelo: "#3a2418",
    mira: entra,
    pulso,
    t,
  });
  if (num > 0.02) k.pastilla(g, 780, 1280, "68", "%", "120,230,255", num, 128);
  velo(g, 0.8);
}
