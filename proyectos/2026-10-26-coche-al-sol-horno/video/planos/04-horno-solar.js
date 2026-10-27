// «De hecho, los hornos solares con los que se cocina son justo eso: una caja oscura con un cristal encima.»
// Otro sitio: un horno solar de caja sobre la hierba, al sol. Se entra con un corte en «De».
// - Desde el primer fotograma: la caja de madera, negra por dentro, con su cristal y el espejo abierto detrás; dentro,
//   una olla negra. Los rayos de sol entran por el cristal.
// - «cocina»: la tapa de la olla se mueve con el hervor y el cristal se empaña de vapor.
// - «caja oscura»: la cámara se acerca. «cristal»: un brillo lo recorre.
import * as k from "#kit";
import { v } from "#voz";
import { velo, vineta } from "../mundo.js";

const f10 = v.frase(10);
export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f10.inicio, Thor = f10.t("hornos"), Tcoc = f10.t("cocina"), Tcaja = f10.t("caja"), Tcri = f10.t("cristal"), Tenc = f10.t("encima");
const Fin = v.frase(11).inicio;

const SOLH = [800, 640];
const ACERCA = k.claves([[T0, 0], [Tcaja - 0.3, 0.35], [Tcri + 0.1, 1]]);
const hierba = (() => {
  const W = 512, l = k.lienzo(W, W), c = l.getContext("2d"), az = azar(71);
  c.fillStyle = "#4f9a3a"; c.fillRect(0, 0, W, W);
  for (let i = 0; i < 6000; i++) {
    const x = az() * W, y = az() * W, h = 6 + az() * 16, a = (az() - 0.5) * 0.6;
    c.strokeStyle = az() < 0.5 ? `rgba(30,80,20,${0.4 + az() * 0.4})` : `rgba(170,230,110,${0.3 + az() * 0.4})`;
    c.lineWidth = 1.5;
    for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) {
      if (x + dx < -20 || x + dx > W + 20 || y + dy < -20 || y + dy > W + 20) continue;
      c.beginPath(); c.moveTo(x + dx, y + dy); c.lineTo(x + dx + Math.sin(a) * h, y + dy - Math.cos(a) * h); c.stroke();
    }
  }
  return l;
})();
const patrones = new WeakMap();
const patronHierba = (g) => { if (!patrones.has(g)) patrones.set(g, g.createPattern(hierba, "repeat")); return patrones.get(g); };
const vetas = (() => {
  const W = 512, l = k.lienzo(W, 256), c = l.getContext("2d"), az = azar(19);
  c.fillStyle = "#808080"; c.fillRect(0, 0, W, 256);
  for (let i = 0; i < 90; i++) {
    const y = az() * 256, a = 0.15 + az() * 0.3;
    c.strokeStyle = `rgba(40,20,0,${a})`; c.lineWidth = 1 + az() * 3;
    c.beginPath(); for (let x = 0; x <= W; x += 16) { const yy = y + 4 * Math.sin(x * 0.02 + i); x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke();
  }
  return l;
})();
const poli = (g, P) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

// La caja, en perspectiva: la cara de delante y la tapa de cristal; el espejo, abierto detrás.
const FR = [[190, 1230], [890, 1230], [890, 1520], [190, 1520]];
const TOP = [[270, 1050], [810, 1050], [890, 1230], [190, 1230]];
const ESP = [[270, 1050], [810, 1050], [870, 640], [210, 640]];
const LAT = [[890, 1230], [810, 1050], [810, 1330], [890, 1520]];

function caja(g, t) {
  // la sombra en la hierba
  g.save(); g.fillStyle = "rgba(10,40,5,0.45)"; g.beginPath(); g.ellipse(520, 1530, 440, 60, 0, 0, 6.2832); g.fill(); g.restore();
  // el espejo de detrás: papel de aluminio, con el cielo y el sol reflejados
  poli(g, ESP);
  const eg = g.createLinearGradient(210, 640, 870, 1050);
  eg.addColorStop(0, "#e9eef4"); eg.addColorStop(0.35, "#9aa6b4"); eg.addColorStop(0.55, "#f7f9fc"); eg.addColorStop(0.8, "#8c97a6"); eg.addColorStop(1, "#d9e0e8");
  g.fillStyle = eg; g.fill();
  g.save(); poli(g, ESP); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.red2, 150, 600, 800, 500);
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 1;
  k.brillo(g, 640, 800, 520, "255,236,190", 0.55 + 0.1 * Math.sin(t * 2));
  g.restore();
  g.strokeStyle = "#7a5230"; g.lineWidth = 12; poli(g, ESP); g.stroke();
  // los lados de madera
  poli(g, LAT); g.fillStyle = "#7a4b25"; g.fill();
  // el interior negro, a través del cristal
  poli(g, TOP); g.fillStyle = "#0b0b0d"; g.fill();
  g.save(); poli(g, TOP); g.clip();
  const ig = g.createRadialGradient(540, 1150, 20, 540, 1150, 420); ig.addColorStop(0, "rgba(60,40,30,0.8)"); ig.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = ig; g.fillRect(180, 1040, 720, 200);
  olla(g, t);
  g.restore();
  // la cara de delante, de madera
  poli(g, FR);
  const mg = g.createLinearGradient(0, 1230, 0, 1520); mg.addColorStop(0, "#c98b4f"); mg.addColorStop(0.5, "#a96d38"); mg.addColorStop(1, "#7a4b25");
  g.fillStyle = mg; g.fill();
  g.save(); poli(g, FR); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(vetas, 190, 1230, 700, 290); g.restore();
  g.strokeStyle = "rgba(255,220,170,0.6)"; g.lineWidth = 4; g.beginPath(); g.moveTo(192, 1232); g.lineTo(888, 1232); g.stroke();
}

