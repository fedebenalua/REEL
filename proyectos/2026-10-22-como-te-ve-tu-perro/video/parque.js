// El parque, visto desde la hierba, a la altura de tu perro: tú de pie, enorme, con tu jersey rojo y tus vaqueros, con la
// mano tendida; en el césped, una pelota roja y una azul; detrás, los árboles y el cielo de la tarde.
// parque(c, t, ...) lo dibuja en pantalla (1080 × 1920); vistaPerro(g, ...) lo pone como lo vería tu perro: borroso,
// con el rojo y el verde iguales, o de noche.
import * as k from "#kit";

const { azar, lienzo, mez } = k;

// Los colores que cambian: el rojo del jersey y de la pelota, y el verde del césped y los árboles, a un ocre parecido.
export const ROJO = [208, 36, 40], OCRE = [150, 132, 66];
const mezA = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
const rgb = (c, f = 1) => `rgb(${Math.min(255, c[0] * f) | 0},${Math.min(255, c[1] * f) | 0},${Math.min(255, c[2] * f) | 0})`;
const HORIZONTE = 1240;

// ---------------------------------------------------------------- el cielo, los árboles y el césped
// Cada uno, una vez en verde y otra en ocre (como lo ve tu perro): se mezclan.
function pintaCesped(c, verde) {
  const [r, g2, b] = verde;
  const sg = c.createLinearGradient(0, HORIZONTE, 0, 1920);
  sg.addColorStop(0, rgb([r, g2, b], 0.75)); sg.addColorStop(1, rgb([r, g2, b], 1.1));
  c.fillStyle = sg; c.fillRect(0, HORIZONTE, 1080, 1920 - HORIZONTE);
  // las briznas: más grandes cuanto más cerca
  const az = azar(515); c.lineCap = "round";
  for (let i = 0; i < 9000; i++) {
    const y = HORIZONTE + Math.pow(az(), 0.7) * (1960 - HORIZONTE), p = (y - HORIZONTE) / (1920 - HORIZONTE);
    const x = az() * 1080, L = 6 + p * 70 * (0.5 + az()), f = 0.6 + az() * 0.7;
    c.strokeStyle = `rgba(${Math.min(255, r * f) | 0},${Math.min(255, g2 * f) | 0},${Math.min(255, b * f) | 0},${0.6 + az() * 0.4})`;
    c.lineWidth = 1 + p * 5 * az();
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + (az() - 0.5) * L * 0.4, y - L * 0.6, x + (az() - 0.5) * L * 0.7, y - L); c.stroke();
  }
}
function pintaArboles(c, verde) {
  const az = azar(733);
  for (let i = 0; i < 9; i++) {
    const x = -60 + i * 150 + (az() - 0.5) * 60, y = HORIZONTE - 40 - az() * 90, r = 110 + az() * 80;
    c.fillStyle = "#4a3422"; c.fillRect(x - 12, y, 24, HORIZONTE - y + 10);
    for (let j = 0; j < 7; j++) {
      const bx = x + (az() - 0.5) * r * 1.2, by = y - r * 0.6 + (az() - 0.5) * r * 0.9, br = r * (0.45 + az() * 0.35);
      const gr = c.createRadialGradient(bx - br * 0.3, by - br * 0.4, br * 0.1, bx, by, br);
      gr.addColorStop(0, rgb(verde, 1.35)); gr.addColorStop(1, rgb(verde, 0.6));
      c.fillStyle = gr; c.beginPath(); c.arc(bx, by, br, 0, 6.2832); c.fill();
    }
  }
}
const capa = (fn) => { const l = lienzo(1080, 1920), c = l.getContext("2d"); fn(c); return l; };
const CESPED = [capa((c) => pintaCesped(c, [70, 150, 52])), capa((c) => pintaCesped(c, OCRE))];
const ARBOLES = [capa((c) => pintaArboles(c, [52, 120, 48])), capa((c) => pintaArboles(c, mezA(OCRE, [0, 0, 0], 0.2)))];
function cielo(c, noche) {
  const cg = c.createLinearGradient(0, 0, 0, HORIZONTE);
  cg.addColorStop(0, k.mezColor("#4f8fd8", "#0a1238", noche)); cg.addColorStop(0.6, k.mezColor("#9cc6ec", "#1a2a60", noche)); cg.addColorStop(1, k.mezColor("#f6dca0", "#30407a", noche));
  c.fillStyle = cg; c.fillRect(0, 0, 1080, HORIZONTE);
  // el sol de la tarde, bajo, a la derecha; de noche, la luna
  if (noche < 1) k.brillo(c, 900, 1000, 900, "255,220,150", 0.7 * (1 - noche));
  if (noche > 0) {
    const az = azar(19);
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${(0.4 + az() * 0.6) * noche})`; c.beginPath(); c.arc(az() * 1080, az() * 900, 1.5 + az() * 2.5, 0, 6.2832); c.fill(); }
    k.brillo(c, 210, 300, 320, "200,220,255", 0.8 * noche);
    c.fillStyle = `rgba(244,242,230,${noche})`; c.beginPath(); c.arc(210, 300, 52, 0, 6.2832); c.fill();
  }
}

// ---------------------------------------------------------------- tú
const PUNTO = k.ruido(256, 313, 40, 2, "lineas");
const DENIM = k.ruido(256, 317, 60, 2, "lineas");
export function tu(c, t, { mano = 1, jersey = ROJO, saluda = 0 } = {}) {
  const resp = Math.sin(t * 1.6) * 4;
  c.save(); c.translate(0, resp * 0.5);
  const pierna = (x0, x1, x2, x3) => {
    c.beginPath(); c.moveTo(x0, 1380); c.lineTo(x1, 1380); c.bezierCurveTo(x1 + 10, 1600, x3, 1750, x3, 1960); c.lineTo(x2, 1960); c.bezierCurveTo(x2, 1750, x0 - 10, 1600, x0, 1380); c.closePath();
    const lg = c.createLinearGradient(x2, 0, x3, 0); lg.addColorStop(0, "#1f3f7a"); lg.addColorStop(0.45, "#3d6cc0"); lg.addColorStop(1, "#16305e");
    c.fillStyle = lg; c.fill();
    c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.45; c.drawImage(DENIM, x2 - 20, 1380, x3 - x2 + 40, 600); c.restore();
  };
  pierna(318, 540, 230, 545); pierna(540, 762, 535, 850);
  c.strokeStyle = "rgba(10,20,50,0.6)"; c.lineWidth = 4; c.beginPath(); c.moveTo(540, 1390); c.lineTo(540, 1960); c.stroke();
  c.strokeStyle = "rgba(230,180,90,0.5)"; c.lineWidth = 2; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(330, 1400); c.bezierCurveTo(320, 1600, 260, 1750, 250, 1960); c.stroke(); c.beginPath(); c.moveTo(750, 1400); c.bezierCurveTo(760, 1600, 830, 1750, 830, 1960); c.stroke(); c.setLineDash([]);
  c.beginPath(); c.moveTo(380, 790); c.bezierCurveTo(300, 800, 290, 900, 285, 1000); c.lineTo(300, 1420); c.quadraticCurveTo(540, 1450, 780, 1420); c.lineTo(795, 1000); c.bezierCurveTo(790, 900, 780, 800, 700, 790); c.closePath();
  const jg = c.createLinearGradient(285, 0, 795, 0); jg.addColorStop(0, rgb(jersey, 0.6)); jg.addColorStop(0.4, rgb(jersey, 1.05)); jg.addColorStop(0.75, rgb(jersey, 0.95)); jg.addColorStop(1, rgb(jersey, 0.5));
  c.fillStyle = jg; c.fill();
  c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.5; c.drawImage(PUNTO, 280, 780, 520, 660);
  c.globalAlpha = 0.35; c.strokeStyle = "#000"; c.lineWidth = 3; for (let x = 300; x < 790; x += 14) { c.beginPath(); c.moveTo(x, 1370); c.lineTo(x, 1440); c.stroke(); }
  c.restore();
  c.beginPath(); c.ellipse(540, 795, 120, 40, 0, 0, 6.2832); c.fillStyle = rgb(jersey, 0.75); c.fill();
  c.beginPath(); c.ellipse(540, 780, 70, 34, 0, 0, 6.2832); const cu = c.createLinearGradient(470, 0, 610, 0); cu.addColorStop(0, "#c88a6a"); cu.addColorStop(1, "#9a6248"); c.fillStyle = cu; c.fill();
  brazo(c, [735, 830], [800, 1100], [810, 1360], jersey, 0, 0.9);
  const hx = mez(300, 430, mano), hy = mez(1330, 1480, mano) + Math.sin(t * 2.2) * 6 * mano;
  brazo(c, [345, 830], [mez(270, 330, mano), mez(1100, 1150, mano)], [hx, hy], jersey, mano, mez(0.9, 1.6, mano), saluda);
  cabeza(c);
  c.restore();
}
function brazo(c, a, b, m, jersey, tendida, tamMano, saluda = 0) {
  c.save(); c.lineCap = "round"; c.lineJoin = "round";
  c.strokeStyle = rgb(jersey, 0.62); c.lineWidth = 118; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], m[0], m[1] - 60 * tamMano); c.stroke();
  c.strokeStyle = rgb(jersey, 0.95); c.lineWidth = 80; c.beginPath(); c.moveTo(a[0] - 8, a[1]); c.quadraticCurveTo(b[0] - 8, b[1], m[0] - 6, m[1] - 64 * tamMano); c.stroke();
  c.strokeStyle = rgb(jersey, 0.55); c.lineWidth = 104 * Math.min(1.25, tamMano * 0.85); c.beginPath(); c.moveTo(m[0], m[1] - 85 * tamMano); c.lineTo(m[0], m[1] - 55 * tamMano); c.stroke();
  c.restore();
  mano(c, m[0], m[1], tamMano, tendida, saluda);
}
export function mano(c, x, y, s, tendida, saluda = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(Math.sin(saluda * 9) * 40 * Math.min(1, saluda * 3), 0); c.rotate(mez(0.1, -0.15, tendida) + Math.sin(saluda * 9) * 0.35 * Math.min(1, saluda * 3));
  const piel = c.createLinearGradient(-60, -60, 60, 80); piel.addColorStop(0, "#f2c2a0"); piel.addColorStop(1, "#b97c5c");
  c.fillStyle = piel;
  c.beginPath(); c.ellipse(0, 0, 52, 58, 0, 0, 6.2832); c.fill();
  c.lineCap = "round"; c.strokeStyle = piel;
  const dedos = [[-40, 20, -62, 78], [-16, 34, -22, 104], [8, 36, 10, 108], [30, 30, 38, 96], [48, -10, 82, 20]];
  for (const [x0, y0, x1, y1] of dedos) { c.lineWidth = 24; c.beginPath(); c.moveTo(x0 * 0.8, y0 * 0.6); c.lineTo(x1, y1 * mez(0.8, 1, tendida)); c.stroke(); }
  c.fillStyle = "rgba(255,225,210,0.7)";
  for (const [, , x1, y1] of dedos) { c.beginPath(); c.ellipse(x1, y1 * mez(0.8, 1, tendida) - 2, 6, 7, 0, 0, 6.2832); c.fill(); }
  c.fillStyle = "rgba(255,240,225,0.35)"; c.beginPath(); c.ellipse(-12, -10, 26, 30, 0, 0, 6.2832); c.fill();
  c.restore();
}
function cabeza(c) {
  const x = 540, y = 640;
  c.fillStyle = "#3a2214"; c.beginPath(); c.ellipse(x, y - 20, 132, 140, 0, 0, 6.2832); c.fill();
  const fg = c.createRadialGradient(x - 30, y - 30, 20, x, y, 140); fg.addColorStop(0, "#f4c8a8"); fg.addColorStop(0.7, "#d9a080"); fg.addColorStop(1, "#a86c50");
  c.fillStyle = fg; c.beginPath(); c.ellipse(x, y + 10, 108, 128, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#c88a6a"; c.beginPath(); c.ellipse(x - 108, y + 10, 18, 30, 0, 0, 6.2832); c.fill(); c.beginPath(); c.ellipse(x + 108, y + 10, 18, 30, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#4a2c1a"; c.beginPath(); c.moveTo(x - 125, y - 20); c.bezierCurveTo(x - 110, y - 160, x + 110, y - 170, x + 128, y - 30); c.bezierCurveTo(x + 60, y - 90, x - 20, y - 60, x - 125, y - 20); c.fill();
  c.fillStyle = "rgba(140,90,60,0.5)"; c.beginPath(); c.ellipse(x - 30, y - 105, 50, 12, -0.2, 0, 6.2832); c.fill();
  for (const s of [-1, 1]) {
    c.fillStyle = "#fff"; c.beginPath(); c.ellipse(x + s * 42, y + 22, 18, 11, 0, 0, 6.2832); c.fill();
    c.fillStyle = "#3a2618"; c.beginPath(); c.arc(x + s * 42, y + 26, 9, 0, 6.2832); c.fill();
    c.strokeStyle = "#3a2214"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(x + s * 22, y - 8); c.quadraticCurveTo(x + s * 42, y - 18, x + s * 62, y - 6); c.stroke();
  }
  c.strokeStyle = "rgba(140,80,60,0.7)"; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y + 35); c.quadraticCurveTo(x + 10, y + 60, x - 4, y + 66); c.stroke();
  c.strokeStyle = "#8a3a30"; c.lineWidth = 7; c.beginPath(); c.moveTo(x - 38, y + 88); c.quadraticCurveTo(x, y + 116, x + 38, y + 88); c.stroke();
  c.fillStyle = "rgba(230,120,110,0.3)"; for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * 62, y + 66, 20, 0, 6.2832); c.fill(); }
}

// ---------------------------------------------------------------- las pelotas
// Una pelota de goma en (x, y) de radio r, con su brillo y su sombra en la hierba; color: [r,g,b].
export function pelota(c, x, y, r, color, luz = 1, plana = 0) {
  c.fillStyle = `rgba(10,25,5,${0.35 * (1 - 0.6 * plana)})`; c.beginPath(); c.ellipse(x + r * 0.15, y + r * 0.9, r * 1.05, r * 0.25, 0, 0, 6.2832); c.fill();
  const pg = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  pg.addColorStop(0, rgb(color, mez(1.35, 1.08, plana))); pg.addColorStop(0.6, rgb(color, 1)); pg.addColorStop(1, rgb(color, mez(0.45, 0.8, plana)));
  c.fillStyle = pg; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
  // la costura curva
  c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - plana)})`; c.lineWidth = r * 0.06;
  c.beginPath(); c.arc(x - r * 1.1, y, r * 1.05, -0.75, 0.75); c.stroke(); c.beginPath(); c.arc(x + r * 1.1, y, r * 1.05, Math.PI - 0.75, Math.PI + 0.75); c.stroke();
  c.fillStyle = `rgba(255,255,255,${0.7 * luz})`; c.beginPath(); c.ellipse(x - r * 0.35, y - r * 0.45, r * 0.22, r * 0.13, -0.6, 0, 6.2832); c.fill();
}
export const AZUL = [40, 90, 230];
export const PELOTAS = { roja: [205, 1500, 78], azul: [878, 1490, 74] };

