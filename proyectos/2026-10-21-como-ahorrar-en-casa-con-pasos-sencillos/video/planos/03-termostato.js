// «Dos: baja un grado la calefacción. Cada grado de más es un siete por ciento más de gasto.»
// Otro sitio: la pared del salón, con el termostato redondo y, debajo, el radiador que calienta. Corte en «Dos».
// - «baja un grado»: el aro del termostato gira y el número pasa de 22 a 21; el calor del radiador baja un poco.
// - «Cada grado de más»: vuelve a 22 (en rojo), el radiador brilla más y empiezan a subir monedas con el calor;
//   «siete por ciento»: salta «+7 %». En «gasto» dejan de salir y todo se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, moneda, velo, vineta, ROJO, AZUL } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f4 = v.frase(4);
const T0 = f4.inicio, Tbaja = f4.t("baja"), Tgra = f4.t("grado"), Tcal = f4.t("calefaccion"), Tcada = f4.t("cada"), Tgra2 = f4.t("grado", 2), Tsie = f4.t("siete"), Tgas = f4.t("gasto"), Fin = v.frase(5).inicio;

const TERMO = [0, -260], RAD = [0, 520];
const cam = camino2D([[T0, [1.05, 0, -170]], [Tgra + 0.2, [1.1, 0, -200]], [Tcal + 0.4, [1.0, 0, 130]], [Tsie, [1.0, 0, 120]], [Fin, [1.02, 0, 120]]]);
// la temperatura que marca: 22 → 21 en «grado» → 22 en «grado» (la segunda)
const temp = (t) => 22 - su(tr(t, Tgra - 0.25, Tgra + 0.1)) + su(tr(t, Tgra2 - 0.1, Tgra2 + 0.2));
const calor = (t) => mez(0.7, 1, temp(t) - 21);
const sube = (ts) => su(tr(ts, Tgra2, Tgra2 + 0.3)) * (1 - su(tr(ts, Tgas - 0.2, Tgas + 0.1)));
const MON = Array.from({ length: 24 }, (_, i) => { const az = azar(100 + i); return { t0: Tgra2 + i * 0.1, x: (az() - 0.5) * 640, v: 520 + az() * 300, g: az() }; });

