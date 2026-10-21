// Lo que comparten los planos: la cámara 2D, el termostato, el dedo, las monedas y los billetes, la hucha, la ventana
// con su día y su noche, la persona, la casa cortada y el avión con el amigo. Todo en coordenadas del mundo (px con zoom 1).
import * as k from "#kit";
import { v } from "#voz";

const { azar, redondo, suave: su, tramo: tr, mez, entra, mezColor, mezRgb } = k;
const TAU = 6.2832;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al = 0.55) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(5,5,10,${al})`); vg.addColorStop(0.6, `rgba(5,5,10,${al * 0.7})`); vg.addColorStop(1, "rgba(5,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- el color del calor
// calor 1 = rojo vivo, 0 = azul frío
export const colCalor = (calor) => {
  const c = Math.max(0, Math.min(1, calor));
  return c > 0.5 ? mezRgb("255,170,60", "255,80,55", (c - 0.5) * 2) : mezRgb("110,205,255", "255,170,60", c * 2);
};

// ---------------------------------------------------------------- texto
function texto(g, s, x, y, tam, col, peso = 800, al = 1) {
  g.save(); g.globalAlpha *= al; g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.fillText(s, x, y); g.restore();
}

// ---------------------------------------------------------------- la cifra que rueda (de más a menos)
export function digitos(g, valor, x, y, tam, col) {
  const hi = Math.ceil(valor - 1e-6), f = hi - valor;
  const A = g.globalAlpha;
  g.save(); g.beginPath(); g.rect(x - tam * 0.95, y - tam * 0.62, tam * 1.9, tam * 1.24); g.clip();
  g.font = `800 ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 42; g.fillStyle = `rgb(${col})`;
  g.globalAlpha = A * (1 - f); g.fillText(String(hi), x, y + f * tam * 0.9);
  if (f > 0.001) { g.globalAlpha = A * f; g.fillText(String(hi - 1), x, y - (1 - f) * tam * 0.9); }
  g.restore();
}

// ---------------------------------------------------------------- el termostato, de frente (centrado en 0,0; radio TR)
export const TR = 330;
export function termostato(g, t, o = {}) {
  const { grados = 22, calor = 1, boton = 0 } = o;
  const col = colCalor(calor);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 70; g.shadowOffsetY = 34;
  g.beginPath(); g.arc(0, 0, TR, 0, TAU); g.fillStyle = "#d9dce6"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  let gr = g.createLinearGradient(-TR, -TR, TR, TR); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "#e1e4ee"); gr.addColorStop(1, "#a9afc2");
  g.beginPath(); g.arc(0, 0, TR, 0, TAU); g.fillStyle = gr; g.fill();
  gr = g.createLinearGradient(TR, TR, -TR, -TR); gr.addColorStop(0, "#f4f5fa"); gr.addColorStop(1, "#8f95aa");
  g.beginPath(); g.arc(0, 0, TR - 32, 0, TAU); g.fillStyle = gr; g.fill();
  g.beginPath(); g.arc(0, 0, TR - 48, 0, TAU); g.fillStyle = "#0b1022"; g.fill();
  gr = g.createRadialGradient(0, 0, 10, 0, 0, TR - 48); gr.addColorStop(0, `rgba(${col},0.42)`); gr.addColorStop(1, `rgba(${col},0.06)`);
  g.beginPath(); g.arc(0, 0, TR - 48, 0, TAU); g.fillStyle = gr; g.fill();
  // la escala: de 16 a 30 grados
  const p = Math.max(0, Math.min(1, (grados - 16) / 14));
  const a0 = 135 * Math.PI / 180, span = 270 * Math.PI / 180;
  g.lineCap = "round";
  for (let i = 0; i < 54; i++) {
    const u = i / 53, a = a0 + span * u, c = Math.cos(a), s = Math.sin(a);
    g.strokeStyle = u <= p ? `rgb(${col})` : "rgba(255,255,255,0.18)"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(c * 246, s * 246); g.lineTo(c * 262, s * 262); g.stroke();
  }
  g.strokeStyle = "rgba(255,255,255,0.1)"; g.lineWidth = 14; g.beginPath(); g.arc(0, 0, 228, a0, a0 + span); g.stroke();
  if (p > 0.01) { g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 24; g.strokeStyle = `rgb(${col})`; g.beginPath(); g.arc(0, 0, 228, a0, a0 + span * p); g.stroke(); g.shadowBlur = 0; g.shadowColor = "rgba(0,0,0,0)"; }
  // la cifra
  digitos(g, grados, -8, -12, 250, col);
  texto(g, "°C", 160, -96, 74, `rgb(${col})`, 700, 0.9);
  // las flechas
  const flecha = (y, sgn, brilla) => {
    g.save(); g.translate(0, y); g.scale(1 + 0.25 * brilla, 1 + 0.25 * brilla);
    if (brilla > 0.01) k.brillo(g, 0, 0, 220, "255,230,150", 0.85 * brilla);
    g.fillStyle = brilla > 0.01 ? "#fff3c4" : "rgba(255,255,255,0.55)";
    g.beginPath(); g.moveTo(-36, -18 * sgn); g.lineTo(36, -18 * sgn); g.lineTo(0, 22 * sgn); g.closePath(); g.fill();
    g.restore();
  };
  flecha(-196, -1, 0); flecha(196, 1, boton);
  g.restore();
}

