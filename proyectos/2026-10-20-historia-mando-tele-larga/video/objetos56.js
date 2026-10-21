// El salón de 1956: el sillón, el hombre con su mando de ultrasonidos (por dentro, con sus varillas de aluminio y sus
// martillitos), el perro, y las ondas de sonido que salen del mando.
import * as k from "#kit";
import { tejido, madera } from "./mundo.js";

const { azar, redondo, suave: su, tramo: tr, mez, entra } = k;

// ---------------------------------------------------------------- el salón
export function salon56(g, t) {
  const pg = g.createLinearGradient(0, -1000, 0, 700); pg.addColorStop(0, "#2a1830"); pg.addColorStop(1, "#4e2c3c");
  g.fillStyle = pg; g.fillRect(-1700, -1500, 3400, 2200);
  g.save(); g.globalAlpha = 0.1;
  for (let x = -1700; x < 1700; x += 110) { g.fillStyle = "#ffd9a0"; g.fillRect(x, -1500, 46, 2200); }
  g.restore();
  // la luz de una lámpara de pie, a la derecha
  k.brillo(g, 520, -520, 1500, "255,190,120", 0.42);
  madera(g, -1700, 560, 3400, 90, 0, ["#d6c398", "#b09a68", "#6a5832"]);
  g.fillStyle = "#2a160a"; g.fillRect(-1700, 648, 3400, 1500);
  madera(g, -1700, 648, 3400, 1500, 0, ["#6a3e1c", "#4a2810", "#24120a"]);
  for (let y = 680; y < 1800; y += 64) { g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(-1700, y, 3400, 3); }
  // la alfombra
  g.save(); g.beginPath(); g.ellipse(80, 760, 640, 190, 0, 0, 6.2832);
  const rg = g.createRadialGradient(80, 760, 40, 80, 760, 640); rg.addColorStop(0, "#a8322a"); rg.addColorStop(1, "#5a1612"); g.fillStyle = rg; g.fill(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(tejido, -600, 560, 1400, 400);
  g.restore();
  g.strokeStyle = "rgba(255,220,160,0.5)"; g.lineWidth = 8; g.beginPath(); g.ellipse(80, 760, 600, 168, 0, 0, 6.2832); g.stroke();
}

// ---------------------------------------------------------------- el sillón y el hombre
const VERDE = ["#4a9a72", "#2f6b4f", "#16382a"];
const verde = (g, x, y, w, h, r, hor = true) => {
  redondo(g, x, y, w, h, r);
  const gr = hor ? g.createLinearGradient(x, y, x + w, y) : g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, VERDE[0]); gr.addColorStop(0.45, VERDE[1]); gr.addColorStop(1, VERDE[2]); g.fillStyle = gr; g.fill();
  g.save(); redondo(g, x, y, w, h, r); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(tejido, x, y, w, h); g.restore();
  redondo(g, x + 2, y + 2, w - 4, h - 4, r); g.strokeStyle = "rgba(200,255,225,0.22)"; g.lineWidth = 3; g.stroke();
};
const PIEL = ["#f2c39a", "#d99a70", "#a8664a"];
function brazo(g, pts, w, col) {
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = w + 6; g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke();
  g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke();
  g.restore();
}
export const MANO = [-176, 26]; // dónde sostiene el mando
export function sillonYHombre(g, t) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 50; g.shadowOffsetY = 30;
  verde(g, -262, -450, 524, 600, 100, true); // el respaldo
  g.shadowColor = "rgba(0,0,0,0)";
  // los botones del capitoné
  g.fillStyle = "rgba(0,0,0,0.35)"; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { g.beginPath(); g.arc(-180 + c * 120, -330 + r * 90 + (c % 2) * 45, 8, 0, 6.2832); g.fill(); }
  // el hombre: el torso con su jersey de rombos
  const jg = g.createLinearGradient(-130, 0, 130, 0); jg.addColorStop(0, "#f2c04a"); jg.addColorStop(0.5, "#d9a232"); jg.addColorStop(1, "#8a6212");
  redondo(g, -138, -92, 276, 270, 80); g.fillStyle = jg; g.fill();
  g.save(); redondo(g, -138, -92, 276, 270, 80); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(tejido, -138, -92, 276, 270); g.restore();
  g.fillStyle = "#f4ead0"; g.beginPath(); g.moveTo(-44, -92); g.lineTo(0, -34); g.lineTo(44, -92); g.closePath(); g.fill();
  // el cuello y la cabeza
  g.fillStyle = PIEL[1]; redondo(g, -30, -142, 60, 66, 20); g.fill();
  const cabeza = g.createRadialGradient(-28, -230, 10, 0, -200, 110); cabeza.addColorStop(0, PIEL[0]); cabeza.addColorStop(0.7, PIEL[1]); cabeza.addColorStop(1, PIEL[2]);
  // las orejas (grandes, a los lados)
  for (const sx of [-1, 1]) {
    g.save(); g.translate(sx * 80, -192); g.fillStyle = cabeza;
    g.beginPath(); g.ellipse(0, 0, 21, 33, sx * 0.15, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(120,60,40,0.7)"; g.lineWidth = 4; g.beginPath(); g.ellipse(sx * 2, 2, 10, 20, sx * 0.15, -1.2, 2.6); g.stroke();
    g.restore();
  }
  g.beginPath(); g.ellipse(0, -198, 78, 92, 0, 0, 6.2832); g.fillStyle = cabeza; g.fill();
  // el pelo
  g.fillStyle = "#3a2414"; g.beginPath(); g.moveTo(-82, -205); g.quadraticCurveTo(-96, -300, 0, -296); g.quadraticCurveTo(96, -300, 82, -205); g.quadraticCurveTo(70, -250, 0, -246); g.quadraticCurveTo(-70, -250, -82, -205); g.closePath(); g.fill();
  // las gafas, los ojos que miran hacia la tele (a la izquierda) y la cara
  g.strokeStyle = "#1a1a1e"; g.lineWidth = 6;
  for (const sx of [-1, 1]) { g.fillStyle = "rgba(255,255,255,0.88)"; g.beginPath(); g.ellipse(sx * 34, -208, 25, 22, 0, 0, 6.2832); g.fill(); g.stroke(); g.fillStyle = "#3a2410"; g.beginPath(); g.arc(sx * 34 - 9, -206, 9, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(sx * 34 - 12, -210, 3, 0, 6.2832); g.fill(); }
  g.beginPath(); g.moveTo(-9, -210); g.lineTo(9, -210); g.stroke();
  g.strokeStyle = "#3a2414"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(-60, -240); g.lineTo(-14, -238); g.moveTo(14, -238); g.lineTo(60, -240); g.stroke();
  g.strokeStyle = "rgba(140,70,40,0.7)"; g.lineWidth = 5; g.beginPath(); g.moveTo(-4, -200); g.quadraticCurveTo(-14, -168, 4, -164); g.stroke();
  g.strokeStyle = "#8a3a2a"; g.lineWidth = 6; g.beginPath(); g.moveTo(-22, -140); g.quadraticCurveTo(0, -128, 22, -140); g.stroke();
  // la luz de la tele (que está a la izquierda) en un lado de la cara
  g.save(); g.globalCompositeOperation = "lighter"; const tg = g.createLinearGradient(-90, 0, 40, 0); tg.addColorStop(0, "rgba(130,190,255,0.32)"); tg.addColorStop(1, "rgba(130,190,255,0)"); g.fillStyle = tg; g.beginPath(); g.ellipse(0, -198, 78, 92, 0, 0, 6.2832); g.fill(); g.restore();
  // el brazo derecho (a la derecha de la imagen), sobre el apoyabrazos
  brazo(g, [[116, -40], [170, 70], [150, 140]], 58, "#d9a232");
  g.fillStyle = PIEL[1]; g.beginPath(); g.arc(146, 150, 30, 0, 6.2832); g.fill();
  g.restore();
}
// Lo de delante del hombre: el asiento, los brazos del sillón, las piernas.
export function sillonDelante(g, t) {
  g.save();
  // las piernas del pantalón, bajando del asiento
  for (const sx of [-1, 1]) {
    redondo(g, sx * 80 - 56, 120, 112, 250, 50); const pg = g.createLinearGradient(sx * 80 - 56, 0, sx * 80 + 56, 0); pg.addColorStop(0, "#5a6a8a"); pg.addColorStop(0.5, "#3a4666"); pg.addColorStop(1, "#1e2640"); g.fillStyle = pg; g.fill();
    redondo(g, sx * 80 - 62, 350, 124, 70, 30); g.fillStyle = "#1a0e08"; g.fill();
    g.fillStyle = "rgba(255,255,255,0.18)"; redondo(g, sx * 80 - 40, 360, 50, 10, 5); g.fill();
  }
  verde(g, -262, 150, 524, 150, 50, false); // el asiento
  verde(g, -330, -20, 120, 330, 56, true); verde(g, 210, -20, 120, 330, 56, true); // los brazos
  for (const sx of [-1, 1]) { madera(g, sx * 270 - 20, 300, 40, 90, 8, ["#8a5a2a", "#5a3416", "#2a1608"], true); }
  g.restore();
}

// ---------------------------------------------------------------- el perro
// En (0,0), tumbado y mirando a la izquierda. orejas: 0 caídas, 1 levantadas.
export function perro(g, t, orejas = 0, mov = 1) {
  g.save();
  const C = ["#f0bf78", "#c98a45", "#7a4a1e"];
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 20;
  // el cuerpo
  g.beginPath(); g.ellipse(0, 0, 170, 78, 0, 0, 6.2832); const bg = g.createLinearGradient(0, -78, 0, 78); bg.addColorStop(0, C[0]); bg.addColorStop(0.6, C[1]); bg.addColorStop(1, C[2]); g.fillStyle = bg; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  // el muslo y la cola
  g.beginPath(); g.ellipse(100, 14, 74, 66, 0.2, 0, 6.2832); g.fillStyle = C[1]; g.fill(); g.strokeStyle = "rgba(90,50,20,0.5)"; g.lineWidth = 4; g.stroke();
  g.save(); g.lineCap = "round"; g.strokeStyle = C[1]; g.lineWidth = 34; const wag = Math.sin(t * 9) * 14 * orejas * mov; g.beginPath(); g.moveTo(160, 20); g.quadraticCurveTo(230, 30 + wag, 250, -26 + wag * 1.4); g.stroke(); g.restore();
  // las patas de delante, estiradas
  for (const dy of [34, 6]) {
    redondo(g, -250, dy + 26, 190, 44, 22); const lg = g.createLinearGradient(0, dy + 26, 0, dy + 70); lg.addColorStop(0, dy > 20 ? C[1] : C[0]); lg.addColorStop(1, C[2]); g.fillStyle = lg; g.fill();
    g.beginPath(); g.ellipse(-250, dy + 50, 30, 24, 0, 0, 6.2832); g.fillStyle = "#f6dcb0"; g.fill();
    g.strokeStyle = "rgba(120,70,30,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-262, dy + 36); g.lineTo(-262, dy + 62); g.moveTo(-248, dy + 33); g.lineTo(-248, dy + 66); g.stroke();
  }
  // la cabeza, que se alza un poco al oír
  g.save(); g.translate(0, -20 * orejas);
  g.beginPath(); g.ellipse(-168, -22, 74, 66, 0, 0, 6.2832); const hg = g.createRadialGradient(-190, -50, 10, -168, -22, 80); hg.addColorStop(0, C[0]); hg.addColorStop(1, C[1]); g.fillStyle = hg; g.fill();
  g.beginPath(); g.ellipse(-232, 8, 52, 36, 0.1, 0, 6.2832); g.fillStyle = "#f6dcb0"; g.fill();
  g.fillStyle = "#1a0e0a"; g.beginPath(); g.ellipse(-276, 0, 17, 13, 0, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(-281, -4, 4, 0, 6.2832); g.fill();
  // el ojo, más abierto al oír
  const ro = mez(8, 13, orejas);
  g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-198, -40, ro + 5, ro + 3, 0, 0, 6.2832); g.fill(); g.fillStyle = "#2a1408"; g.beginPath(); g.arc(-202, -40, ro - 1, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(-206, -44, 3.5, 0, 6.2832); g.fill();
  g.strokeStyle = "#5a3416"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(-222, -66 - 8 * orejas); g.lineTo(-180, -62 - 8 * orejas); g.stroke();
  // las orejas: de caídas hacia atrás a puntiagudas hacia arriba
  const ang = mez(1.9, -0.18, su(orejas));
  for (const [ox, oy, mir] of [[-150, -70, 1], [-118, -62, 0.82]]) {
    g.save(); g.translate(ox, oy); g.rotate(ang);
    g.beginPath(); g.moveTo(-26 * mir, 0); g.quadraticCurveTo(-30 * mir, -80, 4, -120 * mir); g.quadraticCurveTo(34 * mir, -70, 32 * mir, 0); g.closePath();
    const eg = g.createLinearGradient(-30, 0, 30, 0); eg.addColorStop(0, mir === 1 ? "#8a5222" : "#6a3c16"); eg.addColorStop(1, mir === 1 ? "#c98a45" : "#9a6428"); g.fillStyle = eg; g.fill();
    g.beginPath(); g.moveTo(-12 * mir, -6); g.quadraticCurveTo(-14 * mir, -60, 6, -92 * mir); g.quadraticCurveTo(20 * mir, -56, 18 * mir, -6); g.closePath(); g.fillStyle = `rgba(255,170,150,${0.75 * orejas})`; g.fill();
    g.restore();
  }
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el mando de 1956 (por dentro)
export const VARILLAS = [
  { x: -90, len: 150, col: "120,230,255" }, { x: -30, len: 185, col: "150,255,180" },
  { x: 30, len: 220, col: "255,200,110" }, { x: 90, len: 255, col: "255,130,200" },
];
export const topeVarilla = (i) => [VARILLAS[i].x, 30 - VARILLAS[i].len];
// cuánto ha girado el martillo i: de reposo (-1.1) al golpe (0) y rebote
const angMartillo = (t, ts) => (t < ts - 0.2 ? -1.1 : t < ts ? mez(-1.1, 0, entra(tr(t, ts - 0.2, ts))) : mez(0, -0.6, su(tr(t, ts, ts + 0.22))));
// o: corte (0 cerrado, 1 se ve por dentro), golpes (los segundos de cada golpe), pulsa (0 a 1, el botón de arriba)
export function mando56(g, t, o = {}) {
  const { corte = 0, golpes = [], pulsa = 0 } = o;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 28;
  redondo(g, -150, -290, 300, 580, 58); g.fillStyle = "#1c1e22"; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  redondo(g, -150, -290, 300, 580, 58); k.metal(g, -150, 150, ["#2e3238", "#cfd4dc", "#7a808a", "#e8ecf1", "#3a3e46"]);
  g.save(); redondo(g, -150, -290, 300, 580, 58); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.08; g.drawImage(k.red, -150, -290, 300, 580); g.restore();
  redondo(g, -146, -286, 292, 572, 55); g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 3; g.stroke();
  // las ranuras por donde sale el sonido (arriba)
  g.fillStyle = "rgba(10,12,16,0.8)"; for (let i = 0; i < 6; i++) redondo(g, -92, -250 + i * 28, 184, 10, 5), g.fill();
  // el hueco: se abre y deja ver las varillas
  if (corte > 0.01) {
    g.save(); g.globalAlpha *= corte;
    redondo(g, -128, -262, 256, 310, 26); g.fillStyle = "#0c0f14"; g.fill(); g.save(); g.clip();
    const bg = g.createLinearGradient(0, -262, 0, 48); bg.addColorStop(0, "#1a2230"); bg.addColorStop(1, "#080a0e"); g.fillStyle = bg; g.fillRect(-128, -262, 256, 310);
    // la base donde se clavan las varillas
    redondo(g, -118, 28, 236, 18, 8); g.fillStyle = "#58606c"; g.fill();
    VARILLAS.forEach((r, i) => {
      const ts = golpes[i] ?? -99, dt = t - ts, vib = dt > 0 ? 9 * Math.exp(-3.4 * dt) * Math.sin(62 * dt) : 0, top = 30 - r.len;
      // la varilla de aluminio, ligeramente doblada por la vibración
      g.save();
      const rg = g.createLinearGradient(r.x - 12, 0, r.x + 12, 0); rg.addColorStop(0, "#5a626e"); rg.addColorStop(0.3, "#f4f7fb"); rg.addColorStop(0.6, "#b8c0cc"); rg.addColorStop(1, "#4a525e");
      g.fillStyle = rg; g.beginPath(); g.moveTo(r.x - 12, 30); g.quadraticCurveTo(r.x - 12 + vib * 0.3, top + r.len * 0.4, r.x - 12 + vib, top); g.lineTo(r.x + 12 + vib, top); g.quadraticCurveTo(r.x + 12 + vib * 0.3, top + r.len * 0.4, r.x + 12, 30); g.closePath(); g.fill();
      g.restore();
      // su brillo de color cuando suena
      if (dt > 0) k.brillo(g, r.x + vib, top, 150, r.col, Math.exp(-2.6 * dt));
      // el martillito y su brazo
      const a = angMartillo(t, ts), px = r.x - 66, py = top - 4;
      g.save(); g.translate(px, py); g.rotate(a);
      g.strokeStyle = "#8a909a"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(52, 0); g.stroke();
      const hg = g.createRadialGradient(54, -5, 2, 56, 0, 14); hg.addColorStop(0, "#fff"); hg.addColorStop(1, "#5a606a"); g.fillStyle = hg; g.beginPath(); g.arc(56, 0, 13, 0, 6.2832); g.fill();
      g.fillStyle = "#c9a45a"; g.beginPath(); g.arc(0, 0, 7, 0, 6.2832); g.fill();
      g.restore();
      // el muelle, abajo, en zigzag
      g.strokeStyle = "rgba(220,190,120,0.8)"; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py + 8); for (let q = 1; q <= 6; q++) g.lineTo(px + (q % 2 ? -9 : 9), py + 8 + q * 7); g.stroke();
    });
    g.restore();
    redondo(g, -128, -262, 256, 310, 26); g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 4; g.stroke();
    g.restore();
  }
  // los cuatro botones
  const iconos = ["on", "vol", "sube", "baja"];
  for (let i = 0; i < 4; i++) {
    const y = 78 + i * 52, p = i === 0 ? pulsa : 0;
    redondo(g, -88, y + 5 * p, 176, 40, 14); const bg2 = g.createLinearGradient(0, y, 0, y + 40); bg2.addColorStop(0, "#fff7dc"); bg2.addColorStop(1, "#cdbb86"); g.fillStyle = bg2; g.fill();
    g.strokeStyle = "rgba(60,50,20,0.55)"; g.lineWidth = 3; g.stroke();
    g.save(); g.translate(0, y + 20 + 5 * p); g.strokeStyle = "#2a2412"; g.fillStyle = "#2a2412"; g.lineWidth = 5; g.lineCap = "round";
    if (iconos[i] === "on") { g.beginPath(); g.arc(0, 2, 11, -1.1, 4.25); g.stroke(); g.beginPath(); g.moveTo(0, -12); g.lineTo(0, 0); g.stroke(); }
    else if (iconos[i] === "vol") { g.beginPath(); g.moveTo(-14, -5); g.lineTo(-6, -5); g.lineTo(4, -13); g.lineTo(4, 13); g.lineTo(-6, 5); g.lineTo(-14, 5); g.closePath(); g.fill(); g.beginPath(); g.arc(8, 0, 10, -0.9, 0.9); g.stroke(); }
    else { const s = iconos[i] === "sube" ? -1 : 1; g.beginPath(); g.moveTo(-14, -6 * s); g.lineTo(0, 6 * s); g.lineTo(14, -6 * s); g.stroke(); }
    g.restore();
  }
  if (pulsa > 0.05) k.brillo(g, 0, 98, 330, "255,235,170", 0.7 * pulsa);
  g.restore();
}

// ---------------------------------------------------------------- las ondas de sonido
// Cada onda: { t: cuándo nace, x, y: dónde, col: "r,g,b" }. Un anillo que se abre y se apaga.
export const VEL_SONIDO = 720;
export function ondas(g, t, lista) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const o of lista) {
    const d = t - o.t; if (d < 0 || d > 3.2) continue;
    const r = d * VEL_SONIDO + 20, al = Math.exp(-d * 0.75) * Math.min(1, d * 12) * (o.al ?? 1) * (o.fin === undefined ? 1 : 1 - su(tr(t, o.fin - 0.6, o.fin)));
    g.strokeStyle = `rgba(${o.col},${0.9 * al})`; g.lineWidth = 11; g.beginPath(); g.arc(o.x, o.y, r, 0, 6.2832); g.stroke();
    g.strokeStyle = `rgba(${o.col},${0.28 * al})`; g.lineWidth = 34; g.beginPath(); g.arc(o.x, o.y, r, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// El brazo izquierdo del hombre (a la izquierda de la imagen) y sus dedos, para que el mando esté en su mano.
export function brazoIzq(g) {
  brazo(g, [[-116, -40], [-206, 74], [MANO[0] - 4, MANO[1] + 40]], 58, "#d9a232");
}
export function dedos(g) {
  g.save();
  g.fillStyle = PIEL[1]; g.beginPath(); g.ellipse(MANO[0] + 6, MANO[1] + 52, 40, 30, -0.3, 0, 6.2832); g.fill();
  g.fillStyle = PIEL[0]; g.beginPath(); g.ellipse(MANO[0] + 34, MANO[1] + 30, 15, 26, 0.4, 0, 6.2832); g.fill();
  g.restore();
}
