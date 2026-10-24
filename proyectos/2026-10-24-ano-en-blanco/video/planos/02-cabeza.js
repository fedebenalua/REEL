// «Parece que de bebé no se guardaba nada.»
// Dentro de una cabeza de bebé. Tres burbujas revientan. En «nada» queda el vacío.
import * as k from "#kit";
import { v } from "#voz";
import { cuna, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;
const f2 = v.frase(2);
const Tnada = f2.t("nada");

const BURBUJAS = [
  { x: 420, y: 980, nace: 2.75, muere: 3.45 },
  { x: 680, y: 1180, nace: 3.35, muere: 4.05 },
  { x: 520, y: 1320, nace: 3.95, muere: Tnada + 0.18 },
];

export function dibuja(g, t) {
  const cg = g.createRadialGradient(540, 1000, 40, 540, 1000, 900);
  cg.addColorStop(0, "#2a1848");
  cg.addColorStop(0.6, "#140818");
  cg.addColorStop(1, "#08040c");
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);

  // aro de la cabeza: piel, mechón, oreja. Se entiende que estamos dentro.
  g.save();
  g.beginPath();
  g.rect(0, 0, 1080, 1920);
  g.arc(540, 1040, 760, 0, 6.2832, true);
  const pg = g.createLinearGradient(0, 400, 1080, 1600);
  pg.addColorStop(0, "#f0b898");
  pg.addColorStop(0.5, "#ffd8c0");
  pg.addColorStop(1, "#d88868");
  g.fillStyle = pg;
  g.fill();
  g.restore();
  // mechón
  g.fillStyle = "#3a2014";
  g.beginPath();
  g.ellipse(540, 250, 120, 70, 0, 0, 6.2832);
  g.fill();
  g.beginPath();
  g.ellipse(470, 300, 70, 46, -0.4, 0, 6.2832);
  g.fill();
  // oreja
  g.beginPath();
  g.ellipse(160, 1080, 70, 100, 0, 0, 6.2832);
  g.fillStyle = "#f0b090";
  g.fill();
  g.beginPath();
  g.ellipse(175, 1080, 36, 58, 0, 0, 6.2832);
  g.fillStyle = "#e09078";
  g.fill();

  for (const b of BURBUJAS) {
    const entra = k.entra(k.tramo(t, b.nace, b.nace + 0.28));
    const sale = k.suave(k.tramo(t, b.muere - 0.12, b.muere + 0.18));
    const al = entra * (1 - sale);
    if (al < 0.02) {
      if (sale > 0.2 && sale < 1) {
        g.save();
        g.globalCompositeOperation = "lighter";
        k.brillo(g, b.x, b.y, 220 * (1 - sale), "naranja", (1 - sale) * 0.8);
        g.restore();
      }
      continue;
    }
    const r = 150 * (0.4 + 0.6 * entra) * (1 + 0.15 * sale);
    g.save();
    g.globalAlpha = al;
    g.beginPath();
    g.arc(b.x, b.y, r, 0, 6.2832);
    g.clip();
    g.fillStyle = "#ffd8c0";
    g.fillRect(b.x - r, b.y - r, r * 2, r * 2);
    cuna(g, b.x, b.y + 20, 0.42);
    g.restore();
    g.beginPath();
    g.arc(b.x, b.y, r, 0, 6.2832);
    g.strokeStyle = `rgba(255,255,255,${0.7 * al})`;
    g.lineWidth = 8;
    g.stroke();
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, b.x - r * 0.3, b.y - r * 0.3, r, "blanca", 0.25 * al);
    g.restore();
  }
  veloArriba(g, 0.55);
}