// ---------------------------------------------------------------- el dedo (la punta en 0,0, el cuerpo hacia abajo)
export function dedo(g, x, y, rot = 0, esc = 1, h = 0) {
  g.save(); g.translate(x + 40 * h, y + 90 * h); g.rotate(rot); const s = esc * (1 + 0.16 * h); g.scale(s, s);
  const gr = g.createLinearGradient(-60, 0, 60, 0); gr.addColorStop(0, "#e8ae88"); gr.addColorStop(0.45, "#ffe0c8"); gr.addColorStop(1, "#e3a583");
  g.beginPath(); g.moveTo(-58, 900); g.lineTo(-58, 64); g.quadraticCurveTo(-58, 0, 0, 0); g.quadraticCurveTo(58, 0, 58, 64); g.lineTo(58, 900); g.closePath();
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 26 + 26 * h; g.shadowOffsetY = 12 + 22 * h; g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  redondo(g, -34, 18, 68, 92, 30); g.fillStyle = "rgba(255,238,230,0.85)"; g.fill(); g.strokeStyle = "rgba(210,140,120,0.7)"; g.lineWidth = 4; g.stroke();
  g.strokeStyle = "rgba(170,100,80,0.4)"; g.lineWidth = 4; g.lineCap = "round";
  for (const yy of [330, 350]) { g.beginPath(); g.moveTo(-34, yy); g.quadraticCurveTo(0, yy + 12, 34, yy); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- la moneda (de frente, con giro) y el billete
export function moneda(g, x, y, r, giro = 0, o = {}) {
  const { al = 1, rojo = 0, brilla = 0 } = o;
  const sx = Math.cos(giro), ax = Math.max(0.1, Math.abs(sx));
  g.save(); g.translate(x, y); g.globalAlpha *= al;
  if (brilla > 0.01) k.brillo(g, 0, 0, r * 5, rojo > 0.3 ? "255,90,70" : "255,215,100", 0.8 * brilla);
  g.scale(ax, 1);
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 14; g.shadowOffsetY = 6;
  let gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, "#ffe58a"); gr.addColorStop(0.5, "#f2b21f"); gr.addColorStop(1, "#b97a0b");
  g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  gr = g.createLinearGradient(r, r, -r, -r); gr.addColorStop(0, "#ffd45a"); gr.addColorStop(1, "#ffeaa0");
  g.beginPath(); g.arc(0, 0, r * 0.8, 0, TAU); g.fillStyle = gr; g.fill(); g.lineWidth = r * 0.06; g.strokeStyle = "rgba(140,80,0,0.55)"; g.stroke();
  if (sx > 0) { texto(g, "€", r * 0.02, r * 0.06, r * 1.15, "#a26608"); texto(g, "€", -r * 0.03, r * 0.02, r * 1.15, "rgba(255,244,180,0.8)"); }
  if (rojo > 0.01) { g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = `rgba(255,60,50,${0.5 * rojo})`; g.fill(); }
  g.restore();
}
export function billete(g, x, y, rot, esc, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(esc, esc); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 16; g.shadowOffsetY = 6;
  const gr = g.createLinearGradient(-90, 0, 90, 0); gr.addColorStop(0, "#8ae8a4"); gr.addColorStop(1, "#2fa85a");
  redondo(g, -90, -48, 180, 96, 10); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  redondo(g, -78, -36, 156, 72, 6); g.strokeStyle = "rgba(255,255,255,0.65)"; g.lineWidth = 4; g.stroke();
  g.beginPath(); g.arc(0, 0, 28, 0, TAU); g.fillStyle = "rgba(255,255,255,0.3)"; g.fill();
  texto(g, "€", 0, 3, 50, "#1d7a40");
  g.restore();
}

// una moneda de canto (para las torres): w ancho, h grueso; arriba = la de más arriba (lleva tapa)
export function monedaCanto(g, x, y, w, h, o = {}) {
  const { rojo = 0, arriba = false } = o;
  g.save(); g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.3)"; g.shadowBlur = 10; g.shadowOffsetY = 4;
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#b97a0b"); gr.addColorStop(0.25, "#ffd45a"); gr.addColorStop(0.5, "#fff0a8"); gr.addColorStop(0.8, "#f2b21f"); gr.addColorStop(1, "#a86a08");
  redondo(g, -w / 2, -h / 2, w, h, h * 0.45); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.strokeStyle = "rgba(120,70,0,0.35)"; g.lineWidth = 3; g.lineCap = "round";
  for (let i = -w / 2 + 22; i < w / 2 - 10; i += 20) { g.beginPath(); g.moveTo(i, -h * 0.25); g.lineTo(i, h * 0.25); g.stroke(); }
  if (arriba) {
    g.beginPath(); g.ellipse(0, -h * 0.5, w / 2 - 4, h * 0.42, 0, 0, TAU); g.fillStyle = "#ffe27a"; g.fill();
    g.strokeStyle = "rgba(160,100,10,0.6)"; g.lineWidth = 4; g.stroke();
    g.beginPath(); g.ellipse(0, -h * 0.5, w / 2 - 34, h * 0.26, 0, 0, TAU); g.strokeStyle = "rgba(160,100,10,0.4)"; g.lineWidth = 3; g.stroke();
  }
  if (rojo > 0.01) { redondo(g, -w / 2, -h / 2, w, h, h * 0.45); g.fillStyle = `rgba(255,60,50,${0.55 * rojo})`; g.fill(); if (arriba) { g.beginPath(); g.ellipse(0, -h * 0.5, w / 2 - 4, h * 0.42, 0, 0, TAU); g.fill(); } }
  g.restore();
}

