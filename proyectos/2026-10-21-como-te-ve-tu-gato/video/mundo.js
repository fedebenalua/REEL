// Lo que comparten los planos: tu gato (su cara de frente, atigrada y naranja, con sus orejas y sus bigotes), su ojo
// (ámbar y verde, con la pupila que se abre, el párpado y el brillo de noche), y lo que ve él: el salón desde el suelo,
// contigo de pie dentro.
import * as k from "#kit";
import { Path2D } from "@napi-rs/canvas";

const { azar, lienzo, mez, mezRgb } = k;

// ---------------------------------------------------------------- el iris
// Una textura de 1024: fibras que salen de la pupila, ámbar por dentro y verde amarillo por fuera, con su anillo oscuro.
export const IRIS = (() => {
  const N = 1024, l = lienzo(N), c = l.getContext("2d"), C = N / 2;
  const bg = c.createRadialGradient(C, C, 0, C, C, C);
  bg.addColorStop(0, "#5a3a08"); bg.addColorStop(0.12, "#c8781c"); bg.addColorStop(0.32, "#e7a53a"); bg.addColorStop(0.58, "#d8c048");
  bg.addColorStop(0.8, "#a9b43c"); bg.addColorStop(0.92, "#6f7a26"); bg.addColorStop(1, "#2a2a0c");
  c.fillStyle = bg; c.fillRect(0, 0, N, N);
  const az = azar(707);
  c.lineCap = "round";
  for (let i = 0; i < 2600; i++) {
    const a = az() * 6.2832, r0 = C * (0.08 + az() * 0.3), r1 = r0 + C * (0.2 + az() * 0.55), ond = (az() - 0.5) * 0.12;
    const claro = az() < 0.5;
    c.strokeStyle = claro ? `rgba(255,236,150,${0.05 + az() * 0.12})` : `rgba(70,40,5,${0.05 + az() * 0.13})`;
    c.lineWidth = 1 + az() * 3.5;
    c.beginPath(); c.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0);
    c.quadraticCurveTo(C + Math.cos(a + ond) * (r0 + r1) / 2, C + Math.sin(a + ond) * (r0 + r1) / 2, C + Math.cos(a) * r1, C + Math.sin(a) * r1);
    c.stroke();
  }
  // las criptas: manchitas oscuras repartidas
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.manchas, 0, 0, N, N);
  c.globalAlpha = 0.25; c.drawImage(k.red, 0, 0, N, N);
  c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  // el anillo de fuera, oscuro
  const an = c.createRadialGradient(C, C, C * 0.82, C, C, C);
  an.addColorStop(0, "rgba(30,25,5,0)"); an.addColorStop(0.7, "rgba(30,25,5,0.5)"); an.addColorStop(1, "rgba(20,15,0,0.95)");
  c.fillStyle = an; c.fillRect(0, 0, N, N);
  // un collar dorado alrededor de la pupila
  const co = c.createRadialGradient(C, C, C * 0.06, C, C, C * 0.3);
  co.addColorStop(0, "rgba(255,190,80,0.0)"); co.addColorStop(0.45, "rgba(255,170,60,0.35)"); co.addColorStop(1, "rgba(255,170,60,0)");
  c.globalCompositeOperation = "screen"; c.fillStyle = co; c.fillRect(0, 0, N, N);
  return l;
})();

// La forma del ojo abierto (la almendra), centrada en (x, y), con radio de iris R. lado: -1 el izquierdo, 1 el derecho
// (la esquina de dentro, hacia la nariz, queda un poco más baja). abre: de 0 (cerrado) a 1.
function almendra(g, x, y, R, lado, abre = 1, soloArriba = false) {
  const ix = x - lado * 1.18 * R, iy = y + 0.2 * R, ox = x + lado * 1.12 * R, oy = y - 0.12 * R;
  const arriba = mez(0.75, -1.22, abre), abajo = 1.12;
  g.beginPath();
  g.moveTo(ix, iy);
  g.bezierCurveTo(x - lado * 0.95 * R, y + arriba * R * 0.9, x + lado * 0.7 * R, y + arriba * R, ox, oy);
  if (soloArriba) return;
  g.bezierCurveTo(x + lado * 0.8 * R, y + abajo * R, x - lado * 0.75 * R, y + abajo * R, ix, iy);
  g.closePath();
}

