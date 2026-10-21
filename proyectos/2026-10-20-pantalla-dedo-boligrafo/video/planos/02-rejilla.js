// «Debajo del cristal hay una rejilla de cables finísimos, cruzados como una cuadrícula. /
//  Por ellos pasa electricidad, y en cada cruce se forma un pequeño campo eléctrico.»
// Un sitio nuevo: el interior de la pantalla, visto desde arriba, sobre un fondo azul oscuro. Una cámara que se echa sobre un cruce.
// - «cristal»: el cristal del móvil se levanta y se va hacia la cámara.
// - «rejilla», «cables»: crecen los cables, los de las filas (azules) y los de las columnas (rosas).
// - «cruzados»: en cada cruce se enciende un punto, en ola. «cuadrícula»: una luz barre toda la rejilla.
// - «electricidad»: corren luces por todos los cables.
// - «cruce»: la cámara se echa sobre un cruce. «campo»: nacen los arcos del campo entre sus dos cables.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, movil, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const F3 = v.frase(3), F4 = v.frase(4);
const T0 = F3.inicio, Tcri = F3.t("cristal"), Trej = F3.t("rejilla"), Tcab = F3.t("cables"), Tcru = F3.t("cruzados"), Tcua = F3.t("cuadricula");
const Tele = F4.t("electricidad"), Tcrc = F4.t("cruce"), Tcam = F4.t("campo");
const FIN = v.frase(5).inicio;
const XS = Array.from({ length: 8 }, (_, i) => -350 + i * 100), YS = Array.from({ length: 15 }, (_, i) => -700 + i * 100);
const NX = 50, NY = 100;

const cam = camino2D([[T0, [1.08, 0, 30]], [Tcri + 0.9, [1.0, 0, 0]], [Tcrc - 0.5, [1.0, 0, 0]], [Tcrc + 1.1, [4.0, NX, NY]], [FIN, [4.0, NX, NY]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // el fondo
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#06102a"); bg.addColorStop(1, "#102a5a"); g.fillStyle = bg; g.fillRect(-1600, -1600, 3200, 3200);
  k.brillo(g, 0, 0, 2400, "60,110,255", 0.22);
  // la placa de la pantalla, azul oscuro, con su borde
  g.save(); redondo(g, -420, -780, 840, 1560, 40); g.fillStyle = "rgba(20,50,110,0.65)"; g.fill(); g.strokeStyle = "rgba(120,180,255,0.45)"; g.lineWidth = 5; g.stroke(); g.restore();
  const lw = 7 / Math.pow(Z, 0.55), ancho = mez(1, 1, 0);
  // los cables de las filas (azules) y de las columnas (rosas), que crecen
  g.save(); g.lineCap = "round";
  YS.forEach((y, i) => {
    const u = su(tr(t, Trej - 0.4 + i * 0.03, Trej + 0.2 + i * 0.03)); if (u <= 0.001) return;
    g.strokeStyle = "rgba(90,200,255,0.35)"; g.lineWidth = lw * 3; g.beginPath(); g.moveTo(-380, y); g.lineTo(mez(-380, 380, u), y); g.stroke();
    g.strokeStyle = "#5ac8ff"; g.lineWidth = lw; g.stroke();
  });
  XS.forEach((x, j) => {
    const u = su(tr(t, Tcab - 0.6 + j * 0.07, Tcab + 0.3 + j * 0.07)); if (u <= 0.001) return;
    g.strokeStyle = "rgba(255,110,200,0.35)"; g.lineWidth = lw * 3; g.beginPath(); g.moveTo(x, -740); g.lineTo(x, mez(-740, 740, u)); g.stroke();
    g.strokeStyle = "#ff6ec8"; g.lineWidth = lw; g.stroke();
  });
  g.restore();
  // la luz que barre la rejilla al decir «cuadrícula»
  const sw = tr(t, Tcua - 0.2, Tcua + 0.9);
  if (sw > 0 && sw < 1) { g.save(); g.globalCompositeOperation = "lighter"; const bx = mez(-420, 420, su(sw)); const sg = g.createLinearGradient(bx - 120, 0, bx + 120, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.55)"); sg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = sg; g.fillRect(bx - 120, -780, 240, 1560); g.restore(); }
  // los puntos de cada cruce, en ola desde el centro
  g.save();
  XS.forEach((x, j) => YS.forEach((y, i) => {
    const d = Math.hypot(x, y) / 900, u = su(tr(t, Tcru + d * 0.9, Tcru + d * 0.9 + 0.3)); if (u <= 0.01) return;
    const r = (5 + 8 * u) / Math.pow(Z, 0.3);
    g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, r * 7 * (0.6 + 0.4 * u), "255,240,200", 0.55 * u);
    g.globalCompositeOperation = "source-over"; g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }));
  g.restore();
  // la electricidad que corre por los cables
  const ea = su(tr(t, Tele - 0.2, Tele + 0.5)) * (1 - su(tr(t, FIN - 0.9, FIN - 0.3)));
  if (ea > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    YS.forEach((y, i) => { const p = (t * 0.55 + i * 0.137) % 1, x = mez(-380, 380, p); k.brillo(g, x, y, 90 / Math.pow(Z, 0.3), "140,225,255", 0.95 * ea); });
    XS.forEach((x, j) => { const p = (t * 0.5 + j * 0.211) % 1, y = mez(-740, 740, p); k.brillo(g, x, y, 90 / Math.pow(Z, 0.3), "255,150,225", 0.95 * ea); });
    g.restore();
  }
  // el campo del cruce: arcos de un cable al otro
  const fa = su(tr(t, Tcam - 0.1, Tcam + 0.5));
  if (fa > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    k.brillo(g, NX, NY, 380, "255,220,120", 0.5 * fa);
    for (let n = 0; n < 4; n++) {
      const r = 24 + n * 24, a = su(tr(t, Tcam + n * 0.12, Tcam + n * 0.12 + 0.4)) * fa;
      if (a < 0.01) continue;
      g.setLineDash([16, 12]); g.lineDashOffset = -Math.min(t, FIN - 0.8) * 60; g.strokeStyle = `rgba(${n % 2 ? "255,230,130" : "255,255,255"},${0.95 * a})`; g.lineWidth = 8 / Math.pow(Z, 0.3);
      g.beginPath(); g.arc(NX, NY, r, 0, 6.2832); g.stroke();
    }
    g.restore();
  }
  // el cristal que se levanta (al principio)
  const lv = su(tr(t, Tcri - 0.15, Tcri + 0.8));
  if (lv < 0.999) { g.save(); g.globalAlpha = 1 - lv; const s = 1 + 0.5 * lv; g.translate(0, 40 - 30 * lv); g.scale(s, s); movil(g, t, {}); g.restore(); }
  sinVista(g);
  k.etiqueta(g, 270, 1500, "campo eléctrico", "255,225,130", su(tr(t, Tcam + 0.3, Tcam + 0.7)), 62);
  velo(g, 0.45);
  vineta(g, 0.45);
}

export const momentos = { cristal: Tcri, rejilla: Trej, cruce: Tcrc, campo: Tcam };
