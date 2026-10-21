// Las seis habitaciones de la casa, cada una en su sitio (0,0)-(520,560) y con su truco. Todo sale de t:
// cada una empieza "mal" (gastando) y se arregla en su palabra.
import * as k from "#kit";
import { T, FIJO, W, fase } from "./tiempos.js";

const { tramo: tr, suave: su, entra, mez, redondo } = k;
export const RW = 520, RH = 560, PISO = 455;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ utilidades
export const rs = (n, s = 0) => { const x = Math.sin(n * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const lin = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
const rad = (g, x, y, r0, r1, st, x2 = x, y2 = y) => { const q = g.createRadialGradient(x, y, r0, x2, y2, r1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
const disco = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); };

function pared(g, c0, c1) {
  g.fillStyle = lin(g, 0, 0, 0, PISO, [[0, c0], [1, c1]]); g.fillRect(0, 0, RW, PISO + 4);
  g.save();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.14; g.drawImage(k.red, 0, 0, RW, PISO);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.05; g.drawImage(k.manchas, 0, 0, RW, PISO);
  g.restore();
}
function suelo(g, c0, c1, tablas = true) {
  g.fillStyle = lin(g, 0, PISO, 0, RH, [[0, c0], [1, c1]]); g.fillRect(0, PISO, RW, RH - PISO);
  g.fillStyle = "rgba(255,255,255,0.2)"; g.fillRect(0, PISO - 12, RW, 12);
  g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(0, PISO, RW, 6);
  if (tablas) { g.strokeStyle = "rgba(0,0,0,0.2)"; g.lineWidth = 2; for (let y = PISO + 30; y < RH; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); } }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, 0, PISO, RW, RH - PISO); g.restore();
}
function vineta(g, fuerza = 0.5) {
  g.fillStyle = rad(g, RW / 2, RH * 0.48, RW * 0.32, RW * 0.88, [[0, "rgba(0,0,0,0)"], [1, `rgba(0,0,0,${fuerza})`]]); g.fillRect(0, 0, RW, RH);
}
// Olas de calor o de frío: líneas ondulantes que suben.
function olas(g, t, x, y, w, h, rgb, al, n = 6, vel = 3, grosor = 6) {
  if (al < 0.01) return;
  g.save(); g.lineCap = "round"; g.lineWidth = grosor; g.setLineDash([34, 20]); g.lineDashOffset = -t * 80;
  for (let i = 0; i < n; i++) {
    const x0 = x + (n === 1 ? 0 : (i / (n - 1) - 0.5) * w), ph = i * 1.7;
    const q = g.createLinearGradient(0, y, 0, y - h); q.addColorStop(0, `rgba(${rgb},${al})`); q.addColorStop(1, `rgba(${rgb},0)`); g.strokeStyle = q;
    g.beginPath();
    for (let s = 0; s <= 16; s++) { const yy = y - (h * s) / 16, xx = x0 + Math.sin(s * 0.7 - t * vel + ph) * (7 + (12 * s) / 16); s ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
  g.restore();
}
// Vapor o niebla: bolas suaves que suben y crecen.
function vapor(g, t, x, y, w, h, rgb, al, n = 7, seed = 1, vel = 0.32, r0 = 22, r1 = 70) {
  if (al < 0.01) return;
  g.save();
  for (let i = 0; i < n; i++) {
    const u = (((t * vel + i / n + rs(i, seed) * 0.25) % 1) + 1) % 1, px = x + (rs(i, seed + 3) - 0.5) * w + Math.sin(u * 5 + i) * 16, py = y - u * h, r = mez(r0, r1, u);
    const a = al * Math.sin(Math.PI * u) * (1 - u * 0.3);
    g.fillStyle = rad(g, px, py, 0, r, [[0, `rgba(${rgb},${a})`], [1, `rgba(${rgb},0)`]]); disco(g, px, py, r); g.fill();
  }
  g.restore();
}
const brillo = (g, x, y, tam, col, al) => k.brillo(g, x, y, tam, col, al);
const texto = (g, s, x, y, tam, col = "#fff", peso = 800) => { g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.fillText(s, x, y); g.textAlign = "left"; g.textBaseline = "alphabetic"; };
const sombra = (g, x, y, w, h, al = 0.35) => { g.save(); g.fillStyle = rad(g, x, y, 0, w, [[0, `rgba(0,0,0,${al})`], [1, "rgba(0,0,0,0)"]]); g.translate(0, 0); g.beginPath(); g.ellipse(x, y, w, h, 0, 0, TAU); g.fill(); g.restore(); };

// ================================================================== 1. EL DORMITORIO: la bombilla
const TSOLTAR = T.cambia + 0.12, TLED = T.led + 0.05, BX = 262, BY = 232;

function peraPath(g, esc = 1) {
  g.beginPath();
  g.moveTo(-19 * esc, -88 * esc);
  g.bezierCurveTo(-19 * esc, -64 * esc, -52 * esc, -58 * esc, -52 * esc, -4 * esc);
  g.bezierCurveTo(-52 * esc, 32 * esc, -28 * esc, 54 * esc, 0, 54 * esc);
  g.bezierCurveTo(28 * esc, 54 * esc, 52 * esc, 32 * esc, 52 * esc, -4 * esc);
  g.bezierCurveTo(52 * esc, -58 * esc, 19 * esc, -64 * esc, 19 * esc, -88 * esc);
  g.closePath();
}
function rosca(g, esc = 1, tono = ["#7f858f", "#f1f3f6", "#9aa1ac", "#d7dbe2", "#6a707a"]) {
  g.save();
  const q = g.createLinearGradient(-22, 0, 22, 0); tono.forEach((c, i) => q.addColorStop(i / (tono.length - 1), c));
  g.fillStyle = q; redondo(g, -22, -118, 44, 34, 6); g.fill();
  g.strokeStyle = "rgba(0,0,0,0.32)"; g.lineWidth = 3;
  for (let y = -110; y < -86; y += 8) { g.beginPath(); g.moveTo(-22, y); g.lineTo(22, y + 3); g.stroke(); }
  g.restore();
}
// La bombilla vieja (encendida, al rojo) con su filamento.
function bombillaVieja(g, t, calor, luz) {
  const a = 0.35 + 0.65 * calor;
  peraPath(g);
  g.fillStyle = rad(g, 0, 4, 4, 70, [[0, `rgba(255,250,215,${0.95 * luz + 0.05})`], [0.45, `rgba(255,206,110,${0.85 * luz * a + 0.1})`], [1, `rgba(255,128,48,${0.9 * a * luz + 0.08})`]]); g.fill();
  g.strokeStyle = `rgba(255,255,255,${0.5})`; g.lineWidth = 3; g.stroke();
  // filamento
  g.save(); g.strokeStyle = `rgba(255,255,235,${0.4 + 0.6 * luz})`; g.lineWidth = 3; g.lineCap = "round";
  g.beginPath(); g.moveTo(-8, -72); g.lineTo(-8, -18); g.moveTo(8, -72); g.lineTo(8, -18); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(-8, -18);
  for (let i = 0; i < 6; i++) g.lineTo(i % 2 ? -8 : 8, -18 + (i + 1) * 3.2); g.stroke();
  g.restore();
  // brillo de vidrio
  g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.ellipse(-28, -12, 6, 20, 0.2, 0, TAU); g.fill();
  rosca(g);
}
// La bombilla LED: vidrio lechoso, chips y aletas.
function bombillaLed(g, t, luz) {
  // aletas del disipador
  g.save();
  const q = g.createLinearGradient(-26, 0, 26, 0); ["#9aa2ad", "#ffffff", "#d3d9e2", "#8e96a2"].forEach((c, i) => q.addColorStop(i / 3, c));
  g.fillStyle = q; redondo(g, -24, -92, 48, 44, 8); g.fill();
  g.strokeStyle = "rgba(60,70,90,0.5)"; g.lineWidth = 2; for (let y = -86; y < -50; y += 7) { g.beginPath(); g.moveTo(-24, y); g.lineTo(24, y); g.stroke(); }
  g.restore();
  g.save(); g.translate(0, 8);
  peraPath(g, 0.98);
  g.fillStyle = rad(g, -10, -8, 4, 66, [[0, `rgba(255,255,255,${0.5 + 0.5 * luz})`], [0.6, `rgba(232,243,255,${0.55 + 0.4 * luz})`], [1, `rgba(150,205,255,${0.5 + 0.4 * luz})`]]); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 3; g.stroke();
  // chips
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.3, cx = Math.cos(a) * 24, cy = -2 + Math.sin(a) * 22;
    g.fillStyle = `rgba(255,243,170,${0.55 + 0.45 * luz})`; g.fillRect(cx - 5, cy - 5, 10, 10);
    g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(cx - 2, cy - 2, 4, 4);
  }
  g.fillStyle = `rgba(255,255,255,${0.6 * luz})`; disco(g, 0, -2, 11); g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(-28, -14, 6, 20, 0.2, 0, TAU); g.fill();
  g.restore();
  rosca(g);
}

export function dormitorio(g, t) {
  const fj = FIJO.luz(t);
  pared(g, "#4552c4", "#1e2570");
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let x = 26; x < RW; x += 52) g.fillRect(x, 0, 26, PISO);
  suelo(g, "#b07548", "#6a3f2a");
  // ventana con noche y luna
  g.save(); g.beginPath(); g.rect(36, 78, 146, 212); g.clip();
  g.fillStyle = lin(g, 0, 78, 0, 290, [[0, "#0a1448"], [1, "#4a3a96"]]); g.fillRect(36, 78, 146, 212);
  for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * rs(i, 5)})`; disco(g, 36 + rs(i, 1) * 146, 78 + rs(i, 2) * 200, 0.8 + rs(i, 3) * 1.8); g.fill(); }
  brillo(g, 138, 134, 120, "255,244,200", 0.55); g.fillStyle = "#fff4cf"; disco(g, 138, 134, 17); g.fill();
  g.restore();
  g.strokeStyle = "#f4f1ff"; g.lineWidth = 10; g.strokeRect(36, 78, 146, 212); g.lineWidth = 6; g.beginPath(); g.moveTo(109, 78); g.lineTo(109, 290); g.moveTo(36, 184); g.lineTo(182, 184); g.stroke();
  g.fillStyle = "#eae6ff"; redondo(g, 26, 288, 166, 14, 6); g.fill();
  for (const [cx, sg] of [[26, 1], [192, -1]]) { // cortinas
    g.fillStyle = lin(g, cx, 0, cx + sg * 58, 0, [[0, "#ff7aa2"], [0.5, "#d84877"], [1, "#ff7aa2"]]);
    g.beginPath(); g.moveTo(cx, 60); g.lineTo(cx + sg * 58, 60); g.quadraticCurveTo(cx + sg * 44, 180, cx + sg * 64, 310); g.lineTo(cx, 312); g.closePath(); g.fill();
    g.strokeStyle = "rgba(90,10,50,0.35)"; g.lineWidth = 3; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(cx + sg * i * 14, 62); g.lineTo(cx + sg * i * 15, 306); g.stroke(); }
  }
  g.fillStyle = "#ffe08a"; g.fillRect(14, 54, 190, 9); // barra
  // cama
  sombra(g, 400, 458, 130, 12, 0.45);
  g.fillStyle = "#6b3f23"; redondo(g, 290, 398, 222, 60, 8); g.fill();
  g.fillStyle = lin(g, 0, 330, 0, 400, [[0, "#fff5e2"], [1, "#e9d6b3"]]); redondo(g, 290, 346, 222, 56, 22); g.fill();
  g.fillStyle = lin(g, 0, 360, 0, 410, [[0, "#ff8a64"], [1, "#d6483a"]]); redondo(g, 290, 366, 196, 44, 18); g.fill();
  g.fillStyle = "rgba(255,255,255,0.2)"; for (let i = 0; i < 4; i++) g.fillRect(320 + i * 42, 366, 14, 44);
  g.fillStyle = "#fffaf0"; g.beginPath(); g.ellipse(458, 340, 40, 20, -0.12, 0, TAU); g.fill();
  g.fillStyle = "rgba(0,0,0,0.12)"; g.beginPath(); g.ellipse(462, 346, 36, 12, -0.12, 0, TAU); g.fill();
  g.fillStyle = lin(g, 496, 0, 520, 0, [[0, "#8a5532"], [1, "#4a2a18"]]); g.fillRect(496, 270, 24, 190);

  // luz de la bombilla en toda la habitación
  const caeAl = su(tr(t, TSOLTAR, TSOLTAR + 0.18)), entraAl = su(tr(t, TLED - 0.3, TLED + 0.05));
  const luz = 1 - 0.78 * caeAl * (1 - entraAl);
  const col = k.mezRgb("255,170,70", "255,244,222", fj);
  g.save(); g.globalCompositeOperation = "lighter";
  g.fillStyle = rad(g, BX, BY, 0, 380, [[0, `rgba(${col},${0.55 * luz})`], [0.5, `rgba(${col},${0.2 * luz})`], [1, `rgba(${col},0)`]]); g.fillRect(0, 0, RW, RH);
  g.restore();
  // cable y casquillo
  g.strokeStyle = "#16121f"; g.lineWidth = 6; g.beginPath(); g.moveTo(BX, -4); g.lineTo(BX, BY - 118); g.stroke();
  // bombilla vieja: calor, desenroscarse y caer
  const dt = t - TSOLTAR;
  if (dt < 6) {
    let by = BY, rot = 0;
    const vivo = 1 - su(tr(dt, 0, 1.0));
    if (dt < 0 && t > T.cambia - 0.25) { const u = tr(t, T.cambia - 0.25, TSOLTAR); rot = Math.sin(u * 14) * 0.07 * u; by = BY - 8 * su(u); }
    if (dt >= 0) {
      const G = 2600, yF = PISO + 40, ty = Math.sqrt((2 * (yF - BY)) / G);
      if (dt < ty) by = BY + 0.5 * G * dt * dt;
      else { const vb = -G * ty * 0.3, d2 = dt - ty; by = yF + vb * d2 + 0.5 * G * d2 * d2; if (by > yF || d2 > (2 * -vb) / G) by = yF; }
      rot = 1.5 * su(tr(dt, 0, ty + 0.3));
    }
    const calor = dt < 0 ? 1 : vivo, luzV = dt < 0 ? 1 : vivo * 0.9;
    const al = dt < 4.4 ? 1 : 1 - su(tr(dt, 4.4, 5.6));
    g.save(); g.translate(dt < 0 ? BX : BX + 0 * dt, by); g.rotate(rot); g.globalAlpha = al;
    if (dt < 0) { brillo(g, 0, 0, 420, "255,170,70", 0.75); }
    else brillo(g, 0, 0, 420 * vivo + 40, "255,170,70", 0.75 * vivo);
    bombillaVieja(g, t, calor, luzV);
    g.restore();
    // olas de calor: tirando energía
    olas(g, t, BX, BY - 70, 110, 180, "255,120,70", 0.75 * (dt < 0 ? 1 : vivo), 7, 3.2, 6);
  }
  // LED nueva: entra desde arriba, se enrosca
  if (t > TLED - 0.5) {
    const u = tr(t, TLED - 0.5, TLED), off = -300 * (1 - entra(u));
    g.save(); g.translate(BX, BY + off);
    brillo(g, 0, 0, 420, "255,250,235", 0.55 * entraAl);
    bombillaLed(g, t, entraAl); g.restore();
    k.fogonazo(g, BX, BY, t - TLED, 520, "255,250,235");
  }
  vineta(g, 0.55);
}

// ================================================================== 2. EL SALÓN: el termostato
export function salon(g, t) {
  const fj = FIJO.calor(t), h = 1 - 0.5 * fj;
  pared(g, "#b5483c", "#5e2228");
  g.fillStyle = "rgba(255,230,200,0.06)"; for (let x = 20; x < RW; x += 48) g.fillRect(x, 0, 22, PISO);
  suelo(g, "#c98a52", "#6e4128");
  // ventana fría
  g.save(); g.beginPath(); g.rect(54, 56, 188, 232); g.clip();
  g.fillStyle = lin(g, 0, 56, 0, 288, [[0, "#0c1c5a"], [1, "#3d7ec0"]]); g.fillRect(54, 56, 188, 232);
  for (let i = 0; i < 34; i++) {
    const r = rs(i, 9), x = 54 + ((rs(i, 2) * 188 + Math.sin(t * 1.2 + i) * 14 + 188) % 188), y = 56 + (((t * (34 + 40 * r) + rs(i, 4) * 232) % 232));
    g.fillStyle = `rgba(255,255,255,${0.55 + 0.4 * r})`; disco(g, x, y, 2 + r * 3.2); g.fill();
  }
  g.fillStyle = lin(g, 0, 230, 0, 288, [[0, "rgba(190,230,255,0)"], [1, "rgba(190,230,255,0.45)"]]); g.fillRect(54, 230, 188, 58);
  g.restore();
  g.strokeStyle = "#f6f1ff"; g.lineWidth = 11; g.strokeRect(54, 56, 188, 232); g.lineWidth = 6; g.beginPath(); g.moveTo(148, 56); g.lineTo(148, 288); g.moveTo(54, 172); g.lineTo(242, 172); g.stroke();
  g.fillStyle = "#f1ebe0"; redondo(g, 40, 288, 216, 14, 6); g.fill();
  // radiador
  const RX = 52, RY = 334, RWd = 192;
  g.fillStyle = lin(g, 0, 326, 0, 342, [[0, "#c8ced9"], [1, "#8a92a2"]]); redondo(g, RX - 8, 326, RWd + 16, 14, 6); g.fill(); redondo(g, RX - 8, 442, RWd + 16, 14, 6); g.fill();
  for (let i = 0; i < 7; i++) {
    const x = RX + i * 28;
    g.fillStyle = lin(g, x, 0, x + 24, 0, [[0, "#d9deea"], [0.4, "#ffffff"], [1, "#aab2c4"]]); redondo(g, x, RY, 24, 112, 12); g.fill();
    g.fillStyle = lin(g, 0, RY, 0, RY + 112, [[0, `rgba(255,90,50,${0.45 * h})`], [1, `rgba(255,40,30,${0.8 * h})`]]); redondo(g, x, RY, 24, 112, 12); g.fill();
  }
  brillo(g, RX + 98, 392, 380, "255,110,70", 0.7 * h); brillo(g, RX + 98, 360, 200, "255,200,150", 0.4 * h);
  olas(g, t, RX + 98, 326, 170, 220 * (0.4 + 0.6 * h), "255,130,90", 0.8 * h, 7, 3.0, 7);
  // sofá y manta
  sombra(g, 390, 458, 140, 12, 0.45);
  g.fillStyle = lin(g, 0, 324, 0, 410, [[0, "#2aa6b3"], [1, "#146578"]]); redondo(g, 276, 326, 232, 86, 28); g.fill();
  g.fillStyle = lin(g, 0, 384, 0, 456, [[0, "#35bfcb"], [1, "#157487"]]); redondo(g, 262, 384, 258, 72, 22); g.fill();
  g.fillStyle = lin(g, 0, 372, 0, 440, [[0, "#1b8e9e"], [1, "#0f5668"]]); redondo(g, 258, 360, 36, 96, 16); g.fill(); redondo(g, 486, 360, 36, 96, 16); g.fill();
  g.save(); g.translate(430, 392); g.rotate(-0.06); // manta de cuadros
  g.fillStyle = lin(g, 0, -10, 0, 70, [[0, "#ffc23d"], [1, "#e0861e"]]); redondo(g, -80, -14, 130, 80, 16); g.fill();
  g.strokeStyle = "rgba(160,50,20,0.55)"; g.lineWidth = 4; for (let i = -2; i < 4; i++) { g.beginPath(); g.moveTo(-80 + i * 32, -14); g.lineTo(-80 + i * 32, 66); g.stroke(); } for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-80, 6 + i * 24); g.lineTo(50, 6 + i * 24); g.stroke(); }
  g.restore();
  g.fillStyle = "#ff6f8e"; g.save(); g.translate(318, 392); g.rotate(-0.2); redondo(g, -26, -26, 52, 52, 16); g.fill(); g.restore();
  // termostato de pared
  const TX = 416, TY = 196;
  g.fillStyle = "rgba(0,0,0,0.3)"; disco(g, TX + 4, TY + 8, 70); g.fill();
  g.fillStyle = lin(g, TX - 66, TY - 66, TX + 66, TY + 66, [[0, "#ffffff"], [1, "#c9ced9"]]); disco(g, TX, TY, 68); g.fill();
  const act = 1 - fj;
  for (let i = 0; i < 28; i++) { // marcas alrededor
    const a = -Math.PI * 0.75 + (i / 27) * Math.PI * 1.5, on = i <= 8 + Math.round(10 * (1 - fj * 0.07 * 5));
    g.strokeStyle = on ? `rgba(${k.mezRgb("255,70,50", "255,150,60", fj)},1)` : "rgba(120,130,150,0.6)"; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath(); g.moveTo(TX + Math.cos(a) * 52, TY + Math.sin(a) * 52); g.lineTo(TX + Math.cos(a) * 62, TY + Math.sin(a) * 62); g.stroke();
  }
  g.fillStyle = "#0d1230"; disco(g, TX, TY, 46); g.fill();
  g.save(); disco(g, TX, TY, 44); g.clip();
  const baja = su(tr(t, T.grado - 0.1, T.grado + 0.25));
  const col = baja < 0.5 ? "255,120,90" : "255,190,110";
  g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 16;
  texto(g, "22", TX - 6, TY - 4 - baja * 60, 54, `rgb(${col})`); texto(g, "21", TX - 6, TY - 4 + (1 - baja) * 60, 54, "rgb(255,190,110)");
  g.shadowBlur = 0; g.restore();
  texto(g, "°C", TX + 28, TY - 20, 18, "rgba(255,200,170,0.9)", 700);
  g.fillStyle = `rgba(${k.mezRgb("255,60,40", "255,170,70", fj)},${0.6 + 0.4 * Math.sin(t * 3)})`; disco(g, TX, TY + 30, 4.5); g.fill();
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = rad(g, 0, 0, 0, 1, [[0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0)"]]); g.restore();
  brillo(g, TX, TY, 190, k.mezRgb("255,80,60", "255,160,70", fj), 0.5);
  // tinte rojo del calor
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,70,40,${0.11 * h})`; g.fillRect(0, 0, RW, PISO); g.restore();
  vineta(g, 0.5);
}