// ---------------------------------------------------------------- la hucha (centrada en 0,0; mira a la derecha)
export function hucha(g, t, o = {}) {
  const { aplasta = 0, guino = 0 } = o;
  g.save();
  g.translate(0, 200); g.scale(1 + 0.1 * aplasta, 1 - 0.12 * aplasta); g.translate(0, -200);
  g.save(); g.globalAlpha *= 0.3; g.beginPath(); g.ellipse(0, 236, 290, 34, 0, 0, TAU); g.fillStyle = "#000"; g.fill(); g.restore();
  // patas
  for (const [x, c] of [[-175, "#d85c88"], [95, "#d85c88"], [-95, "#f07aa2"], [175, "#f07aa2"]]) { redondo(g, x - 36, 130, 72, 104, 26); g.fillStyle = c; g.fill(); }
  // cola
  g.strokeStyle = "#e8739a"; g.lineWidth = 14; g.lineCap = "round";
  g.beginPath(); g.moveTo(-250, -10); g.bezierCurveTo(-320, -30, -310, -100, -260, -80); g.bezierCurveTo(-235, -70, -255, -45, -275, -55); g.stroke();
  // oreja
  g.save(); g.translate(90, -165); g.rotate(0.35); g.beginPath(); g.moveTo(-50, 10); g.lineTo(0, -80); g.lineTo(55, 10); g.closePath(); g.fillStyle = "#e5628f"; g.fill();
  g.beginPath(); g.moveTo(-28, 6); g.lineTo(2, -46); g.lineTo(32, 6); g.closePath(); g.fillStyle = "#ff9fc0"; g.fill(); g.restore();
  // cuerpo
  const gr = g.createRadialGradient(-70, -90, 40, 0, 0, 300); gr.addColorStop(0, "#ffc0d6"); gr.addColorStop(0.55, "#f47fa8"); gr.addColorStop(1, "#c8447a");
  g.beginPath(); g.ellipse(0, 0, 265, 195, 0, 0, TAU); g.fillStyle = gr; g.fill();
  g.beginPath(); g.arc(0, 0, 232, 3.5, 4.5); g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 12; g.lineCap = "round"; g.stroke();
  // ranura
  redondo(g, -78, -198, 156, 22, 11); g.fillStyle = "#7a1c46"; g.fill();
  // hocico
  g.beginPath(); g.ellipse(248, 22, 72, 60, 0, 0, TAU); g.fillStyle = "#ff9fbd"; g.fill(); g.strokeStyle = "#e0709a"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "#8a2a55"; g.beginPath(); g.ellipse(238, 20, 11, 20, 0, 0, TAU); g.ellipse(272, 20, 11, 20, 0, 0, TAU); g.fill();
  // ojo
  if (guino > 0.5) { g.strokeStyle = "#3a1226"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.arc(158, -52, 18, 3.5, 5.9); g.stroke(); }
  else { g.beginPath(); g.arc(158, -52, 17, 0, TAU); g.fillStyle = "#2a0d1e"; g.fill(); g.beginPath(); g.arc(163, -58, 6, 0, TAU); g.fillStyle = "#fff"; g.fill(); }
  g.beginPath(); g.arc(150, 6, 30, 0, TAU); g.fillStyle = "rgba(255,80,120,0.38)"; g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la ventana, con su día y su noche
// fase: 0 = mediodía, 0.5 = medianoche (se pasa tal cual; ciclo = 1)
export function ventana(g, t, o = {}) {
  const { w = 620, h = 560, fase = 0, al = 1 } = o;
  const dia = 0.5 + 0.5 * Math.cos(fase * TAU);
  g.save(); g.globalAlpha *= al;
  g.translate(-w / 2, -h / 2);
  g.save(); redondo(g, 0, 0, w, h, 18); g.clip();
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, mezColor("#0b1440", "#6fc0ff", dia)); gr.addColorStop(1, mezColor("#2a3a86", "#d6efff", dia));
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  if (dia < 0.6) { const a = (0.6 - dia) / 0.6; const r = azar(5); for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h * 0.6, s = 3 + r() * 3; g.fillStyle = `rgba(255,255,255,${a * (0.5 + 0.5 * Math.sin(t * 4 + i))})`; g.fillRect(x, y, s, s); } }
  const R = h * 0.85, cx = w / 2, cy0 = h * 1.1, th = fase * TAU;
  const sx = cx + R * Math.sin(th), sy = cy0 - R * Math.cos(th);
  k.brillo(g, sx, sy, 320, "255,225,120", 0.9); g.beginPath(); g.arc(sx, sy, 52, 0, TAU); g.fillStyle = "#ffe27a"; g.fill();
  const mx = cx - R * Math.sin(th), my = cy0 + R * Math.cos(th);
  g.beginPath(); g.arc(mx, my, 48, 0, TAU); g.fillStyle = "#f1f4ff"; g.fill(); g.beginPath(); g.arc(mx + 18, my - 8, 42, 0, TAU); g.fillStyle = mezColor("#0b1440", "#6fc0ff", dia); g.fill();
  const rr = azar(11);
  for (let i = 0; i < 46; i++) { const x0 = rr() * w, sp = 60 + rr() * 80, y = (rr() * h + t * sp) % h, x = x0 + Math.sin(t * 1.5 + i) * 14; g.beginPath(); g.arc(x, y, 3 + rr() * 4, 0, TAU); g.fillStyle = "rgba(255,255,255,0.9)"; g.fill(); }
  g.beginPath(); g.moveTo(0, h * 0.86); g.quadraticCurveTo(w * 0.3, h * 0.78, w * 0.55, h * 0.88); g.quadraticCurveTo(w * 0.8, h * 0.8, w, h * 0.86); g.lineTo(w, h); g.lineTo(0, h); g.closePath();
  g.fillStyle = mezColor("#aab6e0", "#ffffff", dia); g.fill();
  g.restore();
  g.lineWidth = 26; g.strokeStyle = "#f6f1e8"; redondo(g, 0, 0, w, h, 18); g.stroke();
  g.lineWidth = 16; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la persona (origen en la base del cuello)
