// Las cosas que salen en más de un plano: el móvil ladrillo, el ladrillo de verdad y el móvil de hoy.
import * as k from "#kit";
import { tejido } from "./mundo.js";

const { redondo, azar } = k;

// ---------------------------------------------------------------- el móvil ladrillo (centrado en 0,0; 230 × 640, con antena arriba)
export const LAD = { w: 230, h: 640, ant: 100 };
export function movilLadrillo(g, t, o = {}) {
  const { led = null, ledAl = 1, polvo = 0 } = o;
  const { w, h } = LAD;
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 50; g.shadowOffsetY = 28; redondo(g, -w / 2, -h / 2, w, h, 40); g.fillStyle = "#6e6856"; g.fill(); g.restore();
  // la antena
  redondo(g, -92, -h / 2 - LAD.ant, 30, LAD.ant + 30, 14); const ag = g.createLinearGradient(-92, 0, -62, 0); ag.addColorStop(0, "#0a0a0c"); ag.addColorStop(0.4, "#4a4c54"); ag.addColorStop(1, "#0a0a0c"); g.fillStyle = ag; g.fill();
  // el cuerpo
  redondo(g, -w / 2, -h / 2, w, h, 40);
  const bg = g.createLinearGradient(-w / 2, 0, w / 2, 0); bg.addColorStop(0, "#a8a18c"); bg.addColorStop(0.2, "#e8e2cf"); bg.addColorStop(0.55, "#d3ccb6"); bg.addColorStop(1, "#8f8975");
  g.fillStyle = bg; g.fill();
  g.save(); redondo(g, -w / 2, -h / 2, w, h, 40); g.clip();
  const sh = g.createLinearGradient(0, -h / 2, 0, -h / 2 + 260); sh.addColorStop(0, "rgba(255,255,255,0.4)"); sh.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = sh; g.fillRect(-w / 2, -h / 2, w, 260);
  g.restore();
  redondo(g, -w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 38); g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 3; g.stroke();
  // el altavoz de arriba
  redondo(g, -64, -h / 2 + 32, 128, 16, 8); g.fillStyle = "#4a4638"; g.fill();
  // la pantallita roja
  redondo(g, -92, -h / 2 + 70, 184, 76, 14); g.fillStyle = "#120406"; g.fill(); g.strokeStyle = "#3c382c"; g.lineWidth = 5; g.stroke();
  if (led) { g.save(); g.globalAlpha = ledAl; k.brillo(g, 0, -h / 2 + 108, 190, "255,40,40", 0.5); g.font = "800 58px Figtree"; g.fillStyle = "#ff3c32"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(255,40,40,0.9)"; g.shadowBlur = 18; g.fillText(led, 0, -h / 2 + 111); g.restore(); }
  // las teclas: tres filas de funciones y cuatro de números
  const tecla = (x, y, kw, kh, oscura) => { redondo(g, x - kw / 2, y - kh / 2, kw, kh, 9); const kg = g.createLinearGradient(0, y - kh / 2, 0, y + kh / 2); kg.addColorStop(0, oscura ? "#5a5a60" : "#fbf8ee"); kg.addColorStop(1, oscura ? "#26262a" : "#b9b29c"); g.fillStyle = kg; g.fill(); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2; g.stroke(); };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) tecla(-66 + c * 66, -h / 2 + 194 + r * 44, 54, 30, true);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = -66 + c * 66, y = -h / 2 + 340 + r * 62; tecla(x, y, 56, 46, false);
    g.fillStyle = "#2a2820"; g.font = "800 26px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String([1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"][r * 3 + c]), x, y + 1);
  }
  // el micrófono, abajo
  g.fillStyle = "#4a4638"; for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) { g.beginPath(); g.arc(-40 + i * 20, h / 2 - 34 + j * 14, 4, 0, 6.2832); g.fill(); }
  if (polvo > 0.01) { const r = azar(7); g.save(); g.globalAlpha = 0.35 * polvo; g.fillStyle = "#c9c2ae"; for (let i = 0; i < 60; i++) { g.beginPath(); g.arc((r() - 0.5) * w, (r() - 0.5) * h, 2 + r() * 8, 0, 6.2832); g.fill(); } g.restore(); }
  g.restore();
}

