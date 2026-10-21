// «Tecleabas tres números, y esperabas a que la página pasara volando por el aire. Para no esperar, cada página traía
// abajo cuatro enlaces, cada uno de un color. Pulsabas el botón de ese color, y la página salía al instante.»
// Otro sitio: una tele de los ochenta, de madera, con el teletexto en pantalla, y el mando delante. Una cámara; corte de
// entrada en «Tecleabas».
// - «tecleabas tres números»: el mando lanza tres destellos y arriba a la izquierda salen P1, P10, P101.
// - «esperabas… volando por el aire»: arriba corren números sin parar; la cámara se abre y las páginas vuelan hacia la
//   tele; la que busca llega y se enciende.
// - «cuatro enlaces, cada uno de un color»: la cámara baja a la fila de abajo; salen las cuatro barras y, sobre cada una,
//   la página a la que lleva, antes de que la pidas.
// - «pulsabas el botón de ese color»: el mando vuelve, aprieta el verde y la página del tiempo salta de golpe.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, madera } from "../mundo.js";
import { mandoColores, MC, IR } from "../objetos.js";
import { pagina, PAG, css, bloques, texto, COLS, ROWS, ENLACES } from "../teletexto.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const T0 = f5.inicio, Tesp = f5.t("esperabas"), Tvol = f5.t("volando"), Taire = f5.t("aire");
const Tnoe = f6.t("esperar"), Tcua = f6.t("cuatro"), Tenl = f6.t("enlaces"), Tcol6 = f6.t("color");
const Tbot = f7.t("boton"), Tcol7 = f7.t("color"), Tpag = f7.t("pagina"), Tins = f7.t("instante");
const FIN = v.frase(8).inicio;

const SX = -430, SY = -310, SW = 660, SH = 495;          // la pantalla de la tele
const PRESS = [T0 + 0.8, T0 + 1.1, T0 + 1.4];            // los tres números
const Tpul = Tcol7 + 0.3;                                 // el botón verde
const Tland = Taire + 0.05;                                // llega la página buscada
const Tsalta = Tpul + 0.12;                               // la página del tiempo salta

const cam = camino2D([
  [T0, [0.95, 0, 100]], [Tesp - 0.2, [0.95, 0, 100]], [Tesp + 0.7, [0.78, 40, 0]], [Taire + 0.3, [0.78, 40, 0]],
  [f6.inicio + 0.2, [0.9, -100, 10]], [f6.inicio + 1.0, [1.45, -100, 40]], [Tenl - 1.0, [1.45, -100, 30]], [Tenl - 0.3, [1.55, -100, 62]], [Tcol6 + 0.7, [1.55, -100, 62]],
  [f7.inicio + 0.4, [0.8, -60, 200]], [FIN, [0.8, -60, 200]],
]);

const burst = (t, p) => Math.max(su(tr(t, p, p + 0.06)) * (1 - su(tr(t, p + 0.16, p + 0.26))), 0);
const rayo = (t) => Math.max(...PRESS.map((p) => burst(t, p)), burst(t, Tpul));
// el mando, de abajo
const offMando = (t) => 520 * (1 - su(tr(t, T0 + 0.05, T0 + 0.6))) + 520 * su(tr(t, Tesp - 0.1, Tesp + 0.5)) * (t < f7.inicio ? 1 : 0) + (t >= f7.inicio ? -520 * 0 : 0);
const offMando2 = (t) => 520 * (1 - su(tr(t, f7.inicio + 0.1, f7.inicio + 0.65)));
const mandoY = (t) => 170 + (t < f6.inicio ? offMando(t) : offMando2(t)) * 1.3;

function tele(g) {
  // el estante
  madera(g, -760, 372, 1520, 60, 10, ["#b0733a", "#7a4520", "#3e1f0c"]);
  // la caja de madera y la cara
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 26; redondo(g, -470, -370, 940, 744, 56); g.fillStyle = "#4a2a14"; g.fill(); g.restore();
  madera(g, -470, -370, 940, 744, 56, ["#d08a44", "#9a5a28", "#552a12"]);
  madera(g, -452, -352, 904, 708, 44, ["#b87238", "#7e4520", "#3c1d0a"]);
  // el hueco de la pantalla
  redondo(g, SX - 26, SY - 26, SW + 52, SH + 52, 50); const cg = g.createLinearGradient(SX, SY, SX + SW, SY + SH); cg.addColorStop(0, "#f4f1e6"); cg.addColorStop(0.5, "#8c8a82"); cg.addColorStop(1, "#d8d4c6"); g.fillStyle = cg; g.fill();
  redondo(g, SX - 14, SY - 14, SW + 28, SH + 28, 38); g.fillStyle = "#040405"; g.fill();
  // el panel de la derecha: altavoz y perillas
  redondo(g, 262, SY - 14, 180, 150, 18); g.fillStyle = "#20120a"; g.fill();
  g.save(); redondo(g, 262, SY - 14, 180, 150, 18); g.clip(); for (let i = 0; i < 11; i++) { const x = 274 + i * 15; g.fillStyle = "#c9a050"; g.fillRect(x, SY - 4, 8, 130); } g.restore();
  for (const [px, py] of [[318, 20], [388, 20], [318, 120], [388, 120]]) { g.beginPath(); g.arc(px, py, 30, 0, 6.2832); g.fillStyle = "#2a1a0e"; g.fill(); g.beginPath(); g.arc(px, py, 26, 0, 6.2832); const kg = g.createRadialGradient(px - 8, py - 10, 3, px, py, 28); kg.addColorStop(0, "#fffbe8"); kg.addColorStop(1, "#8a7a4a"); g.fillStyle = kg; g.fill(); g.fillStyle = "#3a2a10"; g.fillRect(px - 2.5, py - 22, 5, 16); }
}

