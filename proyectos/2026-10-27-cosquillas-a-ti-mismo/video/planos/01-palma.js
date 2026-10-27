// «¿Por qué no puedes hacerte cosquillas a ti mismo?»
// - Fotograma 0: la cámara llega volando a tu palma, enorme, mientras tu dedo (manga azul) le dibuja círculos a toda
//   velocidad, con su estela de luz.
// - «cosquillas»: revientan chispas rosas y doradas y la mano se encoge.
// - «a ti mismo»: las chispas se apagan en humo gris, la mano se queda quieta y el dedo frena antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ROSA, chispas, circulo, dedo, estela, fondoMorado, humo, palma, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), Tcos = f1.t("cosquillas"), Tmis = f1.t("mismo"), Tfin = v.frase(2).inicio;

export function dibuja(g, t) {
  fondoMorado(g, t);
  const llega = entra(tr(t, 0, 0.95));
  const s = mez(0.85, 1.3, llega), cx = 540, cy = mez(1300, 1160, llega), ang = mez(-0.3, 0, llega);
  // cuánto hace cosquillas: sube hasta «cosquillas» y se apaga en «mismo»
  const inten = mez(0.45, 1.35, su(tr(t, Tcos - 0.45, Tcos + 0.05))) * (1 - su(tr(t, Tmis - 0.05, Tmis + 0.3)));
  const frena = 1 - su(tr(t, Tmis + 0.1, Tfin - 0.25));
  g.save();
  g.translate(cx, cy); g.rotate(ang); g.translate(-cx, -cy);
  palma(g, cx, cy, s, t, { estilo: AZUL, encoge: 0.55 * Math.min(1, inten) * (inten > 0.5 ? 1 : inten * 2), tiembla: 0.9 * Math.max(0, inten - 0.4) });
  // la yema dibuja círculos en la palma; la velocidad baja a cero antes del corte
  const fase = 15 * t - 15 * Math.max(0, t - (Tmis + 0.1)) + 15 * integraFrena(t);
  const R = 85 * s, ox = cx + 10 * s, oy = cy - 10 * s;
  const [fx, fy] = [ox + R * Math.cos(fase), oy + R * 0.7 * Math.sin(fase)];
  estelaFase(g, t, ox, oy, R, fase, AZUL.borde, 0.9 * frena);
  chispas(g, t, fx, fy, inten, s * 0.9);
  humo(g, fx, fy - 20, tr(t, Tmis, Tmis + 0.65), s);
  dedo(g, fx, fy, -2.45, s * 0.95, AZUL);
  g.restore();
  vineta(g); velo(g, 0.35);
}

// Cuánto gira el dedo después de «mismo», mientras frena (la integral de la velocidad que baja).
function integraFrena(t) {
  const a = Tmis + 0.1, b = Tfin - 0.25;
  if (t <= a) return 0;
  const n = 24, h = (Math.min(t, b) - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += (1 - su(tr(a + (i + 0.5) * h, a, b))) * h;
  return s;
}
function estelaFase(g, t, ox, oy, R, fase, color, al) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const n = 14, largo = 2.6;
  for (let i = 0; i < n; i++) {
    const a0 = fase - (largo * i) / n, a1 = fase - (largo * (i + 1)) / n, f = 1 - i / n;
    g.strokeStyle = `rgba(${color},${0.5 * al * f})`; g.lineWidth = 8 + 20 * f;
    g.beginPath(); g.moveTo(ox + R * Math.cos(a0), oy + R * 0.7 * Math.sin(a0)); g.lineTo(ox + R * Math.cos(a1), oy + R * 0.7 * Math.sin(a1)); g.stroke();
  }
  g.restore();
}
