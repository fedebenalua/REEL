// La otra apertura del hook: «¿Sabías que los plátanos son radiactivos?»
// - Fotograma 0: un contador Geiger, enorme, con su aguja y su sonda, barre a toda velocidad un frutero (una manzana,
//   una naranja) y la aguja apenas se mueve.
// - «plátanos»: llega al plátano y la aguja salta hasta el rojo y tiembla allí.
// - «radiactivos»: el plátano echa ondas verdes y se enciende; el contador se va hacia arriba y el plátano se coloca
//   grande, en diagonal, y se vuelve transparente: igual que en la otra apertura, para seguir con «Dentro de este».
import * as k from "#kit";
import { v } from "#voz";
import { BANG, BL, BX, BY, ROTURAS, destello, dondeRotura, fondo, platano, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, claves } = k;
const Tpla = v.frase(1).t("platanos"), Trad = v.frase(1).t("radiactivos"), Tfin = v.frase(1).fin;

// el frutero, en una tira: la manzana, la naranja y el plátano; la cámara barre de izquierda a derecha
const pan = claves([[0, -1500], [Tpla + 0.1, 0]]);
function manzana(g, x, y, r) {
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, "#ff8a7a"); gr.addColorStop(0.4, "#d8232f"); gr.addColorStop(1, "#4a0610");
  g.fillStyle = gr; g.beginPath(); g.moveTo(x, y - r * 0.8);
  g.bezierCurveTo(x + r * 0.6, y - r * 1.15, x + r * 1.15, y - r * 0.6, x + r, y + r * 0.1);
  g.bezierCurveTo(x + r * 0.9, y + r * 0.8, x + r * 0.4, y + r, x, y + r * 0.9);
  g.bezierCurveTo(x - r * 0.4, y + r, x - r * 0.9, y + r * 0.8, x - r, y + r * 0.1);
  g.bezierCurveTo(x - r * 1.15, y - r * 0.6, x - r * 0.6, y - r * 1.15, x, y - r * 0.8); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, x - r, y - r, r * 2, r * 2); g.restore();
  g.strokeStyle = "#4a2a10"; g.lineWidth = r * 0.07; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y - r * 0.75); g.quadraticCurveTo(x + r * 0.05, y - r * 1.05, x + r * 0.18, y - r * 1.2); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(x - r * 0.45, y - r * 0.35, r * 0.16, r * 0.26, 0.5, 0, 6.2832); g.fill();
}
function naranja(g, x, y, r) {
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, "#ffd08a"); gr.addColorStop(0.45, "#f28a12"); gr.addColorStop(1, "#5a2a04");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.red2, x - r, y - r, r * 2, r * 2); g.restore();
  g.fillStyle = "#3a5a14"; g.beginPath(); g.arc(x + r * 0.1, y - r * 0.92, r * 0.07, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(x - r * 0.42, y - r * 0.4, r * 0.15, r * 0.24, 0.6, 0, 6.2832); g.fill();
}
// el contador Geiger: una caja amarilla con su esfera, la aguja (0 a 1) y la sonda colgando de su cable
function contador(g, x, y, esc, aguja, t) {
  g.save(); g.translate(x, y); g.scale(esc, esc);
  // el cable hasta la sonda
  g.strokeStyle = "#1a1a1a"; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.moveTo(-250, 140); g.bezierCurveTo(-330, 330, -120, 380, -60, 470); g.stroke();
  // la sonda: un tubo de metal que apunta abajo
  g.save(); g.translate(-40, 560); g.rotate(-0.25);
  k.redondo(g, -34, -120, 68, 230, 30); k.metal(g, -34, 34);
  g.fillStyle = "#222"; k.redondo(g, -40, -150, 80, 50, 18); g.fill();
  g.fillStyle = "#555"; g.beginPath(); g.ellipse(0, 110, 34, 10, 0, 0, 6.2832); g.fill();
  g.restore();
  // la caja
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 60; g.shadowOffsetY = 30;
  k.redondo(g, -300, -200, 600, 400, 50); g.fillStyle = "#e0b21a"; g.fill(); g.restore();
  k.redondo(g, -300, -200, 600, 400, 50);
  const cg = g.createLinearGradient(0, -200, 0, 200); cg.addColorStop(0, "#ffe27a"); cg.addColorStop(0.5, "#f1c12a"); cg.addColorStop(1, "#a87a08");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.2; g.drawImage(k.red, -300, -200, 600, 400); g.restore();
  g.strokeStyle = "rgba(255,250,200,0.6)"; g.lineWidth = 4; g.stroke();
  // el asa
  g.strokeStyle = "#2a2a2a"; g.lineWidth = 26; g.beginPath(); g.moveTo(-200, -200); g.quadraticCurveTo(0, -330, 200, -200); g.stroke();
  // la esfera
  k.redondo(g, -230, -150, 460, 280, 30); g.fillStyle = "#f6f1e2"; g.fill(); g.strokeStyle = "#333"; g.lineWidth = 8; g.stroke();
  const cx = 0, cy = 100, R = 200, a0 = Math.PI * 1.15, a1 = Math.PI * 1.85;
  g.lineWidth = 26; g.lineCap = "butt";
  [["#3aa64a", 0, 0.45], ["#f0c020", 0.45, 0.7], ["#e0302a", 0.7, 1]].forEach(([c, u0, u1]) => { g.strokeStyle = c; g.beginPath(); g.arc(cx, cy, R - 30, mez(a0, a1, u0), mez(a0, a1, u1)); g.stroke(); });
  g.strokeStyle = "#333"; g.lineWidth = 4;
  for (let i = 0; i <= 10; i++) { const a = mez(a0, a1, i / 10); g.beginPath(); g.moveTo(cx + Math.cos(a) * (R - 52), cy + Math.sin(a) * (R - 52)); g.lineTo(cx + Math.cos(a) * (R - 70), cy + Math.sin(a) * (R - 70)); g.stroke(); }
  const an = mez(a0, a1, Math.max(0, Math.min(1, aguja)));
  g.strokeStyle = "#111"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * (R - 20), cy + Math.sin(an) * (R - 20)); g.stroke();
  g.fillStyle = "#111"; g.beginPath(); g.arc(cx, cy, 20, 0, 6.2832); g.fill();
  // el cristal de la esfera
  const rg = g.createLinearGradient(-230, -150, 230, 130); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.35)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg; k.redondo(g, -230, -150, 460, 280, 30); g.fill();
  // la luz roja que parpadea con cada cuenta
  const luz = aguja > 0.6 ? 0.5 + 0.5 * Math.sin(t * 40) : 0.1;
  g.fillStyle = `rgb(${k.mezRgb("90,20,20", "255,60,50", luz)})`; g.beginPath(); g.arc(230, 170, 18, 0, 6.2832); g.fill();
  if (luz > 0.5) k.brillo(g, 230, 170, 120, "255,60,50", luz);
  g.restore();
}