// una mini página que vuela (o que sube sobre un enlace)
function miniPag(g, col, w, h) {
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h); g.fillStyle = css("C"); g.fillRect(6, 6, w * 0.5, h * 0.1);
  for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(6, h * 0.25 + i * h * 0.15, w * (0.8 - 0.12 * i), h * 0.07); }
  g.fillStyle = css(col); g.fillRect(0, h - h * 0.12, w, h * 0.12);
  g.strokeStyle = css(col); g.lineWidth = 5; g.strokeRect(0, 0, w, h);
}

// el reloj de arena tachado de «para no esperar»
const RELOJ = ["WWWWWWWWWWWW", " WWWWWWWWWW ", "  WWWWWWWW  ", "   WWWWWW   ", "    WWWW    ", "     WW     ", "     WW     ", "    WCCW    ", "   WCCCCW   ", "  WCCCCCCW  ", " WCCCCCCCCW ", "WWWWWWWWWWWW"];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared: verde azulado, con la luz de la tele
  const bg = g.createLinearGradient(0, -1200, 0, 900); bg.addColorStop(0, "#0e2a42"); bg.addColorStop(1, "#071622"); g.fillStyle = bg; g.fillRect(-1600, -1400, 3200, 2400);
  g.strokeStyle = "rgba(255,255,255,0.035)"; g.lineWidth = 10; for (let i = -16; i <= 16; i++) { g.beginPath(); g.moveTo(i * 90, -1400); g.lineTo(i * 90, 900); g.stroke(); }
  k.brillo(g, -100, -60, 1500, "70,120,255", 0.28);
  tele(g);
  // ----- qué se ve en la pantalla
  const cuenta = (() => {
    if (t < PRESS[0]) return null;
    if (t < PRESS[1]) return "P1--"; if (t < PRESS[2]) return "P10-"; if (t < Tesp) return "P101";
    if (t < Tland) return "P" + (100 + ((Math.floor((t - Tesp) * 22) * 37) % 800));
    return null;
  })();
  const landed = t >= Tland, flip = t >= Tsalta;
  const def = flip ? PAG.tiempo : landed ? PAG.noticias : PAG.indice;
  const enl = landed && t < f6.inicio + 0.1 ? [0, 0, 0, 0] : landed && !flip && t < Tcua ? [0, 0, 0, 0] : [0, 1, 2, 3].map((i) => (flip ? 1 : su(tr(t, Tcua + 0.18 * i, Tcua + 0.18 * i + 0.3))));
  const lit = [0, 1, 2, 3].map((i) => Math.max(k.pulso(t, Tcol6 - 0.5 + 0.28 * i, 0.22), i === 1 ? Math.max(su(tr(t, Tpul, Tpul + 0.05)) * (1 - su(tr(t, Tpul + 0.2, Tpul + 0.45))), 0) : 0));
  const desfase = [0, 1, 2, 3].map((i) => 40 * (1 - su(tr(t, Tcua + 0.18 * i, Tcua + 0.18 * i + 0.3))) * (t < Tsalta ? 1 : 0));
  g.save(); redondo(g, SX, SY, SW, SH, 26); g.clip(); g.translate(SX, SY);
  // la página
  g.save();
  if (landed && !flip) { const e = su(tr(t, Tland, Tland + 0.16)); g.globalAlpha = 1; }
  pagina(g, SW, SH, def, { cuenta, enl, lit, desfase, nubeOff: flip ? 2 * (((t - Tsalta) * 1.1) % 2 - 1) : 0 });
  g.restore();
  // el reloj de arena tachado
  const rj = su(tr(t, Tnoe - 0.05, Tnoe + 0.25)) * (1 - su(tr(t, Tcua - 0.9, Tcua - 0.6)));
  if (rj > 0.01) { const cw = SW / COLS, ch = SH / ROWS; g.save(); g.globalAlpha = rj; g.fillStyle = "rgba(0,0,0,0.78)"; g.fillRect(12 * cw, 7 * ch, 16 * cw, 14 * ch); bloques(g, RELOJ, 17, 9, cw * 1.0, ch * 1.0); g.strokeStyle = "#ff3b3b"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(14 * cw, 8 * ch); g.lineTo(26 * cw, 20 * ch); g.moveTo(26 * cw, 8 * ch); g.lineTo(14 * cw, 20 * ch); g.stroke(); g.restore(); }
  // el destello cuando llega una página
  for (const T of [Tland, Tsalta]) { const u = (t - T) / 0.3; if (u > 0 && u < 1) { g.fillStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; g.fillRect(0, 0, SW, SH); } }
  // las páginas a las que lleva cada enlace, subiendo
  const cw2 = SW / COLS, ch2 = SH / ROWS;
  ENLACES.forEach(([c], i) => {
    const s = su(tr(t, Tenl + 0.16 * i, Tenl + 0.16 * i + 0.35)) * (1 - su(tr(t, Tcol6 + 0.5, Tcol6 + 0.85)));
    if (s < 0.01) return; g.save(); g.translate(i * 10 * cw2 + 5 * cw2, 24 * ch2 - 25 - 140 * s); g.scale(s, s); g.translate(-70, -52); miniPag(g, c, 140, 104); g.restore();
    g.strokeStyle = css(c, 0.8 * s); g.lineWidth = 4; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(i * 10 * cw2 + 5 * cw2, 24 * ch2 - 25 - 140 * s + 52); g.lineTo(i * 10 * cw2 + 5 * cw2, 24 * ch2); g.stroke(); g.setLineDash([]);
  });
  // el cristal: líneas y brillo
  g.fillStyle = "rgba(0,0,0,0.12)"; for (let y = 0; y < SH; y += 4) g.fillRect(0, y, SW, 2);
  const gl = g.createLinearGradient(0, 0, SW * 0.8, SH * 0.8); gl.addColorStop(0, "rgba(255,255,255,0.16)"); gl.addColorStop(0.4, "rgba(255,255,255,0)"); g.fillStyle = gl; g.fillRect(0, 0, SW, SH);
  g.restore();
  k.brillo(g, SX + SW / 2, SY + SH / 2, 700, "120,160,255", 0.22);
  // ----- las páginas que vuelan por el aire
  if (t > Tvol - 0.5 && t < Taire + 0.3) {
    for (let i = 0; i < 8; i++) {
      const t0 = Tvol - 0.3 + i * 0.16, u = (t - t0) / 0.75; if (u < 0 || u > 1) continue;
      const e = su(u), x0 = 900 + 60 * (i % 3), y0 = -330 + 70 * ((i * 5) % 6), tx = SX + SW / 2, ty = SY + SH / 2;
      const px = mez(x0, tx, e) + 80 * Math.sin(e * 3.1416 + i), py = mez(y0, ty, e) - 120 * Math.sin(e * 3.1416), s = mez(1.2, 0.5, e), al = 1 - su(tr(u, 0.8, 1));
      g.save(); g.translate(px, py); g.rotate(0.9 * Math.sin(u * 7 + i)); g.scale(s, s); g.globalAlpha = al; g.shadowColor = "rgba(120,180,255,0.9)"; g.shadowBlur = 30; g.translate(-70, -52); miniPag(g, ["R", "G", "Y", "B", "M", "C", "R", "Y"][i], 140, 104); g.restore();
    }
  }
  // ----- el mando de abajo
  const my = mandoY(t);
  if (my < 1100) {
    const bote = [0, 1, 2, 3].map((i) => (i === 1 ? Math.sin(Math.PI * tr(t, Tpul - 0.05, Tpul + 0.3)) : 0));
    const litM = [0, 1, 2, 3].map((i) => (i === 1 ? su(tr(t, Tbot, Tpul)) * (1 - su(tr(t, Tpul + 0.9, Tpul + 1.3))) : su(tr(t, f7.inicio + 0.6, f7.inicio + 1.0)) * 0.7 * (1 - su(tr(t, Tpul, Tpul + 0.3)))));
    g.save(); g.translate(330, my); g.rotate(-0.3); g.scale(0.74, 0.74); g.translate(0, -282); mandoColores(g, t, { led: rayo(t), lit: litM, bote }); g.restore();
    const ri = rayo(t);
    if (ri > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; for (const [a, w2] of [[0.25, 52], [0.95, 18], [0.9, 6]]) { g.strokeStyle = a === 0.9 ? `rgba(255,235,240,${a * ri})` : `rgba(${IR},${a * ri})`; g.lineWidth = w2; g.beginPath(); g.moveTo(322, my - 22); g.lineTo(236, SY + SH * 0.55); g.stroke(); } g.restore(); }
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { tecleo: PRESS[0], espera: Tesp, llega: Tland, enlaces: Tcua, pulsa: Tpul, salta: Tsalta };
