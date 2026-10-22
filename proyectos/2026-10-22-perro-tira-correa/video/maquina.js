// La máquina de chicles (la comparación de casa): globo de cristal con bolas, cuerpo rojo, palanca (una manivela) y
// la trampilla por donde sale la bola. Se dibuja en píxeles de un lienzo de 1080 × 1920 (la cámara la mueve el plano).
import * as k from "#kit";

const { azar, lienzo, redondo, suave: su, tramo: tr, mez } = k;
const TAU = Math.PI * 2;

export const CX = 540, GY = 690, GR = 258, MANIV = [540, 1120], CHUTE = [540, 1296];
const COLS = ["#ff4d6d", "#ffd23f", "#3ddc97", "#4cc9f0", "#b388ff", "#ff9f1c", "#fff1f5", "#ff7ad9"];

// Las bolas, puestas una vez: se apilan abajo del globo sin tocarse.
const BOLAS = (() => {
  const az = azar(515), l = [], r = 29;
  for (let i = 0; i < 4000 && l.length < 105; i++) {
    const a = az() * TAU, d = Math.sqrt(az()) * (GR - r - 6), x = CX + Math.cos(a) * d, y = GY + Math.sin(a) * d;
    if (y < GY - GR * 0.18 - 0.0 && az() < 0.82) continue;
    if (l.some((b) => Math.hypot(b.x - x, b.y - y) < 2 * r * 0.93)) continue;
    l.push({ x, y, r, c: COLS[l.length % COLS.length], f: az() * 6 });
  }
  return l.sort((a, b) => a.y - b.y);
})();

const sprites = new Map();
function bola(c) {
  if (sprites.has(c)) return sprites.get(c);
  const S = 96, l = lienzo(S), g = l.getContext("2d");
  const gr = g.createRadialGradient(S * 0.36, S * 0.3, S * 0.04, S / 2, S / 2, S * 0.52);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.18, c); gr.addColorStop(1, k.mezColor(c, "#000000", 0.55));
  g.fillStyle = gr; g.beginPath(); g.arc(S / 2, S / 2, S * 0.48, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.ellipse(S * 0.34, S * 0.28, S * 0.1, S * 0.06, -0.7, 0, TAU); g.fill();
  sprites.set(c, l);
  return l;
}
export function dibujaBola(g, x, y, r, c) { g.drawImage(bola(c), x - r * 1.0, y - r * 1.0, r * 2, r * 2); }

// El hueso de «lo que quiere», dibujado sobre una bola.
export function hueso(g, x, y, s, rot = -0.5) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = "#fffaf0"; g.strokeStyle = "rgba(120,80,40,0.55)"; g.lineWidth = 2.4;
  g.beginPath(); g.rect(-30, -8, 60, 16); g.fill(); g.stroke();
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { g.beginPath(); g.arc(sx * 30, sy * 10, 12, 0, TAU); g.fill(); g.stroke(); }
  g.fillStyle = "#fffaf0"; g.fillRect(-30, -7, 60, 14);
  g.restore();
}

// Un candado: cerrado o abierto (ab de 0 a 1), centrado en (x, y).
export function candado(g, x, y, s, ab = 0, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(s, s);
  g.strokeStyle = "#d5dae2"; g.lineWidth = 11; g.lineCap = "round";
  g.beginPath(); g.save(); g.translate(14 * ab, -ab * 24); g.rotate(ab * 0.5); g.moveTo(-22, -8); g.lineTo(-22, -34); g.arc(0, -34, 22, Math.PI, 0); g.lineTo(22, ab > 0.2 ? -22 : -8); g.restore(); g.stroke();
  const gr = g.createLinearGradient(-34, 0, 34, 0); gr.addColorStop(0, "#f2b53a"); gr.addColorStop(0.5, "#ffe38a"); gr.addColorStop(1, "#c98a1c");
  g.fillStyle = gr; redondo(g, -34, -8, 68, 54, 12); g.fill(); g.strokeStyle = "rgba(90,50,0,0.5)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "#6b4308"; g.beginPath(); g.arc(0, 14, 7, 0, TAU); g.fill(); g.fillRect(-3, 14, 6, 16);
  g.restore();
}

