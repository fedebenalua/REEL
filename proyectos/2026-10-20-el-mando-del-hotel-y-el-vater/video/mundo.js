// Lo que comparten los planos: la habitación de hotel (de día y bajo luz ultravioleta), los microbios que brillan, el
// mando, el váter, las placas de laboratorio, las huellas, la tele y el móvil. Todo en coordenadas de pantalla.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

export const camara = (g, cam) => { g.translate(540, 960); g.scale(cam.Z, cam.Z); g.translate(-cam.F.x, -cam.F.y); };
export const CAM0 = { Z: 1, F: { x: 540, y: 960 } };
export const mezCam = (a, b, u) => ({ Z: Math.exp(mez(Math.log(a.Z), Math.log(b.Z), u)), F: { x: mez(a.F.x, b.F.x, u), y: mez(a.F.y, b.F.y, u) } });

// ---------------------------------------------------------------- los microbios
// Un microbio: una mancha blanda que se mueve, con pelillos y dos ojos. color: "r,g,b"; al: cuánto se ve.
export function microbio(g, x, y, r, t, semilla, color = "120,255,140", al = 1) {
  if (al <= 0.01 || r < 1) return;
  const az = azar(semilla), f = az() * 6.28, n = 9;
  g.save(); g.globalAlpha *= al; g.translate(x + 3 * Math.sin(t * 2 + f) * r / 20, y + 3 * Math.cos(t * 1.7 + f) * r / 20);
  k.brillo(g, 0, 0, r * 4, color, 0.5);
  // los pelillos
  g.strokeStyle = `rgba(${color},0.8)`; g.lineWidth = Math.max(1, r * 0.08); g.lineCap = "round";
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28 + f, ond = Math.sin(t * 8 + i) * 0.2; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9); g.lineTo(Math.cos(a + ond) * r * 1.35, Math.sin(a + ond) * r * 1.35); g.stroke(); }
  // el cuerpo, blando
  g.beginPath();
  for (let i = 0; i <= n; i++) { const a = i / n * 6.28, rr = r * (1 + 0.12 * Math.sin(a * 3 + t * 4 + f)); const px = Math.cos(a) * rr, py = Math.sin(a) * rr * 0.9; i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath();
  const cg = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.1); cg.addColorStop(0, "rgba(255,255,255,0.95)"); cg.addColorStop(0.35, `rgba(${color},0.95)`); cg.addColorStop(1, `rgba(${color},0.6)`);
  g.fillStyle = cg; g.fill();
  // los ojos
  const parp = Math.sin(t * 1.3 + f * 3) > 0.97 ? 0.15 : 1;
  for (const s of [-1, 1]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(s * r * 0.3, -r * 0.1, r * 0.2, r * 0.24 * parp, 0, 0, 6.2832); g.fill(); g.fillStyle = "#111"; g.beginPath(); g.arc(s * r * 0.3 + r * 0.05, -r * 0.08, r * 0.1 * parp, 0, 6.2832); g.fill(); }
  g.restore();
}
// Muchos microbios repartidos por un rectángulo (x, y, w, h), que aparecen con n (0-1).
export function nube(g, x, y, w, h, t, n, semilla, color, rMax = 26) {
  const az = azar(semilla), N = 40;
  for (let i = 0; i < N; i++) {
    const px = x + az() * w, py = y + az() * h, r = rMax * (0.4 + 0.6 * az()), u = Math.max(0, Math.min(1, n * N - i));
    if (u > 0) microbio(g, px, py, r * k.entra(u), t, semilla * 100 + i, color, 1);
  }
}

