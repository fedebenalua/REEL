// «Unos investigadores lo midieron en habitaciones de hotel, cosa por cosa.»
// «Y el mando y el interruptor de la lámpara salieron de lo más sucio, al nivel del baño.»
// «Lo más limpio, el cabecero de la cama y la manilla de la puerta del baño.»
// La mesa del laboratorio, con una sola cámara. Se entra con un corte en «Unos».
// - «lo midieron»: un bastoncillo entra; «cosa por cosa»: van apareciendo cinco placas, cada una con su nombre
//   (mando, interruptor, váter, cabecero, manilla), y en ellas crecen las colonias.
// - Las placas suben y debajo de cada una crece su barra: en «mando» y en «interruptor», altas y rojas; en «baño», la
//   del váter, igual de alta. «cabecero» y «manilla»: barras bajitas y verdes.
import * as k from "#kit";
import { v } from "#voz";
import { camara, microbio, placa } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
export const desde = (vz) => vz.frase(2).inicio;
const T2 = f2.inicio, Tmid = f2.t("midieron"), Tcos = f2.t("cosa");
const T3 = f3.inicio, Tman = f3.t("mando"), Tint = f3.t("interruptor"), Tsuc = f3.t("sucio"), Tban = f3.t("bano");
const Tcab = f4.t("cabecero"), Tmani = f4.t("manilla"), Fin = v.frase(5).inicio;

const COSAS = [
  { n: "mando", alto: 520, cuando: Tman, sucio: 1 },
  { n: "interruptor", alto: 490, cuando: Tint, sucio: 1 },
  { n: "váter", alto: 540, cuando: Tban - 0.1, sucio: 1 },
  { n: "cabecero", alto: 110, cuando: Tcab, sucio: 0 },
  { n: "manilla", alto: 90, cuando: Tmani, sucio: 0 },
];

export function dibuja(g, t) {
  // la mesa: azulejos blancos y luz fría
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#d8eef4"); fg.addColorStop(1, "#a8c8d4");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; for (let x = 0; x <= 1080; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); } for (let y = 0; y <= 1920; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  k.brillo(g, 540, 600, 1500, "255,255,255", 0.4);
  // la cámara: se acerca a cada placa que aparece y luego a cada barra que crece
  const pasos = [[T2, 540, 1.0], [Tmid - 0.1, 300, 1.25], [Tmid + 0.7, 780, 1.25], [Tcos - 0.1, 540, 1.05], [T3, 540, 1.0], ...COSAS.map((c, i) => [c.cuando - 0.15, 140 + i * 200, 1.2]), [Fin - 0.3, 540, 1.0]];
  const fx = k.claves(pasos.map(([a, x]) => [a, x])), fz = k.claves(pasos.map(([a, , z]) => [a, z]));
  const fy = k.claves([[T2, 960], [T3 - 0.3, 1000], [T3 + 0.3, 1100], [Fin - 0.3, 1060]]);
  g.save(); camara(g, { Z: fz(t), F: { x: Math.max(380, Math.min(700, fx(t))), y: fy(t) } });
  // de placas a gráfica
  const sube = su(tr(t, T3 - 0.3, Tman - 0.05));
  const base = 1420;
  COSAS.forEach((c, i) => {
    const ap = entra(tr(t, Tmid - 0.2 + i * 0.4, Tmid + 0.1 + i * 0.4));
    if (ap <= 0) return;
    const col = i < 3 ? 0 : 1;
    // en la mesa: dos filas; en la gráfica: una fila arriba
    const x0 = [300, 780, 300, 780, 540][i], y0 = [820, 820, 1150, 1150, 1440][i], r0 = 150;
    const x1 = 140 + i * 200, y1 = 790, r1 = 74;
    const x = mez(x0, x1, sube), y = mez(y0, y1, sube), r = mez(r0, r1, sube) * ap;
    // la barra
    const crece = entra(tr(t, c.cuando - 0.1, c.cuando + 0.35));
    if (sube > 0 && crece > 0) {
      const h = c.alto * crece, bx = x1 - 64;
      const bg = g.createLinearGradient(0, base - h, 0, base); const cc = c.sucio ? ["#ff5a5a", "#c41e3a"] : ["#6ae88a", "#2a9a4a"];
      bg.addColorStop(0, cc[0]); bg.addColorStop(1, cc[1]);
      g.save(); g.shadowColor = "rgba(0,0,0,0.2)"; g.shadowBlur = 16; k.redondo(g, bx, base - h, 128, h, 18); g.fillStyle = bg; g.fill(); g.restore();
      g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(bx + 14, base - h + 14, 16, Math.max(0, h - 28));
      // un microbio que salta encima de cada barra sucia
      if (c.sucio) microbio(g, bx + 64, base - h - 34 - 20 * Math.abs(Math.sin(t * 5 + i)), 30 * crece, t, 50 + i, "255,120,90", 1);
    }
    const colonias = mez(0.1, c.sucio ? 1 : 0.15, su(tr(t, Tmid + i * 0.4, Tcos + 1.0)));
    placa(g, x, y, r, t, colonias, 20 + i, c.sucio ? "255,120,90" : "120,220,140");
    // su nombre
    g.fillStyle = "#1a2a3a"; g.font = `800 ${Math.round(mez(46, 33, sube))}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
    g.globalAlpha = ap; g.fillText(c.n, sube > 0.5 ? x1 : x, sube > 0.5 ? base + 46 : y + r0 + 44); g.globalAlpha = 1;
  });
  // la línea de la gráfica
  if (sube > 0) { g.fillStyle = `rgba(26,42,58,${sube})`; g.fillRect(30, base, 1020, 6); }
  // el bastoncillo que toma la muestra
  const bast = tr(t, T2 - 0.1, Tmid + 0.3);
  if (bast > 0 && bast < 1) {
    const bx = mez(1100, 300, su(Math.min(1, bast * 2))) + 480 * su(Math.max(0, bast * 2 - 1)), by = 760 + 40 * Math.sin(bast * 20);
    g.save(); g.translate(bx, by); g.rotate(-0.6); g.fillStyle = "#f4f0e8"; g.fillRect(0, -6, 420, 12); g.fillStyle = "#ffffff"; g.beginPath(); g.ellipse(0, 0, 34, 18, 0, 0, 6.2832); g.fill(); g.restore();
  }
  g.restore();
  const vg = g.createLinearGradient(0, 180, 0, 600); vg.addColorStop(0, "rgba(16,32,44,0.75)"); vg.addColorStop(0.6, "rgba(16,32,44,0.45)"); vg.addColorStop(1, "rgba(16,32,44,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { barras: COSAS.map((c) => c.cuando) };
