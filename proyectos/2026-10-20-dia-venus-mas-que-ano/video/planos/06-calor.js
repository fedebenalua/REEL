// «Y hace cuatrocientos sesenta y cuatro grados: más calor que en Mercurio, que está más cerca del Sol.»
// Un sitio nuevo: el espacio caliente, de lado, con un Sol enorme a la izquierda. Una cámara fija.
// - «hace»: Venus enorme y al rojo, con su termómetro debajo.
// - «cuatrocientos sesenta y cuatro grados»: el termómetro sube hasta 464 °C.
// - «Mercurio»: Venus se echa a la derecha, entra Mercurio a su izquierda, pegado al Sol, y su termómetro sube hasta 430 °C,
//   donde queda una línea; el de Venus la pasa.
// - «más cerca del Sol»: una flecha corta del Sol a Mercurio.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, sol, venusLado, mercurio, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(9);
const T0 = f.inicio, Tcua = f.t("cuatrocientos"), Tgra = f.t("grados"), Tmer = f.t("mercurio"), Tcer = f.t("cerca");
const FIN = v.frase(10).inicio;
const TOP = 230, BOT = 700, ESC = (BOT - 60 - TOP) / 500;      // el termómetro: de 0 a 500 °C

function termometro(g, x, val, col, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha = al; g.translate(x, 0);
  const W = 86, yb = BOT - 6;
  // el cristal
  k.redondo(g, -W / 2, TOP - 20, W, yb - TOP - 20, 43); g.fillStyle = "rgba(255,255,255,0.14)"; g.fill();
  g.beginPath(); g.arc(0, yb, 76, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.14)"; g.fill();
  // el líquido
  const top = yb - 60 - val * ESC * 0.0 - Math.max(0, val) * (yb - 60 - TOP) / 500;
  g.save(); g.beginPath(); g.arc(0, yb, 76, 0, 6.2832); k.redondo(g, -W / 2, TOP - 20, W, yb - TOP - 20, 43); g.clip("nonzero");
  const lg = g.createLinearGradient(0, TOP, 0, yb); lg.addColorStop(0, "#ffe27a"); lg.addColorStop(0.5, `rgb(${col})`); lg.addColorStop(1, "#c01010");
  g.fillStyle = lg; g.fillRect(-W / 2, top, W, yb + 80 - top); g.restore();
  g.beginPath(); g.arc(0, yb, 60, 0, 6.2832); g.fillStyle = `rgb(${col})`; g.fill();
  g.beginPath(); g.arc(-18, yb - 20, 16, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.5)"; g.fill();
  k.redondo(g, -W / 2 + 14, top + 4, 12, Math.max(0, yb - 80 - top), 6); g.fillStyle = "rgba(255,255,255,0.4)"; g.fill();
  // el borde del cristal
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 5; k.redondo(g, -W / 2, TOP - 20, W, yb - TOP - 20, 43); g.stroke();
  // las rayitas
  g.fillStyle = "rgba(255,255,255,0.55)"; for (let i = 1; i <= 5; i++) { const y = yb - 60 - i * 100 * (yb - 60 - TOP) / 500; g.fillRect(W / 2 + 6, y - 2, i % 5 === 0 ? 30 : 18, 4); }
  g.restore();
  return top;
}
const nivel = (val) => (BOT - 6) - 60 - val * (BOT - 6 - 60 - TOP) / 500;