// El ojo de tu gato en (x, y), con radio de iris R.
//   pupila: 0 una raja, 1 redonda y enorme · abre: 1 abierto, 0 cerrado (el parpadeo) · mira: [dx, dy] hacia dónde
//   mira (en radios) · noche: de 0 a 1, el brillo verde del fondo del ojo · reflejo(g, x, y, R): lo que se refleja en la
//   córnea (se dibuja con "screen") · piel: el color del párpado.
export function ojo(g, x, y, R, lado, { pupila = 0.2, abre = 1, mira = [0, 0], noche = 0, reflejo = null, piel = "#c97c34", luz = 1, dentro = null, cornea = 1 } = {}) {
  const ixc = x + mira[0] * R, iyc = y + mira[1] * R;
  g.save();
  almendra(g, x, y, R, lado, 1); g.save(); g.clip();
  // el fondo de la cuenca, por si asoma
  g.fillStyle = "#2a1c08"; g.fillRect(x - 1.4 * R, y - 1.4 * R, 2.8 * R, 2.8 * R);
  // el iris
  g.save(); g.beginPath(); g.arc(ixc, iyc, R, 0, 6.2832); g.clip();
  g.drawImage(IRIS, ixc - R, iyc - R, 2 * R, 2 * R);
  if (luz < 1) { g.fillStyle = `rgba(0,0,8,${1 - luz})`; g.fillRect(ixc - R, iyc - R, 2 * R, 2 * R); }
  g.restore();
  // la pupila: una raja que se abre en un círculo
  const pw = R * mez(0.1, 0.8, pupila), ph = R * mez(0.94, 0.82, pupila);
  g.beginPath(); g.ellipse(ixc, iyc, pw, ph, 0, 0, 6.2832);
  const pg = g.createRadialGradient(ixc - pw * 0.3, iyc - ph * 0.3, 0, ixc, iyc, Math.max(pw, ph));
  pg.addColorStop(0, "#08090d"); pg.addColorStop(1, "#000");
  g.fillStyle = pg; g.fill();
  if (dentro) { g.save(); g.clip(); dentro(g, ixc, iyc); g.restore(); }
  if (noche > 0.01) {
    // el espejo del fondo: la pupila se enciende verde
    g.save(); g.globalCompositeOperation = "lighter";
    const ng = g.createRadialGradient(ixc, iyc, 0, ixc, iyc, Math.max(pw, ph) * 1.1);
    ng.addColorStop(0, `rgba(220,255,170,${0.95 * noche})`); ng.addColorStop(0.5, `rgba(120,230,110,${0.75 * noche})`); ng.addColorStop(1, `rgba(40,140,60,${0.35 * noche})`);
    g.fillStyle = ng; g.beginPath(); g.ellipse(ixc, iyc, pw, ph, 0, 0, 6.2832); g.fill();
    g.restore();
  }
  // la sombra del párpado de arriba sobre el ojo
  const sg = g.createLinearGradient(0, y - 1.1 * R, 0, y + 0.1 * R);
  sg.addColorStop(0, "rgba(20,10,0,0.75)"); sg.addColorStop(0.45, "rgba(20,10,0,0.25)"); sg.addColorStop(1, "rgba(20,10,0,0)");
  g.fillStyle = sg; g.fillRect(x - 1.4 * R, y - 1.4 * R, 2.8 * R, 1.6 * R);
  // la córnea: lo que se refleja y el brillo de la ventana
  if (reflejo) { g.save(); g.globalCompositeOperation = "screen"; reflejo(g, ixc, iyc, R); g.restore(); }
  g.save(); g.globalCompositeOperation = "screen";
  const cg = g.createRadialGradient(ixc - 0.35 * R, iyc - 0.45 * R, 0, ixc - 0.35 * R, iyc - 0.45 * R, R * 0.9);
  cg.addColorStop(0, `rgba(255,255,255,${0.32 * luz * cornea})`); cg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = cg; g.fillRect(x - 1.4 * R, y - 1.4 * R, 2.8 * R, 2.8 * R);
  g.restore();
  // la ventana: un brillo curvo, suave, arriba a la izquierda, y un punto de luz
  if (luz * cornea > 0.05) {
    luz *= cornea;
    g.save(); g.globalCompositeOperation = "screen"; g.filter = `blur(${Math.max(0.5, R * 0.02)}px)`;
    g.fillStyle = `rgba(255,252,240,${0.75 * luz})`;
    g.beginPath(); g.arc(ixc, iyc, R * 0.82, 3.55, 4.3); g.arc(ixc, iyc, R * 0.6, 4.3, 3.55, true); g.closePath(); g.fill();
    g.filter = "none";
    g.fillStyle = `rgba(255,255,255,${0.95 * luz})`; g.beginPath(); g.ellipse(ixc - 0.3 * R, iyc - 0.5 * R, 0.09 * R, 0.07 * R, -0.5, 0, 6.2832); g.fill();
    g.fillStyle = `rgba(255,255,255,${0.45 * luz})`; g.beginPath(); g.arc(ixc + 0.45 * R, iyc + 0.4 * R, 0.035 * R, 0, 6.2832); g.fill();
    g.restore();
  }
  g.restore(); // fin del recorte
  // el párpado de arriba que baja (el parpadeo)
  if (abre < 0.999) {
    g.save();
    almendra(g, x, y, R, lado, 1); g.clip();
    almendra(g, x, y, R, lado, abre, true);
    g.lineTo(x + lado * 1.4 * R, y - 1.6 * R); g.lineTo(x - lado * 1.4 * R, y - 1.6 * R); g.closePath();
    const lg = g.createLinearGradient(0, y - R, 0, y + R);
    lg.addColorStop(0, piel); lg.addColorStop(1, mezRgb2(piel, 0.7));
    g.fillStyle = lg; g.fill();
    g.restore();
    g.lineWidth = R * 0.075; g.strokeStyle = "#1a1008"; g.lineCap = "round";
    almendra(g, x, y, R, lado, abre, true); g.stroke();
  }
  // el borde negro del ojo (los gatos lo tienen como pintado)
  g.lineWidth = R * 0.045; g.strokeStyle = "#140c05"; g.lineJoin = "round";
  almendra(g, x, y, R, lado, 1); g.stroke();
  g.restore();
}
const mezRgb2 = (hex, f) => { const n = parseInt(hex.slice(1), 16); return `rgb(${Math.round(((n >> 16) & 255) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`; };

// ---------------------------------------------------------------- la cara de tu gato
// De frente. En sus coordenadas, la cabeza mide unos 1000 de ancho y su centro es (0, 0); los ojos, en OJOS, con iris
// de radio RO. Se dibuja en un lienzo una vez (el pelo) y encima, cada fotograma, las orejas, los ojos y los bigotes.
export const RO = 112;
export const OJOS = [[-208, -38], [208, -38]];
const W = 1500, H = 1500, CX = 750, CY = 820; // el lienzo de la cabeza y dónde cae su centro

