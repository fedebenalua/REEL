// «Puede que no tuviera palabras, y ahora lo busques hablando.»
// La cuna dentro de una bola. Las cintas de voz chocan y caen.
import * as k from "#kit";
import { v } from "#voz";
import { bolaCristal, cuna, muneco, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;
const f9 = v.frase(9);
const Tp = f9.t("palabras"), Th = f9.t("hablando"), Fin = v.frase(10).inicio;

const az = k.azar(44);
const CINTAS = [
  { color: "255,80,110", y: 700, retraso: 0 },
  { color: "255,190,60", y: 980, retraso: 0.12 },
  { color: "80,210,255", y: 1240, retraso: 0.22 },
  { color: "190,140,255", y: 1500, retraso: 0.3 },
].map((c) => ({ ...c, ond: az() * 6 }));

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120818");
  bg.addColorStop(0.45, "#243058");
  bg.addColorStop(1, "#0c1830");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, 1000, 800, "cian", 0.18);
  g.restore();

  const zoom = 1 + 0.06 * k.suave(k.tramo(t, f9.inicio, Th));
  g.save();
  g.translate(540, 1080);
  g.scale(zoom, zoom);
  g.translate(-540, -1080);

  g.save();
  g.beginPath();
  g.arc(540, 1020, 300, 0, 6.2832);
  g.clip();
  g.fillStyle = "#ffd0b8";
  g.fillRect(200, 700, 700, 700);
  cuna(g, 540, 1120, 0.72);
  muneco(g, 540, 860, 70, t * 0.8, 0, "estrella");
  g.restore();
  bolaCristal(g, 540, 1020, 320);

  // las cintas salen a la derecha, chocan en «hablando» y caen. Reposan antes del corte.
  const golpe = Th - 0.05;
  for (const c of CINTAS) {
    const sale = k.entra(k.tramo(t, Tp - 0.15 + c.retraso, golpe));
    const cae = k.suave(k.tramo(t, golpe, Math.min(golpe + 0.55, Fin - 0.25)));
    const x = k.mez(1180, 860, sale);
    const y = c.y + cae * 280 + Math.sin(c.ond) * 10 * (1 - cae);
    const al = sale * (1 - cae * 0.85);
    if (al < 0.02) continue;
    g.save();
    g.globalAlpha = al;
    g.strokeStyle = `rgba(${c.color},0.95)`;
    g.lineWidth = 22;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x + 180, y);
    g.quadraticCurveTo(x + 80, y - 40, x, y);
    g.stroke();
    g.restore();
    if (cae > 0.05 && cae < 0.7) {
      g.save();
      g.globalCompositeOperation = "lighter";
      k.brillo(g, 820, c.y, 120, "blanca", (1 - cae) * 0.45);
      g.restore();
    }
  }
  g.restore();
  veloArriba(g, 0.8);
}