export function dibuja(g, t) {
  vista(g, mez(1.0, 1.07, su(tr(t, T0, Tmer))) - 0.07 * su(tr(t, Tmer, Tmer + 0.8)), mez(0, 0, 0), mez(0, 40, su(tr(t, T0, Tmer))) * (1 - su(tr(t, Tmer, Tmer + 0.8))));
  // el fondo: un espacio al rojo
  const bg = g.createLinearGradient(0, -960, 0, 960); bg.addColorStop(0, "#1c0614"); bg.addColorStop(0.55, "#4a0f16"); bg.addColorStop(1, "#8a2410");
  g.fillStyle = bg; g.fillRect(-700, -1000, 1400, 2000);
  k.brillo(g, 0, 500, 1800, "255,90,30", 0.45);
  // el Sol, enorme, a la izquierda
  sol(g, -650, -100, 280, t, 0.4);
  // la posición de las dos columnas
  const mm = su(tr(t, Tmer - 0.2, Tmer + 0.5));
  const xv = mez(0, 250, mm), xm = -250;
  // Venus, al rojo
  const rv = mez(250, 175, mm), yv = mez(-90, -110, mm);
  k.brillo(g, xv, yv, rv * 3.4, "255,70,30", 0.55);
  venusLado(g, xv, yv, rv, (t - T0) * 0.05, -1, -0.2);
  g.save(); g.globalAlpha = 0.35; g.globalCompositeOperation = "lighter"; g.fillStyle = "#ff4010"; g.beginPath(); g.arc(xv, yv, rv, 0, 6.2832); g.fill(); g.restore();
  // el calor que sube
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 7; i++) { const ph = ((t * 0.5 + i / 7) % 1), bx = xv + (i - 3) * rv * 0.3, y0 = yv - rv * 0.95; g.strokeStyle = `rgba(255,150,70,${0.5 * (1 - ph) * su(tr(t, T0 + 0.2, T0 + 0.6))})`; g.lineWidth = 9; g.beginPath(); for (let j = 0; j <= 10; j++) { const yy = y0 - ph * 150 - j * 8, xx = bx + Math.sin(j * 0.9 + t * 4 + i) * 12; if (j === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy); } g.stroke(); }
  g.restore();
  // las chispas que salen de Venus
  { const az = k.azar(5); g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 46; i++) { const sx = (az() - 0.5) * 2, sp = 0.35 + az() * 0.6, ph = (t * sp + az()) % 1, a0 = az() * 6.2832, r0 = rv * (0.4 + 0.7 * az()); const bx = xv + Math.cos(a0) * r0 * 0.9, by = yv + Math.sin(a0) * r0 * 0.9; const px = bx + sx * 60 * ph, py = by - 520 * ph; g.fillStyle = `rgba(255,${Math.round(150 + 80 * (1 - ph))},70,${0.9 * (1 - ph) * su(tr(t, T0 + 0.2, T0 + 0.6))})`; g.beginPath(); g.arc(px, py, 3 + 6 * az(), 0, 6.2832); g.fill(); }
    g.restore(); }
  { const ff = k.pulso(t, Tgra + 0.2, 0.15); if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, xv, yv, 1200, "255,120,60", 0.6 * ff); g.restore(); } }
  // su termómetro
  const vv = 464 * su(tr(t, Tcua, Tgra + 0.35));
  termometro(g, xv, vv, "255,64,32", su(tr(t, T0 + 0.1, T0 + 0.5)));
  // Mercurio y su termómetro
  const me = su(tr(t, Tmer - 0.15, Tmer + 0.35));
  if (me > 0.01) {
    g.save(); g.globalAlpha = me; k.brillo(g, xm, -110, 520, "255,200,140", 0.35 * me); mercurio(g, mez(-700, xm, me), -110, 100, t * 0.1, -1, -0.2); g.restore();
    termometro(g, xm, 430 * su(tr(t, Tmer + 0.3, Tmer + 1.1)), "255,120,40", me);
  }
  // la línea de los 430: Venus la pasa
  const la = su(tr(t, Tmer + 1.0, Tmer + 1.4));
  if (la > 0.01) { g.save(); g.globalAlpha = la; g.setLineDash([16, 14]); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 5; const yl = nivel(430) + 0; g.beginPath(); g.moveTo(-420, yl); g.lineTo(420, yl); g.stroke(); g.restore(); }
  // la flecha del Sol a Mercurio
  const fa = su(tr(t, Tcer - 0.1, Tcer + 0.3));
  if (fa > 0.01) { g.save(); g.globalAlpha = fa; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#fff"; g.lineWidth = 12; g.beginPath(); g.moveTo(-440, -110); g.lineTo(-375, -110); g.moveTo(-398, -140); g.lineTo(-368, -110); g.lineTo(-398, -80); g.stroke(); g.restore(); }
  sinVista(g);
  // las cifras
  const ca = su(tr(t, Tcua + 0.1, Tcua + 0.5));
  k.pastilla(g, 540 + xv, 960 + 150, `${Math.round(vv)}`, "°C", "255,120,80", ca, 96);
  k.pastilla(g, 540 + xm, 960 + 150, `${Math.round(430 * su(tr(t, Tmer + 0.3, Tmer + 1.1)))}`, "°C", "255,200,150", me * su(tr(t, Tmer + 0.3, Tmer + 0.6)), 80);
  const na = su(tr(t, Tmer + 0.3, Tmer + 0.6));
  k.etiqueta(g, 540 + xm - 120, 600, "MERCURIO", "255,215,170", me * na, 48);
  k.etiqueta(g, 540 + xv - 90, 600, "VENUS", "255,150,100", su(tr(t, Tmer + 0.3, Tmer + 0.6)), 48);
  velo(g, 0.35);
  vineta(g, 0.45);
}

export const momentos = { grados: Tgra, mercurio: Tmer };
