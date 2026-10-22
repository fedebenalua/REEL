// El salón, visto desde el suelo, a la altura de tu gato: tú de pie, enorme, con tu jersey rojo y tus vaqueros,
// agachándote con la mano tendida; detrás, la ventana con el cielo, la lámpara encendida y una planta grande.
// salon(c, t, ...) lo dibuja en pantalla (1080 × 1920); vistaGato(g, ...) lo pone como lo vería tu gato: borroso, con
// el rojo y el verde apagados, o de noche.
import * as k from "#kit";

const { azar, lienzo, mez, tramo, suave } = k;

// Los colores que cambian: el jersey, de rojo a un marrón verdoso; la planta, de verde a lo mismo.
const ROJO = [205, 38, 42], VERDE = [52, 150, 60], SUCIO = [128, 116, 70];
const mezA = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
const rgb = (c, f = 1) => `rgb(${Math.min(255, c[0] * f) | 0},${Math.min(255, c[1] * f) | 0},${Math.min(255, c[2] * f) | 0})`;

// ---------------------------------------------------------------- lo de detrás (no cambia: se hace una vez)
const FONDO = (() => {
  const l = lienzo(1080, 1920), c = l.getContext("2d");
  // la pared, cálida, con la luz de la lámpara
  const pg = c.createLinearGradient(0, 0, 0, 1500); pg.addColorStop(0, "#c9a07a"); pg.addColorStop(1, "#8a6248");
  c.fillStyle = pg; c.fillRect(0, 0, 1080, 1500);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.12; c.drawImage(k.manchas, 0, 0, 1080, 1500); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // el rodapié
  c.fillStyle = "#e9dccb"; c.fillRect(0, 1440, 1080, 40); c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(0, 1478, 1080, 6);
  // el suelo de madera, en perspectiva desde abajo
  const sg = c.createLinearGradient(0, 1480, 0, 1920); sg.addColorStop(0, "#6e4024"); sg.addColorStop(1, "#a96a3a");
  c.fillStyle = sg; c.fillRect(0, 1480, 1080, 440);
  c.strokeStyle = "rgba(40,20,8,0.55)"; c.lineWidth = 3;
  for (let i = -14; i <= 14; i++) { c.beginPath(); c.moveTo(540 + i * 40, 1480); c.lineTo(540 + i * 230, 1920); c.stroke(); }
  for (let y = 1490, d = 8; y < 1920; y += d, d *= 1.35) { c.globalAlpha = 0.35; c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
  c.globalAlpha = 1;
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.ruido(512, 91, 2, 4, "lineas"), 0, 1480, 1080, 440); c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  return l;
})();
// La ventana, a la izquierda: ya es de noche; el cielo azul oscuro, la luna y unas estrellas, y el marco blanco.
function ventana(c) {
  const x = 40, y = 300, w = 330, h = 760;
  const cg = c.createLinearGradient(0, y, 0, y + h); cg.addColorStop(0, "#0d1a4a"); cg.addColorStop(0.6, "#2a4a9a"); cg.addColorStop(1, "#5a7cc8");
  c.fillStyle = cg; c.fillRect(x, y, w, h);
  const az = azar(17);
  for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(255,255,255,${0.4 + az() * 0.6})`; c.beginPath(); c.arc(x + az() * w, y + az() * h * 0.6, 1.5 + az() * 2, 0, 6.2832); c.fill(); }
  // la luna
  k.brillo(c, x + 235, y + 170, 260, "200,220,255", 0.8);
  c.fillStyle = "#f4f2e6"; c.beginPath(); c.arc(x + 235, y + 170, 44, 0, 6.2832); c.fill();
  c.fillStyle = "rgba(180,180,170,0.4)"; c.beginPath(); c.arc(x + 222, y + 160, 9, 0, 6.2832); c.arc(x + 250, y + 185, 6, 0, 6.2832); c.fill();
  // los tejados de enfrente
  c.fillStyle = "#0a1030"; c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + h - 140); c.lineTo(x + 90, y + h - 200); c.lineTo(x + 180, y + h - 140); c.lineTo(x + 180, y + h - 220); c.lineTo(x + w, y + h - 220); c.lineTo(x + w, y + h); c.closePath(); c.fill();
  c.fillStyle = "#ffd77a"; for (const [wx, wy] of [[x + 70, y + h - 110], [x + 220, y + h - 170], [x + 270, y + h - 120]]) c.fillRect(wx, wy, 24, 30);
  c.strokeStyle = "#f6f1ea"; c.lineWidth = 26; c.strokeRect(x, y, w, h);
  c.lineWidth = 16; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h * 0.45); c.lineTo(x + w, y + h * 0.45); c.stroke();
  // la luz de la luna que entra
  c.save(); c.globalCompositeOperation = "lighter";
  const lg = c.createLinearGradient(x, y, x + 600, y + 1300); lg.addColorStop(0, "rgba(150,180,255,0.14)"); lg.addColorStop(1, "rgba(150,180,255,0)");
  c.fillStyle = lg; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w + 500, 1920); c.lineTo(x + 200, 1920); c.closePath(); c.fill();
  c.restore();
}
// La lámpara de pie, a la derecha, con su pantalla de tela. luz: 0 apagada, 1 encendida.
function lampara(c, luz) {
  const x = 900, y = 420;
  c.strokeStyle = "#2a2420"; c.lineWidth = 12; c.beginPath(); c.moveTo(x, y + 120); c.lineTo(x, 1470); c.stroke();
  c.beginPath(); c.moveTo(x - 140, y + 140); c.lineTo(x - 90, y - 30); c.lineTo(x + 90, y - 30); c.lineTo(x + 140, y + 140); c.closePath();
  const pg = c.createLinearGradient(x - 140, 0, x + 140, 0);
  pg.addColorStop(0, k.mezColor("#8a7a68", "#ffd9a0", luz)); pg.addColorStop(0.5, k.mezColor("#a89880", "#fff0d0", luz)); pg.addColorStop(1, k.mezColor("#6a5a48", "#f0b870", luz));
  c.fillStyle = pg; c.fill();
  if (luz > 0.01) {
    k.brillo(c, x, y + 150, 700, "255,200,120", 0.9 * luz);
    k.brillo(c, x, y + 60, 380, "255,230,180", 0.6 * luz);
  }
}
// La planta: una costilla de Adán en su maceta, con hojas grandes. color: "r,g,b" de las hojas.
const HOJAS = (() => { const az = azar(808), l = []; for (let i = 0; i < 9; i++) l.push({ a: -2.5 + i * 0.32 + (az() - 0.5) * 0.2, L: 260 + az() * 160, r: 95 + az() * 45, f: az() * 6 }); return l; })();
function planta(c, t, verde) {
  const px = 1000, py = 1500;
  c.save(); c.lineCap = "round";
  for (const h of HOJAS) {
    const a = h.a + Math.sin(t * 0.8 + h.f) * 0.02, hx = px + Math.cos(a) * h.L, hy = py - 230 + Math.sin(a) * h.L;
    c.strokeStyle = rgb(verde, 0.6); c.lineWidth = 9;
    c.beginPath(); c.moveTo(px, py - 220); c.quadraticCurveTo(px + Math.cos(a) * h.L * 0.4, py - 260 + Math.sin(a) * h.L * 0.5, hx, hy); c.stroke();
    c.save(); c.translate(hx, hy); c.rotate(a + 1.57);
    c.beginPath(); c.ellipse(0, 0, h.r * 0.95, h.r, 0, 0, 6.2832);
    const hg = c.createLinearGradient(-h.r, -h.r, h.r, h.r); hg.addColorStop(0, rgb(verde, 1.35)); hg.addColorStop(1, rgb(verde, 0.7));
    c.fillStyle = hg; c.fill();
    // los cortes de la hoja y su nervio
    c.strokeStyle = "rgba(20,30,15,0.55)"; c.lineWidth = 7;
    for (let j = -2; j <= 2; j++) { if (!j) continue; c.beginPath(); c.moveTo(Math.sign(j) * h.r * 0.95, j * h.r * 0.28); c.lineTo(Math.sign(j) * h.r * 0.45, j * h.r * 0.2); c.stroke(); }
    c.strokeStyle = rgb(verde, 1.5); c.lineWidth = 4; c.beginPath(); c.moveTo(0, -h.r * 0.9); c.lineTo(0, h.r * 0.9); c.stroke();
    c.restore();
  }
  // la maceta
  c.beginPath(); c.moveTo(px - 130, py - 230); c.lineTo(px + 130, py - 230); c.lineTo(px + 100, py + 40); c.lineTo(px - 100, py + 40); c.closePath();
  const mg = c.createLinearGradient(px - 130, 0, px + 130, 0); mg.addColorStop(0, "#c8643a"); mg.addColorStop(0.4, "#e8885a"); mg.addColorStop(1, "#8a3e20");
  c.fillStyle = mg; c.fill();
  c.restore();
}

// ---------------------------------------------------------------- tú
const PUNTO = k.ruido(256, 313, 40, 2, "lineas"); // el punto del jersey
const DENIM = k.ruido(256, 317, 60, 2, "lineas");
// mano: de 0 (el brazo colgando) a 1 (tendida hacia tu gato). sonrisa: de 0 a 1. jersey: [r,g,b].
function tu(c, t, { mano = 1, jersey = ROJO, saluda = 0 } = {}) {
  const resp = Math.sin(t * 1.6) * 4; // respiras
  c.save(); c.translate(0, resp * 0.5);
  // las piernas (vaqueros): se abren hacia abajo, grandes por la perspectiva
  const pierna = (x0, x1, x2, x3) => {
    c.beginPath(); c.moveTo(x0, 1380); c.lineTo(x1, 1380); c.bezierCurveTo(x1 + 10, 1600, x3, 1750, x3, 1960); c.lineTo(x2, 1960); c.bezierCurveTo(x2, 1750, x0 - 10, 1600, x0, 1380); c.closePath();
    const lg = c.createLinearGradient(x2, 0, x3, 0); lg.addColorStop(0, "#1f3f7a"); lg.addColorStop(0.45, "#3d6cc0"); lg.addColorStop(1, "#16305e");
    c.fillStyle = lg; c.fill();
    c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.45; c.drawImage(DENIM, x2 - 20, 1380, x3 - x2 + 40, 600); c.restore();
  };
  pierna(318, 540, 230, 545); pierna(540, 762, 535, 850);
  c.strokeStyle = "rgba(10,20,50,0.6)"; c.lineWidth = 4; c.beginPath(); c.moveTo(540, 1390); c.lineTo(540, 1960); c.stroke();
  // las costuras amarillas
  c.strokeStyle = "rgba(230,180,90,0.5)"; c.lineWidth = 2; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(330, 1400); c.bezierCurveTo(320, 1600, 260, 1750, 250, 1960); c.stroke(); c.beginPath(); c.moveTo(750, 1400); c.bezierCurveTo(760, 1600, 830, 1750, 830, 1960); c.stroke(); c.setLineDash([]);
  // el jersey: del cuello a la cadera, un poco más ancho abajo
  c.beginPath(); c.moveTo(380, 790); c.bezierCurveTo(300, 800, 290, 900, 285, 1000); c.lineTo(300, 1420); c.quadraticCurveTo(540, 1450, 780, 1420); c.lineTo(795, 1000); c.bezierCurveTo(790, 900, 780, 800, 700, 790); c.closePath();
  const jg = c.createLinearGradient(285, 0, 795, 0); jg.addColorStop(0, rgb(jersey, 0.6)); jg.addColorStop(0.4, rgb(jersey, 1.05)); jg.addColorStop(0.75, rgb(jersey, 0.95)); jg.addColorStop(1, rgb(jersey, 0.5));
  c.fillStyle = jg; c.fill();
  c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.5; c.drawImage(PUNTO, 280, 780, 520, 660);
  // los canalés del bajo
  c.globalAlpha = 0.35; c.strokeStyle = "#000"; c.lineWidth = 3; for (let x = 300; x < 790; x += 14) { c.beginPath(); c.moveTo(x, 1370); c.lineTo(x, 1440); c.stroke(); }
  c.restore();
  // el cuello
  c.beginPath(); c.ellipse(540, 795, 120, 40, 0, 0, 6.2832); c.fillStyle = rgb(jersey, 0.75); c.fill();
  c.beginPath(); c.ellipse(540, 780, 70, 34, 0, 0, 6.2832); const cu = c.createLinearGradient(470, 0, 610, 0); cu.addColorStop(0, "#c88a6a"); cu.addColorStop(1, "#9a6248"); c.fillStyle = cu; c.fill();
  // el brazo izquierdo (a la derecha de la imagen), colgando
  brazo(c, [735, 830], [800, 1100], [810, 1360], jersey, 0, 0.9);
  // el brazo que se tiende hacia tu gato (a la izquierda), con la mano grande, cerca
  const hx = mez(300, 430, mano), hy = mez(1330, 1480, mano) + Math.sin(t * 2.2) * 6 * mano;
  brazo(c, [345, 830], [mez(270, 330, mano), mez(1100, 1150, mano)], [hx, hy], jersey, mano, mez(0.9, 1.6, mano), saluda);
  // la cabeza: mira hacia abajo, a tu gato
  cabeza(c, t);
  c.restore();
}
function brazo(c, a, b, m, jersey, tendida, tamMano, saluda = 0) {
  c.save(); c.lineCap = "round"; c.lineJoin = "round";
  c.strokeStyle = rgb(jersey, 0.62); c.lineWidth = 118; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], m[0], m[1] - 60 * tamMano); c.stroke();
  c.strokeStyle = rgb(jersey, 0.95); c.lineWidth = 80; c.beginPath(); c.moveTo(a[0] - 8, a[1]); c.quadraticCurveTo(b[0] - 8, b[1], m[0] - 6, m[1] - 64 * tamMano); c.stroke();
  // el puño del jersey
  c.strokeStyle = rgb(jersey, 0.55); c.lineWidth = 104 * Math.min(1.25, tamMano * 0.85); c.beginPath(); c.moveTo(m[0], m[1] - 85 * tamMano); c.lineTo(m[0], m[1] - 55 * tamMano); c.stroke();
  c.restore();
  mano(c, m[0], m[1], tamMano, tendida, saluda);
}
// Una mano abierta, con la palma hacia tu gato, de tamaño s (1: unos 110 px de ancho).
function mano(c, x, y, s, tendida, saluda) {
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(Math.sin(saluda * 9) * 40 * Math.min(1, saluda * 3), 0); c.rotate(mez(0.1, -0.15, tendida) + Math.sin(saluda * 9) * 0.35 * Math.min(1, saluda * 3));
  const piel = c.createLinearGradient(-60, -60, 60, 80); piel.addColorStop(0, "#f2c2a0"); piel.addColorStop(1, "#b97c5c");
  c.fillStyle = piel;
  // la palma
  c.beginPath(); c.ellipse(0, 0, 52, 58, 0, 0, 6.2832); c.fill();
  // los dedos, abiertos
  c.lineCap = "round"; c.strokeStyle = piel;
  const dedos = [[-40, 20, -62, 78], [-16, 34, -22, 104], [8, 36, 10, 108], [30, 30, 38, 96], [48, -10, 82, 20]];
  for (const [x0, y0, x1, y1] of dedos) { c.lineWidth = 24; c.beginPath(); c.moveTo(x0 * 0.8, y0 * 0.6); c.lineTo(x1, y1 * mez(0.8, 1, tendida)); c.stroke(); }
  // las uñas y una sombra entre los dedos
  c.fillStyle = "rgba(255,225,210,0.7)";
  for (const [, , x1, y1] of dedos) { c.beginPath(); c.ellipse(x1, y1 * mez(0.8, 1, tendida) - 2, 6, 7, 0, 0, 6.2832); c.fill(); }
  c.fillStyle = "rgba(255,240,225,0.35)"; c.beginPath(); c.ellipse(-12, -10, 26, 30, 0, 0, 6.2832); c.fill();
  c.restore();
}
function cabeza(c, t) {
  const x = 540, y = 640;
  // el pelo de detrás
  c.fillStyle = "#3a2214"; c.beginPath(); c.ellipse(x, y - 20, 132, 140, 0, 0, 6.2832); c.fill();
  // la cara, vista un poco desde abajo: la barbilla delante
  const fg = c.createRadialGradient(x - 30, y - 30, 20, x, y, 140); fg.addColorStop(0, "#f4c8a8"); fg.addColorStop(0.7, "#d9a080"); fg.addColorStop(1, "#a86c50");
  c.fillStyle = fg; c.beginPath(); c.ellipse(x, y + 10, 108, 128, 0, 0, 6.2832); c.fill();
  // las orejas
  c.fillStyle = "#c88a6a"; c.beginPath(); c.ellipse(x - 108, y + 10, 18, 30, 0, 0, 6.2832); c.fill(); c.beginPath(); c.ellipse(x + 108, y + 10, 18, 30, 0, 0, 6.2832); c.fill();
  // el flequillo
  c.fillStyle = "#4a2c1a"; c.beginPath(); c.moveTo(x - 125, y - 20); c.bezierCurveTo(x - 110, y - 160, x + 110, y - 170, x + 128, y - 30); c.bezierCurveTo(x + 60, y - 90, x - 20, y - 60, x - 125, y - 20); c.fill();
  c.fillStyle = "rgba(140,90,60,0.5)"; c.beginPath(); c.ellipse(x - 30, y - 105, 50, 12, -0.2, 0, 6.2832); c.fill();
  // los ojos, mirando abajo, y las cejas
  for (const s of [-1, 1]) {
    c.fillStyle = "#fff"; c.beginPath(); c.ellipse(x + s * 42, y + 22, 18, 11, 0, 0, 6.2832); c.fill();
    c.fillStyle = "#3a2618"; c.beginPath(); c.arc(x + s * 42, y + 26, 9, 0, 6.2832); c.fill();
    c.strokeStyle = "#3a2214"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(x + s * 22, y - 8); c.quadraticCurveTo(x + s * 42, y - 18, x + s * 62, y - 6); c.stroke();
  }
  // la nariz y la sonrisa
  c.strokeStyle = "rgba(140,80,60,0.7)"; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y + 35); c.quadraticCurveTo(x + 10, y + 60, x - 4, y + 66); c.stroke();
  c.strokeStyle = "#8a3a30"; c.lineWidth = 7; c.beginPath(); c.moveTo(x - 38, y + 88); c.quadraticCurveTo(x, y + 116, x + 38, y + 88); c.stroke();
  c.fillStyle = "rgba(230,120,110,0.3)"; for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * 62, y + 66, 20, 0, 6.2832); c.fill(); }
}

// ---------------------------------------------------------------- el salón entero
// En pantalla. rojo / verde: de 0 a 1, cuánto se apagan; luz: la lámpara.
export function salon(c, t, { rojo = 0, verde = 0, luz = 1, mano = 1, saluda = 0 } = {}) {
  c.drawImage(FONDO, 0, 0);
  ventana(c);
  lampara(c, luz);
  planta(c, t, mezA(VERDE, SUCIO, verde));
  // la sombra que haces en el suelo
  c.fillStyle = "rgba(30,15,5,0.35)"; c.beginPath(); c.ellipse(540, 1900, 420, 70, 0, 0, 6.2832); c.fill();
  tu(c, t, { jersey: mezA(ROJO, SUCIO, rojo), mano, saluda });
  // la luz cálida de la lámpara por encima de todo
  c.save(); c.globalCompositeOperation = "soft-light";
  const lg = c.createRadialGradient(900, 560, 50, 900, 560, 1400); lg.addColorStop(0, `rgba(255,200,130,${0.5 * luz})`); lg.addColorStop(1, "rgba(0,0,0,0.15)");
  c.fillStyle = lg; c.fillRect(0, 0, 1080, 1920); c.restore();
}

// ---------------------------------------------------------------- como lo ve tu gato
// Dibuja el salón en un lienzo y lo pone en g con la cámara (zoom Z hacia el punto (cx, cy) de la escena) y con lo
// que le hace su ojo:
//   borroso: de 0 (nítido, como lo ves tú) a 1 (como lo ve él) · rojo, verde: los colores que se apagan ·
//   oscuro: de 0 a 1, la luz apagada (todo negro, como lo verías tú) · noche: de 0 a 1, lo que ve él a oscuras: el
//   salón sale de lo negro, azulado y sin color.
const L = lienzo(1080, 1920);
export function vistaGato(g, t, { caja = null, Z = 1, cx = 540, cy = 960, borroso = 0, rojo = 0, verde = 0, oscuro = 0, noche = 0, luz = 1, mano = 1, saluda = 0 } = {}) {
  const c = L.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.filter = "none";
  c.fillStyle = "#000"; c.fillRect(0, 0, 1080, 1920);
  c.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
  salon(c, t, { rojo, verde, luz, mano, saluda });
  c.setTransform(1, 0, 0, 1, 0, 0);
  const b = borroso * 16 * Z ** 0.5;
  const brillo = mez(1, mez(0.04, 0.8, noche), oscuro), sat = mez(mez(1, 0.85, borroso), 0.12, noche * oscuro);
  g.save();
  g.filter = `blur(${b.toFixed(1)}px) saturate(${sat.toFixed(2)}) brightness(${brillo.toFixed(2)})`;
  const m = b * 2.5; // que el borroso no oscurezca los bordes
  if (caja) g.drawImage(L, caja[0], caja[1], caja[2], caja[3]); else g.drawImage(L, -m, -m * 1.78, 1080 + 2 * m, 1920 + 3.56 * m);
  g.filter = "none";
  // de noche, él lo ve azulado
  if (noche * oscuro > 0.01) {
    g.globalCompositeOperation = "multiply"; g.fillStyle = `rgba(110,170,255,${0.75 * noche * oscuro})`; if (caja) g.fillRect(...caja); else g.fillRect(0, 0, 1080, 1920);
    g.globalCompositeOperation = "source-over";
  }
  g.restore();
}
export { ROJO, VERDE, SUCIO };
