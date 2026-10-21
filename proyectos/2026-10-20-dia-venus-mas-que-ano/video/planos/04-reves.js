// «Y gira al revés que la Tierra y que casi todos los planetas.»
// Un sitio nuevo: el espacio, de lado, con los planetas girando. Una cámara fija.
// - «gira al revés»: Venus grande, sus nubes y su punto rojo corren de derecha a izquierda, con una flecha hacia la izquierda.
// - «la Tierra»: Venus se va a un lado y entra la Tierra, que gira al otro lado (hacia la derecha), con su flecha verde.
// - «casi todos los planetas»: abajo, uno a uno, Mercurio, Marte, Júpiter y Saturno, todos girando hacia la derecha.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, espacio, venusLado, marca, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(6);
const T0 = f.inicio, Tres = f.t("reves"), Tti = f.t("tierra"), Tcas = f.t("casi"), Ttod = f.t("todos"), Tplan = f.t("planetas");
const FIN = v.frase(7).inicio;
const CY = 120;

function flecha(g, x, y, dir, col, al, esc = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(dir * esc, esc); g.globalAlpha = al; g.lineCap = "round"; g.lineJoin = "round";
  g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${col},0.35)`; g.lineWidth = 46; g.beginPath(); g.moveTo(-120, 0); g.lineTo(110, 0); g.stroke();
  g.globalCompositeOperation = "source-over"; g.strokeStyle = `rgb(${col})`; g.lineWidth = 18; g.beginPath(); g.moveTo(-120, 0); g.lineTo(110, 0); g.moveTo(60, -50); g.lineTo(120, 0); g.lineTo(60, 50); g.stroke();
  g.restore();
}

const SMALL = [
  { x: -330, tono: ["#d8d2c6", "#8a8378", "#2c2924"], r: 70, T: Tcas },
  { x: -110, tono: ["#f08a5a", "#b04a26", "#3a1408"], r: 78, T: Ttod },
  { x: 110, tono: ["#f2d6a0", "#b8844c", "#3a2412"], r: 96, T: Tplan - 0.25 },
  { x: 330, tono: ["#f4e2a8", "#c8a45a", "#3c2c14"], r: 80, T: Tplan },
];

export function dibuja(g, t) {
  espacio(g, 1);
  vista(g, 1, 0, 0);
  // Venus: empieza grande en el centro y se va a la derecha
  const mv = su(tr(t, Tti - 0.35, Tti + 0.4));
  const vr = mez(300, 230, mv), vx = mez(0, 262, mv), vy = CY + mez(0, 0, mv);
  const gv = (t - T0) * 0.16;
  venusLado(g, vx, vy, vr, gv, -1, -0.3);
  marca(g, vx, vy, vr, 1.2 - gv * 4);
  // la Tierra entra por la izquierda
  const me = su(tr(t, Tti - 0.35, Tti + 0.4));
  if (me > 0.001) k.tierra(g, mez(-900, -262, me), CY, 230, -(t - T0) * 0.12, -1, -0.3);
  // las flechas
  flecha(g, vx, vy - vr - 80, -1, "255,150,60", su(tr(t, T0 + 0.1, T0 + 0.4)), 1.2);
  flecha(g, -262, CY - 230 - 80, 1, "120,255,150", su(tr(t, Tti + 0.3, Tti + 0.6)), 1.2);
  // los planetas pequeños de abajo, todos hacia la derecha
  for (const s of SMALL) {
    const a = su(tr(t, s.T - 0.05, s.T + 0.25)); if (a < 0.01) continue;
    const e = 0.55 + 0.45 * a, y = 730;
    g.save(); g.globalAlpha = a;
    if (s.r === 80 && s.x > 0) { // Saturno: su anillo
      g.save(); g.translate(s.x, y); g.rotate(-0.35); g.strokeStyle = "rgba(240,215,150,0.85)"; g.lineWidth = 14; g.beginPath(); g.ellipse(0, 0, s.r * 1.75 * e, s.r * 0.5 * e, 0, Math.PI, 6.2832); g.stroke(); g.restore();
    }
    k.planeta(g, s.x, y, s.r * e, (t - T0) * 0.2, -1, -0.3, s.tono);
    if (s.r === 80 && s.x > 0) { g.save(); g.translate(s.x, y); g.rotate(-0.35); g.strokeStyle = "rgba(240,215,150,0.9)"; g.lineWidth = 14; g.beginPath(); g.ellipse(0, 0, s.r * 1.75 * e, s.r * 0.5 * e, 0, 0, Math.PI); g.stroke(); g.restore(); }
    g.restore();
    flecha(g, s.x, y - s.r * 1.2 - 80, 1, "120,255,150", a, 0.5);
  }
  sinVista(g);
  // los nombres
  k.etiqueta(g, 150, 1345, "TIERRA", "120,255,150", me * su(tr(t, Tti + 0.3, Tti + 0.6)), 60);
  k.etiqueta(g, 700, 1345, "VENUS", "255,150,60", mv * su(tr(t, Tti + 0.3, Tti + 0.6)), 60);
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { tierra: Tti };
