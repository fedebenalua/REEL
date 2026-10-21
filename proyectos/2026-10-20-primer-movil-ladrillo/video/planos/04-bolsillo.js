// «Hoy ese ladrillo cabe en el bolsillo del pantalón.»
// Un sitio nuevo: un vaquero, de cerca, con su bolsillo. Una cámara.
// - «ese ladrillo»: el móvil ladrillo, enorme, sobre el bolsillo.
// - «cabe»: se encoge y se transforma en un móvil de hoy.
// - «bolsillo»: el móvil se desliza dentro del bolsillo y solo asoma la parte de arriba.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, tejido } from "../mundo.js";
import { movilLadrillo, movilHoy, inicioMovil } from "../cosas.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(5);
const T0 = f.inicio, Tlad = f.t("ladrillo"), Tcab = f.t("cabe"), Tbol = f.t("bolsillo");
const FIN = v.frase(6).inicio;

const cam = camino2D([[T0, [1.0, 0, -200]], [FIN, [1.04, 0, -160]]]);
const BOCA = -150;                                   // la boca del bolsillo

function bolsillo(g, t) {
  const pul = 1 + 0.015 * k.pulso(t, Tbol + 0.25, 0.25);
  g.save(); g.translate(0, 200); g.scale(pul, pul); g.translate(0, -200);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 18;
  g.beginPath(); g.moveTo(-330, BOCA); g.lineTo(330, BOCA); g.lineTo(330, 340); g.quadraticCurveTo(330, 640, 0, 760); g.quadraticCurveTo(-330, 640, -330, 340); g.closePath(); g.fillStyle = "#2f6fe0"; g.fill(); g.restore();
  g.save(); g.beginPath(); g.moveTo(-330, BOCA); g.lineTo(330, BOCA); g.lineTo(330, 340); g.quadraticCurveTo(330, 640, 0, 760); g.quadraticCurveTo(-330, 640, -330, 340); g.closePath(); g.clip();
  const gr = g.createLinearGradient(-330, 0, 330, 0); gr.addColorStop(0, "#1c4fb8"); gr.addColorStop(0.35, "#3b82f0"); gr.addColorStop(1, "#1a47a4"); g.fillStyle = gr; g.fillRect(-340, BOCA, 680, 940);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(tejido, -330, BOCA, 660, 920); g.restore();
  // la boca del bolsillo, con su dobladillo y sus costuras naranjas
  g.fillStyle = "#245ec8"; g.fillRect(-330, BOCA - 6, 660, 56); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-330, BOCA + 44, 660, 6);
  g.strokeStyle = "#ffb347"; g.lineWidth = 6; g.setLineDash([22, 14]); g.lineCap = "round";
  g.beginPath(); g.moveTo(-318, BOCA + 24); g.lineTo(318, BOCA + 24); g.stroke();
  g.beginPath(); g.moveTo(-300, BOCA + 80); g.lineTo(-300, 340); g.quadraticCurveTo(-300, 620, 0, 725); g.quadraticCurveTo(300, 620, 300, 340); g.lineTo(300, BOCA + 80); g.stroke();
  g.setLineDash([]);
  for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 318, BOCA + 24, 15, 0, 6.2832); g.fillStyle = "#e8a23a"; g.fill(); g.strokeStyle = "#9a6a18"; g.lineWidth = 4; g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // el vaquero
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#10306e"); bg.addColorStop(1, "#0a1c48"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, 3000);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(tejido, -1300, -1500, 2600, 3000); g.restore();
  k.brillo(g, 0, 0, 1100, "120,170,255", 0.22);
  // el móvil: ladrillo enorme → móvil de hoy → dentro del bolsillo
  const enc = su(tr(t, Tcab - 0.05, Tcab + 0.55));
  const cae = su(tr(t, Tbol - 0.1, Tbol + 0.55));
  const y = mez(mez(-406, -342, enc), -95, cae);
  const sLad = mez(0.8, 0.55, enc), sHoy = mez(0.55, 0.5, cae);
  // el móvil va detrás de la parte de abajo del bolsillo: se dibuja antes que él
  g.save(); g.translate(0, y);
  if (enc < 0.5) { g.save(); g.globalAlpha = 1 - su(tr(enc, 0.3, 0.6)); g.scale(sLad, sLad); g.rotate(-0.06 * (1 - enc)); movilLadrillo(g, t, { led: null }); g.restore(); }
  if (enc > 0.3) { g.save(); g.globalAlpha = su(tr(enc, 0.3, 0.65)); g.scale(sHoy, sHoy); movilHoy(g, t, (gg, w, h) => inicioMovil(gg, w, h, t)); g.restore(); }
  g.restore();
  bolsillo(g, t);
  const ch = k.pulso(t, Tcab + 0.3, 0.25); if (ch > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, -330, 700, "255,240,160", 0.7 * ch); g.restore(); }
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.4);
}

export const momentos = { ladrillo: Tlad, cabe: Tcab, bolsillo: Tbol };