// ================================================================== 3. EL BAÑO: ducha contra baño
export function bano(g, t) {
  const caliente = 1 - FIJO.ducha(t), tub = 1 - FIJO.ducha(t);
  const capas = 1 + 3 * tub; // 4 capas de agua (el baño) → 1
  pared(g, "#26a3b0", "#12586a");
  g.strokeStyle = "rgba(255,255,255,0.16)"; g.lineWidth = 3;
  for (let x = 0; x <= RW; x += 52) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, PISO); g.stroke(); }
  for (let y = 0; y <= PISO; y += 52) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); }
  for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(255,255,255,${0.04 + 0.05 * rs(i, 8)})`; g.fillRect(Math.floor(rs(i, 1) * 10) * 52 + 3, Math.floor(rs(i, 2) * 8) * 52 + 3, 46, 46); }
  suelo(g, "#2a7885", "#123d4c", false);
  for (let i = 0; i < 11; i++) for (let j = 0; j < 2; j++) { if ((i + j) % 2) { g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(i * 52, PISO + 6 + j * 52, 52, 52); } }
  // bañera (sección)
  const Y0 = 312, YB = 432, capa = (YB - Y0) / 4, yTop = YB - capa * capas;
  sombra(g, 150, 458, 150, 12, 0.45);
  g.fillStyle = "#e1b34a"; for (const fx of [64, 236]) { g.beginPath(); g.ellipse(fx, 452, 16, 9, 0, 0, TAU); g.fill(); }
  g.fillStyle = lin(g, 18, 0, 282, 0, [[0, "#cdd9e6"], [0.25, "#ffffff"], [0.8, "#e9eff6"], [1, "#a9b9cc"]]);
  g.beginPath(); g.moveTo(18, 296); g.lineTo(282, 296); g.lineTo(282, 408); g.quadraticCurveTo(282, 448, 242, 448); g.lineTo(58, 448); g.quadraticCurveTo(18, 448, 18, 408); g.closePath(); g.fill();
  g.fillStyle = "#c6dbe8"; redondo(g, 34, Y0 - 4, 232, 128, 16); g.fill();
  g.save(); redondo(g, 34, Y0 - 4, 232, YB - Y0 + 12, 16); g.clip();
  g.fillStyle = lin(g, 0, yTop, 0, YB, [[0, "#7be6ff"], [1, "#168fc5"]]); g.fillRect(34, yTop, 232, YB - yTop + 12);
  g.fillStyle = `rgba(255,80,60,${0.2 * caliente})`; g.fillRect(34, yTop, 232, YB - yTop + 12);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.3; g.drawImage(k.causticas, 34 + Math.sin(t) * 12, yTop - 20, 300, 200); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  for (let i = 0; i < 4; i++) { // las cuatro capas del baño
    const y = YB - (i + 1) * capa; if (y < yTop - 1) continue;
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.08)" : "rgba(0,0,60,0.06)"; g.fillRect(34, y, 232, capa);
    g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(34, y); g.lineTo(266, y); g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(34, yTop - 1, 232, 4);
  g.restore();
  // los números 1-2-3-4 de las capas
  for (let i = 0; i < 4; i++) {
    const tn = T.cuatro + i * 0.26, a = su(tr(t, tn, tn + 0.18)) * (i < capas - 0.3 ? 1 : 0);
    if (a < 0.01) continue;
    g.save(); g.globalAlpha = a; const cy = YB - (i + 0.5) * capa, esc = 1 + 0.35 * k.pulso(t, tn + 0.08, 0.12);
    g.translate(112, cy); g.scale(esc, esc); g.shadowColor = "rgba(0,40,90,0.7)"; g.shadowBlur = 8; texto(g, String(i + 1), 0, 0, 30, "#fff"); g.restore();
  }
  g.fillStyle = lin(g, 0, 288, 0, 308, [[0, "#ffffff"], [1, "#b9c8d8"]]); redondo(g, 12, 286, 276, 18, 8); g.fill();
  // patito
  const dy = yTop + Math.sin(t * 2.2) * 2.2 - 6;
  g.fillStyle = "#ffd23f"; g.beginPath(); g.ellipse(210, dy, 24, 15, 0, 0, TAU); g.fill(); disco(g, 224, dy - 16, 11); g.fill();
  g.fillStyle = "#ff8a1e"; g.beginPath(); g.moveTo(232, dy - 16); g.lineTo(244, dy - 12); g.lineTo(232, dy - 10); g.closePath(); g.fill();
  g.fillStyle = "#222"; disco(g, 226, dy - 19, 2); g.fill();
  vapor(g, t, 150, 300, 200, 200, "255,255,255", 0.3 * caliente, 8, 4, 0.28, 26, 74);
  // ducha
  const on = su(tr(t, T.ducha, T.ducha + 0.3)), llena = su(tr(t, T.ducha + 0.35, T.ducha + 1.7));
  g.fillStyle = lin(g, 426, 0, 438, 0, [[0, "#8a92a2"], [0.5, "#ffffff"], [1, "#9aa2b2"]]); g.fillRect(426, -6, 12, 118);
  g.beginPath(); g.moveTo(426, 100); g.quadraticCurveTo(426, 132, 400, 132); g.lineTo(400, 142); g.lineTo(412, 142); g.quadraticCurveTo(438, 142, 438, 100); g.closePath(); g.fill();
  g.save(); g.translate(398, 148); g.rotate(0.12);
  g.fillStyle = lin(g, -50, 0, 50, 0, [[0, "#8f98a8"], [0.45, "#ffffff"], [1, "#98a1b2"]]); g.beginPath(); g.ellipse(0, 0, 50, 17, 0, 0, TAU); g.fill();
  g.fillStyle = "#d8dee9"; g.beginPath(); g.ellipse(0, 9, 46, 9, 0, 0, TAU); g.fill();
  g.fillStyle = "#4b5566"; for (let i = -4; i <= 4; i++) { disco(g, i * 9, 10, 1.8); g.fill(); }
  g.restore();
  if (on > 0.01) {
    g.save(); g.globalAlpha = on; g.lineCap = "round"; g.lineWidth = 4; g.strokeStyle = "rgba(210,248,255,0.9)";
    for (let i = 0; i < 28; i++) {
      const r = rs(i, 6), x = 398 - 38 + (i / 27) * 76 + (rs(i, 7) - 0.5) * 6, vel = 480 + r * 260, y0 = 164, L = 190, pos = (t * vel + r * 300) % (L + 40);
      g.beginPath(); g.moveTo(x + (x - 398) * pos * 0.0006, y0 + Math.max(0, pos - 24)); g.lineTo(x + (x - 398) * pos * 0.0006, y0 + Math.min(L, pos)); g.stroke();
    }
    g.restore();
    vapor(g, t, 400, 320, 70, 170, "255,255,255", 0.22 * on, 5, 11, 0.4, 16, 44);
  }
  // jarra medidora
  const JX = 364, JW = 70, JY = 346, JH = 106;
  g.save(); redondo(g, JX, JY, JW, JH, 10); g.clip();
  g.fillStyle = "rgba(220,245,255,0.18)"; g.fillRect(JX, JY, JW, JH);
  const nivel = JH * 0.92 * llena;
  g.fillStyle = lin(g, 0, JY + JH - nivel, 0, JY + JH, [[0, "#8aefff"], [1, "#1a98cc"]]); g.fillRect(JX, JY + JH - nivel, JW, nivel);
  g.fillStyle = "rgba(255,255,255,0.7)"; if (nivel > 2) g.fillRect(JX, JY + JH - nivel, JW, 3);
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(JX + 8, JY + 6, 8, JH - 14);
  g.restore();
  g.strokeStyle = "rgba(235,250,255,0.9)"; g.lineWidth = 4; redondo(g, JX, JY, JW, JH, 10); g.stroke();
  g.beginPath(); g.moveTo(JX + JW, JY + 22); g.quadraticCurveTo(JX + JW + 30, JY + 26, JX + JW + 26, JY + 60); g.quadraticCurveTo(JX + JW + 22, JY + 84, JX + JW, JY + 84); g.stroke();
  g.lineWidth = 3; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(JX + JW - 18, JY + (JH * i) / 4); g.lineTo(JX + JW, JY + (JH * i) / 4); g.stroke(); }
  const a1 = su(tr(t, T.cuatro - 0.2, T.cuatro + 0.1));
  if (a1 > 0.01) { g.save(); g.globalAlpha = a1; g.shadowColor = "rgba(0,40,90,0.7)"; g.shadowBlur = 8; g.fillStyle = "rgba(10,60,90,0.55)"; disco(g, JX - 30, JY + 52, 26); g.fill(); texto(g, "1", JX - 30, JY + 54, 38, "#fff"); g.restore(); }
  vineta(g, 0.5);
}

// ================================================================== 4. EL LAVADERO: la lavadora
export function lavadero(g, t) {
  const fj = FIJO.lavadora(t), cal = 1 - fj;
  pared(g, "#e0a63e", "#8e5f1f");
  g.strokeStyle = "rgba(90,50,10,0.18)"; g.lineWidth = 3; for (let y = 40; y < PISO; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); }
  suelo(g, "#c4603a", "#7d3422");
  // estante con detergentes
  g.fillStyle = lin(g, 0, 108, 0, 124, [[0, "#b87a3d"], [1, "#7a4a22"]]); redondo(g, 8, 110, 210, 14, 4); g.fill();
  const bot = [[26, 52, 62, "#3a6bff", "#9fc0ff"], [78, 34, 48, "#ff5d8f", "#ffc1d6"], [118, 38, 58, "#2fc47a", "#aef0ce"], [166, 46, 50, "#ff9a2e", "#ffd9a6"]];
  for (const [x, w, hh, c0, c1] of bot) { g.fillStyle = lin(g, x, 0, x + w, 0, [[0, c1], [0.5, c0], [1, c0]]); redondo(g, x, 110 - hh, w, hh, 8); g.fill(); g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(x + 5, 110 - hh * 0.6, w - 10, hh * 0.22); }
  // cesto
  g.fillStyle = lin(g, 0, 385, 0, 456, [[0, "#d99a5a"], [1, "#9a6130"]]); redondo(g, 444, 392, 66, 64, 10); g.fill();
  g.strokeStyle = "rgba(90,50,20,0.4)"; g.lineWidth = 3; for (let y = 404; y < 456; y += 12) { g.beginPath(); g.moveTo(444, y); g.lineTo(510, y); g.stroke(); }
  for (const [x, c] of [[456, "#ff5d7a"], [478, "#4cc9f0"], [494, "#ffd23f"]]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, 392, 14, 12, 0.3, 0, TAU); g.fill(); }
  // la lavadora
  sombra(g, 260, 458, 200, 12, 0.5);
  g.fillStyle = lin(g, 84, 0, 436, 0, [[0, "#c5cfe3"], [0.18, "#ffffff"], [0.8, "#eef2fa"], [1, "#aab6cf"]]); redondo(g, 84, 116, 352, 340, 26); g.fill();
  g.fillStyle = lin(g, 0, 116, 0, 204, [[0, "rgba(120,150,255,0.35)"], [1, "rgba(120,150,255,0.08)"]]); redondo(g, 84, 116, 352, 88, 26); g.fill();
  g.fillStyle = "rgba(60,70,110,0.25)"; g.fillRect(84, 203, 352, 3);
  // mando de temperatura
  const KX = 168, KY = 160, ang = mez(0.15, -1.05, su(tr(t, T.treinta - 0.15, T.treinta + 0.5)));
  g.fillStyle = "rgba(0,0,0,0.22)"; disco(g, KX + 2, KY + 5, 36); g.fill();
  for (let i = 0; i < 7; i++) { const a = -1.5 + i * 0.42 - 0.1; g.strokeStyle = "rgba(60,70,110,0.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(KX + Math.cos(a - 1.57) * 40, KY + Math.sin(a - 1.57) * 40); g.lineTo(KX + Math.cos(a - 1.57) * 48, KY + Math.sin(a - 1.57) * 48); g.stroke(); }
  g.fillStyle = lin(g, KX - 32, KY - 32, KX + 32, KY + 32, [[0, "#f4f6fb"], [1, "#8d97ad"]]); disco(g, KX, KY, 32); g.fill();
  g.fillStyle = "#2a3350"; disco(g, KX, KY, 22); g.fill();
  g.strokeStyle = `rgb(${k.mezRgb("255,90,60", "90,200,255", su(tr(t, T.treinta - 0.15, T.treinta + 0.5)))})`; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(KX + Math.sin(ang) * 6, KY - Math.cos(ang) * 6); g.lineTo(KX + Math.sin(ang) * 26, KY - Math.cos(ang) * 26); g.stroke();
  // pantalla
  g.fillStyle = "#0b1230"; redondo(g, 290, 136, 118, 48, 10); g.fill();
  const num = fj < 0.5 ? "60°" : "30°", cn = k.mezRgb("255,90,70", "90,210,255", su(tr(t, T.treinta - 0.05, T.treinta + 0.3)));
  g.save(); g.shadowColor = `rgba(${cn},0.9)`; g.shadowBlur = 14; texto(g, num, 349, 161, 34, `rgb(${cn})`); g.restore();
  // calor alrededor del ojo de buey
  const PX = 260, PY = 330;
  brillo(g, PX, PY, 420, "255,70,40", 0.7 * cal);
  g.fillStyle = lin(g, PX - 120, PY - 120, PX + 120, PY + 120, [[0, "#f5f7fb"], [0.5, "#8a95aa"], [1, "#d9dfec"]]); disco(g, PX, PY, 116); g.fill();
  g.fillStyle = "#1c2236"; disco(g, PX, PY, 102); g.fill();
  g.save(); disco(g, PX, PY, 94); g.clip();
  g.fillStyle = "#0a0f20"; g.fillRect(PX - 100, PY - 100, 200, 200);
  g.fillStyle = "rgba(255,255,255,0.1)"; for (let i = 0; i < 40; i++) { const a = i * 2.4, r = 20 + (i % 5) * 16; disco(g, PX + Math.cos(a) * r, PY + Math.sin(a) * r, 3); g.fill(); }
  const colAgua = k.mezRgb("255,86,56", "40,150,255", fj), nivel = PY + 8 + Math.sin(t * 3) * 4;
  g.fillStyle = `rgba(${colAgua},0.85)`; g.fillRect(PX - 100, nivel, 200, 120);
  g.fillStyle = `rgba(255,255,255,0.35)`; g.fillRect(PX - 100, nivel, 200, 3);
  const giro = t * (3.4 - 1.2 * fj);
  const ropa = [["#ff5d7a", 0], ["#ffd23f", 1.25], ["#4cc9f0", 2.5], ["#f4f6fb", 3.75], ["#9b5de5", 5.0]];
  for (const [c, a0] of ropa) { const a = a0 + giro, x = PX + Math.cos(a) * 52, y = PY + Math.sin(a) * 52; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 26, 17, 0, 0, TAU); g.fill(); g.fillStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(4, 5, 22, 10, 0, 0, TAU); g.fill(); g.restore(); }
  for (let i = 0; i < 9; i++) { const u = (t * 0.7 + i / 9) % 1, bx = PX - 60 + rs(i, 4) * 120, by = nivel + 60 - u * 90; g.fillStyle = `rgba(255,255,255,${0.55 * cal * (1 - u)})`; disco(g, bx, by, 3 + rs(i, 5) * 4); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.14)"; g.beginPath(); g.ellipse(PX - 32, PY - 44, 36, 14, -0.6, 0, TAU); g.fill();
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 4; g.beginPath(); g.arc(PX, PY, 84, 3.6, 4.5); g.stroke();
  // resistencia encendida
  g.fillStyle = lin(g, 200, 0, 320, 0, [[0, `rgba(255,120,60,${0.15 + 0.85 * cal})`], [1, `rgba(255,60,40,${0.15 + 0.85 * cal})`]]); redondo(g, 204, 436, 112, 8, 4); g.fill();
  brillo(g, 260, 440, 220, "255,100,50", 0.6 * cal);
  vapor(g, t, 260, 120, 230, 190, "255,214,200", 0.4 * cal, 9, 3, 0.34, 26, 78);
  olas(g, t, 260, 116, 230, 150, "255,120,90", 0.6 * cal, 6, 3.4, 6);
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,70,40,${0.1 * cal})`; g.fillRect(0, 0, RW, PISO); g.restore();
  vineta(g, 0.5);
}

