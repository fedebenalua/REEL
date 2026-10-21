// «Pero lleva mucho menos oxígeno, así que...»
// Otro sitio: dos tubos de cristal de sangre, uno al lado del otro, con una luz suave. Se entra con un corte en «Pero».
// - «Pero lleva»: el tubo de tu sangre, rojo, lleno de burbujas de oxígeno que suben; el del pulpo, azul, a su lado.
// - «mucho menos oxígeno»: en el azul suben muy pocas; la cámara se acerca a él.
// - «así que»: las burbujas frenan y la imagen reposa antes del corte (en «hay», vuelta al pulpo).
import * as k from "#kit";
import { v } from "#voz";
import { burbuja, vista, sinVista, camino2D } from "../mundo.js";

export const desde = "pero";

const { suave: su, tramo: tr, mez, azar } = k;
const f = v.frase(7);
const T0 = f.inicio, Tmen = f.t("menos"), Toxi = f.t("oxigeno"), Tasi = f.t("asi"), Thay = f.t("hay");

const TUBOS = [{ x: 290, liq: ["#ff5a5a", "#c8121e", "#5a0008"], n: 46, et: "tú", col: "255,140,140" }, { x: 790, liq: ["#7ac0ff", "#1f6ee0", "#061e66"], n: 11, et: "pulpo", col: "150,205,255" }];
const ARRIBA = 560, ABAJO = 1420, R = 175;
TUBOS.forEach((tb, j) => { const az = azar(500 + j); tb.b = Array.from({ length: tb.n }, () => ({ x: (az() - 0.5) * R * 1.5, y: az(), r: 14 + az() * 16, v: 0.5 + az() * 0.5, f: az() * 6.28 })); });

const cam = camino2D([[T0, [1.0, 540, 990]], [Tmen - 0.1, [1.0, 540, 990]], [Toxi + 0.35, [1.12, 640, 990]], [Thay, [1.12, 640, 990]]]);
// lo que han subido las burbujas: frenan antes del corte
const sube = (t) => (t - T0) * 0.32 - 0.3 * su(tr(t, Tasi - 0.2, Thay - 0.1)) * (t - (Tasi - 0.2)) * 0.0 - 0.32 * Math.max(0, t - (Tasi - 0.05)) * su(tr(t, Tasi - 0.05, Thay - 0.15));

function tubo(g, tb, t) {
  const x = tb.x, top = ARRIBA, bot = ABAJO;
  // la sombra y la luz que pasa por el líquido sobre la mesa
  k.brillo(g, x, bot + 30, 700, tb.col, 0.4);
  // el líquido
  g.save();
  k.redondo(g, x - R, top + 40, R * 2, bot - top - 40, R * 0.9); g.clip();
  const lg = g.createLinearGradient(x - R, 0, x + R, 0);
  lg.addColorStop(0, tb.liq[2]); lg.addColorStop(0.35, tb.liq[1]); lg.addColorStop(0.6, tb.liq[0]); lg.addColorStop(1, tb.liq[2]);
  g.fillStyle = lg; g.fillRect(x - R, top, R * 2, bot - top);
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.12; g.drawImage(k.causticas, x - R * 1.5, top - 200 - ((t * 40) % 300), R * 3, bot - top + 600);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // las burbujas de oxígeno que suben
  const s = sube(t);
  for (const b of tb.b) {
    const u = (((b.y - s * b.v) % 1) + 1) % 1, y = mez(top + 80, bot - 40, u);
    burbuja(g, x + b.x + 10 * Math.sin(t * 2 + b.f), y, b.r, 0.9);
  }
  // la superficie del líquido
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(x, top + 44, R * 0.98, 16, 0, 0, 6.2832); g.fill();
  g.restore();
  // el cristal
  k.redondo(g, x - R - 8, top, R * 2 + 16, bot - top + 10, R); k.vidrio(g, x - R - 8, x + R + 8, 0.5);
  k.reflejo(g, x - R * 0.72, top + 70, 22, bot - top - 220, 0.4);
  k.reflejo(g, x + R * 0.55, top + 120, 10, bot - top - 360, 0.22);
  g.beginPath(); g.ellipse(x, top + 4, R + 8, 22, 0, 0, 6.2832); g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 5; g.stroke();
}

export function dibuja(g, t) {
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0b1424"); bg.addColorStop(0.6, "#16233a"); bg.addColorStop(1, "#080c14");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const lg = g.createRadialGradient(540, 700, 50, 540, 900, 1100);
  lg.addColorStop(0, "rgba(160,190,255,0.22)"); lg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la mesa
  const mg = g.createLinearGradient(0, ABAJO - 20, 0, ABAJO + 500); mg.addColorStop(0, "#26324a"); mg.addColorStop(1, "#0a0e16");
  g.fillStyle = mg; g.fillRect(-500, ABAJO - 10, 2100, 900);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.manchas, -500, ABAJO - 10, 2100, 900); g.restore();
  for (const tb of TUBOS) tubo(g, tb, t);
  // de quién es cada uno
  for (const tb of TUBOS) {
    g.font = "800 50px Figtree"; const w = g.measureText(tb.et).width + 52;
    k.etiqueta(g, tb.x - w / 2, ABAJO - 170, tb.et, tb.col, 1, 50);
  }
  sinVista(g);
  const vg = g.createLinearGradient(0, 180, 0, 600); vg.addColorStop(0, "rgba(6,10,18,0.6)"); vg.addColorStop(1, "rgba(6,10,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