// jersey: 0 = no lo lleva, se pasa la posición ya animada (0 a 1); frio: 0 a 1; feliz: 0 a 1
export function persona(g, t, o = {}) {
  const { jersey = 0, frio = 0, feliz = 0 } = o;
  const tem = Math.sin(t * 46) * 6 * frio;
  g.save(); g.translate(tem, 0);
  const piel = frio > 0.01 ? mezColor("#ffd2a8", "#cfe0f4", frio * 0.6) : "#ffd2a8";
  const camisa = "#7fc4ff";
  const cuerpo = (c, extra = 0) => {
    g.strokeStyle = c; g.lineWidth = 96 + extra; g.lineCap = "round";
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 185, 80); g.lineTo(s * 255, 520); g.stroke(); }
    redondo(g, -200 - extra / 2, -10, 400 + extra, 960, 110); g.fillStyle = c; g.fill();
  };
  cuerpo(camisa);
  for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 258, 548, 50, 0, TAU); g.fillStyle = piel; g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(-70, 160, 60, 120, 0.2, 0, TAU); g.fill();
  // cuello y cabeza
  redondo(g, -46, -70, 92, 100, 30); g.fillStyle = mezColor(piel, "#b88060", 0.2); g.fill();
  g.beginPath(); g.arc(-138, -170, 28, 0, TAU); g.arc(138, -170, 28, 0, TAU); g.fillStyle = piel; g.fill();
  g.beginPath(); g.arc(0, -170, 136, 0, TAU); g.fillStyle = piel; g.fill();
  g.beginPath(); g.arc(0, -178, 142, 3.35, 6.07); g.quadraticCurveTo(100, -240, 40, -260); g.quadraticCurveTo(-60, -232, -134, -190); g.closePath(); g.fillStyle = "#3a2416"; g.fill();
  // la cara
  const cerrado = feliz > 0.5;
  for (const s of [-1, 1]) {
    if (cerrado) { g.strokeStyle = "#3a2210"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.arc(s * 48, -168, 24, 3.4, 6.0); g.stroke(); }
    else { g.beginPath(); g.ellipse(s * 48, -178, 28, 34, 0, 0, TAU); g.fillStyle = "#fff"; g.fill(); g.beginPath(); g.arc(s * 48 + 2, -174 + 4 * frio, 14, 0, TAU); g.fillStyle = "#2a1a10"; g.fill(); }
    g.strokeStyle = "#3a2416"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(s * 20, -222 + (frio ? -6 : 0)); g.lineTo(s * 76, -226 + (frio ? 8 : 0) * -s * 0); g.stroke();
    g.beginPath(); g.arc(s * 84, -112, 26, 0, TAU); g.fillStyle = frio > 0.01 ? "rgba(140,170,255,0.3)" : "rgba(255,110,110,0.35)"; g.fill();
  }
  g.lineCap = "round"; g.lineWidth = 9;
  if (feliz > 0.5) { g.beginPath(); g.arc(0, -126, 44, 0.2, Math.PI - 0.2); g.strokeStyle = "#5a1d1d"; g.stroke(); }
  else if (frio > 0.3) { g.strokeStyle = "#5a2d4d"; g.beginPath(); g.moveTo(-34, -88); for (let i = 1; i <= 6; i++) g.lineTo(-34 + i * 11.3, -88 + (i % 2 ? -10 : 8)); g.stroke(); }
  else { g.strokeStyle = "#7a2a2a"; g.beginPath(); g.arc(0, -112, 30, 0.25, Math.PI - 0.25); g.stroke(); }
  // el jersey que cae encima
  if (jersey > 0.001) {
    const e = jersey, dy = -(1 - e) * 1300;
    g.save(); g.translate(0, dy);
    g.save(); g.globalAlpha *= 0.4; g.restore();
    const na = "#ff8a2a", nb = "#c9561a";
    const manga = (s) => { g.strokeStyle = na; g.lineWidth = 118; g.lineCap = "round"; g.beginPath(); g.moveTo(s * 190, 70); g.lineTo(s * 258, 470); g.stroke(); };
    manga(-1); manga(1);
    for (const s of [-1, 1]) { g.save(); g.strokeStyle = "rgba(150,60,10,0.35)"; g.lineWidth = 108; g.setLineDash([5, 16]); g.beginPath(); g.moveTo(s * 190, 70); g.lineTo(s * 258, 470); g.stroke(); g.restore(); g.strokeStyle = "#ffe9c4"; g.lineWidth = 124; g.lineCap = "butt"; g.beginPath(); g.moveTo(s * 253, 440); g.lineTo(s * 258, 485); g.stroke(); }
    redondo(g, -214, -16, 428, 960, 112); const gr = g.createLinearGradient(-200, 0, 200, 0); gr.addColorStop(0, "#ffa04a"); gr.addColorStop(0.5, "#ff8a2a"); gr.addColorStop(1, "#e56f18"); g.fillStyle = gr; g.fill();
    g.save(); redondo(g, -214, -16, 428, 960, 112); g.clip(); g.strokeStyle = "rgba(150,60,10,0.3)"; g.lineWidth = 5;
    for (let x = -210; x < 215; x += 20) { g.beginPath(); g.moveTo(x, -16); g.lineTo(x, 960); g.stroke(); }
    g.fillStyle = "#ffe9c4"; g.fillRect(-214, 250, 428, 36); g.fillRect(-214, 340, 428, 36); g.fillStyle = nb; g.fillRect(-214, 286, 428, 8);
    g.restore();
    g.beginPath(); g.ellipse(0, -20, 78, 44, 0, 0, TAU); g.fillStyle = "#ffe9c4"; g.fill();
    g.beginPath(); g.ellipse(0, -26, 52, 24, 0, 0, TAU); g.fillStyle = mezColor(piel, "#b88060", 0.2); g.fill();
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- la casa cortada: el interior se ve (centrada en 0,0)
export function casa(g, t, o = {}) {
  const { calor = 0.5, grados = 21, sudor = 0, humo = 1 } = o;
  const col = colCalor(calor);
  g.save();
  // nieve del suelo
  g.beginPath(); g.ellipse(0, 400, 560, 70, 0, 0, TAU); g.fillStyle = "#e9f1ff"; g.fill();
  // chimenea
  redondo(g, 150, -400, 74, 150, 8); g.fillStyle = "#7a4a3a"; g.fill(); redondo(g, 140, -414, 94, 26, 10); g.fillStyle = "#fff"; g.fill();
  if (humo > 0.01) for (let i = 0; i < 6; i++) { const p = (t * 0.4 + i / 6) % 1; g.beginPath(); g.arc(187 + Math.sin(p * 6 + i) * 18, -430 - p * 260, 22 + p * 34, 0, TAU); g.fillStyle = `rgba(235,235,245,${0.6 * (1 - p) * humo})`; g.fill(); }
  // tejado
  g.beginPath(); g.moveTo(-410, -108); g.lineTo(0, -440); g.lineTo(410, -108); g.closePath();
  let gr = g.createLinearGradient(0, -440, 0, -108); gr.addColorStop(0, "#c24848"); gr.addColorStop(1, "#8f2f3a"); g.fillStyle = gr; g.fill();
  g.lineJoin = "round"; g.lineCap = "round"; g.lineWidth = 30; g.strokeStyle = "#ffffff"; g.beginPath(); g.moveTo(-330, -166); g.lineTo(0, -440 + 14); g.lineTo(330, -166); g.stroke();
  // el interior
  redondo(g, -330, -108, 660, 490, 14);
  gr = g.createLinearGradient(0, -108, 0, 382); gr.addColorStop(0, mezColor("#ffe9c2", "#ff9a66", calor)); gr.addColorStop(1, mezColor("#ffc98a", "#ff5a3a", calor)); g.fillStyle = gr; g.fill();
  g.lineWidth = 22; g.strokeStyle = "#f4ece0"; g.stroke();
  g.fillStyle = "#8a5a34"; g.fillRect(-319, 336, 638, 35);
  // la ventana
  redondo(g, -270, -10, 170, 200, 10); g.fillStyle = "#cfe8ff"; g.fill();
  const r = azar(21); for (let i = 0; i < 12; i++) { g.beginPath(); g.arc(-266 + r() * 160, -6 + ((r() * 190 + t * 40) % 190), 3, 0, TAU); g.fillStyle = "#fff"; g.fill(); }
  g.lineWidth = 12; g.strokeStyle = "#fff"; redondo(g, -270, -10, 170, 200, 10); g.stroke(); g.beginPath(); g.moveTo(-185, -10); g.lineTo(-185, 190); g.stroke();
  // el radiador y su calor
  for (let i = 0; i < 6; i++) { redondo(g, -250 + i * 27, 236, 20, 100, 8); g.fillStyle = "#f1f3f8"; g.fill(); }
  g.fillStyle = "#c9ced8"; g.fillRect(-256, 228, 160, 10); g.fillRect(-256, 330, 160, 10);
  if (calor > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 5; i++) { const x = -240 + i * 36, ph = t * 2.2 + i; g.strokeStyle = `rgba(${col},${0.55 * calor})`; g.beginPath(); g.moveTo(x, 220); g.bezierCurveTo(x - 16 + Math.sin(ph) * 10, 170, x + 16 + Math.cos(ph) * 10, 130, x + Math.sin(ph) * 8, 70); g.stroke(); } g.restore(); }
  // el termostato de la pared
  g.save(); g.translate(180, 100); g.scale(0.3, 0.3); termostato(g, t, { grados, calor }); g.restore();
  // el amigo en la ventana, con su sudor
  if (sudor > 0.01) {
    g.save(); g.globalAlpha *= sudor; g.translate(-185, 90);
    g.beginPath(); g.arc(0, 0, 60, 0, TAU); g.fillStyle = "#ffd2a8"; g.fill();
    g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-20, -8, 7, 0, TAU); g.arc(20, -8, 7, 0, TAU); g.fill();
    g.strokeStyle = "#5a1d1d"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.arc(0, 28, 18, 3.6, 5.8); g.stroke();
    g.fillStyle = "rgba(255,120,120,0.35)"; g.beginPath(); g.arc(-38, 14, 14, 0, TAU); g.arc(38, 14, 14, 0, TAU); g.fill();
    for (let i = 0; i < 3; i++) { const p = (t * 1.2 + i / 3) % 1; const x = (i - 1) * 46, y = -40 + p * 90; g.beginPath(); g.moveTo(x, y - 14); g.quadraticCurveTo(x + 11, y + 6, x, y + 12); g.quadraticCurveTo(x - 11, y + 6, x, y - 14); g.fillStyle = `rgba(120,200,255,${0.9 * (1 - p)})`; g.fill(); }
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- el avión de papel y el amigo
export function avion(g, x, y, ang) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1.7, 1.7);
  g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.fillStyle = "#cfe0ff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-20, 12); g.closePath(); g.fill();
  g.fillStyle = "#9ab8ee"; g.beginPath(); g.moveTo(-20, 12); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.restore();
}
export function amigo(g, x, y, esc, al, textoAmigo = "Ese amigo") {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha *= al;
  g.beginPath(); g.arc(0, 0, 80, 0, TAU); g.fillStyle = "#ffd29a"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-28, -10, 8, 0, TAU); g.arc(28, -10, 8, 0, TAU); g.fill();
  g.strokeStyle = "#3a2210"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.arc(0, 14, 32, 0.25, Math.PI - 0.25); g.stroke();
  redondo(g, 100, -40, 300, 80, 36); g.fillStyle = "#1d6bff"; g.fill(); g.font = "800 44px Figtree"; g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(textoAmigo, 130, 2);
  g.restore();
}