// ---------------------------------------------------------------- el parque entero
// En pantalla. dicro: de 0 a 1, el rojo y el verde se vuelven ocre (rojo y verde por separado); noche: el cielo.
export function parque(c, t, { rojo = 0, verde = 0, noche = 0, mano = 1, saluda = 0, pelotaRoja = null } = {}) {
  const pr = pelotaRoja ?? rojo;
  cielo(c, noche);
  c.drawImage(ARBOLES[0], 0, 0);
  if (verde > 0) { c.globalAlpha = verde; c.drawImage(ARBOLES[1], 0, 0); c.globalAlpha = 1; }
  c.drawImage(CESPED[0], 0, 0);
  if (verde > 0) { c.globalAlpha = verde; c.drawImage(CESPED[1], 0, 0); c.globalAlpha = 1; }
  const [rx, ry, rr] = PELOTAS.roja, [bx, by, br] = PELOTAS.azul;
  pelota(c, rx, ry, rr, mezA(ROJO, OCRE, pr), 1 - 0.9 * pr, pr);
  pelota(c, bx, by, br, AZUL);
  // tu sombra en la hierba
  c.fillStyle = "rgba(10,25,5,0.3)"; c.beginPath(); c.ellipse(540, 1900, 420, 70, 0, 0, 6.2832); c.fill();
  c.save(); c.translate(540, 0); c.scale(0.9, 1); c.translate(-540, 0);
  tu(c, t, { jersey: mezA(ROJO, OCRE, rojo), mano, saluda });
  c.restore();
  // la luz de la tarde por encima de todo
  c.save(); c.globalCompositeOperation = "soft-light";
  const lg = c.createRadialGradient(900, 1000, 50, 900, 1000, 1500); lg.addColorStop(0, `rgba(255,210,140,${0.45 * (1 - noche)})`); lg.addColorStop(1, "rgba(0,0,0,0.12)");
  c.fillStyle = lg; c.fillRect(0, 0, 1080, 1920); c.restore();
}

