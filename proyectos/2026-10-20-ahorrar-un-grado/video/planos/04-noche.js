// «Y para dormir, basta con entre quince y diecisiete grados.»
// Un sitio nuevo: el dormitorio de noche. Una persona duerme en su cama bajo el edredón, con la luna en la ventana y el
// termostato a 16. «quince y diecisiete»: el rango en un cartel.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, termostato, ventana, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const F9 = v.frase(9);
const T0 = F9.inicio, Tdor = F9.t("dormir"), Tqui = F9.t("quince"), Tdie = F9.t("diecisiete");
const cam = camino2D([[T0, [1.0, 0, 0]], [F9.fin + 0.04, [1.08, 0, 30]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const gr = g.createLinearGradient(0, -1100, 0, 1100); gr.addColorStop(0, "#0b1238"); gr.addColorStop(1, "#2c3180");
  g.fillStyle = gr; g.fillRect(-800, -1300, 1600, 2600);
  g.fillStyle = "rgba(255,255,255,0.04)"; for (let x = -800; x < 800; x += 140) g.fillRect(x, -1300, 60, 2600);
  k.brillo(g, -300, -250, 900, "170,190,255", 0.25);
  // la ventana con la luna
  g.save(); g.translate(-300, -250); ventana(g, t, { w: 360, h: 420, fase: 0.5 }); g.restore();
  // el termostato
  g.save(); g.translate(330, -250); g.scale(0.4, 0.4); termostato(g, t, { grados: 16, calor: 0.0 }); g.restore();
  // la cama: cabecero, almohada, cabeza y edredón
  redondo(g, -450, 10, 900, 420, 60); let w = g.createLinearGradient(0, 10, 0, 430); w.addColorStop(0, "#9a6338"); w.addColorStop(1, "#6b4226"); g.fillStyle = w; g.fill();
  redondo(g, -400, 50, 800, 340, 40); g.fillStyle = "rgba(0,0,0,0.12)"; g.fill();
  redondo(g, -270, 120, 540, 190, 90); g.fillStyle = "#f4f1ff"; g.fill(); redondo(g, -270, 240, 540, 70, 40); g.fillStyle = "rgba(160,150,210,0.45)"; g.fill();
  // la cabeza que duerme
  const resp = Math.sin(t * 2.2) * 4;
  g.save(); g.translate(0, 170 + resp);
  g.beginPath(); g.arc(0, 0, 128, 0, 6.2832); g.fillStyle = "#ffd2a8"; g.fill();
  g.beginPath(); g.arc(0, -8, 134, 3.3, 6.12); g.quadraticCurveTo(90, -70, 20, -100); g.quadraticCurveTo(-70, -80, -128, -30); g.closePath(); g.fillStyle = "#3a2416"; g.fill();
  g.strokeStyle = "#3a2210"; g.lineWidth = 9; g.lineCap = "round";
  for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 46, 6, 22, 0.35, Math.PI - 0.35); g.stroke(); g.beginPath(); g.arc(s * 80, 56, 24, 0, 6.2832); g.fillStyle = "rgba(255,110,110,0.35)"; g.fill(); }
  g.beginPath(); g.arc(0, 56, 18, 0.2, Math.PI - 0.2); g.stroke();
  g.restore();
  const ed = g.createLinearGradient(-470, 0, 470, 0); ed.addColorStop(0, "#3fb8b0"); ed.addColorStop(0.5, "#56d0c4"); ed.addColorStop(1, "#2a8f95");
  redondo(g, -480, 300, 960, 1000, 90); g.fillStyle = ed; g.fill();
  g.save(); redondo(g, -480, 300, 960, 1000, 90); g.clip(); g.fillStyle = "rgba(255,255,255,0.14)"; for (let i = -6; i < 8; i++) { g.beginPath(); g.moveTo(i * 150, 300); g.lineTo(i * 150 + 70, 300); g.lineTo(i * 150 + 70 - 600, 1300); g.lineTo(i * 150 - 600, 1300); g.closePath(); g.fill(); } g.restore();
  redondo(g, -480, 300, 960, 70, 40); g.fillStyle = "rgba(255,255,255,0.4)"; g.fill();
  // las zetas que suben
  for (let i = 0; i < 3; i++) {
    const p = ((t - Tdor) * 0.45 + i / 3) % 1; if (t < Tdor) continue;
    g.save(); g.globalAlpha = Math.min(1, p * 5) * (1 - tr(p, 0.7, 1)); g.font = `800 ${70 + 28 * i}px Figtree`; g.fillStyle = "#cfe0ff"; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(150,190,255,0.9)"; g.shadowBlur = 24; g.fillText("Z", 190 + p * 120 + i * 30, 90 - p * 330); g.restore();
  }
  // el rango
  k.pastilla(g, 0, 640, "15–17", "°C", "140,215,255", su(tr(t, Tqui, Tqui + 0.3)), 130);
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.45);
}
export const momentos = { dormir: Tdor, quince: Tqui, diecisiete: Tdie };