// ================================================================== 5. LA COCINA: la nevera
export function cocina(g, t) {
  const fz = FIJO.nevera(t), fuga = 1 - fz;
  pared(g, "#22916c", "#124a3b");
  g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(0, 300, RW, PISO - 300);
  g.strokeStyle = "rgba(20,70,60,0.35)"; g.lineWidth = 3;
  for (let y = 300; y < PISO; y += 31) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); }
  for (let r = 0; r < 5; r++) for (let x = (r % 2) * 26; x < RW; x += 52) { g.beginPath(); g.moveTo(x, 300 + r * 31); g.lineTo(x, 331 + r * 31); g.stroke(); }
  g.fillStyle = "rgba(0,60,40,0.18)"; g.fillRect(0, 300, RW, 8);
  suelo(g, "#5c4636", "#2c2018");
  // mueble
  g.fillStyle = lin(g, 0, 330, 0, 456, [[0, "#ff9f43"], [1, "#d8651f"]]); redondo(g, -10, 340, 156, 118, 8); g.fill();
  g.fillStyle = "#f6efe2"; redondo(g, -14, 326, 164, 18, 6); g.fill();
  g.strokeStyle = "rgba(100,40,0,0.35)"; g.lineWidth = 3; g.strokeRect(10, 360, 112, 84);
  g.fillStyle = "#f6d86b"; redondo(g, 54, 410, 30, 6, 3); g.fill();
  g.fillStyle = "#e84a3c"; disco(g, 32, 312, 14); g.fill(); g.fillStyle = "#ff9d2e"; disco(g, 62, 314, 15); g.fill(); g.fillStyle = "#8ed454"; disco(g, 92, 313, 14); g.fill(); // fruta
  // nevera
  const NX = 170, NY = 58, NW = 232, NH = 397;
  sombra(g, 286, 458, 170, 12, 0.5);
  g.fillStyle = lin(g, NX - 6, 0, NX + NW + 6, 0, [[0, "#b9d2cb"], [0.2, "#f2faf7"], [0.85, "#e3f0ec"], [1, "#9dbab2"]]); redondo(g, NX - 6, NY - 8, NW + 12, NH + 8, 22); g.fill();
  // interior
  const CX0 = NX + 12, CW = NW - 24, CY0 = NY + 12, CH = NH - 22;
  g.fillStyle = lin(g, 0, CY0, 0, CY0 + CH, [[0, "#f2fbff"], [1, "#bfe3f1"]]); redondo(g, CX0, CY0, CW, CH, 14); g.fill();
  const abierta = 1 - su(tr(t, T.siete5, T.siete5 + 0.5)), th = abierta * 1.74;
  if (abierta > 0.01) {
    brillo(g, 286, CY0 + 10, 300, "200,235,255", 0.6 * abierta);
    for (let i = 0; i < 4; i++) { const y = CY0 + 54 + i * 82; g.fillStyle = "rgba(140,190,215,0.5)"; g.fillRect(CX0, y, CW, 5); g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(CX0, y - 1, CW, 2); }
    const sh = [CY0 + 54, CY0 + 136, CY0 + 218, CY0 + 300];
    // comida
    g.fillStyle = lin(g, CX0 + 14, 0, CX0 + 50, 0, [[0, "#ffffff"], [1, "#c8d8ff"]]); redondo(g, CX0 + 16, sh[0] - 50, 36, 50, 5); g.fill(); g.fillStyle = "#3a6bff"; g.fillRect(CX0 + 16, sh[0] - 30, 36, 14); // leche
    g.fillStyle = "#f6e6c8"; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(CX0 + 100 + i * 24, sh[0] - 14, 10, 13, 0, 0, TAU); g.fill(); } // huevos
    g.fillStyle = "#ffcf3a"; g.beginPath(); g.moveTo(CX0 + 128, sh[1]); g.lineTo(CX0 + 180, sh[1]); g.lineTo(CX0 + 128, sh[1] - 40); g.closePath(); g.fill(); // queso
    g.fillStyle = "#e03a3a"; for (const [x, y] of [[CX0 + 28, sh[1] - 20], [CX0 + 66, sh[1] - 18], [CX0 + 46, sh[1] - 42]]) { disco(g, x, y, 17); g.fill(); g.fillStyle = "rgba(255,255,255,0.5)"; disco(g, x - 6, y - 7, 4); g.fill(); g.fillStyle = "#e03a3a"; } // tomates
    g.fillStyle = "#6fcf4d"; g.beginPath(); g.ellipse(CX0 + 40, sh[2] - 24, 30, 24, 0, 0, TAU); g.fill(); g.fillStyle = "#a9e888"; g.beginPath(); g.ellipse(CX0 + 34, sh[2] - 28, 14, 14, 0, 0, TAU); g.fill(); // lechuga
    g.fillStyle = "#ff9b2e"; redondo(g, CX0 + 100, sh[2] - 46, 40, 46, 8); g.fill(); g.fillStyle = "#fff"; g.fillRect(CX0 + 100, sh[2] - 36, 40, 10);
    g.fillStyle = "#ff6b8a"; for (let i = 0; i < 3; i++) { redondo(g, CX0 + 152 + i * 14, sh[2] - 30, 12, 30, 4); g.fill(); }
    g.fillStyle = "#9c6bff"; redondo(g, CX0 + 30, sh[3] - 52, 56, 52, 6); g.fill(); g.fillStyle = "#cdb8ff"; redondo(g, CX0 + 100, sh[3] - 40, 70, 40, 6); g.fill();
  }
  // la puerta (bisagra a la derecha)
  const hx = NX + NW, hh = NH, ex = hx - NW * Math.cos(th) + 62 * Math.sin(th), esc = 1 + 0.17 * Math.sin(th);
  const por = (y0, y1) => { /* puerta como trapecio: borde de la bisagra normal, borde libre en perspectiva */ };
  const top0 = NY, bot0 = NY + NH - 2, topE = NY + (NH * (1 - esc)) / 2 - 8 * Math.sin(th), botE = bot0 + (NH * (esc - 1)) / 2 + 8 * Math.sin(th);
  g.save();
  g.beginPath(); g.moveTo(hx, top0); g.lineTo(ex, topE); g.lineTo(ex, botE); g.lineTo(hx, bot0); g.closePath();
  if (th < 1.25) {
    g.fillStyle = lin(g, ex, 0, hx, 0, [[0, "#ffffff"], [1, "#cfe2dc"]]); g.fill();
    g.clip(); g.fillStyle = "rgba(0,0,0,0.08)"; g.fillRect(ex, (topE + botE) / 2 - 2, hx - ex, 4);
    g.restore(); g.save();
    const hxh = ex + 20 * Math.cos(th) * 0 + 16; g.fillStyle = lin(g, hxh, 0, hxh + 10, 0, [[0, "#8e9aa6"], [0.5, "#fff"], [1, "#8e9aa6"]]); redondo(g, hxh, NY + 70, 10, 120, 5); g.fill();
      } else {
    g.fillStyle = lin(g, hx, 0, ex, 0, [[0, "#e9f4f1"], [1, "#b7d2c9"]]); g.fill();
    g.clip();
    for (let i = 0; i < 3; i++) { const y = (topE + botE) / 2 - 110 + i * 100; g.fillStyle = "rgba(120,170,160,0.55)"; g.fillRect(Math.min(hx, ex), y, Math.abs(ex - hx), 8); }
    for (let i = 0; i < 3; i++) { const y = (topE + botE) / 2 - 140 + i * 100, x = Math.min(hx, ex) + 4; g.fillStyle = ["#ff8a3d", "#38b6ff", "#ffd23f"][i]; redondo(g, x, y, Math.abs(ex - hx) - 8, 32, 6); g.fill(); }
  }
  g.restore();
  // el frío que se escapa por abajo
  if (fuga > 0.01) {
    g.save();
    brillo(g, 286, 452, 520, "150,215,255", 0.45 * fuga);
    for (let i = 0; i < 20; i++) {
      const u = (((t * 0.42 + i / 20) % 1) + 1) % 1, lado = i % 2 ? 1 : -1, dist = u * (150 + 130 * rs(i, 2));
      const x = 286 + lado * (30 + dist), y = 446 - Math.sin(u * 3.14) * 9 * rs(i, 3), r = 40 + u * 34, a = 0.5 * fuga * (1 - u) * (u < 0.1 ? u * 10 : 1);
      g.fillStyle = rad(g, x, y, 0, r, [[0, `rgba(215,240,255,${a})`], [1, "rgba(215,240,255,0)"]]); g.beginPath(); g.ellipse(x, y, r * 1.5, r * 0.55, 0, 0, TAU); g.fill();
    }
    for (let i = 0; i < 10; i++) { // niebla cayendo desde la apertura
      const u = (((t * 0.8 + i / 10) % 1) + 1) % 1, x = 220 + rs(i, 7) * 140, y = 200 + u * 250, r = 26 + u * 20;
      g.fillStyle = rad(g, x, y, 0, r, [[0, `rgba(215,240,255,${0.4 * fuga * Math.sin(u * 3.14)})`], [1, "rgba(215,240,255,0)"]]); disco(g, x, y, r); g.fill();
    }
    g.fillStyle = "rgba(255,255,255,0.9)";
    for (let i = 0; i < 24; i++) { const u = (((t * 0.6 + rs(i, 1)) % 1) + 1) % 1, x = 260 + (rs(i, 2) - 0.5) * 420 * u + Math.sin(t * 2 + i) * 6, y = 380 + u * 60 - 0, s = 1.6 + rs(i, 3) * 2.2; g.globalAlpha = fuga * (1 - u) * 0.9; disco(g, x, y, s); g.fill(); }
    g.restore();
  }
  // cronómetro: "mucho rato"
  const cr = su(tr(t, T.puerta - 0.15, T.puerta + 0.2)) * (1 - su(tr(t, T.siete5 + 0.7, T.siete5 + 1.2)));
  if (cr > 0.01) {
    const CXs = 454, CYs = 160, frac = tr(t, T.puerta, T.siete5) * 0.94;
    g.save(); g.translate(CXs, CYs); g.scale(0.6 + 0.4 * cr, 0.6 + 0.4 * cr); g.globalAlpha = cr;
    g.fillStyle = "rgba(0,0,0,0.3)"; disco(g, 3, 6, 52); g.fill();
    g.fillStyle = lin(g, -50, -50, 50, 50, [[0, "#ffffff"], [1, "#cfd6e4"]]); disco(g, 0, 0, 50); g.fill();
    g.fillStyle = "#e8eefb"; disco(g, 0, 0, 40); g.fill();
    g.fillStyle = "rgba(255,70,60,0.95)"; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 40, -Math.PI / 2, -Math.PI / 2 + frac * TAU); g.closePath(); g.fill();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; g.strokeStyle = "#3a4668"; g.lineWidth = 3; g.beginPath(); g.moveTo(Math.cos(a) * 34, Math.sin(a) * 34); g.lineTo(Math.cos(a) * 40, Math.sin(a) * 40); g.stroke(); }
    g.strokeStyle = "#1b2440"; g.lineWidth = 4; g.lineCap = "round"; const ah = -Math.PI / 2 + frac * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ah) * 34, Math.sin(ah) * 34); g.stroke();
    g.fillStyle = "#8a93a8"; redondo(g, -8, -62, 16, 12, 3); g.fill();
    g.restore();
  }
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(120,200,255,${0.12 * fuga})`; g.fillRect(0, 0, RW, RH); g.restore();
  vineta(g, 0.5);
}

// ================================================================== 6. LA ENTRADA: el contador
export function contador(g, t) {
  const w = W(t), wn = Math.min(1, (w - 0.1) / 0.9);
  pared(g, "#5b3bb8", "#251a5c");
  g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 14; for (let i = -4; i < 12; i++) { g.beginPath(); g.moveTo(i * 70, 0); g.lineTo(i * 70 + 200, PISO); g.stroke(); }
  suelo(g, "#3b2a7a", "#1a1238");
  // cable que entra
  g.strokeStyle = "#171221"; g.lineWidth = 17; g.lineCap = "round"; g.beginPath(); g.moveTo(34, -6); g.bezierCurveTo(34, 60, 160, 20, 190, 74); g.stroke();
  g.strokeStyle = "#ff8a2e"; g.lineWidth = 5; g.beginPath(); g.moveTo(34, -6); g.bezierCurveTo(34, 60, 160, 20, 190, 74); g.stroke();
  // caja de fusibles
  g.fillStyle = lin(g, 0, 100, 0, 300, [[0, "#2b3a78"], [1, "#161f4a"]]); redondo(g, 386, 104, 112, 190, 10); g.fill();
  g.strokeStyle = "#8da2ff"; g.lineWidth = 3; redondo(g, 386, 104, 112, 190, 10); g.stroke();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.fillStyle = "#e9eeff"; redondo(g, 400 + c * 32, 122 + r * 40, 22, 28, 4); g.fill(); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(400 + c * 32, 134 + r * 40, 22, 3); }
  g.fillStyle = `rgba(${k.mezRgb("120,255,160", "255,90,70", wn)},1)`; disco(g, 484, 118, 4.5); g.fill();
  // el contador
  sombra(g, 220, 458, 160, 10, 0.45);
  g.fillStyle = lin(g, 76, 0, 364, 0, [[0, "#d9cfae"], [0.15, "#fbf5e1"], [0.8, "#efe6c9"], [1, "#b9ac86"]]); redondo(g, 76, 70, 288, 368, 36); g.fill();
  g.fillStyle = "#2f5fd0"; redondo(g, 76, 70, 288, 44, 30); g.fill(); texto(g, "kWh", 220, 93, 28, "#fff", 800);
  // pantalla de dígitos
  g.fillStyle = "#0a0d1c"; redondo(g, 104, 130, 232, 62, 10); g.fill();
  const val = 48210 + fase(t) * 40;
  for (let c = 0; c < 6; c++) {
    const p = val / Math.pow(10, 5 - c), d = Math.floor(p) % 10, fr = p - Math.floor(p), x = 118 + c * 36;
    g.save(); g.beginPath(); g.rect(x - 2, 134, 32, 54); g.clip();
    const sh = (c >= 4 ? fr : (c === 3 ? Math.max(0, fr - 0.8) * 5 : 0)) * 54;
    g.fillStyle = "#f4f6ff"; g.font = "800 44px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(d), x + 14, 162 - sh); g.fillText(String((d + 1) % 10), x + 14, 162 - sh + 54); g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.restore();
  }
  // disco giratorio
  g.fillStyle = "#0a0d1c"; redondo(g, 104, 206, 232, 150, 12); g.fill();
  const DX = 220, DY = 282, an = fase(t) * TAU;
  g.fillStyle = rad(g, DX - 14, DY - 14, 4, 74, [[0, "#ffffff"], [0.6, "#aeb8cc"], [1, "#59647c"]]); disco(g, DX, DY, 62); g.fill();
  g.strokeStyle = "rgba(60,70,100,0.45)"; g.lineWidth = 2; for (let r = 14; r < 60; r += 12) { disco(g, DX, DY, r); g.stroke(); }
  const estela = Math.min(1, wn * 2);
  for (let i = 5; i >= 0; i--) {
    const a = an - i * 0.28 * (0.3 + estela), al = i === 0 ? 1 : 0.2 * estela * (1 - i / 6);
    if (al < 0.02) continue;
    g.fillStyle = `rgba(235,40,40,${al})`; g.beginPath(); g.moveTo(DX, DY); g.arc(DX, DY, 58, a - 0.13, a + 0.13); g.closePath(); g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(DX - 22, DY - 30, 34, 12, -0.5, 0, TAU); g.fill();
  g.fillStyle = "#c9bf9b"; redondo(g, 104, 370, 232, 12, 5); g.fill();
  // lámpara de aviso y chispas
  const lat = 0.55 + 0.45 * Math.sin(t * 5);
  g.fillStyle = `rgb(${k.mezRgb("90,230,140", "255,60,50", wn)})`; disco(g, 220, 52, 16); g.fill();
  brillo(g, 220, 52, 220 * (0.4 + wn), k.mezRgb("90,230,140", "255,60,50", wn), 0.55 + 0.4 * wn * lat);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const tt = t * 4 + i * 0.41, n = Math.floor(tt), u = tt - n;
    if (rs(n, i) > 0.75 * wn || u > 0.45) continue;
    const side = rs(n, i + 3) > 0.5 ? 1 : -1, x0 = 220 + side * (150 + rs(n, i + 7) * 30), y0 = 120 + rs(n, i + 9) * 260;
    g.strokeStyle = `rgba(255,236,150,${1 - u / 0.45})`; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, y0);
    for (let s = 1; s <= 4; s++) g.lineTo(x0 + side * s * 12 + (rs(n, s + i) - 0.5) * 22, y0 + (rs(n, s + i + 5) - 0.5) * 26); g.stroke();
  }
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,120,50,${0.1 * wn})`; g.fillRect(0, 0, RW, PISO); g.restore();
  vineta(g, 0.5);
}