function caminoCabeza(c) {
  if (c.beginPath) c.beginPath();
  c.moveTo(0, -430);
  c.bezierCurveTo(-210, -440, -380, -370, -440, -190);
  c.bezierCurveTo(-490, -40, -520, 120, -480, 230);
  c.bezierCurveTo(-420, 380, -220, 440, 0, 440);
  c.bezierCurveTo(220, 440, 420, 380, 480, 230);
  c.bezierCurveTo(520, 120, 490, -40, 440, -190);
  c.bezierCurveTo(380, -370, 210, -440, 0, -430);
  c.closePath();
}
// El color del pelo en cada punto: naranja atigrado, con la «M» de la frente, rayas en las mejillas y el hocico blanco.
function colorPelo(x, y) {
  const ax = Math.abs(x);
  let raya = 0;
  if (y < -120 && ax < 300) { // la frente: rayas que bajan hacia los ojos
    const s = Math.sin((x / 52) * Math.PI + Math.sin(y / 90) * 0.6);
    raya = Math.max(0, s) ** 3 * k.tramo(-y, 120, 260) * (1 - k.tramo(ax, 230, 300));
  }
  if (ax > 260 && y > -120 && y < 260) { // las mejillas: rayas curvas hacia atrás
    const s = Math.sin(((y - 0.45 * ax) / 58) * Math.PI);
    raya = Math.max(raya, Math.max(0, s) ** 4 * k.tramo(ax, 270, 330) * 0.9);
  }
  if (y < -330) raya = Math.max(raya, 0.45 * Math.max(0, Math.sin((x / 70) * Math.PI)) ** 2);
  // el blanco del hocico, la barbilla y el pecho
  const dm = Math.min(Math.hypot(ax - 78, (y - 175) * 1.05), Math.hypot(x, (y - 300) * 0.9) + 10);
  const blanco = 1 - k.tramo(dm, 95, 150);
  // un poco más claro alrededor de los ojos
  const de = Math.hypot(ax - 208, (y + 38) * 1.3);
  const claro = (1 - k.tramo(de, 120, 175)) * 0.6 + 0.2 * (1 - k.tramo(ax, 0, 120)) * k.tramo(y, -40, 60);
  let c = [233, 150, 70];
  c = c.map((v, i) => v + ([248, 205, 140][i] - v) * claro);
  c = c.map((v, i) => v + ([150, 72, 22][i] - v) * raya);
  c = c.map((v, i) => v + ([250, 244, 232][i] - v) * blanco);
  return c;
}
const CABEZA = (() => {
  const l = lienzo(W, H), c = l.getContext("2d");
  c.translate(CX, CY);
  // la base: el mapa de color a poca resolución, suave
  const n = 300, mapa = lienzo(n), mc = mapa.getContext("2d"), img = mc.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = (i / n) * W - CX, y = (j / n) * H - CY, col = colorPelo(x, y), q = (j * n + i) * 4;
    img.data[q] = col[0]; img.data[q + 1] = col[1]; img.data[q + 2] = col[2]; img.data[q + 3] = 255;
  }
  mc.putImageData(img, 0, 0);
  caminoCabeza(c); c.save(); c.clip();
  c.drawImage(mapa, -CX, -CY, W, H);
  c.restore();
  // el pelo: muchos trazos cortos que salen de la nariz hacia fuera (los del borde asoman: el contorno es de pelo)
  const az = azar(1234);
  c.setTransform(1, 0, 0, 1, CX, CY);
  const P = new Path2D(); caminoCabeza(P);
  const dentro = (x, y) => c.isPointInPath(P, x + CX, y + CY);
  c.lineCap = "round";
  for (let i = 0; i < 60000; i++) {
    const x = (az() - 0.5) * 1080, y = -440 + az() * 910;
    if (!dentro(x, y)) continue;
    const dx = x, dy = y - 90, d = Math.hypot(dx, dy) || 1;
    let ux = dx / d, uy = dy / d;
    uy += 0.35; const u = Math.hypot(ux, uy); ux /= u; uy /= u; // el pelo cae un poco
    const borde = Math.max(0, 1 - Math.min(Math.abs(Math.abs(x) - 470) / 60, 1)) * k.tramo(y, -150, 300);
    const L = 9 + az() * 16 + borde * 30 + d * 0.02;
    const col = colorPelo(x, y), f = 0.72 + az() * 0.5;
    c.strokeStyle = `rgba(${Math.min(255, col[0] * f) | 0},${Math.min(255, col[1] * f) | 0},${Math.min(255, col[2] * f) | 0},${0.5 + az() * 0.45})`;
    c.lineWidth = 1.5 + az() * 2.5;
    const bx = (az() - 0.5) * 0.4;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + ux * L * 0.5 - uy * L * bx, y + uy * L * 0.5 + ux * L * bx, x + ux * L, y + uy * L); c.stroke();
  }
  c.setTransform(1, 0, 0, 1, CX, CY);
  // las cuencas de los ojos: un poco de sombra alrededor
  for (const [ex, ey] of OJOS) {
    const sg = c.createRadialGradient(ex, ey, RO * 1.0, ex, ey + 10, RO * 1.9);
    sg.addColorStop(0, "rgba(60,25,5,0.55)"); sg.addColorStop(1, "rgba(60,25,5,0)");
    c.fillStyle = sg; c.beginPath(); c.arc(ex, ey, RO * 2, 0, 6.2832); c.fill();
  }
  // la luz: de arriba a la izquierda; la sombra, abajo a la derecha
  const antes = lienzo(W, H); antes.getContext("2d").drawImage(l, 0, 0);
  c.save();
  c.globalCompositeOperation = "multiply";
  const sh = c.createLinearGradient(-500, -450, 450, 480);
  sh.addColorStop(0, "rgba(255,255,255,1)"); sh.addColorStop(0.55, "rgba(235,220,210,1)"); sh.addColorStop(1, "rgba(120,80,70,1)");
  c.fillStyle = sh; c.fillRect(-600, -600, 1200, 1200);
  const bo = c.createRadialGradient(0, 40, 380, 0, 40, 620);
  bo.addColorStop(0, "rgba(255,255,255,1)"); bo.addColorStop(1, "rgba(110,70,50,1)");
  c.fillStyle = bo; c.fillRect(-600, -600, 1200, 1200);
  c.globalCompositeOperation = "screen";
  const hl = c.createRadialGradient(-220, -300, 20, -220, -300, 420);
  hl.addColorStop(0, "rgba(255,230,190,0.35)"); hl.addColorStop(1, "rgba(255,230,190,0)");
  c.fillStyle = hl; c.fillRect(-600, -600, 1200, 1200);
  c.globalCompositeOperation = "destination-in"; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(antes, 0, 0);
  c.restore();
  // la nariz: rosa, en forma de corazón al revés, con su brillo
  c.save(); c.translate(0, 92);
  c.beginPath(); c.moveTo(-52, -30); c.bezierCurveTo(-30, -44, 30, -44, 52, -30); c.bezierCurveTo(56, -22, 30, 10, 6, 26); c.lineTo(-6, 26); c.bezierCurveTo(-30, 10, -56, -22, -52, -30); c.closePath();
  const ng = c.createLinearGradient(0, -44, 0, 26); ng.addColorStop(0, "#f0a4a0"); ng.addColorStop(1, "#b8605e");
  c.fillStyle = ng; c.fill(); c.strokeStyle = "rgba(90,30,30,0.6)"; c.lineWidth = 3; c.stroke();
  c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.15; c.drawImage(k.red2, -60, -50, 120, 80); c.restore();
  c.fillStyle = "rgba(255,240,240,0.7)"; c.beginPath(); c.ellipse(-14, -26, 16, 6, -0.1, 0, 6.2832); c.fill();
  c.restore();
  // la boca: la raya de la nariz y la «ω»
  c.strokeStyle = "rgba(70,35,30,0.85)"; c.lineWidth = 5; c.lineCap = "round";
  c.beginPath(); c.moveTo(0, 118); c.lineTo(0, 160); c.stroke();
  c.beginPath(); c.moveTo(-70, 168); c.quadraticCurveTo(-34, 196, 0, 160); c.quadraticCurveTo(34, 196, 70, 168); c.stroke();
  // los puntos de los bigotes
  for (const s of [-1, 1]) for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
    c.fillStyle = "rgba(150,110,90,0.55)"; c.beginPath(); c.arc(s * (60 + q * 20 + r * 6), 140 + r * 18 - q * 3, 3.5, 0, 6.2832); c.fill();
  }
  return l;
})();

