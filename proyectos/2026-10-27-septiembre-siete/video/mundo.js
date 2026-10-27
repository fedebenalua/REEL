// Lo que comparten los planos: la letra tallada, la moneda de oro (lo que dice el nombre de un mes) y la chapa roja
// (su puesto en el año).
import * as k from "#kit";
import { GlobalFonts } from "@napi-rs/canvas";

// La letra tallada: una romana del sistema (sin registrar nada, para no tocar las letras del motor en cada hilo).
// Ninguna letra se mira ni se usa al cargar el módulo: render.mjs lo carga en el hilo principal sin Figtree, y si se
// usan letras ahí, los hilos que dibujan se quedan sin Figtree.
const ROMANAS = ["Noto Serif Display", "Noto Serif", "Liberation Serif", "DejaVu Serif"];
let romanaHecha = null;
export function romana() {
  if (!romanaHecha) { const hay = new Set(GlobalFonts.families.map((f) => f.family)); const r = ROMANAS.find((f) => hay.has(f)); romanaHecha = r ? `'${r}'` : "Figtree"; }
  return romanaHecha;
}

export const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mezHex = (a, b, u) => { const x = hexRgb(a), y = hexRgb(b); return `rgb(${x.map((c, i) => Math.round(c + (y[i] - c) * u)).join(",")})`; };