// El fondo de la tienda: pared azul verdosa con luces desenfocadas y el suelo brillante.
export function tienda(g, t) {
  const wg = g.createLinearGradient(0, 0, 0, 1920);
  wg.addColorStop(0, "#0f6f86"); wg.addColorStop(0.55, "#17a3a0"); wg.addColorStop(0.735, "#f1c27a"); wg.addColorStop(1, "#b6733f");
  g.fillStyle = wg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  const az = azar(88);
  for (let i = 0; i < 18; i++) { const x = az() * 1080, y = 180 + az() * 1050, r = 40 + az() * 90, a = 0.12 + 0.07 * Math.sin(t * 1.4 + i), c = ["255,230,150", "255,170,120", "150,240,255"][i % 3]; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(0.75, `rgba(${c},${a * 0.8})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.restore();
  // el suelo: baldosas en perspectiva
  g.save(); g.beginPath(); g.rect(0, 1415, 1080, 505); g.clip();
  const fg = g.createLinearGradient(0, 1415, 0, 1920); fg.addColorStop(0, "#e9b873"); fg.addColorStop(1, "#8a5230"); g.fillStyle = fg; g.fillRect(0, 1415, 1080, 505);
  g.strokeStyle = "rgba(60,30,10,0.25)"; g.lineWidth = 3; g.beginPath();
  for (let i = -8; i <= 8; i++) { g.moveTo(540 + i * 90, 1415); g.lineTo(540 + i * 380, 1920); }
  for (let j = 0; j < 6; j++) { const y = 1415 + Math.pow(j / 5, 1.7) * 505; g.moveTo(0, y); g.lineTo(1080, y); }
  g.stroke();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, 1414, 1080, 4);
}

// La máquina. o: { t, manivela (ángulo de la palanca, rad), bolaCae (0..1: la bola baja por dentro), bolaSale (0..1: sale por la trampilla y viene a cámara), lampara: null | "roja" | "verde" (la luz de arriba del cuerpo) }
export function maquina(g, o) {
  const { t = 0 } = o;
  // la sombra del suelo
  g.save(); g.globalAlpha = 0.35; g.fillStyle = "#3a1a08"; g.beginPath(); g.ellipse(CX, 1420, 270, 34, 0, 0, TAU); g.fill(); g.restore();
  // el pie
  const pg = g.createLinearGradient(CX - 200, 0, CX + 200, 0); pg.addColorStop(0, "#23262c"); pg.addColorStop(0.45, "#5a606b"); pg.addColorStop(1, "#1a1c20");
  g.fillStyle = pg; g.beginPath(); g.moveTo(CX - 232, 1412); g.lineTo(CX - 206, 1360); g.lineTo(CX + 206, 1360); g.lineTo(CX + 232, 1412); g.closePath(); g.fill();
  // el cuerpo rojo
  const cuerpo = () => { g.beginPath(); g.moveTo(CX - 225, 1010); g.quadraticCurveTo(CX - 232, 1010, CX - 236, 1030); g.lineTo(CX - 252, 1340); g.quadraticCurveTo(CX - 254, 1364, CX - 230, 1364); g.lineTo(CX + 230, 1364); g.quadraticCurveTo(CX + 254, 1364, CX + 252, 1340); g.lineTo(CX + 236, 1030); g.quadraticCurveTo(CX + 232, 1010, CX + 225, 1010); g.closePath(); };
  cuerpo();
  const bg = g.createLinearGradient(CX - 250, 0, CX + 250, 0); bg.addColorStop(0, "#8c1414"); bg.addColorStop(0.16, "#e0322d"); bg.addColorStop(0.42, "#ff5a4e"); bg.addColorStop(0.75, "#d3241f"); bg.addColorStop(1, "#7d0f10");
  g.fillStyle = bg; g.fill();
  g.save(); cuerpo(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; g.drawImage(k.manchas, CX - 260, 1000, 520, 340);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.5; const hg = g.createLinearGradient(CX - 200, 0, CX - 130, 0); hg.addColorStop(0, "rgba(255,255,255,0)"); hg.addColorStop(0.5, "rgba(255,255,255,0.6)"); hg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = hg; g.fillRect(CX - 210, 1020, 90, 320);
  g.restore();
  // las tiras cromadas, arriba y abajo
  for (const [y, h] of [[1010, 26], [1340, 24]]) { g.beginPath(); g.rect(CX - 250, y, 500, h); k.metal(g, CX - 250, CX + 250, ["#6d737c", "#e8ecf1", "#9aa2ad", "#f4f6f9", "#5c626a"]); }
  // la luz de arriba del cuerpo
  const lam = o.lampara;
  if (lam) {
    const rojo = lam === "roja", cx2 = CX + 178, cy2 = 1066;
    const col = rojo ? "255,60,50" : "70,255,120", pul = rojo ? 0.7 + 0.3 * Math.sin(t * 7) : 1;
    k.brillo(g, cx2, cy2, 280, col, 0.85 * pul);
    const lg = g.createRadialGradient(cx2 - 8, cy2 - 10, 2, cx2, cy2, 30); lg.addColorStop(0, "#ffffff"); lg.addColorStop(0.3, `rgb(${col})`); lg.addColorStop(1, rojo ? "#6b0a0a" : "#0a5a1c");
    g.fillStyle = "#2a1a1a"; g.beginPath(); g.arc(cx2, cy2, 38, 0, TAU); g.fill();
    g.fillStyle = lg; g.beginPath(); g.arc(cx2, cy2, 31, 0, TAU); g.fill();
  }
  // la placa de la manivela: un disco cromado
  const [mx, my] = MANIV;
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 24; g.shadowOffsetY = 10;
  g.beginPath(); g.arc(mx, my, 102, 0, TAU); g.fillStyle = "#c9ced6"; g.fill(); g.restore();
  const dg = g.createRadialGradient(mx - 36, my - 40, 8, mx, my, 102); dg.addColorStop(0, "#ffffff"); dg.addColorStop(0.5, "#b7bec8"); dg.addColorStop(1, "#5d646e");
  g.fillStyle = dg; g.beginPath(); g.arc(mx, my, 102, 0, TAU); g.fill();
  g.fillStyle = "#7a1010"; g.beginPath(); g.arc(mx, my, 82, 0, TAU); g.fill();
  const ig = g.createRadialGradient(mx - 28, my - 30, 4, mx, my, 80); ig.addColorStop(0, "#ff6a5a"); ig.addColorStop(1, "#8f1414"); g.fillStyle = ig; g.beginPath(); g.arc(mx, my, 78, 0, TAU); g.fill();
  // la palanca: una barra en T que gira
  const ang = o.manivela ?? 0;
  g.save(); g.translate(mx, my); g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 16; g.shadowOffsetY = 8;
  const barra = g.createLinearGradient(0, -24, 0, 24); barra.addColorStop(0, "#fff2b0"); barra.addColorStop(0.5, "#f2b53a"); barra.addColorStop(1, "#a86a10");
  g.fillStyle = barra; redondo(g, -100, -21, 200, 42, 21); g.fill(); g.shadowColor = "transparent";
  g.fillStyle = "rgba(255,255,255,0.5)"; redondo(g, -88, -14, 168, 9, 4.5); g.fill();
  const cg = g.createRadialGradient(-4, -4, 2, 0, 0, 34); cg.addColorStop(0, "#fff"); cg.addColorStop(0.4, "#d5dae2"); cg.addColorStop(1, "#6d737c"); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, 33, 0, TAU); g.fill();
  g.restore();
  // la trampilla de salida
  const [tx, ty] = CHUTE, sale = o.bolaSale || 0;
  g.save();
  redondo(g, tx - 102, ty - 54, 204, 108, 28); g.fillStyle = "#2a2d33"; g.fill();
  const fg = g.createLinearGradient(tx - 102, 0, tx + 102, 0); fg.addColorStop(0, "#6d737c"); fg.addColorStop(0.5, "#eef1f5"); fg.addColorStop(1, "#6d737c");
  redondo(g, tx - 102, ty - 54, 204, 108, 28); g.strokeStyle = fg; g.lineWidth = 10; g.stroke();
  const ig2 = g.createLinearGradient(0, ty - 50, 0, ty + 50); ig2.addColorStop(0, "#050506"); ig2.addColorStop(1, "#1a1c20"); g.fillStyle = ig2; redondo(g, tx - 92, ty - 44, 184, 88, 22); g.fill();
  g.restore();
  // el cuello cromado y el globo
  g.beginPath(); g.rect(CX - 150, 940, 300, 74); k.metal(g, CX - 150, CX + 150, ["#6d737c", "#e8ecf1", "#9aa2ad", "#f4f6f9", "#5c626a"]);
  g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(CX - 150, 1000, 300, 12);
  // el interior del globo: las bolas
  g.save(); g.beginPath(); g.arc(CX, GY, GR, 0, TAU); g.clip();
  const fondoG = g.createRadialGradient(CX - 40, GY - 60, 20, CX, GY, GR); fondoG.addColorStop(0, "rgba(255,255,255,0.12)"); fondoG.addColorStop(1, "rgba(10,40,60,0.45)"); g.fillStyle = fondoG; g.fillRect(CX - GR, GY - GR, GR * 2, GR * 2);
  const cae = o.bolaCae || 0;
  for (let i = 0; i < BOLAS.length; i++) {
    const b = BOLAS[i], m = Math.sin(t * 2.2 + b.f) * 1.6 * (o.agita ?? 1), m2 = Math.cos(t * 1.7 + b.f) * 1.2 * (o.agita ?? 1);
    dibujaBola(g, b.x + m2, b.y + m, b.r, b.c);
  }
  // la bola que baja: sale del montón y se va por el cuello
  if (cae > 0 && cae < 1) { const y = mez(GY + GR - 80, GY + GR + 40, su(tr(cae, 0, 1))); dibujaBola(g, CX, y, 29, "#ffd23f"); }
  g.restore();
  // el cristal: brillo, borde y reflejos
  const cr = g.createRadialGradient(CX - 70, GY - 90, 10, CX, GY, GR); cr.addColorStop(0, "rgba(255,255,255,0.14)"); cr.addColorStop(0.7, "rgba(200,235,255,0.05)"); cr.addColorStop(1, "rgba(200,235,255,0.28)");
  g.fillStyle = cr; g.beginPath(); g.arc(CX, GY, GR, 0, TAU); g.fill();
  g.strokeStyle = "rgba(235,248,255,0.7)"; g.lineWidth = 7; g.beginPath(); g.arc(CX, GY, GR, 0, TAU); g.stroke();
  g.save(); g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 15; g.lineCap = "round"; g.beginPath(); g.arc(CX, GY, GR - 26, Math.PI * 1.08, Math.PI * 1.42); g.stroke();
  g.lineWidth = 8; g.globalAlpha = 0.55; g.beginPath(); g.arc(CX, GY, GR - 26, Math.PI * 1.46, Math.PI * 1.53); g.stroke();
  g.globalAlpha = 0.4; g.lineWidth = 11; g.beginPath(); g.arc(CX, GY, GR - 24, Math.PI * 0.12, Math.PI * 0.3); g.stroke();
  g.restore();
  // la tapa de arriba
  g.beginPath(); g.moveTo(CX - 62, GY - GR + 4); g.quadraticCurveTo(CX, GY - GR - 56, CX + 62, GY - GR + 4); g.closePath(); k.metal(g, CX - 62, CX + 62, ["#6d737c", "#e8ecf1", "#9aa2ad", "#f4f6f9", "#5c626a"]);
  // la bola que sale: crece hacia la cámara con su hueso
  if (sale > 0) {
    const u = k.entra(sale), x = mez(tx, tx, u), y = mez(ty + 8, 1170, u), r = mez(36, 120, u);
    k.brillo(g, x, y, r * 4.2, "255,230,150", 0.7 * su(tr(sale, 0.4, 1)));
    dibujaBola(g, x, y, r, "#ffd23f");
    if (sale > 0.45) { g.save(); g.globalAlpha = su(tr(sale, 0.45, 0.8)); hueso(g, x, y + 2, r / 62, -0.5); g.restore(); }
  }
}
