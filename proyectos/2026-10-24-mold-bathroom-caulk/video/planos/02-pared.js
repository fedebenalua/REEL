// «Bigger than three feet by three feet? Call a pro.»
// Un cuadro de tres por tres baldosas. El moho se sale. Entra el teléfono.
import * as k from "#kit";
import { v } from "#voz";
import { azulejos, mancha, velo, viñeta } from "../mundo.js";
import { telefono } from "../utiles.js";

export const desde = "Bigger";
export const entrada = "corte";

const f = v.frase(4);
const T0 = f.inicio;
const Tfeet = f.t("feet", 2);
const Tcall = f.t("call");
const Tpro = f.t("pro");
const Tfin = v.frase(5).inicio;

const SEM = k.azar(9);
const MOTAS = Array.from({ length: 18 }, () => ({
  x: SEM() * 640 - 320,
  y: SEM() * 520 - 260,
  r: 30 + SEM() * 70,
  verde: SEM(),
}));

export function dibuja(g, t) {
  const empuje = k.entra(k.tramo(t, T0, T0 + 0.55));
  const quieto = t > T0 + 0.7;
  const s = quieto ? 1.05 : k.mez(1.0, 1.05, empuje);
  g.save();
  g.translate(540, 980);
  g.scale(s, s);
  g.translate(-540, -980);
  azulejos(g, -400, -200, 1900, 2200, 220);
  const x0 = 186, y0 = 500, lado = 236;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    g.fillStyle = "rgba(255,255,255,0.14)";
    g.fillRect(x0 + i * lado + 10, y0 + j * lado + 10, lado - 20, lado - 20);
  }
  const sale = k.suave(k.tramo(t, T0, Math.min(Tfeet + 0.2, Tfin - 0.45)));
  const cx = x0 + lado * 1.5, cy = y0 + lado * 1.5;
  for (const m of MOTAS) {
    const rr = m.r * (0.45 + sale * 0.7);
    mancha(g, cx + m.x * (0.72 + sale * 0.55), cy + m.y * (0.72 + sale * 0.55), rr, 1, m.verde);
  }
  g.lineWidth = 26;
  g.strokeStyle = "#24180c";
  g.strokeRect(x0 - 6, y0 - 6, lado * 3 + 12, lado * 3 + 12);
  g.lineWidth = 12;
  g.strokeStyle = "#ffe14a";
  g.strokeRect(x0 - 6, y0 - 6, lado * 3 + 12, lado * 3 + 12);
  g.restore();
  const tel = k.suave(k.tramo(t, Tcall - 0.05, Math.min(Tpro + 0.18, Tfin - 0.32)));
  telefono(g, k.mez(1240, 780, tel), 1320, 0.78, tel);
  viñeta(g, 0.38);
  velo(g, 0.8);
}
