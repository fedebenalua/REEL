// No desde la cuna. La marca de los 10 se enciende; en los 14 salen los días en color.
import * as k from "#kit";
import { v } from "#voz";
import { cuartoCuna, cuna, marco, tarjeta, velo } from "../mundo.js";

export const desde = "cuna";
export const entrada = "corte";

const f = v.frase(3);
const Tdiez = f.t("diez");
const Tcator = f.t("catorce");
const Fin = v.frase(4).inicio - 0.04;

const pan = k.claves([
  [f.inicio, 0],
  [Tdiez, 0.28],
  [Tcator + 0.15, 1],
  [Fin, 1],
]);

export function dibuja(g, t) {
  const u10 = k.suave(k.tramo(t, Tdiez - 0.05, Tdiez + 0.35));
  const u14 = k.entra(k.tramo(t, Tcator - 0.04, Tcator + 0.55));
  const quieto = k.suave(k.tramo(t, Tcator + 0.7, Tcator + 1.05));
  const sale = 1 - quieto * 0.15;
  const p = pan(t);
  g.save();
  g.translate(k.mez(40, -120, p), k.mez(0, -40, p));
  g.translate(540, 1000);
  g.scale(k.mez(1, 1.08, p), k.mez(1, 1.08, p));
  g.translate(-540, -1000);
  cuartoCuna(g, t);
  cuna(g, 430, 1180, 1.55, t);
  // páginas en blanco, de la cuna
  for (let i = 0; i < 5; i++) {
    const az = (i + 1) * 1.7;
    const x = 250 + Math.sin(t * 0.7 + az) * 18 + i * 30;
    const y = 900 + Math.cos(t * 0.5 + az) * 14 + (i % 2) * 30;
    const color = i < 2 ? k.mez(0, 1, u10) : 0;
    g.save();
    g.globalAlpha = 0.9;
    tarjeta(g, x, y, 150, 198, {
      num: "", color: color > 0.2 ? "#e8872a" : "#d9d3c8", esc: i, rot: -0.2 + i * 0.08,
      escenaAl: 0.15 + 0.85 * (i < 2 ? u10 : 0), al: 1,
    });
    g.restore();
  }
  // los días salen de la marca de los 14
  for (let i = 0; i < 6; i++) {
    const u = k.suave(k.tramo(t, Tcator + i * 0.03, Tcator + 0.62));
    const ang = -2.6 + i * 0.38;
    const dist = 50 + u * (300 + i * 20);
    const x = 700 + Math.cos(ang) * dist;
    const y = 1080 + Math.sin(ang) * dist * 0.5;
    tarjeta(g, x, y, 210, 270, {
      num: String(10 + i), color: ["#e23b4a", "#148a86", "#e8872a", "#3a5ec9", "#c4488a", "#2f9e4f"][i],
      esc: i + 1, rot: (1 - u) * 0.5, escenaAl: u, al: u * sale,
    });
  }
  marco(g, 880, 1080);
  k.brillo(g, 880, 1080 - 80, 160, "amarilla", 0.5 * u10);
  k.brillo(g, 880, 1080 - 240, 220, "naranja", 0.65 * u14);
  g.restore();
  velo(g, 0.72);
}