// ---------------------------------------------------------------- el ladrillo de verdad (de pie, centrado en 0,0; 270 × 560)
export function ladrillo(g, t) {
  const w = 270, h = 560, dx = 54, dy = 34;
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 50; g.shadowOffsetY = 28; g.fillStyle = "#6a2412"; g.fillRect(-w / 2, -h / 2, w, h); g.restore();
  // la cara de arriba
  g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(-w / 2 + dx, -h / 2 - dy); g.lineTo(w / 2 + dx, -h / 2 - dy); g.lineTo(w / 2, -h / 2); g.closePath(); g.fillStyle = "#e0775a"; g.fill();
  g.fillStyle = "rgba(60,16,8,0.55)"; for (const hx of [-60, 40]) { g.beginPath(); g.ellipse(hx + dx / 2, -h / 2 - dy / 2, 30, 8, 0, 0, 6.2832); g.fill(); }
  // el lado derecho
  g.beginPath(); g.moveTo(w / 2, -h / 2); g.lineTo(w / 2 + dx, -h / 2 - dy); g.lineTo(w / 2 + dx, h / 2 - dy); g.lineTo(w / 2, h / 2); g.closePath(); g.fillStyle = "#8a2f1a"; g.fill();
  // la cara de delante
  const fg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); fg.addColorStop(0, "#e2623e"); fg.addColorStop(0.55, "#c4401f"); fg.addColorStop(1, "#97301a");
  g.fillStyle = fg; g.fillRect(-w / 2, -h / 2, w, h);
  g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55; g.drawImage(tejido, -w / 2, -h / 2, w, h); g.restore();
  const r = azar(11); g.fillStyle = "rgba(70,16,6,0.4)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse(-w / 2 + r() * w, -h / 2 + r() * h, 2 + r() * 6, 1.5 + r() * 4, 0, 0, 6.2832); g.fill(); }
  const hg = g.createLinearGradient(-w / 2, 0, -w / 2 + 80, 0); hg.addColorStop(0, "rgba(255,230,200,0.5)"); hg.addColorStop(1, "rgba(255,230,200,0)"); g.fillStyle = hg; g.fillRect(-w / 2, -h / 2, 80, h);
  g.restore();
}

// ---------------------------------------------------------------- el móvil de hoy (centrado en 0,0; 340 × 700). contenido(g, w, h) dibuja la pantalla.
export function movilHoy(g, t, contenido, o = {}) {
  const W2 = 340, H2 = 700, { luz = 0 } = o;
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.65)"; g.shadowBlur = 70; g.shadowOffsetY = 36; redondo(g, -W2 / 2, -H2 / 2, W2, H2, 62); g.fillStyle = "#050507"; g.fill(); g.restore();
  redondo(g, -W2 / 2, -H2 / 2, W2, H2, 62); k.metal(g, -W2 / 2, W2 / 2, ["#2a2d34", "#c9ced6", "#6b707a", "#e6e9ee", "#2e3138"]);
  const sw = W2 - 22, sh = H2 - 22;
  redondo(g, -sw / 2, -sh / 2, sw, sh, 52); g.fillStyle = "#04060c"; g.fill();
  g.save(); redondo(g, -sw / 2, -sh / 2, sw, sh, 52); g.clip();
  contenido(g, sw, sh);
  const rf = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); rf.addColorStop(0.22, "rgba(255,255,255,0)"); rf.addColorStop(0.3, "rgba(255,255,255,0.12)"); rf.addColorStop(0.38, "rgba(255,255,255,0)");
  g.fillStyle = rf; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.restore();
  redondo(g, -54, -sh / 2 + 12, 108, 30, 15); g.fillStyle = "#020203"; g.fill();
  if (luz > 0.01) k.brillo(g, 0, 0, 520, "255,255,255", 0.3 * luz);
  g.restore();
}

// la pantalla de inicio de un móvil de hoy: una rejilla de iconos de colores
export function inicioMovil(g, w, h, t = 0) {
  const bg = g.createLinearGradient(0, -h / 2, 0, h / 2); bg.addColorStop(0, "#2a6aff"); bg.addColorStop(0.5, "#8a3aff"); bg.addColorStop(1, "#ff4a9a"); g.fillStyle = bg; g.fillRect(-w / 2, -h / 2, w, h);
  const cols = ["#ff5a5a", "#ffd24a", "#5aff8a", "#4ad2ff", "#ffffff", "#ffa04a", "#c86aff", "#4a6aff"];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = -w / 2 + 38 + c * 74, y = -h / 2 + 90 + r * 96; redondo(g, x, y, 60, 60, 16); g.fillStyle = cols[(r * 4 + c) % cols.length]; g.globalAlpha = 0.92; g.fill(); g.globalAlpha = 1; }
}
