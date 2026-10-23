// Las garrafas de agua: la lluvia que se amontona (lo que gasta el grifo) y el montón verde (lo que ahorras).
import * as k from "#kit";
import { gradH, gradV } from "./mundo.js";

const { tramo: tr, suave: su, azar } = k;

// una garrafa con el pie en (x, y). verde: la del ahorro
export function garrafa(g, x, y, w, h, verde = 0, sx = 1, sy = 1) {
  g.save(); g.translate(x, y); g.scale(sx, sy);
  const cuerpo = () => { g.beginPath(); k.redondo(g, -w / 2, -h * 0.74, w, h * 0.74, w * 0.2); };
  // el asa
  g.strokeStyle = verde ? "rgba(150,255,190,0.95)" : "rgba(200,236,255,0.95)"; g.lineWidth = w * 0.11; g.lineCap = "round";
  g.beginPath(); g.moveTo(w * 0.1, -h * 0.76); g.quadraticCurveTo(w * 0.16, -h * 1.02, w * 0.4, -h * 0.76); g.stroke();
  // el hombro y el cuello
  g.beginPath(); k.redondo(g, -w * 0.38, -h * 0.94, w * 0.4, h * 0.3, w * 0.1);
  g.fillStyle = verde ? "rgba(120,240,170,0.9)" : "rgba(150,210,250,0.9)"; g.fill();
  cuerpo();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  if (verde) { gr.addColorStop(0, "rgb(40,170,110)"); gr.addColorStop(0.3, "rgb(150,255,200)"); gr.addColorStop(0.7, "rgb(60,200,130)"); gr.addColorStop(1, "rgb(20,120,80)"); }
  else { gr.addColorStop(0, "rgb(34,120,214)"); gr.addColorStop(0.3, "rgb(150,222,255)"); gr.addColorStop(0.7, "rgb(56,160,240)"); gr.addColorStop(1, "rgb(18,84,176)"); }
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(235,252,255,0.9)"; g.lineWidth = Math.max(2, w * 0.04); g.stroke();
  // la etiqueta
  g.fillStyle = "rgba(255,255,255,0.88)"; g.fillRect(-w * 0.34, -h * 0.5, w * 0.68, h * 0.22);
  g.fillStyle = verde ? "rgb(30,160,100)" : "rgb(30,110,210)"; g.fillRect(-w * 0.34, -h * 0.4, w * 0.68, h * 0.05);
  // el tapón
  g.fillStyle = verde ? "rgb(20,100,60)" : "rgb(16,70,170)"; g.beginPath(); k.redondo(g, -w * 0.36, -h * 1.0, w * 0.36, h * 0.09, w * 0.04); g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-w * 0.32, -h * 0.4, w * 0.05, h * 0.2, 0, 0, 6.2832); g.fill();
  g.restore();
}

// la pirámide: filas desde abajo. Cada garrafa cae en su momento. n: filas. Devuelve cuántas han aterrizado.
export function pila(g, t, { t0, dur, base = 1420, filas = 9, w = 104, h = 116, verde = 0, x0 = 540, cae = 0.42 }) {
  const slots = [];
  for (let r = 0; r < filas; r++) for (let i = 0; i < filas - r; i++) slots.push({ r, i, x: x0 + (i - (filas - r - 1) / 2) * (w + 6), y: base - r * (h * 0.92) });
  const N = slots.length, az = azar(5);
  let aterrizadas = 0;
  slots.forEach((s, idx) => {
    const Tl = t0 + dur * Math.pow(idx / N, 0.78) + az() * 0.02, tau = t - (Tl - cae);
    if (tau < 0) return;
    const u = Math.min(1, tau / cae), caer = 1 - u * u;
    const y = s.y - (1500 * caer);
    const sq = tau > cae ? Math.exp(-(tau - cae) * 9) * Math.sin((tau - cae) * 30) * 0.12 : 0;
    if (tau >= cae) aterrizadas++;
    garrafa(g, s.x, y, w, h, verde, 1 + sq, 1 - sq);
  });
  return aterrizadas / N;
}
