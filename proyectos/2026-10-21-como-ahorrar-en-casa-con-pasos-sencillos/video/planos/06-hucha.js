// «No hace falta pasar frío ni cambiar de casa: solo dejar de pagar lo que no usas.»
// Otro sitio: la hucha, enorme, sobre una luz cálida de casa. Corte en «No».
// - Llueven monedas desde arriba y entran por la ranura, cada vez más; la hucha da saltitos y brilla por dentro.
// - «lo que no usas»: entra la última, un fogonazo dorado, y la hucha se queda llena y quieta antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, moneda, hucha, velo, vineta, RANURA, ORO } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tfri = f7.t("frio"), Tsolo = f7.t("solo"), Tusas = f7.t("usas"), Fin = v.frase(8).inicio;
const cam = camino2D([[T0, [0.95, 0, 0]], [Tusas, [1.12, 0, -40]], [Fin, [1.13, 0, -40]]]);
// las monedas: cada una llega a la ranura en su momento (más seguidas al final); la última, en «usas»
const LLEGAN = (() => { const l = []; let tt = T0 + 0.25; while (tt < Tusas - 0.1) { l.push(tt); tt += mez(0.32, 0.12, (tt - T0) / (Tusas - T0)); } l.push(Tusas); return l; })();
const BOKEH = (() => { const az = azar(5), l = []; for (let i = 0; i < 18; i++) l.push({ x: az() * 1080, y: az() * 1920, r: 70 + az() * 150, c: ["255,190,110", "255,140,170", "255,220,150"][i % 3] }); return l; })();

export function dibuja(g, t) {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#5a2a5a"); bg.addColorStop(0.6, "#a8486a"); bg.addColorStop(1, "#3a1430"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.22)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.2832); g.fill(); }
  g.restore();
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  let bota = 0; for (const c of LLEGAN) if (t > c) bota = Math.max(bota, Math.exp(-(t - c) * 10) * (c === Tusas ? 1.6 : 0.6));
  const lleno = LLEGAN.filter((c) => t > c).length / LLEGAN.length;
  const E = 1.15, X = 0, Y = 420;
  g.save(); g.translate(X, Y); g.scale(E, E); hucha(g, t, { bota: Math.min(1, bota), brillo: lleno }); g.restore();
  const rx = X + RANURA[0] * E, ry = Y + RANURA[1] * E;
  const az = azar(99);
  for (const c of LLEGAN) {
    const dx = (az() - 0.5) * 500, gi = az(); const u = tr(t, c - 0.5, c); if (u <= 0 || u >= 1) continue;
    moneda(g, mez(rx + dx, rx, u), mez(ry - 1300, ry, u * u), 62, gi + u * 1.5, 1);
  }
  k.brillo(g, rx, ry, 360, ORO, 0.7 * Math.min(1, bota));
  if (t > Tusas) { g.save(); g.globalAlpha = 1 - su(tr(t, Tusas + 0.3, Fin - 0.15)); k.fogonazo(g, rx, ry + 100, t - Tusas, 1000, ORO); g.restore(); }
  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.45, "40,10,30");
}