// ---------------------------------------------------------------- el mando
// El mando, de frente y de pie, centrado en (x, y), de ancho w (alto 3,4 w), girado ang.
export function mando(g, x, y, w, ang = 0, op = {}) {
  const h = w * 3.4, uv = op.uv ?? 0;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= op.al ?? 1;
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = w * 0.2; g.shadowOffsetY = w * 0.08;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.35); g.fillStyle = "#1b1c22"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.35);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, k.mezColor("#4a4c56", "#3a2a6a", uv)); cg.addColorStop(0.2, k.mezColor("#2a2b33", "#24184a", uv)); cg.addColorStop(1, k.mezColor("#18191e", "#120c28", uv));
  g.fillStyle = cg; g.fill();
  const b = (bx, by, r, col) => { g.fillStyle = k.mezColor(col, "#6a4ab0", uv * 0.6); g.beginPath(); g.arc(bx * w, by * h, r, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.arc(bx * w - r * 0.3, by * h - r * 0.3, r * 0.35, 0, 6.2832); g.fill(); };
  b(-0.22, -0.4, w * 0.11, "#e0283c");
  for (let j = 0; j < 3; j++) for (let i = -1; i <= 1; i++) b(i * 0.25, -0.24 + j * 0.08, w * 0.08, "#55575f");
  g.fillStyle = k.mezColor("#3a3c44", "#2a1a50", uv); g.beginPath(); g.arc(0, h * 0.08, w * 0.3, 0, 6.2832); g.fill(); b(0, 0.08, w * 0.13, "#6a6c74");
  ["#e0283c", "#2fbf55", "#f2c230", "#2f7ae0"].forEach((c, i) => b(-0.33 + i * 0.22, 0.3, w * 0.07, c));
  g.restore();
}