export function dibuja(g, t) {
  const px = pan(t), sale = su(tr(t, Trad + 0.25, Tfin + 0.15));
  fondo(g, t, "255,170,70", 1, -px * 0.4, 0);
  // la mesa: un tablero de madera cálido, que se va con el contador
  g.save(); g.globalAlpha = 1 - sale;
  const mg = g.createLinearGradient(0, 1400, 0, 1920); mg.addColorStop(0, "#6a3e1c"); mg.addColorStop(1, "#24130a");
  g.fillStyle = mg; g.fillRect(0, 1400, 1080, 520);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4 * (1 - sale); g.drawImage(k.red, -px % 700 - 700, 1400, 2800, 600);
  g.restore();
  g.save(); g.globalAlpha = 1 - sale;
  manzana(g, 540 - 1450 - px, 1290, 240);
  naranja(g, 540 - 760 - px, 1300, 225);
  g.restore();
  // el plátano: en el frutero, y luego se coloca grande y transparente
  const u = su(tr(t, Trad + 0.15, Tfin + 0.2)), rx = su(tr(t, Trad + 0.3, Tfin + 0.2));
  const x = mez(560 - px, BX, u), y = mez(1300, BY, u), L = mez(820, BL, u), ang = mez(0.18, BANG, u);
  const verde = su(tr(t, Trad - 0.1, Trad + 0.2));
  k.brillo(g, x, y, 1900, "verde", 0.45 * verde);
  platano(g, x, y, L, ang, { giro: 0.4 + 0.2 * t, rayos: rx });
  if (rx > 0.3) for (const r of ROTURAS) { if (r.t < Trad + 0.4 || r.t > t) continue; const [rx2, ry] = dondeRotura(r); destello(g, rx2, ry, t - r.t, 150, r.dir, 380); }
  // las ondas verdes de «radiactivos»
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const w = t - (Trad - 0.05 + i * 0.22); if (w < 0 || w > 1.2) continue;
    g.strokeStyle = `rgba(170,255,130,${0.75 * Math.exp(-w * 2.5)})`; g.lineWidth = 14 * Math.exp(-w * 1.5) + 2;
    g.beginPath(); g.ellipse(x, y, 200 + 900 * w, 140 + 700 * w, ang, 0, 6.2832); g.stroke();
  }
  g.restore();
  // el contador: barre con la cámara y se va hacia arriba
  const llega = su(tr(t, Tpla - 0.25, Tpla + 0.1));
  const aguja = 0.08 + 0.05 * Math.sin(t * 23) + llega * (0.82 + 0.06 * Math.sin(t * 31) + 0.04 * Math.sin(t * 57));
  contador(g, 600, mez(790, -560, k.sale(sale)), 1.1, aguja, t);
  vineta(g, 0.5);
  velo(g, 0.45);
}
