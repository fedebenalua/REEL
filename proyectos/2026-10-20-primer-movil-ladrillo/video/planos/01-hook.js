// «¿Sabías que el primer móvil pesaba más de un kilo? Medía veinticinco centímetros, y por eso lo llamaban el ladrillo.»
// Un solo sitio: una balanza de platillos sobre una mesa. Una cámara.
// - 0 s: el móvil ladrillo cae sobre un platillo y la balanza se inclina de golpe, con una bolsa de azúcar de un kilo en el otro.
// - «kilo»: el cartel «1,1 kg» sube sobre el móvil; la bolsa dice «1 kg».
// - «veinticinco centímetros»: el móvil sale de la balanza, que se va, y una regla de 25 cm lo mide.
// - «ladrillo»: entra un ladrillo de verdad y se planta a su lado, igual de grande.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, madera } from "../mundo.js";
import { movilLadrillo, ladrillo, LAD } from "../cosas.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, redondo } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tkil = f1.t("kilo"), Tcen = f2.t("centimetros"), Tlla = f2.t("llamaban"), Tlad = f2.t("ladrillo");
const FIN = v.frase(3).inicio;

const TL = 0.42;                                    // cuándo toca el platillo
const MESA = 520, PV = [0, -150], LB = 250, DROP = 330;
const cam = camino2D([[0, [1.3, 0, 130]], [3.2, [1.3, 0, 130]], [4.4, [0.86, 0, 60]], [FIN, [0.86, 0, 60]]]);

// el ángulo de la balanza: positivo, el platillo de la izquierda (el móvil) baja
const ang = (t) => {
  if (t < TL) return -0.14;
  const t1 = TL + 0.12;
  if (t < t1) return mez(-0.14, 0.55, su(tr(t, TL, t1)));
  return 0.34 + 0.21 * Math.exp(-(t - t1) * 3) * Math.cos((t - t1) * 10);
};
const extremos = (d) => [[-LB * Math.cos(d), PV[1] + LB * Math.sin(d)], [LB * Math.cos(d), PV[1] - LB * Math.sin(d)]];