// ---------------------------------------------------------------- como lo ve tu perro
// Dibuja el parque en un lienzo y lo pone en g con la cámara (zoom Z hacia (cx, cy)) y con lo que le hace su ojo:
//   borroso: de 0 (nítido) a 1 (como lo ve él) · rojo, verde · oscuro: de 0 a 1, ha anochecido (todo negro, como lo
//   verías tú) · noche: de 0 a 1, lo que ve él a oscuras: el parque sale de lo negro, azulado.
const L = lienzo(1080, 1920);
export function vistaPerro(g, t, { caja = null, Z = 1, cx = 540, cy = 960, borroso = 0, rojo = 0, verde = 0, oscuro = 0, noche = 0, cielo = 0, mano = 1, saluda = 0, pelotaRoja = null } = {}) {
  const c = L.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.filter = "none";
  c.fillStyle = "#000"; c.fillRect(0, 0, 1080, 1920);
  // la cámara no se sale del parque
  cy = Math.max(960 / Z, Math.min(1920 - 960 / Z, cy)); cx = Math.max(540 / Z, Math.min(1080 - 540 / Z, cx));
  c.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
  parque(c, t, { rojo, verde, noche: cielo, mano, saluda, pelotaRoja });
  c.setTransform(1, 0, 0, 1, 0, 0);
  const b = borroso * 13 * Z ** 0.5;
  const brillo = mez(1, mez(0.03, 0.85, noche), oscuro), sat = mez(mez(1, 0.9, borroso), 0.25, noche * oscuro);
  g.save();
  g.filter = `blur(${b.toFixed(1)}px) saturate(${sat.toFixed(2)}) brightness(${brillo.toFixed(2)})`;
  const m = b * 2.5;
  if (caja) g.drawImage(L, caja[0], caja[1], caja[2], caja[3]); else g.drawImage(L, -m, -m * 1.78, 1080 + 2 * m, 1920 + 3.56 * m);
  g.filter = "none";
  if (noche * oscuro > 0.01) {
    g.globalCompositeOperation = "multiply"; g.fillStyle = `rgba(120,175,255,${0.7 * noche * oscuro})`; if (caja) g.fillRect(...caja); else g.fillRect(0, 0, 1080, 1920);
    g.globalCompositeOperation = "source-over";
  }
  g.restore();
}