// ---------------------------------------------------------------- el váter
// El váter de frente, centrado en el asiento (x, y), de ancho w. uv: bajo luz ultravioleta.
export function vater(g, x, y, w, uv = 0) {
  g.save(); g.translate(x, y);
  const blanco = (a, b) => { const gg = g.createLinearGradient(-w / 2, 0, w / 2, 0); gg.addColorStop(0, k.mezColor("#c8ccd4", "#5a4a9a", uv)); gg.addColorStop(0.4, k.mezColor("#ffffff", "#c8b8ff", uv)); gg.addColorStop(1, k.mezColor("#b0b6c0", "#4a3a8a", uv)); return gg; };
  // la cisterna
  k.redondo(g, -w * 0.42, -w * 1.05, w * 0.84, w * 0.55, w * 0.06); g.fillStyle = blanco(); g.fill();
  g.fillStyle = k.mezColor("#d0d4dc", "#8a7ad0", uv); k.redondo(g, -w * 0.1, -w * 0.98, w * 0.2, w * 0.06, w * 0.03); g.fill();
  // la taza y la tapa
  g.beginPath(); g.ellipse(0, 0, w / 2, w * 0.2, 0, 0, 6.2832); g.fillStyle = blanco(); g.fill();
  g.beginPath(); g.ellipse(0, 0, w * 0.38, w * 0.13, 0, 0, 6.2832); g.fillStyle = k.mezColor("#8aa8c8", "#3a2a7a", uv); g.fill();
  g.beginPath(); g.moveTo(-w * 0.45, w * 0.05); g.quadraticCurveTo(-w * 0.4, w * 0.6, -w * 0.18, w * 0.7); g.lineTo(w * 0.18, w * 0.7); g.quadraticCurveTo(w * 0.4, w * 0.6, w * 0.45, w * 0.05); g.closePath();
  g.fillStyle = blanco(); g.fill();
  g.fillStyle = k.mezColor("#c8ccd4", "#4a3a8a", uv); k.redondo(g, -w * 0.25, w * 0.68, w * 0.5, w * 0.1, w * 0.03); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la habitación del hotel
// Habitación de frente: pared, cabecero, cama, mesilla con lámpara (y su interruptor), la tele en la pared de
// enfrente no se ve. uv: 0 de día, 1 a oscuras con luz ultravioleta.
export const LAMPARA = { x: 900, y: 1090 }, INTERRUPTOR = { x: 900, y: 1165 };
export function habitacion(g, t, uv = 0) {
  const pg = g.createLinearGradient(0, 0, 0, 1920); pg.addColorStop(0, k.mezColor("#e8d8c0", "#1a0d36", uv)); pg.addColorStop(1, k.mezColor("#c8b498", "#0d0620", uv));
  g.fillStyle = pg; g.fillRect(-300, -300, 1680, 2600);
  // el suelo, debajo de la cama
  g.fillStyle = k.mezColor("#6a4a34", "#0a0418", uv); g.fillRect(-300, 1640, 1680, 800);
  // un cuadro
  g.fillStyle = k.mezColor("#6a4a30", "#2a1a4a", uv); g.fillRect(380, 520, 320, 220); g.fillStyle = k.mezColor("#8ac0c8", "#2a2a6a", uv); g.fillRect(396, 536, 288, 188);
  g.fillStyle = k.mezColor("#e8d070", "#4a3a8a", uv); g.beginPath(); g.arc(620, 590, 28, 0, 6.2832); g.fill();
  // el cabecero
  k.redondo(g, 120, 820, 840, 330, 30); const cg = g.createLinearGradient(0, 820, 0, 1150); cg.addColorStop(0, k.mezColor("#8a5a34", "#2a1848", uv)); cg.addColorStop(1, k.mezColor("#6a4224", "#1a1030", uv));
  g.fillStyle = cg; g.fill();
  // la cama: almohadas y la colcha
  for (const x of [330, 750]) { k.redondo(g, x - 160, 1060, 320, 130, 50); g.fillStyle = k.mezColor("#ffffff", "#d8c8ff", uv); g.fill(); }
  k.redondo(g, 80, 1150, 920, 520, 30); const bg = g.createLinearGradient(0, 1150, 0, 1670); bg.addColorStop(0, k.mezColor("#f4f0ea", "#c8b8ff", uv)); bg.addColorStop(1, k.mezColor("#d8d0c4", "#6a5ab0", uv));
  g.fillStyle = bg; g.fill();
  g.fillStyle = k.mezColor("#b8202a", "#4a1a6a", uv); g.fillRect(80, 1430, 920, 90);
  // la mesilla con la lámpara (a la derecha, delante del cabecero)
  g.fillStyle = k.mezColor("#7a4a28", "#24143e", uv); g.fillRect(810, 1180, 200, 200);
  g.fillStyle = k.mezColor("#c9a050", "#5a4a90", uv); g.fillRect(890, 1100, 20, 80);
  g.beginPath(); g.moveTo(830, 1100); g.lineTo(970, 1100); g.lineTo(940, 980); g.lineTo(860, 980); g.closePath(); g.fillStyle = k.mezColor("#fff0c8", "#8a7ad0", uv); g.fill();
  g.fillStyle = k.mezColor("#e8e0d0", "#9a8ae0", uv); k.redondo(g, 880, 1150, 40, 30, 6); g.fill();
  if (uv < 0.5) k.brillo(g, 900, 1040, 500, "255,220,150", 0.5 * (1 - uv * 2));
}
// La linterna de luz ultravioleta: un cono morado que entra desde arriba a la derecha hasta (x, y).
export function luzUV(g, x, y, al) {
  if (al <= 0.01) return;
  const ox = 1150, oy = -100, ang = Math.atan2(y - oy, x - ox), L = Math.hypot(x - ox, y - oy);
  g.save(); g.translate(ox, oy); g.rotate(ang); g.globalCompositeOperation = "lighter";
  const hg = g.createLinearGradient(0, 0, L, 0); hg.addColorStop(0, `rgba(160,80,255,${0.4 * al})`); hg.addColorStop(1, `rgba(140,60,255,${0.25 * al})`);
  g.fillStyle = hg; g.beginPath(); g.moveTo(0, -30); g.lineTo(L, -260); g.lineTo(L, 260); g.lineTo(0, 30); g.closePath(); g.fill();
  g.restore();
  k.brillo(g, x, y, 800, "150,80,255", 0.6 * al);
}

// ---------------------------------------------------------------- las placas del laboratorio
// Una placa de Petri vista desde arriba, centrada en (x, y), de radio r, con colonias (n 0-1, de color col).
export function placa(g, x, y, r, t, n, semilla, col = "255,200,90") {
  g.save(); g.translate(x, y);
  g.save(); g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill(); g.restore();
  const ag = g.createRadialGradient(-r * 0.3, -r * 0.3, 4, 0, 0, r); ag.addColorStop(0, "#fff4d8"); ag.addColorStop(1, "#e8c890");
  g.fillStyle = ag; g.beginPath(); g.arc(0, 0, r * 0.92, 0, 6.2832); g.fill();
  const az = azar(semilla), N = 30;
  for (let i = 0; i < N; i++) {
    const a = az() * 6.28, d = Math.sqrt(az()) * r * 0.8, rr = r * (0.05 + az() * 0.08), u = Math.max(0, Math.min(1, n * N - i));
    if (u <= 0) continue;
    g.fillStyle = `rgba(${col},${0.85})`; g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d, rr * u, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.arc(Math.cos(a) * d - rr * 0.3 * u, Math.sin(a) * d - rr * 0.3 * u, rr * 0.3 * u, 0, 6.2832); g.fill();
  }
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-r * 0.45, -r * 0.5, r * 0.25, r * 0.08, -0.7, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- las huellas
// Una huella de dedo, ovalada, con sus surcos, en (x, y), de alto h, girada ang, de color "r,g,b".
export function huella(g, x, y, h, ang, color, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  g.strokeStyle = `rgba(${color},0.9)`; g.lineWidth = Math.max(1.5, h * 0.05);
  for (let i = 1; i <= 6; i++) { g.beginPath(); g.ellipse(0, h * 0.04 * i * 0.3, h * 0.08 * i * 0.55, h * 0.08 * i * 0.8, 0, Math.PI * 1.05, Math.PI * 2.95); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- la tele y el móvil (casa)
const CW = 640, CH = 360;
function canal(n) {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  if (n === 0) { const gg = c.createLinearGradient(0, 0, 0, CH); gg.addColorStop(0, "#5ad1ff"); gg.addColorStop(1, "#d8f4ff"); c.fillStyle = gg; c.fillRect(0, 0, CW, CH); c.fillStyle = "#2fa24a"; c.beginPath(); c.moveTo(0, 260); c.quadraticCurveTo(200, 180, 360, 250); c.quadraticCurveTo(500, 300, CW, 230); c.lineTo(CW, CH); c.lineTo(0, CH); c.fill(); c.fillStyle = "#fff8c0"; c.beginPath(); c.arc(520, 80, 40, 0, 6.2832); c.fill(); }
  if (n === 1) { c.fillStyle = "#1a0d3a"; c.fillRect(0, 0, CW, CH); c.fillStyle = "#ff5a7a"; c.beginPath(); c.arc(320, 180, 110, 0, 6.2832); c.fill(); c.fillStyle = "#ffd23c"; c.beginPath(); c.arc(320, 180, 60, 0, 6.2832); c.fill(); c.fillStyle = "#fff"; c.font = "900 46px Figtree"; c.textAlign = "center"; c.fillText("PELI", 320, 196); }
  if (n === 2) { c.fillStyle = "#2fa24a"; c.fillRect(0, 0, CW, CH); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#2a9343" : "#34b052"; c.fillRect(i * 80, 0, 80, CH); } c.strokeStyle = "#fff"; c.lineWidth = 5; c.beginPath(); c.moveTo(320, 0); c.lineTo(320, CH); c.stroke(); c.beginPath(); c.arc(320, 180, 60, 0, 6.2832); c.stroke(); }
  return l;
}
const CANALES = [canal(0), canal(1), canal(2)];
const imgTV = k.lienzo(CW, CH);
export function tele(g, x, y, w, t, op = {}) {
  const h = w * 0.5625;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; g.shadowOffsetY = 16;
  k.redondo(g, x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24, 10); g.fillStyle = "#0b0b0e"; g.fill(); g.restore();
  const c = imgTV.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  const cn = op.canal ?? 0, a = Math.floor(cn), u = cn - a;
  c.drawImage(CANALES[((a % 3) + 3) % 3], -CW * su(u), 0); c.drawImage(CANALES[(((a + 1) % 3) + 3) % 3], CW * (1 - su(u)), 0);
  if ((op.volAl ?? 0) > 0) { c.save(); c.globalAlpha = op.volAl; k.redondo(c, 40, 290, 560, 44, 22); c.fillStyle = "rgba(10,10,20,0.75)"; c.fill(); k.redondo(c, 80, 304, Math.max(16, 480 * (op.volumen ?? 0.5)), 16, 8); c.fillStyle = "#5ad1ff"; c.fill(); c.restore(); }
  g.drawImage(imgTV, x - w / 2, y - h / 2, w, h);
  const rg = g.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.08)"); rg.addColorStop(0.42, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x - w / 2, y - h / 2, w, h);
  k.brillo(g, x, y, w * 1.4, "120,200,255", 0.2);
}
const lienzoMovil = k.lienzo(900, 1850);
export function movil(g, x, y, w, ang, op = {}) {
  const h = w * 2.05, r = w * 0.15;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#111"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, r); k.metal(g, -w / 2, w / 2, ["#8ad0c8", "#e8fff8", "#6ab8b0", "#d8fff4", "#4a9890"]);
  const m = w * 0.035, sw = w - 2 * m, sh = h - 2 * m;
  const c = lienzoMovil.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  const bg = c.createLinearGradient(0, 0, 0, 1850); bg.addColorStop(0, "#0f2a2a"); bg.addColorStop(1, "#0a1a24"); c.fillStyle = bg; c.fillRect(0, 0, 900, 1850);
  c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 50px Figtree"; c.fillText("Tele del salón", 450, 230);
  c.strokeStyle = "#5ad1ff"; c.lineWidth = 8; c.lineCap = "round"; for (const rr of [20, 38, 56]) { c.beginPath(); c.arc(780, 130, rr, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); }
  const bt = (i, x, y, rr, col, txt) => { const luz = op.boton === i ? (op.toque ?? 0) : 0; c.save(); c.shadowColor = `rgba(90,255,220,${0.2 + 0.6 * luz})`; c.shadowBlur = 40 + 60 * luz; const gg = c.createRadialGradient(x - rr * 0.3, y - rr * 0.4, rr * 0.1, x, y, rr); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35 + 0.4 * luz)); gg.addColorStop(1, col); c.fillStyle = gg; c.beginPath(); c.arc(x, y, rr, 0, 6.2832); c.fill(); c.restore(); c.fillStyle = "#0a1a1a"; c.font = `800 ${Math.round(rr * 0.7)}px Figtree`; c.fillText(txt, x, y + 4); };
  bt(0, 450, 520, 140, "#5ae8c8", "I"); bt(1, 220, 900, 110, "#d8fff4", "+"); bt(2, 680, 900, 110, "#d8fff4", "-"); bt(3, 220, 1180, 110, "#8ad0ff", "C+"); bt(4, 680, 1180, 110, "#8ad0ff", "C-");
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, r * 0.8); g.clip(); g.drawImage(lienzoMovil, -sw / 2, -sh / 2, sw, sh); g.restore();
  k.redondo(g, -w * 0.13, -sh / 2 + w * 0.03, w * 0.26, w * 0.065, w * 0.033); g.fillStyle = "#050505"; g.fill();
  if ((op.huella ?? 0) > 0) huella(g, w * 0.05, h * 0.18, w * 0.28, 0.2, "90,255,200", op.huella);
  g.restore();
}
export function ondas(g, a, b, t, t0, t1) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  for (let te = t0; te < t1; te += 0.12) {
    const u = (t - te) / 0.55; if (u < 0 || u > 1) continue;
    const x = mez(a.x, b.x, u), y = mez(a.y, b.y, u), r = mez(30, 80, u), al = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
    g.strokeStyle = `rgba(90,230,255,${0.9 * al})`; g.lineWidth = 8;
    g.beginPath(); g.arc(x - Math.cos(ang) * r, y - Math.sin(ang) * r, r, ang - 0.7, ang + 0.7); g.stroke();
  }
  g.restore();
}