function platillo(g, x, y) {
  g.save(); g.translate(x, y);
  g.beginPath(); g.ellipse(0, 0, 138, 32, 0, 0, 6.2832); const gr = g.createLinearGradient(-138, 0, 138, 0); gr.addColorStop(0, "#9a7a24"); gr.addColorStop(0.3, "#ffe27a"); gr.addColorStop(0.6, "#d6a82c"); gr.addColorStop(1, "#7a5a14"); g.fillStyle = gr; g.fill();
  g.beginPath(); g.ellipse(0, -6, 120, 22, 0, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.18)"; g.fill();
  g.restore();
}
function cuerdas(g, ex, ey, px, py) {
  g.save(); g.strokeStyle = "rgba(255,226,122,0.9)"; g.lineWidth = 6; g.lineCap = "round";
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(ex, ey); g.lineTo(px + s * 125, py - 4); g.stroke(); }
  g.fillStyle = "#ffe27a"; g.beginPath(); g.arc(ex, ey, 14, 0, 6.2832); g.fill();
  g.restore();
}
function bolsa(g, al) {
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.4)"; g.shadowBlur = 24; g.shadowOffsetY = 14;
  g.beginPath(); g.moveTo(-76, -118); g.lineTo(76, -118); g.lineTo(84, 110); g.lineTo(-84, 110); g.closePath(); g.fillStyle = "#f4f1e8"; g.fill(); g.restore();
  g.fillStyle = "#e6e0d0"; g.beginPath(); g.moveTo(-76, -118); g.lineTo(76, -118); g.lineTo(70, -96); g.lineTo(-70, -96); g.closePath(); g.fill();
  g.fillStyle = "#2a6ae0"; g.fillRect(-82, -30, 164, 74);
  g.font = "800 54px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1 kg", 0, 8);
  g.font = "800 26px Figtree"; g.fillStyle = "#2a6ae0"; g.fillText("AZÚCAR", 0, -66);
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared y la mesa
  const bg = g.createLinearGradient(0, -900, 0, MESA); bg.addColorStop(0, "#10b8c8"); bg.addColorStop(1, "#0a6a8a"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, MESA + 1500);
  k.brillo(g, 0, -100, 1100, "255,240,160", 0.22);
  madera(g, -1300, MESA, 2600, 900, 0, ["#e0a35a", "#b87a36", "#6a4018"]);
  g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(-1300, MESA, 2600, 14);

  const salida = su(tr(t, 3.55, 4.35));                 // la balanza se va hacia abajo
  const d = ang(t), [E1, E2] = extremos(d);
  const PL = [E1[0], E1[1] + DROP], PR = [E2[0], E2[1] + DROP];
  g.save(); g.translate(0, 1700 * salida);
  // la base y la columna
  g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(0, MESA + 4, 300, 26, 0, 0, 6.2832); g.fill();
  redondo(g, -230, MESA - 66, 460, 66, 22); const bgr = g.createLinearGradient(0, MESA - 66, 0, MESA); bgr.addColorStop(0, "#ffe27a"); bgr.addColorStop(1, "#9a7a24"); g.fillStyle = bgr; g.fill();
  g.beginPath(); g.moveTo(-26, MESA - 64); g.lineTo(26, MESA - 64); g.lineTo(16, PV[1]); g.lineTo(-16, PV[1]); g.closePath(); const cg = g.createLinearGradient(-26, 0, 26, 0); cg.addColorStop(0, "#9a7a24"); cg.addColorStop(0.4, "#ffe27a"); cg.addColorStop(1, "#7a5a14"); g.fillStyle = cg; g.fill();
  // el brazo
  g.save(); g.translate(PV[0], PV[1]); g.rotate(-d); redondo(g, -LB - 20, -12, 2 * LB + 40, 24, 12); const ba = g.createLinearGradient(0, -12, 0, 12); ba.addColorStop(0, "#fff3b0"); ba.addColorStop(1, "#b88a20"); g.fillStyle = ba; g.fill(); g.restore();
  g.fillStyle = "#ffe27a"; g.beginPath(); g.arc(PV[0], PV[1], 30, 0, 6.2832); g.fill(); g.fillStyle = "#7a5a14"; g.beginPath(); g.arc(PV[0], PV[1], 12, 0, 6.2832); g.fill();
  // las cuerdas y los platillos
  cuerdas(g, E1[0], E1[1], PL[0], PL[1]); cuerdas(g, E2[0], E2[1], PR[0], PR[1]);
  platillo(g, PL[0], PL[1]); platillo(g, PR[0], PR[1]);
  // la bolsa de azúcar, en el platillo de la derecha
  g.save(); g.translate(PR[0], PR[1] - 135); g.rotate(-d * 0.15); g.scale(1.15, 1.15); bolsa(g); g.restore();
  g.restore();

  // el móvil: cae, se queda en el platillo y luego se planta en la mesa
  const lift = su(tr(t, 3.3, 4.2));
  const movX = mez(0, -230, su(tr(t, 5.7, 6.5)));
  let mx, my, rot, sc = 0.8;
  if (t < TL) { const u = t / TL; mx = PL[0]; my = extremos(-0.14)[0][1] + DROP - 205 - 640 * (1 - u * u); sc = mez(1.5, 0.8, u * u); rot = 0.3 * (1 - u); }
  else { mx = PL[0]; my = PL[1] - 205; rot = 0.02 * Math.sin((t - TL) * 9) * Math.exp(-(t - TL) * 2); }
  const dest = [movX, MESA - 320];
  const px = mez(mx, dest[0], lift), py = mez(my, dest[1], lift);
  g.save(); g.translate(px, py); g.rotate(rot * (1 - lift)); g.scale(mez(sc, 1.0, lift), mez(sc, 1.0, lift));
  movilLadrillo(g, t, { led: null });
  g.restore();

  // el golpe al caer
  const ch = k.pulso(t, TL + 0.03, 0.2); if (ch > 0.01) { k.brillo(g, PL[0], PL[1] - 40, 520, "255,200,90", 0.8 * ch); }
  // «1,1 kg» sobre el móvil
  const ka = su(tr(t, Tkil - 0.05, Tkil + 0.3)) * (1 - su(tr(t, 3.35, 3.75)));
  if (ka > 0.01) {
    g.save(); g.translate(PL[0], PL[1] - 215 - 24 * (1 - ka)); g.globalAlpha = ka; const e = 0.7 + 0.3 * ka + 0.1 * k.pulso(t, Tkil + 0.2, 0.2); g.scale(e, e);
    redondo(g, -150, -56, 300, 112, 40); g.fillStyle = "#e01818"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 8; g.stroke();
    g.font = "800 72px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1,1 kg", 0, 4);
    g.restore();
  }
  // la regla de 25 cm
  const ra = su(tr(t, Tcen - 0.5, Tcen + 0.1)), rr = su(tr(t, Tcen - 0.5, Tcen + 0.35));
  if (ra > 0.01) {
    const rx = movX - 205, y1 = MESA - LAD.h, y0 = MESA;
    g.save(); g.globalAlpha = ra;
    g.fillStyle = "#ffe27a"; g.fillRect(rx - 28, y0 - (y0 - y1) * rr, 56, (y0 - y1) * rr);
    g.strokeStyle = "#3a2a08"; g.lineWidth = 4;
    for (let i = 0; i <= 25; i++) { const yy = y0 - (y0 - y1) * i / 25; if ((y0 - yy) > (y0 - y1) * rr + 1) break; g.beginPath(); g.moveTo(rx + 28, yy); g.lineTo(rx + 28 - (i % 5 === 0 ? 34 : 18), yy); g.stroke(); }
    g.restore();
    const la = su(tr(t, Tcen, Tcen + 0.3)) * ra;
    if (la > 0.01) { g.save(); g.globalAlpha = la; g.translate(rx - 66, mez(y0, (y0 + y1) / 2, 1)); g.rotate(-Math.PI / 2); redondo(g, -110, -50, 220, 100, 36); g.fillStyle = "#e01818"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 7; g.stroke(); g.font = "800 62px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("25 cm", 0, 4); g.restore(); }
  }
  // el ladrillo de verdad
  const ent = su(tr(t, Tlla, Tlad + 0.15));
  if (ent > 0.001) {
    g.save(); g.translate(mez(1000, 245, ent), MESA - 295); g.rotate(0.35 * (1 - ent)); g.scale(1.05, 1.05); ladrillo(g, t); g.restore();
    const rb = k.pulso(t, Tlad + 0.3, 0.3); if (rb > 0.01) { k.brillo(g, 150, MESA - 280, 560, "255,200,120", 0.35 * rb); }
  }
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.4);
}

export const momentos = { kilo: Tkil, centimetros: Tcen, ladrillo: Tlad };
