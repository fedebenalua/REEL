// «En España llegó en mil novecientos ochenta y ocho, y todavía sigue funcionando.»
// Otro sitio: un mapa de España hecho de cuadrados de teletexto, con un contador de años debajo. Una cámara; corte de
// entrada en «En».
// - «España»: el mapa se enciende cuadro a cuadro desde Madrid.
// - «llegó… mil novecientos ochenta y ocho»: el contador de años corre y se clava en 1988, con un golpe de luz.
// - «todavía sigue funcionando»: Madrid sigue emitiendo ondas, y el contador sigue corriendo hasta hoy, 2026.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { C, css } from "../teletexto.js";

const DIG = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"], 1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"], 3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"], 5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"], 7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"], 9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};
// cifras de píxeles: cada cifra mide 5×7 cuadrados de lado q, con un hueco de 1 cuadrado entre cifras
function cifras(g, s, q, col) {
  g.fillStyle = css(col, 1);
  [...s].forEach((d, n) => DIG[d].forEach((fila, y) => [...fila].forEach((b, x) => { if (b === "1") g.fillRect((n * 6 + x) * q, y * q, q - 2, q - 2); })));
}

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, lienzo } = k;
const f = v.frase(8);
const T0 = f.inicio, Tesp = f.t("espana"), Tlle = f.t("llego"), Toch = f.t("ocho"), Ttod = f.t("todavia"), Tfun = f.t("funcionando");
const FIN = v.frase(9).inicio;

// el contorno de la península, en unidades de 0 a 100 (x) y de 0 a 80 (y)
const POL = [[6, 14], [14, 8], [26, 10], [38, 9], [50, 10], [60, 9], [66, 13], [74, 11], [84, 12], [92, 16], [88, 24], [82, 30], [80, 36], [78, 44], [81, 52], [77, 58], [70, 64], [60, 70], [46, 74], [38, 78], [31, 76], [22, 71], [21, 60], [23, 50], [22, 42], [24, 34], [19, 28], [13, 24], [8, 19]];
const CELL = 15, S = CELL / 7.5;                // 7,5 px por unidad
const MAD = [46, 38];
const ORIG = [-375, -440];                      // la esquina de arriba a la izquierda del mapa (mundo)
const celdas = (() => {
  const cv = lienzo(10, 10), c = cv.getContext("2d"); c.beginPath(); POL.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath();
  const L = [];
  for (let j = 0; j < 42; j++) for (let i = 0; i < 52; i++) { const ux = (i + 0.5) * CELL / 7.5, uy = (j + 0.5) * CELL / 7.5; if (c.isPointInPath(ux, uy)) L.push({ i, j, d: Math.hypot(ux - MAD[0], uy - MAD[1]) }); }
  return L;
})();
const DMAX = Math.max(...celdas.map((c) => c.d));

const cam = camino2D([[T0, [1.0, 0, 0]], [FIN, [1.06, 0, -20]]]);
// el año que marca el contador
const anio = (t) => {
  if (t < Tlle - 0.1) return 1970;
  if (t < Toch + 0.1) return Math.round(mez(1970, 1988, 1 - (1 - tr(t, Tlle, Toch + 0.1)) ** 2.2));
  if (t < Ttod + 0.05) return 1988;
  return Math.round(mez(1988, 2026, su(tr(t, Ttod + 0.05, FIN - 0.75))));
};
const RING = 1.1;

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1200, 0, 1200); bg.addColorStop(0, "#02061c"); bg.addColorStop(0.5, "#0a1250"); bg.addColorStop(1, "#02061c");
  g.fillStyle = bg; g.fillRect(-1200, -1600, 2400, 3200);
  g.strokeStyle = "rgba(43,233,255,0.08)"; g.lineWidth = 3; for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(i * 90, -1600); g.lineTo(i * 90, 1600); g.stroke(); }
  // las ondas de Madrid
  const ondas = []; for (let T = Tesp + 0.2; T <= Tfun + 0.1 && T < FIN - RING - 0.05; T += 0.45) ondas.push(T);
  const nacer = su(tr(t, Tesp - 0.05, Tesp + 0.9));
  celdas.forEach(({ i, j, d }) => {
    const lleva = su(tr(nacer * 1.6, d / DMAX * 1.0, d / DMAX * 1.0 + 0.6)); if (lleva <= 0.01) return;
    let w = 0; for (const T of ondas) { const u = (t - T) / RING; if (u < 0 || u > 1) continue; const r = u * (DMAX + 8); w = Math.max(w, Math.exp(-((d - r) ** 2) / 20) * (1 - 0.5 * u)); }
    const base = 0.55 + 0.12 * Math.sin(d * 0.5);
    g.fillStyle = w > 0.55 ? css("W", Math.min(1, w) * lleva) : w > 0.1 ? css("Y", (0.5 + w) * lleva) : css("R", base * lleva);
    g.fillRect(ORIG[0] + i * CELL, ORIG[1] + j * CELL, CELL - 1.5, CELL - 1.5);
  });
  // Madrid: un cuadro blanco con su aro
  const mx = ORIG[0] + MAD[0] * 7.5, my = ORIG[1] + MAD[1] * 7.5, mp = su(tr(t, Tesp, Tesp + 0.4));
  if (mp > 0.01) { k.brillo(g, mx, my, 160, "255,230,43", 0.9 * mp); g.fillStyle = css("W", mp); g.fillRect(mx - 15, my - 15, 30, 30); g.strokeStyle = css("Y", mp); g.lineWidth = 6; g.strokeRect(mx - 24, my - 24, 48, 48); }
  // el contador de años
  const a = anio(t), pop = Math.max(k.pulso(t, Toch + 0.2, 0.3), 0);
  g.save(); g.translate(0, 215); g.scale(1 + 0.12 * pop, 1 + 0.12 * pop); const q = 22, cw = 6 * q * 0.99 * 1.0, ch = 7 * q;
  g.fillStyle = "rgba(0,0,0,0.85)"; g.fillRect(-4 * cw / 2 - 26, -14, 4 * cw + 52, ch + 28);
  g.strokeStyle = css(t >= Toch && t < Ttod ? "Y" : "C", 0.9); g.lineWidth = 8; g.strokeRect(-4 * cw / 2 - 26, -14, 4 * cw + 52, ch + 28);
  g.translate(-(4 * 6 - 1) * q / 2, 0); cifras(g, String(a), q, t >= Toch && t < Ttod + 0.2 ? "Y" : "W");
  g.restore();
  if (pop > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 290, 520, "255,230,43", 0.8 * pop); g.restore(); }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.4);
}

export const momentos = { espana: Tesp, llego: Tlle, ocho: Toch, todavia: Ttod };