// ---------------------------------------------------------------- una lluvia de monedas que salta y cae
export function lluvia(g, t, t0, x, y, n = 18, semilla = 7, vel = 900) {
  const u = t - t0; if (u < 0 || u > 2.2) return;
  const r = azar(semilla);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.3, s = vel * (0.5 + r() * 0.7), spin = 6 + r() * 10, ph = r() * 6;
    const px = x + Math.cos(a) * s * u, py = y + Math.sin(a) * s * u + 1100 * u * u;
    moneda(g, px, py, 26 + r() * 14, ph + u * spin, { al: 1 - tr(u, 1.5, 2.2) });
  }
}

// ---------------------------------------------------------------- el primer plano del vídeo: el termostato que tira el dinero
const F3 = v.frase(3);
export const TP = F3.t("veintiuno");
const TG = v.frase(2).t("grado");
export function gancho(g, t) {
  const Z = 1.1 + 0.04 * tr(t, 0, 5.7) + 0.3 * su(tr(t, 5.85, 6.7));
  vista(g, Z, 0, 40);
  const calor = mez(1, 0.42, su(tr(t, TP, TP + 0.8)));
  const col = colCalor(calor);
  // la pared
  const gr = g.createLinearGradient(0, -1100, 0, 1100); gr.addColorStop(0, mezColor("#74182c", "#5a2a58", 1 - calor)); gr.addColorStop(1, mezColor("#f0653a", "#f4a257", 1 - calor));
  g.fillStyle = gr; g.fillRect(-800, -1200, 1600, 2400);
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -800; x < 800; x += 120) g.fillRect(x, -1200, 54, 2400);
  k.brillo(g, 0, 40, 1900, col, 0.55 * calor + 0.15);
  // las ondas de calor
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const Tn = Math.min(t, 8.0);
  for (let i = 0; i < 4; i++) { const u = (Tn * 0.55 + i / 4) % 1, rr = TR + 14 + u * 620; g.strokeStyle = `rgba(${col},${(1 - u) * 0.55 * calor})`; g.lineWidth = 16 * (1 - u) + 3; g.beginPath(); g.arc(0, 40, rr, 0, TAU); g.stroke(); }
  g.restore();
  // los billetes que se van volando
  const N = 18, r = azar(3), flujo = 1 - su(tr(t, TP, TP + 0.7));
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * TAU + (r() - 0.5) * 0.3, sp = 0.3 + r() * 0.12, giro = (r() - 0.5) * 4, esc = 1.2 + r() * 0.6;
    const p = (t * sp + i / N * 1.37) % 1, rad = 270 + p * 1000, a = a0 + 0.5 * p;
    const x = Math.cos(a) * rad, y = 40 + Math.sin(a) * rad;
    const fade = Math.max(0, Math.min(1, (flujo - i / N * 0.55) * 6)) * Math.min(1, p * 9) * (1 - tr(p, 0.78, 1)) * (y < -380 ? 0.55 : 1);
    billete(g, x, y, a + giro * p * 3, esc * (0.8 + 0.5 * p), fade);
  }
  // el termostato
  const pul = t > TG && t < TP ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
  const pr = k.pulso(t, TP + 0.05, 0.12);
  g.save(); g.translate(0, 40); const sc = 1 + 0.03 * pr; g.scale(sc, sc);
  termostato(g, t, { grados: 22 - su(tr(t, TP, TP + 0.5)), calor, boton: Math.max(pul * su(tr(t, TG, TG + 0.3)), pr) });
  g.restore();
  // el dedo
  const a = su(tr(t, 2.0, 3.0)) * (1 - su(tr(t, TP + 0.35, TP + 0.8)));
  if (a > 0.001) {
    const h = k.claves([[0, 1], [TP - 0.35, 1], [TP, 0], [TP + 0.15, 0], [TP + 0.5, 0.9]])(t);
    dedo(g, mez(80, 0, a), mez(1050, 240, a), mez(0.2, 0.03, a), 1, h);
  }
  sinVista(g);
  // el letrero «-1 °C»
  const al = su(tr(t, TG, TG + 0.3)) * (1 - su(tr(t, 5.75, 6.0)));
  k.pastilla(g, 540, 560, "-1", "°C", "255,236,140", al, 100);
}
