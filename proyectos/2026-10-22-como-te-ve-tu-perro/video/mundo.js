// Lo que comparten los planos: tu perro, un border collie (su cara de frente, negra y blanca, con la lista blanca, la
// trufa, las orejas con la punta doblada y el pecho de pelo largo), sus ojos marrones (con la pupila redonda que se abre
// y el brillo de noche), y lo que hay detrás de él: el parque.
import * as k from "#kit";
import { Path2D } from "@napi-rs/canvas";

const { azar, lienzo, mez, tramo } = k;

// ---------------------------------------------------------------- el iris
// Una textura de 1024: marrón avellana, más claro y dorado alrededor de la pupila, oscuro por fuera, con sus fibras.
export const IRIS = (() => {
  const N = 1024, l = lienzo(N), c = l.getContext("2d"), C = N / 2;
  const bg = c.createRadialGradient(C, C, 0, C, C, C);
  bg.addColorStop(0, "#2a1406"); bg.addColorStop(0.14, "#8a4a14"); bg.addColorStop(0.3, "#b8742a"); bg.addColorStop(0.5, "#9a5a1e");
  bg.addColorStop(0.75, "#6a3810"); bg.addColorStop(0.9, "#3e1e08"); bg.addColorStop(1, "#140802");
  c.fillStyle = bg; c.fillRect(0, 0, N, N);
  const az = azar(909);
  c.lineCap = "round";
  for (let i = 0; i < 2800; i++) {
    const a = az() * 6.2832, r0 = C * (0.1 + az() * 0.3), r1 = r0 + C * (0.2 + az() * 0.5), ond = (az() - 0.5) * 0.14;
    const claro = az() < 0.45;
    c.strokeStyle = claro ? `rgba(240,180,90,${0.05 + az() * 0.13})` : `rgba(40,16,2,${0.06 + az() * 0.14})`;
    c.lineWidth = 1 + az() * 3.5;
    c.beginPath(); c.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0);
    c.quadraticCurveTo(C + Math.cos(a + ond) * (r0 + r1) / 2, C + Math.sin(a + ond) * (r0 + r1) / 2, C + Math.cos(a) * r1, C + Math.sin(a) * r1);
    c.stroke();
  }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.manchas, 0, 0, N, N);
  c.globalAlpha = 0.25; c.drawImage(k.red, 0, 0, N, N);
  c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  const an = c.createRadialGradient(C, C, C * 0.8, C, C, C);
  an.addColorStop(0, "rgba(20,8,0,0)"); an.addColorStop(0.7, "rgba(20,8,0,0.55)"); an.addColorStop(1, "rgba(10,4,0,0.95)");
  c.fillStyle = an; c.fillRect(0, 0, N, N);
  const co = c.createRadialGradient(C, C, C * 0.1, C, C, C * 0.36);
  co.addColorStop(0, "rgba(255,190,90,0)"); co.addColorStop(0.45, "rgba(255,170,70,0.3)"); co.addColorStop(1, "rgba(255,170,70,0)");
  c.globalCompositeOperation = "screen"; c.fillStyle = co; c.fillRect(0, 0, N, N);
  return l;
})();

// La forma del ojo abierto, centrada en (x, y), con radio de iris R: más redonda que la de un gato, con la esquina de
// dentro (hacia la nariz) más baja. lado: -1 el izquierdo, 1 el derecho. abre: de 0 (cerrado) a 1.
function almendra(g, x, y, R, lado, abre = 1, soloArriba = false) {
  const ix = x - lado * 1.22 * R, iy = y + 0.28 * R, ox = x + lado * 1.2 * R, oy = y - 0.05 * R;
  const arriba = mez(0.85, -1.18, abre), abajo = 1.05;
  g.beginPath();
  g.moveTo(ix, iy);
  g.bezierCurveTo(x - lado * 1.0 * R, y + arriba * R * 0.95, x + lado * 0.75 * R, y + arriba * R, ox, oy);
  if (soloArriba) return;
  g.bezierCurveTo(x + lado * 0.85 * R, y + abajo * R, x - lado * 0.8 * R, y + abajo * R * 1.02, ix, iy);
  g.closePath();
}

