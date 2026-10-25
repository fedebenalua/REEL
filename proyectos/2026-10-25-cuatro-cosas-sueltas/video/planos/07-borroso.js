// «Y en lo que ves, la atención se reparte: más cosas, cada una más borrosa.»
// Dos cuadros nítidos. Salen más, y todos pierden el borde.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo } from "../mundo.js";

export const desde = "ves";

const f12 = v.frase(12);
const Tmas = f12.t("mas"), Tbor = f12.t("borrosa");
const COLS = ["255,70,90", "70,160,255", "255,200,60", "80,230,160", "190,120,255", "255,140,60", "120,255,230", "255,90,170"];
const PUESTO = [
  [300, 860], [780, 860],
  [300, 1180], [780, 1180],
  [540, 700], [540, 1340],
  [180, 1020], [900, 1020],
];

function cuadro(g, x, y, s, rgb, nitido) {
  g.save();
  g.translate(x, y);
  const halo = s * (1.15 + (1 - nitido) * 1.7);
  const rg = g.createRadialGradient(0, 0, s * 0.05, 0, 0, halo);
  rg.addColorStop(0, `rgba(${rgb},${0.35 + (1 - nitido) * 0.45})`);
  rg.addColorStop(0.45, `rgba(${rgb},${0.18 + (1 - nitido) * 0.2})`);
  rg.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, halo, 0, 6.3);
  g.fill();
  if (nitido > 0.04) {
    g.globalAlpha = nitido;
    k.redondo(g, -s, -s, s * 2, s * 2, s * 0.16);
    const gr = g.createLinearGradient(-s, -s, s, s);
    gr.addColorStop(0, "rgba(255,255,255,0.85)");
    gr.addColorStop(0.35, `rgba(${rgb},1)`);
    gr.addColorStop(1, `rgba(${rgb},0.65)`);
    g.fillStyle = gr;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.75)";
    g.lineWidth = 6;
    g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, t);
  const mas = k.suave(k.tramo(t, Tmas - 0.1, Tmas + 0.7));
  const bor = k.suave(k.tramo(t, Tbor - 0.15, Tbor + 0.45));
  const nitido = 1 - bor;
  const n = Math.round(k.mez(2, 8, mas));
  const tam = k.mez(250, 110, mas);
  for (let i = 0; i < n; i++) {
    const entra = k.entra(k.tramo(t, Tmas - 0.15 + (i < 2 ? 0 : (i - 1) * 0.08), Tmas + 0.15 + i * 0.06));
    const u = i < 2 ? 1 : entra;
    if (u <= 0.02) continue;
    const x = PUESTO[i][0], y = PUESTO[i][1];
    cuadro(g, x, y, tam * (i < 2 ? k.mez(1.15, 1, mas) : u), COLS[i], nitido);
  }
  velo(g);
}