// La moneda de oro con un número: lo que dice el nombre del mes. `u` de 0 a 1 la hace saltar (crece con rebote).
export function moneda(g, x, y, r, num, u = 1, al = 1) {
  if (u <= 0 || al <= 0) return;
  const s = u < 1 ? k.entra(u) * (1 + 0.18 * Math.sin(u * Math.PI)) : 1;
  const R = r * s;
  g.save(); g.globalAlpha *= al;
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(x, y, R * 0.6, x, y, R * 2.1);
  hg.addColorStop(0, "rgba(255,200,80,0.45)"); hg.addColorStop(1, "rgba(255,170,40,0)");
  g.fillStyle = hg; g.beginPath(); g.arc(x, y, R * 2.1, 0, 6.2832); g.fill(); g.restore();
  g.shadowColor = "rgba(40,20,0,0.55)"; g.shadowBlur = R * 0.35; g.shadowOffsetY = R * 0.12;
  const cg = g.createLinearGradient(x - R, y - R, x + R, y + R);
  cg.addColorStop(0, "#fff1a8"); cg.addColorStop(0.35, "#f6c443"); cg.addColorStop(0.7, "#c98b16"); cg.addColorStop(1, "#8a5a08");
  g.fillStyle = cg; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  const ig = g.createLinearGradient(x + R, y + R, x - R, y - R);
  ig.addColorStop(0, "#ffe27a"); ig.addColorStop(0.5, "#e2a52a"); ig.addColorStop(1, "#a86d0c");
  g.fillStyle = ig; g.beginPath(); g.arc(x, y, R * 0.82, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(120,70,0,0.55)"; g.lineWidth = Math.max(1, R * 0.04); g.beginPath(); g.arc(x, y, R * 0.82, 0, 6.2832); g.stroke();
  g.font = `900 ${Math.round(R * (String(num).length > 1 ? 0.95 : 1.15))}px ${romana()}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(255,248,210,0.9)"; g.fillText(num, x - R * 0.03, y + R * 0.06 - R * 0.03);
  g.fillStyle = "#6b3f00"; g.fillText(num, x, y + R * 0.06);
  g.globalCompositeOperation = "screen";
  const br = g.createRadialGradient(x - R * 0.4, y - R * 0.45, 0, x - R * 0.4, y - R * 0.45, R * 0.9);
  br.addColorStop(0, "rgba(255,255,240,0.75)"); br.addColorStop(1, "rgba(255,255,240,0)");
  g.fillStyle = br; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fill();
  g.restore();
}

// La chapa del puesto: gris pizarra cuando cuadra, roja cuando no. `rojo` de 0 a 1.
export function chapa(g, x, y, r, num, rojo = 0, al = 1, pop = 0) {
  if (al <= 0) return;
  const R = r * (1 + 0.25 * pop);
  g.save(); g.globalAlpha *= al;
  if (rojo > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    const hg = g.createRadialGradient(x, y, R * 0.5, x, y, R * 2);
    hg.addColorStop(0, `rgba(255,60,60,${0.4 * rojo})`); hg.addColorStop(1, "rgba(255,40,40,0)");
    g.fillStyle = hg; g.beginPath(); g.arc(x, y, R * 2, 0, 6.2832); g.fill(); g.restore();
  }
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = R * 0.25; g.shadowOffsetY = R * 0.08;
  const a = mezHex("#3c4656", "#e3262f", rojo), b = mezHex("#232a35", "#a3121b", rojo);
  const cg = g.createLinearGradient(x, y - R, x, y + R); cg.addColorStop(0, a); cg.addColorStop(1, b);
  g.fillStyle = cg; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = Math.max(1, R * 0.06); g.beginPath(); g.arc(x, y, R * 0.9, 0, 6.2832); g.stroke();
  g.font = `800 ${Math.round(R * (String(num).length > 1 ? 1.0 : 1.2))}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#fff"; g.fillText(num, x, y + R * 0.05);
  g.restore();
}

// Las hojas del calendario de la pared: 760 × 900, con su anilla arriba, la franja de color y los días.
export const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
export const COLOR_MES = ["#2f6fe4", "#8b45e8", "#1fa85a", "#0aa39a", "#e0a106", "#f0731c", "#e2433c", "#e8861a", "#0d7f9a", "#6d3fd6", "#2456c9", "#0f8a5f"];
export const PW = 760, PH = 900, CAB = 250;
const DIAS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const EMPIEZA = [3, 6, 6, 2, 4, 0, 2, 5, 1, 3, 6, 1]; // 2026, lunes = 0

function hojaBase(i) {
  const c = k.lienzo(PW, PH), x = c.getContext("2d");
  const pg = x.createLinearGradient(0, 0, PW, PH); pg.addColorStop(0, "#fffdf8"); pg.addColorStop(1, "#efe9de");
  k.redondo(x, 0, 0, PW, PH, 26); x.fillStyle = pg; x.fill();
  x.save(); k.redondo(x, 0, 0, PW, PH, 26); x.clip();
  x.globalAlpha = 0.07; x.globalCompositeOperation = "multiply"; x.drawImage(k.red, 0, 0, PW, PH); x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
  const col = COLOR_MES[i];
  const hg = x.createLinearGradient(0, 0, 0, CAB); hg.addColorStop(0, mezHex(col, "#ffffff", 0.18)); hg.addColorStop(1, mezHex(col, "#000000", 0.12));
  x.fillStyle = hg; x.fillRect(0, 0, PW, CAB);
  x.globalAlpha = 0.12; x.globalCompositeOperation = "screen"; x.drawImage(k.manchas, 0, 0, PW, CAB); x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
  x.restore();
  // los días
  x.textAlign = "center"; x.textBaseline = "middle";
  const cw = (PW - 80) / 7, y0 = CAB + 70, ch = (PH - CAB - 120) / 6;
  x.font = "800 34px Figtree";
  ["L", "M", "X", "J", "V", "S", "D"].forEach((d, j) => { x.fillStyle = j === 6 ? "#d23a3a" : "#7a808a"; x.fillText(d, 40 + cw * (j + 0.5), y0); });
  x.font = "700 44px Figtree";
  for (let d = 0; d < DIAS[i]; d++) {
    const p = d + EMPIEZA[i], col2 = p % 7, fila = Math.floor(p / 7);
    x.fillStyle = col2 === 6 ? "#d23a3a" : "#2c313a";
    x.fillText(String(d + 1), 40 + cw * (col2 + 0.5), y0 + ch * (fila + 1));
  }
  // los agujeros de la anilla
  for (let j = 0; j < 9; j++) { const ax = 80 + j * 75; x.fillStyle = "rgba(0,0,0,0.35)"; x.beginPath(); x.arc(ax, 28, 9, 0, 6.2832); x.fill(); }
  return c;
}
const HOJAS = [];
export const DORSO = (() => {
  const c = k.lienzo(PW, PH), x = c.getContext("2d");
  const pg = x.createLinearGradient(0, 0, 0, PH); pg.addColorStop(0, "#f3eee4"); pg.addColorStop(1, "#ddd5c6");
  k.redondo(x, 0, 0, PW, PH, 26); x.fillStyle = pg; x.fill();
  x.save(); k.redondo(x, 0, 0, PW, PH, 26); x.clip(); x.globalAlpha = 0.1; x.globalCompositeOperation = "multiply"; x.drawImage(k.red, 0, 0, PW, PH); x.restore();
  return c;
})();

// Dibuja la hoja i en coordenadas de la hoja (0..PW, 0..PH), con el nombre del mes; `oro` enciende las letras que
// dicen el número (SEPT, OCT...).
const RAIZ_NUM = { 8: 4, 9: 3, 10: 3, 11: 3 }; // SEPT, OCT, NOV, DIC: cuántas letras se encienden
export function hoja(g, i, oro = 0) {
  g.drawImage(HOJAS[i] ??= hojaBase(i), 0, 0);
  const nombre = MESES[i];
  let tam = 132; g.font = `800 ${tam}px Figtree`;
  const w = g.measureText(nombre).width; if (w > PW - 80) { tam = Math.floor(tam * (PW - 80) / w); g.font = `800 ${tam}px Figtree`; }
  const total = g.measureText(nombre).width, x0 = PW / 2 - total / 2, yb = CAB / 2 + 18;
  g.textAlign = "left"; g.textBaseline = "middle";
  g.fillStyle = "rgba(0,0,0,0.18)"; g.fillText(nombre, x0 + 4, yb + 6);
  const n = oro > 0 ? (RAIZ_NUM[i] ?? 0) : 0;
  const a = nombre.slice(0, n), b = nombre.slice(n), wa = g.measureText(a).width;
  g.fillStyle = "#ffffff"; g.fillText(b, x0 + wa, yb);
  if (n) {
    g.save();
    g.shadowColor = `rgba(255,190,40,${0.9 * oro})`; g.shadowBlur = 40 * oro;
    g.fillStyle = mezHex("#ffffff", "#ffd23f", oro); g.fillText(a, x0, yb);
    g.restore();
  }
  return { x0, wa, yb, tam };
}