// El ojo de tu perro en (x, y), con radio de iris R.
//   pupila: de 0 (pequeña) a 1 (enorme) · abre: 1 abierto, 0 cerrado · mira: [dx, dy] hacia dónde mira (en radios) ·
//   noche: de 0 a 1, el brillo del espejo del fondo (verde azulado) · reflejo(g, x, y, R): lo que se refleja en la
//   córnea · dentro(g, x, y): lo que se ve dentro de la pupila · luz: 1 de día, menos a oscuras.
export function ojo(g, x, y, R, lado, { pupila = 0.3, abre = 1, mira = [0, 0], noche = 0, reflejo = null, luz = 1, dentro = null, cornea = 1 } = {}) {
  const ixc = x + mira[0] * R, iyc = y + mira[1] * R;
  g.save();
  almendra(g, x, y, R, lado, 1); g.save(); g.clip();
  // el blanco del ojo, que casi no se ve: solo asoma en las esquinas, en sombra
  const wg = g.createRadialGradient(x, y, R * 0.6, x, y, R * 1.4);
  wg.addColorStop(0, "#d8cfc4"); wg.addColorStop(1, "#6a5e54");
  g.fillStyle = wg; g.fillRect(x - 1.5 * R, y - 1.5 * R, 3 * R, 3 * R);
  // el iris, grande
  const RI = R * 1.04;
  g.save(); g.beginPath(); g.arc(ixc, iyc, RI, 0, 6.2832); g.clip();
  g.drawImage(IRIS, ixc - RI, iyc - RI, 2 * RI, 2 * RI);
  if (luz < 1) { g.fillStyle = `rgba(0,0,8,${1 - luz})`; g.fillRect(ixc - RI, iyc - RI, 2 * RI, 2 * RI); }
  g.restore();
  // la pupila, redonda
  const pr = R * mez(0.26, 0.86, pupila);
  g.beginPath(); g.arc(ixc, iyc, pr, 0, 6.2832);
  const pg = g.createRadialGradient(ixc - pr * 0.3, iyc - pr * 0.3, 0, ixc, iyc, pr);
  pg.addColorStop(0, "#0a0b0f"); pg.addColorStop(1, "#000");
  g.fillStyle = pg; g.fill();
  if (dentro) { g.save(); g.clip(); dentro(g, ixc, iyc); g.restore(); }
  if (noche > 0.01) {
    // el espejo del fondo: la pupila se enciende, verde azulada
    g.save(); g.globalCompositeOperation = "lighter";
    const ng = g.createRadialGradient(ixc, iyc, 0, ixc, iyc, pr * 1.1);
    ng.addColorStop(0, `rgba(220,255,230,${0.95 * noche})`); ng.addColorStop(0.5, `rgba(90,230,200,${0.8 * noche})`); ng.addColorStop(1, `rgba(30,130,140,${0.4 * noche})`);
    g.fillStyle = ng; g.beginPath(); g.arc(ixc, iyc, pr, 0, 6.2832); g.fill();
    g.restore();
  }
  // la sombra del párpado de arriba
  const sg = g.createLinearGradient(0, y - 1.1 * R, 0, y + 0.2 * R);
  sg.addColorStop(0, "rgba(5,3,0,0.8)"); sg.addColorStop(0.45, "rgba(5,3,0,0.3)"); sg.addColorStop(1, "rgba(5,3,0,0)");
  g.fillStyle = sg; g.fillRect(x - 1.5 * R, y - 1.5 * R, 3 * R, 1.7 * R);
  // la córnea: lo que se refleja y la ventana
  if (reflejo) { g.save(); g.globalCompositeOperation = "screen"; reflejo(g, ixc, iyc, R); g.restore(); }
  g.save(); g.globalCompositeOperation = "screen";
  const cg = g.createRadialGradient(ixc - 0.35 * R, iyc - 0.45 * R, 0, ixc - 0.35 * R, iyc - 0.45 * R, R * 0.9);
  cg.addColorStop(0, `rgba(255,255,255,${0.3 * luz * cornea})`); cg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = cg; g.fillRect(x - 1.5 * R, y - 1.5 * R, 3 * R, 3 * R);
  g.restore();
  if (luz * cornea > 0.05) {
    const l = luz * cornea;
    g.save(); g.globalCompositeOperation = "screen"; g.filter = `blur(${Math.max(0.5, R * 0.02)}px)`;
    g.fillStyle = `rgba(255,252,240,${0.7 * l})`;
    g.beginPath(); g.arc(ixc, iyc, R * 0.84, 3.6, 4.35); g.arc(ixc, iyc, R * 0.62, 4.35, 3.6, true); g.closePath(); g.fill();
    g.filter = "none";
    g.fillStyle = `rgba(255,255,255,${0.95 * l})`; g.beginPath(); g.ellipse(ixc - 0.32 * R, iyc - 0.48 * R, 0.11 * R, 0.085 * R, -0.5, 0, 6.2832); g.fill();
    g.fillStyle = `rgba(255,255,255,${0.45 * l})`; g.beginPath(); g.arc(ixc + 0.42 * R, iyc + 0.4 * R, 0.04 * R, 0, 6.2832); g.fill();
    g.restore();
  }
  g.restore(); // fin del recorte
  // el párpado que baja
  if (abre < 0.999) {
    g.save();
    almendra(g, x, y, R, lado, 1); g.clip();
    almendra(g, x, y, R, lado, abre, true);
    g.lineTo(x + lado * 1.5 * R, y - 1.7 * R); g.lineTo(x - lado * 1.5 * R, y - 1.7 * R); g.closePath();
    const lg = g.createLinearGradient(0, y - R, 0, y + R);
    lg.addColorStop(0, "#26262c"); lg.addColorStop(1, "#0e0e12");
    g.fillStyle = lg; g.fill();
    g.restore();
    g.lineWidth = R * 0.08; g.strokeStyle = "#050505"; g.lineCap = "round";
    almendra(g, x, y, R, lado, abre, true); g.stroke();
  }
  // el borde negro del ojo, y un brillo húmedo en el párpado de abajo
  g.lineWidth = R * 0.07; g.strokeStyle = "#060606"; g.lineJoin = "round";
  almendra(g, x, y, R, lado, 1); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la cara de tu perro
// De frente. En sus coordenadas, la cabeza mide unos 1000 de ancho y su centro es (0, 0); los ojos, en OJOS, con iris
// de radio RO; la trufa, en NARIZ. El pelo se pinta una vez en un lienzo; encima, cada fotograma, los ojos, la trufa,
// la boca y las orejas.
export const RO = 88;
export const OJOS = [[-185, -75], [185, -75]];
export const NARIZ = [0, 175];
const W = 1600, H = 1700, CX = 800, CY = 860;

function caminoCabeza(c) {
  if (c.beginPath) c.beginPath();
  c.moveTo(0, -430);
  c.bezierCurveTo(-180, -440, -330, -400, -400, -250);
  c.bezierCurveTo(-450, -140, -490, -10, -500, 90);   // la mejilla, con su pelo largo
  c.bezierCurveTo(-500, 200, -400, 260, -270, 300);
  c.bezierCurveTo(-200, 400, -110, 450, 0, 455);
  c.bezierCurveTo(110, 450, 200, 400, 270, 300);
  c.bezierCurveTo(400, 260, 500, 200, 500, 90);
  c.bezierCurveTo(490, -10, 450, -140, 400, -250);
  c.bezierCurveTo(330, -400, 180, -440, 0, -430);
  c.closePath();
}
// El color en cada punto: negro, con la lista blanca que baja por la frente, entre los ojos, y se abre en el hocico.
function blanco(x, y) {
  const ax = Math.abs(x);
  // la lista: estrecha arriba, más ancha entre los ojos
  const ancho = y < -60 ? mez(34, 62, tramo(y, -440, -60)) : mez(62, 140, tramo(y, -60, 40));
  const lista = (1 - tramo(ax, ancho - 10, ancho + 14)) * tramo(y, -460, -400);
  // el hocico blanco: una gota que se abre hacia abajo
  const hoc = 1 - tramo(Math.hypot(x / 0.95, (y - 230) * 1.0), 180, 210);
  const barbilla = y > 300 ? 1 - tramo(ax, 230, 270) : 0;
  return Math.max(lista, hoc, barbilla);
}
const NEGRO = [22, 22, 26], NEGRO_LUZ = [96, 102, 118], BLANCO = [246, 244, 238], BLANCO_SOMBRA = [196, 190, 184];
const CABEZA = (() => {
  const l = lienzo(W, H), c = l.getContext("2d");
  c.translate(CX, CY);
  // la base
  const n = 320, mapa = lienzo(n), mc = mapa.getContext("2d"), img = mc.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = (i / n) * W - CX, y = (j / n) * H - CY, b = blanco(x, y), q = (j * n + i) * 4;
    for (let m = 0; m < 3; m++) img.data[q + m] = mez(NEGRO[m] + 14, BLANCO[m], b);
    img.data[q + 3] = 255;
  }
  mc.putImageData(img, 0, 0);
  caminoCabeza(c); c.save(); c.clip();
  c.drawImage(mapa, -CX, -CY, W, H);
  c.restore();
  // el pelo: trazos que salen del hocico hacia fuera; en el borde, largos (el contorno es de pelo)
  const az = azar(2468);
  c.setTransform(1, 0, 0, 1, CX, CY);
  const P = new Path2D(); caminoCabeza(P);
  c.lineCap = "round";
  for (let i = 0; i < 70000; i++) {
    const x = (az() - 0.5) * 1100, y = -450 + az() * 900;
    if (!c.isPointInPath(P, x + CX, y + CY)) continue;
    const dx = x, dy = y - 150, d = Math.hypot(dx, dy) || 1;
    let ux = dx / d, uy = dy / d;
    if (Math.abs(x) > 300 && y > -150) uy += 0.6; // las mejillas caen
    const u = Math.hypot(ux, uy); ux /= u; uy /= u;
    const borde = k.tramo(Math.abs(x), 380, 500) * k.tramo(y, -250, 100);
    const L = 9 + az() * 15 + borde * 55 + d * 0.025;
    const b = blanco(x, y);
    // el negro brilla azulado arriba a la izquierda (de donde viene la luz)
    const luz = Math.max(0, Math.min(1, 0.55 - (x + y) / 1100)) * (az() < 0.5 ? 1 : 0.4);
    const negro = NEGRO.map((v, j) => v + (NEGRO_LUZ[j] - v) * luz * (0.4 + az() * 0.6));
    const blancoC = BLANCO.map((v, j) => v + (BLANCO_SOMBRA[j] - v) * az() * 0.7);
    const col = negro.map((v, j) => v + (blancoC[j] - v) * b);
    c.strokeStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${0.55 + az() * 0.4})`;
    c.lineWidth = 1.5 + az() * 2.6;
    const bx = (az() - 0.5) * 0.45;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + ux * L * 0.5 - uy * L * bx, y + uy * L * 0.5 + ux * L * bx, x + ux * L, y + uy * L); c.stroke();
  }
  // las cuencas: sombra alrededor de los ojos, y el hueso de la ceja que brilla un poco
  for (const [ex, ey] of OJOS) {
    const sg = c.createRadialGradient(ex, ey, RO * 1.0, ex, ey + 10, RO * 2.0);
    sg.addColorStop(0, "rgba(0,0,0,0.6)"); sg.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = sg; c.beginPath(); c.arc(ex, ey, RO * 2.1, 0, 6.2832); c.fill();
    const cj = c.createRadialGradient(ex - 10, ey - RO * 1.3, 5, ex - 10, ey - RO * 1.3, RO * 1.1);
    cj.addColorStop(0, "rgba(150,160,185,0.22)"); cj.addColorStop(1, "rgba(150,160,185,0)");
    c.fillStyle = cj; c.fillRect(ex - RO * 2, ey - RO * 2.6, RO * 4, RO * 2.4);
  }
  // el volumen: el hocico sale hacia delante (más luz), los lados se van a la sombra
  const antes = lienzo(W, H); antes.getContext("2d").drawImage(l, 0, 0);
  c.save();
  c.globalCompositeOperation = "multiply";
  const sh = c.createLinearGradient(-520, -450, 480, 480);
  sh.addColorStop(0, "rgba(255,255,255,1)"); sh.addColorStop(0.55, "rgba(232,226,222,1)"); sh.addColorStop(1, "rgba(120,110,112,1)");
  c.fillStyle = sh; c.fillRect(-700, -700, 1400, 1400);
  const bo = c.createRadialGradient(0, 60, 380, 0, 60, 640);
  bo.addColorStop(0, "rgba(255,255,255,1)"); bo.addColorStop(1, "rgba(90,90,96,1)");
  c.fillStyle = bo; c.fillRect(-700, -700, 1400, 1400);
  // la sombra que hace el hocico debajo de los ojos, a los lados
  for (const s of [-1, 1]) {
    const hs = c.createRadialGradient(s * 200, 120, 30, s * 200, 120, 160);
    hs.addColorStop(0, "rgba(150,140,140,1)"); hs.addColorStop(1, "rgba(255,255,255,1)");
    c.fillStyle = hs; c.fillRect(s * 200 - 170, -50, 340, 340);
  }
  // el hocico es un cilindro que sale hacia ti: sus lados, en sombra
  const hz = c.createRadialGradient(-30, 200, 60, 0, 230, 230);
  hz.addColorStop(0, "rgba(255,255,255,1)"); hz.addColorStop(0.55, "rgba(240,238,238,1)"); hz.addColorStop(0.82, "rgba(185,180,186,1)"); hz.addColorStop(1, "rgba(255,255,255,1)");
  c.fillStyle = hz; c.fillRect(-300, -60, 600, 560);
  c.globalCompositeOperation = "screen";
  const hl = c.createRadialGradient(-180, -300, 20, -180, -300, 420);
  hl.addColorStop(0, "rgba(170,185,215,0.28)"); hl.addColorStop(1, "rgba(170,185,215,0)");
  c.fillStyle = hl; c.fillRect(-700, -700, 1400, 1400);
  const hh = c.createRadialGradient(-40, 120, 10, -40, 120, 200);
  hh.addColorStop(0, "rgba(255,250,240,0.25)"); hh.addColorStop(1, "rgba(255,250,240,0)");
  c.fillStyle = hh; c.fillRect(-300, -100, 600, 450);
  c.globalCompositeOperation = "destination-in"; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(antes, 0, 0);
  c.restore();
  // los puntos de los bigotes y unos pocos bigotes oscuros
  c.setTransform(1, 0, 0, 1, CX, CY);
  for (const s of [-1, 1]) for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
    c.fillStyle = "rgba(90,80,80,0.5)"; c.beginPath(); c.arc(s * (70 + q * 22 + r * 8), 270 + r * 20 - q * 4, 3.5, 0, 6.2832); c.fill();
  }
  return l;
})();

// El pecho: la gorguera blanca de pelo largo, que cae por debajo de la cabeza; negra por los hombros.
const CXc = 900;
const PECHO = (() => {
  const l = lienzo(1800, 1700), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, CXc, -150);
  const P = new Path2D();
  P.moveTo(-430, 200); P.bezierCurveTo(-640, 500, -820, 1000, -880, 1850); P.lineTo(880, 1850); P.bezierCurveTo(820, 1000, 640, 500, 430, 200); P.closePath();
  const blancoP = (x, y) => 1 - tramo(Math.abs(x) - (y - 300) * 0.12, 300, 380);
  c.fillStyle = "#1a1a1e"; c.fill(P);
  c.save(); c.clip(P);
  const pg = c.createRadialGradient(0, 750, 80, 0, 750, 560); pg.addColorStop(0, "rgba(246,244,238,1)"); pg.addColorStop(0.75, "rgba(236,232,226,1)"); pg.addColorStop(1, "rgba(236,232,226,0)");
  c.fillStyle = pg; c.fillRect(-900, 200, 1800, 1700);
  c.restore();
  const az = azar(1357); c.lineCap = "round";
  for (let i = 0; i < 34000; i++) {
    const x = (az() - 0.5) * 1760, y = 200 + az() * 1600;
    if (!c.isPointInPath(P, x + CXc, y - 150)) continue;
    const b = blancoP(x, y);
    const luz = Math.max(0, 0.5 - x / 1400) * (az() < 0.5 ? 1 : 0.3);
    const negro = NEGRO.map((v, j) => v + (NEGRO_LUZ[j] - v) * luz);
    const blancoC = BLANCO.map((v, j) => v + (BLANCO_SOMBRA[j] - v) * az() * 0.7);
    const col = negro.map((v, j) => v + (blancoC[j] - v) * b);
    // el pelo largo cae en mechones que se abren
    const L = 26 + az() * 44, ux = x / 1000 * 0.5 + Math.sin(y / 60 + x / 90) * 0.2, uy = 1;
    c.strokeStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${0.5 + az() * 0.45})`;
    c.lineWidth = 1.5 + az() * 2.8;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + ux * L * 0.5 + 6, y + L * 0.5, x + ux * L, y + uy * L); c.stroke();
  }
  c.save(); c.clip(P);
  const sh = c.createRadialGradient(0, 360, 200, 0, 360, 620); sh.addColorStop(0, "rgba(0,0,0,0.6)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = sh; c.fillRect(-900, 200, 1800, 900);
  const ld = c.createLinearGradient(-900, 0, 900, 0); ld.addColorStop(0, "rgba(0,0,0,0.35)"); ld.addColorStop(0.3, "rgba(0,0,0,0)"); ld.addColorStop(0.7, "rgba(0,0,0,0)"); ld.addColorStop(1, "rgba(0,0,0,0.55)");
  c.fillStyle = ld; c.fillRect(-900, 200, 1800, 1700);
  c.restore();
  return l;
})();