// El cuello y el pecho, debajo de la cabeza: sentado, de frente. Su lienzo tiene el (0, 0) de la cabeza en (CXc, 120).
const CXc = 800;
const CUERPO = (() => {
  const l = lienzo(1600, 1500), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, CXc, -120);
  const P = new Path2D();
  P.moveTo(-380, 250); P.bezierCurveTo(-520, 520, -700, 900, -780, 1640); P.lineTo(780, 1640); P.bezierCurveTo(700, 900, 520, 520, 380, 250); P.closePath();
  const bg = c.createLinearGradient(-700, 0, 700, 0); bg.addColorStop(0, "#b8692a"); bg.addColorStop(0.4, "#e39a4a"); bg.addColorStop(1, "#9a5420");
  c.fillStyle = bg; c.fill(P);
  // el pecho blanco
  c.save(); c.clip(P);
  const pg = c.createRadialGradient(0, 700, 50, 0, 700, 520); pg.addColorStop(0, "rgba(250,244,232,1)"); pg.addColorStop(0.7, "rgba(250,244,232,0.85)"); pg.addColorStop(1, "rgba(250,244,232,0)");
  c.fillStyle = pg; c.fillRect(-800, 200, 1600, 1500);
  c.restore();
  const az = azar(4321); c.lineCap = "round";
  for (let i = 0; i < 26000; i++) {
    const x = (az() - 0.5) * 1560, y = 250 + az() * 1400;
    if (!c.isPointInPath(P, x + CXc, y - 120)) continue;
    const pecho = 1 - k.tramo(Math.hypot(x, (y - 700) * 0.9), 300, 520);
    const raya = Math.abs(x) > 300 ? Math.max(0, Math.sin(((y + 0.3 * Math.abs(x)) / 70) * Math.PI)) ** 4 * 0.8 : 0;
    let col = [228, 148, 70].map((v, j) => v + ([150, 72, 22][j] - v) * raya);
    col = col.map((v, j) => v + ([250, 244, 232][j] - v) * pecho);
    const f = 0.72 + az() * 0.5, L = 14 + az() * 22, ux = x / 900 * 0.6, uy = 1;
    c.strokeStyle = `rgba(${Math.min(255, col[0] * f) | 0},${Math.min(255, col[1] * f) | 0},${Math.min(255, col[2] * f) | 0},${0.5 + az() * 0.45})`;
    c.lineWidth = 1.5 + az() * 2.5;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + ux * L, y + uy * L); c.stroke();
  }
  // la sombra que hace la cabeza sobre el cuello, y los lados
  c.save(); c.clip(P);
  const sh = c.createRadialGradient(0, 330, 200, 0, 330, 560); sh.addColorStop(0, "rgba(40,15,0,0.65)"); sh.addColorStop(1, "rgba(40,15,0,0)");
  c.fillStyle = sh; c.fillRect(-800, 200, 1600, 800);
  const ld = c.createLinearGradient(-800, 0, 800, 0); ld.addColorStop(0, "rgba(30,10,0,0.45)"); ld.addColorStop(0.3, "rgba(30,10,0,0)"); ld.addColorStop(0.7, "rgba(30,10,0,0)"); ld.addColorStop(1, "rgba(30,10,0,0.6)");
  c.fillStyle = ld; c.fillRect(-800, 200, 1600, 1500);
  c.restore();
  return l;
})();