const rayas = (() => { const l = k.lienzo(256, 512), c = l.getContext("2d"); c.fillStyle = "#f2a476"; c.fillRect(0, 0, 256, 512); c.fillStyle = "rgba(255,230,200,0.35)"; for (let x = 0; x < 256; x += 64) c.fillRect(x, 0, 22, 512); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.25; c.drawImage(k.manchas, 0, 0, 256, 512); return l; })();
function pared(g) {
  for (let x = -1536; x < 1536; x += 256) for (let y = -2048; y < 780; y += 512) g.drawImage(rayas, x, y, 256, 512);
  g.fillStyle = "#f7efe6"; g.fillRect(-1600, 760, 3200, 40);
  const sg = g.createLinearGradient(0, 800, 0, 1700); sg.addColorStop(0, "#a8683c"); sg.addColorStop(1, "#4a2412"); g.fillStyle = sg; g.fillRect(-1600, 800, 3200, 1000);
  g.strokeStyle = "rgba(60,25,10,0.4)"; g.lineWidth = 4; for (let x = -1600; x < 1600; x += 180) { g.beginPath(); g.moveTo(x, 800); g.lineTo(x * 1.4, 1700); g.stroke(); }
}
function radiador(g, t, c) {
  const [x0, y0] = RAD, w = 780, h = 400;
  // el calor que sube (ondas) y su luz en la pared
  const lg = g.createRadialGradient(x0, y0 - 200, 50, x0, y0 - 200, 700); lg.addColorStop(0, `rgba(255,120,50,${0.35 * c})`); lg.addColorStop(1, "rgba(255,120,50,0)");
  g.fillStyle = lg; g.fillRect(x0 - 800, y0 - 900, 1600, 1100);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const x = x0 - w / 2 + 60 + i * 85, u = (t * 0.6 + i * 0.13) % 1;
    g.strokeStyle = `rgba(255,160,90,${0.35 * c * Math.sin(Math.PI * u)})`; g.lineWidth = 8;
    g.beginPath(); for (let j = 0; j <= 12; j++) { const yy = y0 - h / 2 - 20 - j * 30 - u * 200; g.lineTo(x + Math.sin(j * 0.9 + t * 4 + i) * 14, yy); } g.stroke();
  }
  g.restore();
  // el cuerpo: columnas blancas
  g.save(); g.shadowColor = "rgba(60,20,10,0.4)"; g.shadowBlur = 40; g.shadowOffsetY = 25; k.redondo(g, x0 - w / 2, y0 - h / 2, w, h, 26); g.fillStyle = "#e9e3dc"; g.fill(); g.restore();
  for (let i = 0; i < 12; i++) {
    const x = x0 - w / 2 + 10 + i * 63.5;
    k.redondo(g, x, y0 - h / 2 + 8, 56, h - 16, 26);
    const gr = g.createLinearGradient(x, 0, x + 56, 0); gr.addColorStop(0, "#c8c0b8"); gr.addColorStop(0.35, "#ffffff"); gr.addColorStop(1, "#b0a69c"); g.fillStyle = gr; g.fill();
  }
  // el brillo del calor sobre el metal
  g.save(); g.globalCompositeOperation = "lighter"; const hg = g.createLinearGradient(0, y0 - h / 2, 0, y0 + h / 2); hg.addColorStop(0, `rgba(255,120,60,${0.25 * c})`); hg.addColorStop(1, "rgba(255,120,60,0)"); g.fillStyle = hg; g.fillRect(x0 - w / 2, y0 - h / 2, w, h); g.restore();
  // la llave
  g.beginPath(); g.arc(x0 - w / 2 - 30, y0 + h / 2 - 40, 34, 0, 6.2832); k.metal(g, x0 - w / 2 - 64, x0 - w / 2 + 4);
  // las patas al suelo
  for (const x of [x0 - w / 2 + 60, x0 + w / 2 - 60]) { g.fillStyle = "#cfc6bc"; g.fillRect(x - 12, y0 + h / 2, 24, 760 - (y0 + h / 2)); }
}
function termostato(g, t, T, rojo, azul) {
  const [x, y] = TERMO, R = 250;
  g.save(); g.shadowColor = "rgba(60,20,10,0.45)"; g.shadowBlur = 60; g.shadowOffsetY = 30; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fillStyle = "#ddd"; g.fill(); g.restore();
  g.beginPath(); g.arc(x, y, R, 0, 6.2832); k.metal(g, x - R, x + R, ["#9aa2ac", "#ffffff", "#d0d6de", "#ffffff", "#8a929c"]);
  g.beginPath(); g.arc(x, y, R * 0.82, 0, 6.2832); const fg = g.createRadialGradient(x - 60, y - 80, 20, x, y, R); fg.addColorStop(0, "#2a3446"); fg.addColorStop(1, "#0a0e18"); g.fillStyle = fg; g.fill();
  // el aro de colores, que marca la temperatura (de 16 a 28)
  const u = (T - 16) / 12;
  g.lineCap = "round";
  for (let i = 0; i < 48; i++) {
    const a = -Math.PI * 1.25 + (i / 47) * Math.PI * 1.5, on = i / 47 <= u;
    g.strokeStyle = on ? `rgb(${k.mezRgb("90,180,255", "255,70,40", i / 47)})` : "rgba(255,255,255,0.12)"; g.lineWidth = 10;
    g.beginPath(); g.moveTo(x + Math.cos(a) * R * 0.66, y + Math.sin(a) * R * 0.66); g.lineTo(x + Math.cos(a) * R * 0.74, y + Math.sin(a) * R * 0.74); g.stroke();
  }
  // el número
  const n = Math.round(T), col = rojo > 0.01 ? k.mezRgb("255,255,255", "255,90,70", rojo) : k.mezRgb("255,255,255", "120,200,255", azul);
  g.font = "800 200px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = `rgb(${col})`;
  g.fillText(`${n}`, x - 14, y + 10); g.font = "700 70px Figtree"; g.fillText("°", x + 110, y - 50);
  k.brillo(g, x, y, 500, col, 0.25);
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(x - 80, y - 150, 120, 40, -0.4, 0, 6.2832); g.fill();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  pared(g);
  const T = temp(t), c = calor(t);
  radiador(g, t, c);
  // las monedas que suben con el calor
  for (const m of MON) {
    const u = tr(t, m.t0, m.t0 + 1.4); if (u <= 0 || u >= 1 || sube(m.t0) < 0.05) continue;
    moneda(g, RAD[0] + m.x + Math.sin(u * 6 + m.g * 6) * 30, RAD[1] - 200 - u * m.v * 1.4, 58, m.g + u, Math.sin(Math.PI * u) * sube(m.t0) * (1 - su(tr(t, Fin - 0.6, Fin - 0.2))));
  }
  const rojo = k.pulso(t, Tgra2 + 0.15, 0.5) * 0.6 + su(tr(t, Tgra2, Tgra2 + 0.2)) * 0.4, azul = su(tr(t, Tgra - 0.2, Tgra + 0.1)) * (1 - su(tr(t, Tgra2 - 0.2, Tgra2)));
  termostato(g, t, T, t > Tgra2 - 0.1 ? rojo : 0, azul);
  // al bajar: un aro azul; al subir: «+7 %»
  const ab = k.pulso(t, Tgra + 0.05, 0.22);
  if (ab > 0.02) { g.save(); g.strokeStyle = `rgba(${AZUL},${ab})`; g.lineWidth = 12; g.beginPath(); g.arc(TERMO[0], TERMO[1], 270 + 50 * (1 - ab), 0, 6.2832); g.stroke(); g.restore(); }
  sinVista(g);
  const p7 = su(tr(t, Tsie - 0.15, Tsie + 0.1)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p7 > 0) { g.save(); g.translate(820, 960); const s = 1 + 0.25 * k.pulso(t, Tsie + 0.05, 0.12); g.scale(s, s); k.pastilla(g, 0, 0, "+7", "%", ROJO, p7, 130); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "40,15,10");
}