function olla(g, t) {
  const x = 540, y = 1150, hierve = su(tr(t, Tcoc - 0.3, Tcoc + 0.3));
  // el cuerpo negro de la olla
  const og = g.createLinearGradient(x - 170, 0, x + 170, 0);
  og.addColorStop(0, "#050505"); og.addColorStop(0.3, "#2c2c30"); og.addColorStop(0.5, "#4a4a50"); og.addColorStop(1, "#060606");
  g.fillStyle = og; g.beginPath(); g.moveTo(x - 170, y - 30); g.lineTo(x - 160, y + 60); g.quadraticCurveTo(x, y + 100, x + 160, y + 60); g.lineTo(x + 170, y - 30); g.closePath(); g.fill();
  // la tapa, que da saltitos con el hervor
  const salto = hierve * Math.max(0, Math.sin(t * 18)) * 5;
  g.fillStyle = "#1b1b1e"; g.beginPath(); g.ellipse(x, y - 32 - salto, 174, 40, 0, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(x - 40, y - 44 - salto, 90, 12, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#333338"; k.redondo(g, x - 30, y - 70 - salto, 60, 24, 10); g.fill();
  g.strokeStyle = "rgba(255,230,190,0.55)"; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y - 32 - salto, 174, 40, 0, 3.3, 6.1); g.stroke();
  // las asas
  g.strokeStyle = "#1b1b1e"; g.lineWidth = 14; g.beginPath(); g.arc(x - 190, y - 10, 22, 1.6, 4.7); g.stroke(); g.beginPath(); g.arc(x + 190, y - 10, 22, -1.5, 1.5); g.stroke();
}

function cristal(g, t, brilloU, vaho) {
  g.save(); poli(g, TOP); g.clip();
  const cg = g.createLinearGradient(190, 1050, 890, 1230);
  cg.addColorStop(0, "rgba(200,225,255,0.22)"); cg.addColorStop(0.5, "rgba(255,255,255,0.06)"); cg.addColorStop(1, "rgba(200,225,255,0.2)");
  g.fillStyle = cg; g.fillRect(180, 1040, 720, 200);
  // el vaho: gotitas y niebla blanca
  if (vaho > 0.01) {
    g.globalAlpha = 0.12 * vaho; g.globalCompositeOperation = "screen"; g.drawImage(k.manchas, 150, 1000, 800, 300);
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    const az = azar(3);
    for (let i = 0; i < 45; i++) { const px = 220 + az() * 640, py = 1060 + az() * 160, r = 1.5 + az() * 3.5; g.fillStyle = `rgba(255,255,255,${0.35 * vaho})`; g.beginPath(); g.arc(px, py, r, 0, 6.2832); g.fill(); }
  }
  if (brilloU > 0 && brilloU < 1) {
    const x = mez(0, 1100, brilloU);
    g.globalCompositeOperation = "lighter";
    const bg = g.createLinearGradient(x - 120, 0, x + 120, 0);
    bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(0.5, "rgba(255,255,255,0.75)"); bg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = bg; g.beginPath(); g.moveTo(x - 200, 1240); g.lineTo(x + 40, 1240); g.lineTo(x + 140, 1040); g.lineTo(x - 100, 1040); g.closePath(); g.fill();
  }
  g.restore();
  g.strokeStyle = "#5e3a1c"; g.lineWidth = 14; poli(g, TOP); g.stroke();
}

export function dibuja(g, t) {
  const acerca = ACERCA(t);
  const Z = Math.exp(mez(Math.log(0.92), Math.log(1.28), acerca));
  const cx = 540, cy = mez(980, 1120, acerca);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540, 960); g.scale(Z, Z); g.translate(-cx, -cy);
  // el cielo y el sol
  const sg = g.createLinearGradient(0, -200, 0, 1000); sg.addColorStop(0, "#0b3a9a"); sg.addColorStop(0.65, "#3a8ae0"); sg.addColorStop(1, "#bfe0f5");
  g.fillStyle = sg; g.fillRect(-400, -400, 1900, 1420);
  g.save(); g.globalCompositeOperation = "lighter";
  const rg = g.createRadialGradient(SOLH[0], SOLH[1], 60, SOLH[0], SOLH[1], 700);
  rg.addColorStop(0, "rgba(255,236,180,0.85)"); rg.addColorStop(0.3, "rgba(255,210,140,0.3)"); rg.addColorStop(1, "rgba(255,200,130,0)");
  g.fillStyle = rg; g.fillRect(-400, -400, 1900, 1420);
  g.restore();
  const dg = g.createRadialGradient(SOLH[0] - 15, SOLH[1] - 15, 0, SOLH[0], SOLH[1], 80);
  dg.addColorStop(0, "#ffffff"); dg.addColorStop(0.7, "#fff6d0"); dg.addColorStop(1, "#ffd27a");
  g.fillStyle = dg; g.beginPath(); g.arc(SOLH[0], SOLH[1], 80, 0, 6.2832); g.fill();
  // el seto del fondo
  g.fillStyle = "#2f6b32";
  g.beginPath(); g.moveTo(-400, 1010); for (let x = -400; x <= 1500; x += 60) g.lineTo(x, 960 + 22 * Math.sin(x * 0.03) + 12 * Math.sin(x * 0.11)); g.lineTo(1500, 1030); g.lineTo(-400, 1030); g.closePath(); g.fill();
  // la hierba
  const hg = g.createLinearGradient(0, 1000, 0, 2200); hg.addColorStop(0, "#8cc860"); hg.addColorStop(1, "#2f6e22");
  g.fillStyle = hg; g.fillRect(-400, 1000, 1900, 1300);
  g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = patronHierba(g); g.fillRect(-400, 1000, 1900, 1300); g.restore();
  caja(g, t);
  cristal(g, t, tr(t, Tcri - 0.15, Tcri + 0.6), su(tr(t, Tcoc - 0.2, Tcoc + 0.8)));
  // los rayos de sol que entran por el cristal
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const bx = 300 + i * 150, a = 0.16 + 0.04 * Math.sin(t * 1.4 + i);
    const lg = g.createLinearGradient(SOLH[0], SOLH[1], bx, 1180);
    lg.addColorStop(0, `rgba(255,236,180,${a * 0.4})`); lg.addColorStop(0.85, `rgba(255,226,160,${a})`); lg.addColorStop(1, "rgba(255,226,160,0)");
    g.fillStyle = lg; g.beginPath(); g.moveTo(SOLH[0] - 30, SOLH[1]); g.lineTo(SOLH[0] + 30, SOLH[1]); g.lineTo(bx + 60, 1190); g.lineTo(bx - 60, 1190); g.closePath(); g.fill();
  }
  g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0);
  vineta(g, 0.4);
  velo(g, 0.5);
}