// Una oreja (la izquierda; la derecha es su espejo), en un lienzo, con su punto de giro en la base.
const OREJA = (() => {
  const l = lienzo(420, 520), c = l.getContext("2d");
  c.translate(210, 470); // la base, en el centro de abajo
  const forma = () => { c.beginPath(); c.moveTo(-170, 0); c.bezierCurveTo(-170, -160, -120, -330, -40, -440); c.quadraticCurveTo(-20, -455, 0, -430); c.bezierCurveTo(70, -330, 150, -170, 175, 0); c.closePath(); };
  forma();
  const og = c.createLinearGradient(-170, 0, 175, -200); og.addColorStop(0, "#d98b40"); og.addColorStop(1, "#a85e22");
  c.fillStyle = og; c.fill();
  c.save(); c.clip();
  { const az = azar(91); c.lineCap = "round";
    for (let i = 0; i < 2600; i++) {
      const x = (az() - 0.5) * 360, y = -az() * 460, L = 10 + az() * 18, f = 0.75 + az() * 0.5;
      const dx = -20 - x, dy = -440 - y, d = Math.hypot(dx, dy) || 1;
      c.strokeStyle = `rgba(${Math.min(255, 225 * f) | 0},${Math.min(255, 140 * f) | 0},${Math.min(255, 62 * f) | 0},0.7)`; c.lineWidth = 1.5 + az() * 2;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + (dx / d) * L, y + (dy / d) * L); c.stroke();
    } }
  c.restore();
  // dentro: rosa, con pelos blancos
  c.beginPath(); c.moveTo(-120, -10); c.bezierCurveTo(-115, -150, -80, -290, -30, -370); c.bezierCurveTo(30, -280, 100, -150, 120, -10); c.closePath();
  const ig = c.createLinearGradient(0, -370, 0, 0); ig.addColorStop(0, "#b8706a"); ig.addColorStop(0.55, "#d99590"); ig.addColorStop(1, "#6a3028");
  c.fillStyle = ig; c.fill();
  c.save(); c.clip();
  const sg = c.createLinearGradient(-120, 0, 120, 0); sg.addColorStop(0, "rgba(60,20,15,0.45)"); sg.addColorStop(0.5, "rgba(60,20,15,0)"); sg.addColorStop(1, "rgba(60,20,15,0.2)");
  c.fillStyle = sg; c.fillRect(-130, -380, 260, 380);
  const az = azar(55); c.lineCap = "round";
  for (let i = 0; i < 160; i++) {
    const x = (az() - 0.5) * 200, y = -az() * 200, L = 30 + az() * 70;
    c.strokeStyle = `rgba(255,246,230,${0.15 + az() * 0.35})`; c.lineWidth = 1 + az() * 1.2;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x * 0.8, y - L * 0.6, x * 0.6 + (az() - 0.5) * 20, y - L); c.stroke();
  }
  c.restore();
  return l;
})();
const BASE_OREJA = [-262, -300];

// Los bigotes: largos, blancos, finos, que se mueven un poco.
const BIG = (() => { const az = azar(77), l = []; for (const s of [-1, 1]) for (let i = 0; i < 6; i++) l.push({ s, y0: 135 + i * 11, a: -0.32 + i * 0.13 + (az() - 0.5) * 0.06, L: 380 + az() * 140, cv: 0.08 + az() * 0.08, f: az() * 6 }); return l; })();

// La cara de tu gato con su centro en (x, y), a escala esc (1: la cabeza mide unos 1000 px de ancho).
//   orejas: [izq, der] cuánto se giran hacia fuera (radianes; negativo, hacia dentro) · gira: cuánto gira la cabeza
//   (de -1 a 1: un poco de lado, se escorza) · los del ojo (pupila, abre, mira, noche, reflejo, luz) · oscuro: de 0 a 1,
//   la cara a oscuras (solo se ven los ojos que brillan).
export function cara(g, t, x, y, esc, { orejas = [0, 0], gira = 0, inclina = 0, pupila = 0.25, abre = 1, mira = [0, 0], noche = 0, reflejo = null, oscuro = 0, bigotes = 0, dentro = null, cornea = 1 } = {}) {
  g.save();
  g.translate(x, y); g.rotate(inclina); g.scale(esc * (1 - Math.abs(gira) * 0.12), esc);
  g.translate(gira * 60, 0);
  g.drawImage(CUERPO, -CXc, 120);
  // las orejas, detrás de la cabeza
  for (const s of [-1, 1]) {
    const a = orejas[s < 0 ? 0 : 1];
    g.save();
    g.translate(s * Math.abs(BASE_OREJA[0]) + gira * 25, BASE_OREJA[1]);
    g.scale(s < 0 ? 1 : -1, 1);
    g.rotate(-0.16 - a);
    g.scale(1 - Math.min(0.45, Math.abs(a) * 0.45), 1);
    g.drawImage(OREJA, -210, -470);
    g.restore();
  }
  g.drawImage(CABEZA, -CX, -CY);
  // los ojos
  for (let i = 0; i < 2; i++) {
    const [ex, ey] = OJOS[i];
    ojo(g, ex + gira * 30, ey, RO, i === 0 ? -1 : 1, { pupila, abre, mira, noche: 0, reflejo, piel: "#d38a42", luz: 1 - oscuro, dentro: i === 0 ? dentro : null, cornea });
  }
  // los bigotes
  g.save(); g.lineCap = "round";
  for (const b of BIG) {
    const a = b.a + Math.sin(t * 1.3 + b.f) * 0.015 + bigotes * 0.12;
    const x0 = b.s * 95, y0 = b.y0, x1 = x0 + b.s * Math.cos(a) * b.L, y1 = y0 + Math.sin(a) * b.L;
    g.strokeStyle = `rgba(255,252,245,${0.85 * (1 - oscuro)})`; g.lineWidth = 3.2;
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - b.L * b.cv, x1, y1 + b.L * b.cv * 0.4); g.stroke();
  }
  g.restore();
  // a oscuras: la cara se pierde en la noche
  if (oscuro > 0.01) {
    g.fillStyle = `rgba(4,6,14,${0.94 * oscuro})`; g.fillRect(-4000, -4000, 8000, 8000);
  }
  // los ojos que brillan de noche (por encima de la oscuridad)
  if (noche > 0.01 || (dentro && oscuro > 0.01)) {
    for (let i = 0; i < 2; i++) {
      const [ex, ey] = OJOS[i];
      ojo(g, ex + gira * 30, ey, RO, i === 0 ? -1 : 1, { pupila, abre, mira, noche, luz: 0.15, dentro: i === 0 ? dentro : null, cornea });
      k.brillo(g, ex + gira * 30 + mira[0] * RO, ey + mira[1] * RO, RO * 5, "150,255,140", 0.55 * noche * cornea);
    }
  }
  g.restore();
}
// Dónde cae en pantalla un punto de la cara (para llevar la cámara a un ojo).
export const enCara = (x, y, esc, px, py) => [x + px * esc, y + py * esc];