// Una oreja (la izquierda; la derecha es su espejo), en un lienzo con la base abajo en el centro. Semierguida: el tercio
// de arriba se dobla hacia delante; lo doblado se dibuja aparte (PUNTA) para poder levantarlo.
function pintaOreja(c, forma, sem, n, dentroRosa) {
  forma(); c.fillStyle = "#18181c"; c.fill();
  c.save(); c.clip();
  const az = azar(sem); c.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const x = (az() - 0.5) * 400, y = -az() * 460, L = 12 + az() * 22, luz = Math.max(0, 0.6 - x / 400) * az();
    const col = NEGRO.map((v, j) => v + (NEGRO_LUZ[j] - v) * luz);
    c.strokeStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},0.75)`; c.lineWidth = 1.5 + az() * 2.2;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + (az() - 0.5) * 6, y - L); c.stroke();
  }
  if (dentroRosa) dentroRosa();
  c.restore();
}
const OREJA = (() => {
  const l = lienzo(440, 520), c = l.getContext("2d");
  c.translate(220, 480);
  const forma = () => { c.beginPath(); c.moveTo(-175, 0); c.bezierCurveTo(-170, -120, -120, -230, -60, -300); c.lineTo(110, -300); c.bezierCurveTo(140, -200, 170, -90, 180, 0); c.closePath(); };
  pintaOreja(c, forma, 31, 2600, () => {
    // dentro: un poco de rosa grisáceo con pelo claro, que asoma por delante
    c.beginPath(); c.moveTo(-110, -10); c.bezierCurveTo(-100, -120, -60, -220, -10, -290); c.lineTo(70, -290); c.bezierCurveTo(90, -180, 110, -90, 120, -10); c.closePath();
    const ig = c.createLinearGradient(0, -290, 0, 0); ig.addColorStop(0, "#5a3c3e"); ig.addColorStop(0.6, "#8a6062"); ig.addColorStop(1, "#2a1c1c");
    c.fillStyle = ig; c.fill();
    const az = azar(37); c.lineCap = "round";
    for (let i = 0; i < 220; i++) {
      const x = (az() - 0.5) * 210, y = -az() * 260, L = 30 + az() * 60;
      c.strokeStyle = `rgba(240,236,228,${0.2 + az() * 0.45})`; c.lineWidth = 1 + az() * 1.4;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x * 0.85, y - L * 0.6, x * 0.7 + (az() - 0.5) * 20, y - L); c.stroke();
    }
    const sg = c.createLinearGradient(-130, 0, 130, 0); sg.addColorStop(0, "rgba(0,0,0,0.5)"); sg.addColorStop(0.5, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,0,0.3)");
    c.fillStyle = sg; c.fillRect(-140, -300, 280, 300);
  });
  return l;
})();
// La punta doblada: un triángulo negro, con su base en (0, 0) (el pliegue) y la punta hacia arriba (se dobla girándolo).
const PUNTA = (() => {
  const l = lienzo(300, 260), c = l.getContext("2d");
  c.translate(150, 240);
  const forma = () => { c.beginPath(); c.moveTo(-90, 0); c.bezierCurveTo(-70, -80, -30, -170, 10, -205); c.quadraticCurveTo(25, -210, 30, -190); c.bezierCurveTo(60, -120, 80, -60, 85, 0); c.closePath(); };
  pintaOreja(c, forma, 41, 900, null);
  // el pliegue: más claro arriba (le da la luz)
  c.save(); forma(); c.clip();
  const pg = c.createLinearGradient(0, -210, 0, 0); pg.addColorStop(0, "rgba(140,150,170,0.25)"); pg.addColorStop(1, "rgba(0,0,0,0.3)");
  c.fillStyle = pg; c.fillRect(-100, -220, 200, 230);
  c.restore();
  return l;
})();
const BASE_OREJA = [-275, -350];

// La trufa: negra, húmeda, con sus dos aletas. olfatea: de 0 a 1, las aletas se abren.
function trufa(g, x, y, s, olfatea = 0, luz = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const forma = () => { g.beginPath(); g.moveTo(-100, -40); g.bezierCurveTo(-95, -80, -40, -88, 0, -84); g.bezierCurveTo(40, -88, 95, -80, 100, -40); g.bezierCurveTo(108, 0, 80, 40, 30, 52); g.quadraticCurveTo(0, 62, -30, 52); g.bezierCurveTo(-80, 40, -108, 0, -100, -40); g.closePath(); };
  forma();
  const ng = g.createRadialGradient(-30, -50, 5, 0, 0, 120); ng.addColorStop(0, "#4a4a52"); ng.addColorStop(0.5, "#1e1e22"); ng.addColorStop(1, "#060607");
  g.fillStyle = ng; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.red2, -110, -90, 220, 160); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18 * luz; g.drawImage(k.red, -110, -90, 220, 160); g.restore();
  // las aletas
  for (const sd of [-1, 1]) {
    g.save(); g.translate(sd * 44, 5); g.rotate(sd * 0.35);
    const ab = 1 + 0.35 * olfatea;
    g.beginPath(); g.ellipse(0, 0, 26 * ab, 13 * ab, 0, 0, 6.2832); g.fillStyle = "#020202"; g.fill();
    g.beginPath(); g.moveTo(sd * 24 * ab, -4); g.quadraticCurveTo(sd * 40, 20, sd * 20, 34); g.strokeStyle = "#020202"; g.lineWidth = 6; g.stroke();
    g.restore();
  }
  // la raya del medio
  g.strokeStyle = "rgba(0,0,0,0.8)"; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 20); g.lineTo(0, 58); g.stroke();
  // el brillo húmedo
  g.globalCompositeOperation = "screen";
  g.fillStyle = `rgba(230,240,255,${0.75 * luz})`; g.beginPath(); g.ellipse(-30, -58, 34, 12, -0.15, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(230,240,255,${0.45 * luz})`; g.beginPath(); g.ellipse(36, -56, 20, 8, 0.15, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(230,240,255,${0.3 * luz})`; g.beginPath(); g.ellipse(-60, -10, 8, 18, 0.3, 0, 6.2832); g.fill();
  g.restore();
}
// La boca: cerrada (la raya bajo la trufa y los belfos) o abierta y contenta (contento: de 0 a 1), con la lengua fuera.
function boca(g, t, contento, jadea = 1) {
  const y0 = 255, ab = contento, jad = (Math.sin(t * 11) * 0.5 + 0.5) * jadea;
  const comis = 120 + 30 * ab, ycom = 318 - 34 * ab, ymed = 300;
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  if (ab > 0.02) {
    // la mandíbula baja: la boca, oscura por dentro, entre los belfos
    const fondo = 330 + 150 * ab + 8 * jad * ab;
    const P = () => { g.beginPath(); g.moveTo(-comis * 0.9, ycom); g.quadraticCurveTo(0, ymed + 20, comis * 0.9, ycom);
      g.bezierCurveTo(comis * 0.8, fondo - 40, comis * 0.45, fondo, 0, fondo); g.bezierCurveTo(-comis * 0.45, fondo, -comis * 0.8, fondo - 40, -comis * 0.9, ycom); g.closePath(); };
    P();
    const bg = g.createLinearGradient(0, ymed, 0, fondo); bg.addColorStop(0, "#14040a"); bg.addColorStop(1, "#5a1a22");
    g.fillStyle = bg; g.fill();
    g.save(); P(); g.clip();
    // la lengua: ancha, rosa, con su surco; cuelga más allá de la barbilla y se mueve al jadear
    const lw = 78 * Math.min(1, ab * 1.3), ly = ymed + 30, lh = (fondo - ly) + 120 * ab + 14 * jad * ab;
    g.restore();
    g.save();
    g.beginPath(); g.moveTo(-lw * 0.9, ly); g.bezierCurveTo(-lw * 1.1, ly + lh * 0.55, -lw * 0.85, ly + lh, 0, ly + lh); g.bezierCurveTo(lw * 0.85, ly + lh, lw * 1.1, ly + lh * 0.55, lw * 0.9, ly); g.closePath();
    const lg = g.createLinearGradient(-lw, 0, lw, 0); lg.addColorStop(0, "#b04a56"); lg.addColorStop(0.45, "#f2909a"); lg.addColorStop(1, "#a03c48");
    g.fillStyle = lg; g.fill();
    const ls = g.createLinearGradient(0, ly, 0, ly + 90); ls.addColorStop(0, "rgba(40,0,10,0.7)"); ls.addColorStop(1, "rgba(40,0,10,0)");
    g.fillStyle = ls; g.fill();
    g.strokeStyle = "rgba(130,40,50,0.6)"; g.lineWidth = 5; g.beginPath(); g.moveTo(0, ly + 40); g.lineTo(0, ly + lh * 0.8); g.stroke();
    g.fillStyle = "rgba(255,225,230,0.45)"; g.beginPath(); g.ellipse(-lw * 0.38, ly + lh * 0.62, lw * 0.16, lh * 0.12, 0, 0, 6.2832); g.fill();
    g.restore();
    // la barbilla blanca, a los lados de la lengua
    g.strokeStyle = "rgba(20,14,16,0.85)"; g.lineWidth = 7;
    g.beginPath(); g.moveTo(-comis * 0.9, ycom); g.bezierCurveTo(-comis * 0.8, fondo - 40, -comis * 0.45, fondo, -lw * 0.9, fondo - 6); g.stroke();
    g.beginPath(); g.moveTo(comis * 0.9, ycom); g.bezierCurveTo(comis * 0.8, fondo - 40, comis * 0.45, fondo, lw * 0.9, fondo - 6); g.stroke();
  }
  // la raya de debajo de la trufa y los belfos de arriba
  g.strokeStyle = "rgba(25,18,20,0.9)"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(0, y0); g.lineTo(0, ymed); g.stroke();
  g.lineWidth = 8;
  g.beginPath(); g.moveTo(-comis, ycom - 6); g.bezierCurveTo(-comis * 0.8, ycom + 22, -comis * 0.3, ymed + 26, 0, ymed); g.bezierCurveTo(comis * 0.3, ymed + 26, comis * 0.8, ycom + 22, comis, ycom - 6); g.stroke();
  g.restore();
}

// La cara de tu perro con su centro en (x, y), a escala esc (1: la cabeza mide unos 1000 px de ancho).
//   orejas: [izq, der] de 0 (relajadas) a 1 (tiesas, la punta levantada) · inclina: la cabeza ladeada (radianes) ·
//   contento: la boca abierta con la lengua fuera · olfatea: las aletas de la trufa · los del ojo (pupila, abre, mira,
//   noche, reflejo) · oscuro: de 0 a 1, la cara a oscuras (solo se ven los ojos que brillan).
export function cara(g, t, x, y, esc, { orejas = [0, 0], inclina = 0, contento = 0, olfatea = 0, pupila = 0.3, abre = 1, mira = [0, 0], noche = 0, reflejo = null, oscuro = 0, dentro = null, cornea = 1, brilloCabeza = 0, pecho = true, orejasVuelan = 0 } = {}) {
  g.save();
  g.translate(x, y); g.rotate(inclina); g.scale(esc, esc);
  if (pecho) g.drawImage(PECHO, -CXc, 150);
  // las orejas, detrás de la cabeza
  for (const s of [-1, 1]) {
    const a = orejas[s < 0 ? 0 : 1];
    g.save();
    g.translate(s * Math.abs(BASE_OREJA[0]), BASE_OREJA[1] + 20 * (1 - a));
    g.scale(s < 0 ? 1 : -1, 1);
    g.rotate(mez(-0.42, -0.22, a) + Math.sin(t * 1.7 + s) * 0.01 - orejasVuelan * (0.25 + 0.2 * Math.sin(t * 22 + s)));
    g.drawImage(OREJA, -220, -480);
    // la punta: doblada hacia delante y fuera; tiesa, casi de pie
    g.save(); g.translate(25, -296); g.rotate(mez(3.05, 2.15, a) - orejasVuelan * (0.9 + 0.5 * Math.sin(t * 22 + s + 0.8))); g.scale(1, mez(0.5, 0.8, a));
    g.drawImage(PUNTA, -150, -240);
    g.restore();
    g.restore();
  }
  g.drawImage(CABEZA, -CX, -CY);
  // dentro de la cabeza: una luz cálida que se enciende (el olor que le gusta)
  if (brilloCabeza > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const lat = 1 + 0.12 * Math.sin(t * 7);
    const bg = g.createRadialGradient(0, -250, 20, 0, -250, 460 * lat);
    bg.addColorStop(0, `rgba(255,190,90,${0.85 * brilloCabeza})`); bg.addColorStop(0.45, `rgba(255,130,40,${0.45 * brilloCabeza})`); bg.addColorStop(1, "rgba(255,100,20,0)");
    g.fillStyle = bg; g.beginPath(); g.arc(0, -250, 460 * lat, 0, 6.2832); g.fill();
    g.restore();
  }
  boca(g, t, contento);
  trufa(g, NARIZ[0], NARIZ[1], 1.25, olfatea, 1 - oscuro);
  for (let i = 0; i < 2; i++) {
    const [ex, ey] = OJOS[i];
    ojo(g, ex, ey, RO, i === 0 ? -1 : 1, { pupila, abre, mira, reflejo, luz: 1 - oscuro, dentro: i === 0 ? dentro : null, cornea });
  }
  if (oscuro > 0.01) { g.fillStyle = `rgba(3,5,12,${0.95 * oscuro})`; g.fillRect(-4000, -4000, 8000, 8000); }
  // los ojos que brillan de noche, por encima de la oscuridad
  if (noche > 0.01 || (dentro && oscuro > 0.01)) {
    for (let i = 0; i < 2; i++) {
      const [ex, ey] = OJOS[i];
      ojo(g, ex, ey, RO, i === 0 ? -1 : 1, { pupila, abre, mira, noche, luz: 0.12, dentro: i === 0 ? dentro : null, cornea });
      k.brillo(g, ex + mira[0] * RO, ey + mira[1] * RO, RO * 6, "120,255,220", 0.55 * noche * cornea);
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la cámara que mira a la cara
// esc (la escala), F (el punto de la cara que se mira) y A (dónde cae en pantalla): el centro de la cara en pantalla.
export const ancla = (esc, F, A = [540, 960]) => [A[0] - F[0] * esc, A[1] - F[1] * esc];
// La escala a la que la pupila tapa toda la pantalla, y lo que se ve dentro: un rectángulo fijo en la cara que crece
// con la cámara y llena la pantalla justo a esa escala.
export const ESC_DENTRO = 16;
export const cajaPupila = (px, py) => [px - 540 / ESC_DENTRO, py - 960 / ESC_DENTRO, 1080 / ESC_DENTRO, 1920 / ESC_DENTRO];
export function enPupila(c, px, py, dibujaDentro, vela = 1) {
  dibujaDentro(cajaPupila(px, py));
  if (vela > 0.01) {
    const r = 960 / ESC_DENTRO;
    c.save(); c.translate(px, py); c.scale(0.5625, 1);
    const vg = c.createRadialGradient(0, 0, r * 0.45, 0, 0, r * 1.0);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${vela})`);
    c.fillStyle = vg; c.fillRect(-4 * r, -2 * r, 8 * r, 4 * r);
    c.restore();
  }
}
// El mismo velo, a pantalla entera: lo que se ve dentro de la pupila cuando la cámara ya ha entrado (se quita despacio).
export function velo(g, al) {
  if (al <= 0.01) return;
  g.save(); g.translate(540, 960); g.scale(0.5625, 1);
  const vg = g.createRadialGradient(0, 0, 960 * 0.45, 0, 0, 960);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(-4000, -2000, 8000, 4000);
  g.restore();
}
export const OJO = OJOS[0], CENTRO = [0, 120];