// ---------------------------------------------------------------- detrás de tu gato
// Tu salón desde donde estás tú: la pared cálida, desenfocada, con la luz de la lámpara y el sofá.
const FONDO_CASA = (() => {
  const l = lienzo(1080, 1920), c = l.getContext("2d");
  const bg = c.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#6a4a36"); bg.addColorStop(0.6, "#4a3020"); bg.addColorStop(1, "#2a180e");
  c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
  c.globalCompositeOperation = "lighter";
  for (const [x, y, r, col, a] of [[860, 420, 520, "255,190,110", 0.55], [160, 700, 380, "150,190,255", 0.25], [700, 1300, 300, "255,150,80", 0.2], [300, 260, 200, "255,220,160", 0.25]]) {
    const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = gr; c.fillRect(0, 0, 1080, 1920);
  }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.15; c.drawImage(k.manchas, 0, 0, 1080, 1920);
  return l;
})();
export function fondoCasa(g, al = 1) { g.save(); g.globalAlpha *= al; g.drawImage(FONDO_CASA, 0, 0); g.restore(); }

// La cámara que mira a la cara: esc (la escala), F (el punto de la cara que se mira) y A (dónde cae en pantalla).
// Devuelve el (x, y) del centro de la cara en pantalla.
export const ancla = (esc, F, A = [540, 960]) => [A[0] - F[0] * esc, A[1] - F[1] * esc];
// La escala a la que la pupila redonda tapa toda la pantalla, y lo que se ve dentro de ella: el salón, de un tamaño
// fijo en la cara, así que crece con la cámara y llena la pantalla justo a esa escala.
export const ESC_DENTRO = 12.5;
export const cajaPupila = (px, py) => [px - 540 / ESC_DENTRO, py - 960 / ESC_DENTRO, 1080 / ESC_DENTRO, 1920 / ESC_DENTRO];
// Lo que se ve dentro de la pupila: lo que hay delante del gato (dibuja(c, caja)), con los bordes perdidos en el negro
// del ojo (vela: de 1, bordes en negro, a 0, sin velo, cuando ya llena la pantalla).
export function enPupila(c, px, py, dibujaDentro, vela = 1) {
  const caja = cajaPupila(px, py);
  dibujaDentro(caja);
  if (vela > 0.01) {
    const r = 960 / ESC_DENTRO;
    c.save(); c.translate(px, py); c.scale(0.5625, 1);
    const vg = c.createRadialGradient(0, 0, r * 0.45, 0, 0, r * 1.0);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${vela})`);
    c.fillStyle = vg; c.fillRect(-4 * r, -2 * r, 8 * r, 4 * r);
    c.restore();
  }
}

// ---------------------------------------------------------------- tu gato de lado, andando
// Mirando a la derecha. En sus coordenadas, el cuerpo mide unos 560 de largo, su centro es (0, 0) y el suelo está en
// y = 300. Colores: naranja (tu gato), gris y negro (los otros).
export const PELAJES = {
  naranja: { base: [228, 148, 70], raya: [150, 72, 22], claro: [250, 244, 232], nariz: "#e8948c" },
  gris: { base: [150, 156, 166], raya: [80, 84, 94], claro: [236, 238, 242], nariz: "#d89a9a" },
  negro: { base: [44, 40, 42], raya: [24, 22, 24], claro: [70, 66, 68], nariz: "#4a3a3a" },
};
const SUELO = 320;
function caminoCuerpo(P) {
  // el cuello, que sube hacia la cabeza
  P.moveTo(120, -110); P.bezierCurveTo(150, -200, 250, -230, 300, -170); P.bezierCurveTo(340, -110, 300, -20, 262, 20); P.lineTo(120, -110); P.closePath();
  // el muslo de atrás y el hombro
  P.ellipse(-185, 35, 100, 95, -0.3, 0, 6.2832); P.closePath();
  P.ellipse(170, 40, 70, 80, 0.2, 0, 6.2832); P.closePath();
  P.moveTo(-262, -40);
  P.bezierCurveTo(-250, -140, -60, -150, 120, -125);
  P.bezierCurveTo(225, -110, 280, -60, 262, 20);
  P.bezierCurveTo(250, 90, 180, 118, 100, 115);
  P.bezierCurveTo(0, 132, -150, 132, -230, 92);
  P.bezierCurveTo(-292, 60, -292, 10, -262, -40);
  P.closePath();
}
function pintaPelo(c, P, pel, sem, n, dir, colorEn) {
  const az = azar(sem); c.lineCap = "round";
  const b = colorEn ? null : pel.base;
  for (let i = 0; i < n; i++) {
    const x = -340 + az() * 800, y = -380 + az() * 560;
    if (!c.isPointInPath(P, x + 450, y + 420)) continue;
    const col = colorEn(x, y), f = 0.75 + az() * 0.45, [ux, uy] = dir(x, y), L = 10 + az() * 14;
    c.strokeStyle = `rgba(${Math.min(255, col[0] * f) | 0},${Math.min(255, col[1] * f) | 0},${Math.min(255, col[2] * f) | 0},${0.55 + az() * 0.4})`;
    c.lineWidth = 1.5 + az() * 2.2;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + ux * L, y + uy * L); c.stroke();
  }
}
const mezC = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
const ladoCache = new Map();
function lados(nombre) {
  if (ladoCache.has(nombre)) return ladoCache.get(nombre);
  const pel = PELAJES[nombre];
  // el cuerpo
  const lc = lienzo(900, 700), c = lc.getContext("2d"); c.setTransform(1, 0, 0, 1, 450, 420);
  const P = new Path2D(); caminoCuerpo(P);
  const colC = (x, y) => {
    const raya = Math.max(0, Math.sin(((x + 0.25 * y) / 62) * Math.PI)) ** 3 * k.tramo(-y, -40, 60) * 0.95;
    const panza = k.tramo(y, 60, 120) * 0.9 + (x > 190 ? k.tramo(y, -20, 60) * 0.85 : 0);
    return mezC(mezC(pel.base, pel.raya, raya), pel.claro, panza);
  };
  c.fillStyle = `rgb(${pel.base.join(",")})`; c.fill(P, "nonzero");
  pintaPelo(c, P, pel, 501, 30000, (x, y) => [-0.95, 0.3 + y / 400], colC);
  c.save(); c.clip(P);
  const sh = c.createLinearGradient(0, -150, 0, 140); sh.addColorStop(0, "rgba(255,240,210,0.25)"); sh.addColorStop(0.5, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(30,10,0,0.45)");
  c.fillStyle = sh; c.fillRect(-400, -200, 800, 400); c.restore();
  // la cabeza (con las orejas), girada desde el cuello en (230, -90)
  const lh = lienzo(500, 500), h = lh.getContext("2d"); h.setTransform(1, 0, 0, 1, 250, 280); // (0,0) = el centro de la cabeza
  const oreja = (pts, osc) => { h.beginPath(); h.moveTo(...pts[0]); h.quadraticCurveTo(pts[1][0] - 10, pts[1][1] + 30, pts[1][0], pts[1][1]); h.quadraticCurveTo(pts[1][0] + 15, pts[1][1] + 30, ...pts[2]); h.closePath(); h.fillStyle = `rgb(${mezC(pel.base, [0, 0, 0], osc).join(",")})`; h.fill(); };
  oreja([[-110, -60], [-95, -190], [-30, -95]], 0.35);
  oreja([[-40, -95], [10, -200], [55, -80]], 0.05);
  h.beginPath(); h.moveTo(-10, -100); h.quadraticCurveTo(10, -150, 12, -175); h.quadraticCurveTo(30, -130, 40, -88); h.closePath(); h.fillStyle = nombre === "negro" ? "#5a4044" : "#d9958c"; h.fill();
  const PH = new Path2D();
  PH.moveTo(-120, 0); PH.bezierCurveTo(-125, -80, -60, -115, 10, -112); PH.bezierCurveTo(80, -108, 110, -60, 112, -20);
  PH.bezierCurveTo(150, -10, 165, 20, 150, 45); PH.bezierCurveTo(130, 75, 70, 90, 20, 92); PH.bezierCurveTo(-60, 100, -118, 70, -120, 0); PH.closePath();
  h.fillStyle = `rgb(${pel.base.join(",")})`; h.fill(PH);
  const colH = (x, y) => {
    const raya = y < -40 ? Math.max(0, Math.sin((x / 40) * Math.PI)) ** 3 * 0.8 : (x < 20 && y > -20 && y < 50 ? Math.max(0, Math.sin(((y - 0.4 * x) / 34) * Math.PI)) ** 4 * 0.8 : 0);
    const blanco = 1 - k.tramo(Math.hypot(x - 120, (y - 45) * 1.2), 40, 80);
    return mezC(mezC(pel.base, pel.raya, raya), pel.claro, blanco);
  };
  { const az = azar(77 + nombre.length); h.lineCap = "round";
    for (let i = 0; i < 9000; i++) {
      const x = -140 + az() * 310, y = -130 + az() * 240;
      if (!h.isPointInPath(PH, x + 250, y + 280)) continue;
      const col = colH(x, y), f = 0.75 + az() * 0.45, d = Math.hypot(x - 120, y - 30) || 1, L = 8 + az() * 12;
      h.strokeStyle = `rgba(${Math.min(255, col[0] * f) | 0},${Math.min(255, col[1] * f) | 0},${Math.min(255, col[2] * f) | 0},${0.55 + az() * 0.4})`; h.lineWidth = 1.5 + az() * 2;
      h.beginPath(); h.moveTo(x, y); h.lineTo(x + ((x - 120) / d) * L, y + ((y - 30) / d) * L); h.stroke();
    } }
  h.save(); h.clip(PH);
  const hs = h.createRadialGradient(0, -60, 20, 0, 0, 170); hs.addColorStop(0, "rgba(255,240,210,0.2)"); hs.addColorStop(1, "rgba(30,10,0,0.35)");
  h.fillStyle = hs; h.fillRect(-150, -150, 330, 300); h.restore();
  // la nariz y la boca
  h.fillStyle = pel.nariz; h.beginPath(); h.moveTo(152, 18); h.lineTo(162, 30); h.lineTo(148, 36); h.closePath(); h.fill();
  h.strokeStyle = "rgba(60,30,25,0.7)"; h.lineWidth = 3; h.beginPath(); h.moveTo(150, 40); h.quadraticCurveTo(140, 58, 120, 56); h.stroke();
  const r = { cuerpo: lc, cabeza: lh, pel };
  ladoCache.set(nombre, r);
  return r;
}
// Una pata: del hombro (x0, y0) al pie, con su paso (sw: hacia delante, alza: levantada). trasera: con el corvejón
// (la rodilla de atrás doblada). Hecha de círculos que se van estrechando, como la cola.
function pata(g, x0, y0, sw, alza, ancho, col, claro, trasera = false) {
  const px = x0 + sw, py = SUELO - 18 - alza;
  const kx = trasera ? x0 - 40 + sw * 0.3 : x0 + sw * 0.35 + 4, ky = trasera ? y0 + (py - y0) * 0.62 : y0 + (py - y0) * 0.5;
  g.save();
  const n = 26, pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = Math.min(1, u * 2), b = Math.max(0, u * 2 - 1);
    pts.push([u < 0.5 ? x0 + (kx - x0) * a : kx + (px - kx) * b, u < 0.5 ? y0 + (ky - y0) * a : ky + (py - ky) * b, ancho * 0.5 * mez(1.35, 0.72, Math.pow(u, 0.7))]);
  }
  // primero la sombra (todo el grosor, más oscuro), luego la luz un poco hacia delante
  for (const [x, y, r] of pts) { g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); g.fillStyle = col; g.globalAlpha = 0.55; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  for (const [x, y, r] of pts) { g.fillStyle = col; g.beginPath(); g.arc(x + r * 0.18, y, r * 0.8, 0, 6.2832); g.fill(); }
  g.restore();
  g.save();
  g.fillStyle = claro; g.beginPath(); g.ellipse(px + 8, py + 4, ancho * 0.55, ancho * 0.33, 0, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(px + 2, py + 14); g.lineTo(px + 4, py); g.moveTo(px + 16, py + 14); g.lineTo(px + 18, py); g.stroke();
  g.restore();
}
// La cola: de la base (-262, -30) hacia atrás; levanta: 0 baja y curva hacia atrás, 1 recta hacia arriba con la punta
// doblada; menea: un poco de vaivén; enrosca: de 0 a 1, la punta se curva hacia delante (alrededor de tu pierna).
function cola(g, t, pel, levanta, menea = 1, enrosca = 0) {
  const n = 40, pts = [];
  let x = -262, y = -30, a = mez(Math.PI * 1.05, Math.PI * 1.5, levanta);
  for (let i = 0; i <= n; i++) {
    pts.push([x, y]);
    const u = i / n;
    const curva = mez(-0.018, 0.0, levanta) + (u > 0.75 ? mez(0, 0.11, levanta) * (u - 0.75) * 4 : 0) + enrosca * 0.05 * u;
    a += curva + Math.sin(t * 2.2 - u * 3) * 0.012 * menea;
    x += Math.cos(a) * 11; y += Math.sin(a) * 11;
  }
  g.save();
  for (let i = 0; i < pts.length; i++) {
    const u = i / n, w = mez(24, 15, u), raya = Math.max(0, Math.sin(u * Math.PI * 7)) ** 2 * 0.8 + (u > 0.92 ? 0.8 : 0);
    const col = mezC(pel.base, pel.raya, raya);
    g.fillStyle = `rgb(${col.map((v) => v | 0).join(",")})`; g.beginPath(); g.arc(pts[i][0], pts[i][1], w, 0, 6.2832); g.fill();
  }
  g.restore();
}
// Tu gato de lado en (x, y) (el centro del cuerpo), a escala s, mirando a la derecha (o a la izquierda con dir = -1).
//   paso: la fase del paso (lo que ha andado) · anda: 0 quieto, 1 andando · levanta, enrosca: la cola · cabeza: el giro
//   de la cabeza (negativo, baja hacia delante) · ojos: 1 abiertos, 0 cerrados (a gusto) · arquea: el lomo arqueado.
export function gatoLado(g, t, x, y, s, nombre = "naranja", { dir = 1, paso = 0, anda = 1, levanta = 0, enrosca = 0, cabeza = 0, ojos = 1, agacha = 0 } = {}) {
  const L = lados(nombre), pel = L.pel;
  const oscuro = `rgb(${mezC(pel.base, [0, 0, 0], 0.35).map((v) => v | 0).join(",")})`, base = `rgb(${pel.base.join(",")})`;
  const claro = `rgb(${pel.claro.join(",")})`, claroO = `rgb(${mezC(pel.claro, [0, 0, 0], 0.3).map((v) => v | 0).join(",")})`;
  const fase = paso * 2 * Math.PI;
  const sw = (f) => Math.sin(fase + f) * 46 * anda, al = (f) => Math.max(0, Math.cos(fase + f)) * 24 * anda;
  const bota = Math.abs(Math.sin(fase)) * 5 * anda;
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  g.translate(0, -bota + agacha * 60);
  // las patas de detrás (las del otro lado), más oscuras
  pata(g, 140, 50, sw(Math.PI), al(Math.PI), 50, oscuro, claroO);
  pata(g, -200, 60, sw(0), al(0), 54, oscuro, claroO, true);
  cola(g, t, pel, levanta, 1, enrosca);
  // las patas de este lado (el cuerpo tapa dónde empiezan)
  pata(g, 165, 55, sw(0), al(0), 54, base, claro);
  pata(g, -175, 70, sw(Math.PI), al(Math.PI), 58, base, claro, true);
  g.drawImage(L.cuerpo, -450, -420);
  // el cuello y la cabeza
  g.save(); g.translate(240, -120); g.rotate(cabeza); g.translate(55, -40);
  g.drawImage(L.cabeza, -250, -280);
  // el ojo, de lado: una almendra con su raja
  const ex = 70, ey = -30;
  if (ojos > 0.15) {
    g.save(); g.beginPath(); g.ellipse(ex, ey, 22, 15 * ojos, -0.1, 0, 6.2832); g.clip();
    g.fillStyle = "#b6b83a"; g.fillRect(ex - 25, ey - 20, 50, 40);
    g.fillStyle = "#c8902a"; g.beginPath(); g.arc(ex + 4, ey, 9, 0, 6.2832); g.fill();
    g.fillStyle = "#000"; g.beginPath(); g.ellipse(ex + 6, ey, 3.5, 13, 0, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(ex + 10, ey - 5, 3, 0, 6.2832); g.fill();
    g.restore();
  }
  g.strokeStyle = "#1a1008"; g.lineWidth = 3.5; g.beginPath();
  if (ojos > 0.15) g.ellipse(ex, ey, 22, 15 * ojos, -0.1, 0, 6.2832); else { g.moveTo(ex - 20, ey); g.quadraticCurveTo(ex, ey + 9, ex + 20, ey - 2); }
  g.stroke();
  // los bigotes
  g.strokeStyle = "rgba(255,250,240,0.8)"; g.lineWidth = 2;
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(130, 40 + i * 5); g.quadraticCurveTo(190, 30 + i * 12, 250, 40 + i * 22); g.stroke(); }
  g.restore();
  g.restore();
}