// ---------------------------------------------------------------- detrás de tu perro: el parque, desenfocado
const FONDO_PARQUE = (() => {
  const l = lienzo(1080, 1920), c = l.getContext("2d");
  const bg = c.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#7ab0e0"); bg.addColorStop(0.35, "#bcd8e8"); bg.addColorStop(0.5, "#e8d8a8"); bg.addColorStop(0.62, "#5f9a48"); bg.addColorStop(1, "#2f6a2a");
  c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
  c.globalCompositeOperation = "lighter";
  for (const [x, y, r, col, a] of [[820, 760, 520, "255,220,150", 0.45], [180, 620, 360, "255,240,200", 0.25], [300, 1400, 400, "160,220,100", 0.18], [880, 1500, 300, "200,240,120", 0.15]]) {
    const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = gr; c.fillRect(0, 0, 1080, 1920);
  }
  // los árboles lejanos, como manchas
  c.globalCompositeOperation = "source-over";
  c.filter = "blur(28px)";
  const az = azar(64);
  for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(${40 + az() * 40 | 0},${90 + az() * 50 | 0},${40 + az() * 20 | 0},0.8)`; c.beginPath(); c.arc(az() * 1080, 900 + az() * 260, 90 + az() * 120, 0, 6.2832); c.fill(); }
  c.filter = "none";
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.12; c.drawImage(k.manchas, 0, 0, 1080, 1920);
  return l;
})();
export function fondoParque(g, al = 1) { g.save(); g.globalAlpha *= al; g.drawImage(FONDO_PARQUE, 0, 0); g.restore(); }

// ---------------------------------------------------------------- el olor
// Hilos de olor que van de (x0, y0) a (x1, y1) (la trufa), ondulando; color "r,g,b"; u: de 0 a 1, cuánto han avanzado;
// al: intensidad. Muchas motas que fluyen a lo largo de tres curvas.
export function olor(g, t, x0, y0, x1, y1, color, u, al = 1, ancho = 1) {
  if (al <= 0.01 || u <= 0) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  for (let h = 0; h < 3; h++) {
    const amp = (60 + h * 40) * ancho, fase = h * 2.1;
    const punto = (s) => { const w = Math.sin(s * 7 + fase - t * 3) * amp * Math.sin(s * Math.PI); return [x0 + dx * s + nx * w, y0 + dy * s + ny * w]; };
    // la cinta, suave
    g.strokeStyle = `rgba(${color},${0.16 * al})`; g.lineWidth = 34 * ancho; g.lineCap = "round";
    g.beginPath(); for (let i = 0; i <= 40; i++) { const s = (i / 40) * u, [x, y] = punto(s); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(${color},${0.35 * al})`; g.lineWidth = 8 * ancho; g.stroke();
    // las motas que corren hacia la trufa
    for (let i = 0; i < 14; i++) {
      const s = ((i / 14 + t * 0.7 + h * 0.13) % 1) * u, [x, y] = punto(s);
      k.brillo(g, x, y, 60 * ancho, color, 0.8 * al);
    }
  }
  g.restore();
}
