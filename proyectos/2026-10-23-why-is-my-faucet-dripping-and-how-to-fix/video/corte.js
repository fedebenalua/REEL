// El grifo por dentro: el cuerpo cortado por la mitad, con el vástago, la arandela y el asiento, el agua a presión por
// abajo y el caño de salida a la derecha. Sirve de mesa de trabajo: la tuerca, la llave, el vástago, la arandela nueva.
import * as k from "#kit";
import { camara, CROMO, LATON, ACERO, gradH, gradV, cilV, ruedo, gota, destornillador, llave, tubo } from "./mundo.js";

const { mez, suave: su, tramo: tr, azar } = k;

// ---- la geometría (unidades de mundo, y hacia abajo)
export const G = {
  cuerpoTop: 30, camaraY0: 430, asientoY: 556, huecoR: 50, salidaX: 500,
  vastagoTop: -190, vastagoBot: 450, copaY: 450, arandelaY: 500, arandelaTh: 40, arandelaW: 180, tornilloY: 540,
  tuercaY0: -90, tuercaY1: 30, mc: 0,
  abierto: 90,                 // lo que sube el vástago al abrir
  pico: [510, 548],            // la boca de salida (donde cuelgan las gotas)
};
const hexRad = 150;

// ---------------------------------------------------------------- la arandela (rubber washer)
const RUBI = [232, 64, 46], RUBI_LUZ = [255, 150, 120], VIEJA = [58, 42, 38], VIEJA_LUZ = [96, 76, 68];
const mezA = (a, b, u) => a.map((x, i) => x + (b[i] - x) * u);
const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
// x, y: el centro de la cara de arriba. d: desgaste 0..1. apreta: cuánto la comprime el asiento (0..1)
export function arandela(g, x, y, d = 0, { w = G.arandelaW, th = G.arandelaTh, apreta = 0, nuevaLuz = 1 } = {}) {
  const grosor = th * (1 - 0.34 * d) - 5 * apreta;
  const base = mezA(RUBI, VIEJA, Math.pow(d, 0.8)), luz = mezA(RUBI_LUZ, VIEJA_LUZ, d);
  const y1 = y + grosor, r = Math.min(18, grosor * 0.5);
  g.save();
  // el cuerpo
  g.beginPath(); k.redondo(g, x - w / 2, y, w, grosor, r);
  g.fillStyle = gradV(g, y, y1, [[0, rgb(luz)], [0.35, rgb(base)], [1, rgb(mezA(base, [20, 10, 10], 0.55))]]); g.fill();
  g.save(); g.clip();
  // el brillo del caucho nuevo, que se apaga
  g.fillStyle = `rgba(255,255,255,${0.5 * (1 - d) * nuevaLuz})`; g.fillRect(x - w / 2 + 14, y + 4, w - 28, 6);
  g.fillStyle = `rgba(255,255,255,${0.22 * (1 - d)})`; g.fillRect(x - w / 2 + 10, y + 4, 18, grosor - 8);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28 + 0.4 * d; g.drawImage(k.manchas, x - w / 2, y - 6, w, grosor + 12);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // las grietas del caucho viejo
  if (d > 0.45) {
    const a = su(tr(d, 0.45, 1)), az = azar(31);
    g.strokeStyle = `rgba(14,8,6,${0.85 * a})`; g.lineWidth = 2.6;
    for (let i = 0; i < 9; i++) {
      const cx = x - w / 2 + 14 + az() * (w - 28), ln = (0.4 + az() * 0.5) * grosor * a;
      g.beginPath(); g.moveTo(cx, y1 - 1); g.lineTo(cx + (az() - 0.5) * 12, y1 - ln * 0.55); g.lineTo(cx + (az() - 0.5) * 16, y1 - ln); g.stroke();
    }
  }
  g.restore();
  g.strokeStyle = rgb(mezA(base, [0, 0, 0], 0.6), 0.9); g.lineWidth = 3; g.beginPath(); k.redondo(g, x - w / 2, y, w, grosor, r); g.stroke();
  // las dos muescas de la cara de abajo, donde aprieta el asiento: se marcan al envejecer
  if (d > 0.3) {
    const a = su(tr(d, 0.3, 1));
    g.fillStyle = `rgba(10,6,5,${0.8 * a})`;
    for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(x + sx * 62, y1); g.lineTo(x + sx * 76, y1 - 11 * a); g.lineTo(x + sx * 90, y1); g.closePath(); g.fill(); }
  }
  g.restore();
}

// ---------------------------------------------------------------- el cuerpo, cortado
const SECCION = [[-190, 30], [190, 30], [190, 440], [500, 440], [500, 570], [190, 570], [190, 700], [80, 700], [80, 880], [-80, 880], [-80, 700], [-190, 700]];
export function dibujaCuerpo(g, t, o) {
  const al = o.alCuerpo ?? 1;
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // el latón cortado
  g.beginPath(); SECCION.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  g.fillStyle = gradH(g, -190, 500, [[0, "#8a5a14"], [0.12, "#e0ae45"], [0.3, "#fff0b0"], [0.45, "#d79e2c"], [0.7, "#e6b54e"], [0.85, "#fbe08a"], [1, "#8a5a14"]]); g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28 * al; g.drawImage(k.red, -200, 20, 720, 880); g.restore();
  g.strokeStyle = "rgba(70,40,6,0.9)"; g.lineWidth = 6; g.beginPath(); SECCION.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
  // las cavidades: el hueco del vástago, la cámara de la arandela, la salida y la entrada
  const hueco = (poly) => { g.beginPath(); poly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  const oscuro = gradV(g, 30, 560, [[0, "#1d120b"], [1, "#2e1b10"]]);
  hueco([[-78, 30], [78, 30], [78, 430], [130, 430], [130, 556], [-130, 556], [-130, 430], [-78, 430]]); g.fillStyle = oscuro; g.fill();
  hueco([[130, 460], [500, 460], [500, 530], [130, 530]]); g.fillStyle = oscuro; g.fill();
  // el asiento: el cilindro con su agujero y los dos aros
  g.fillStyle = gradH(g, -130, 130, LATON); g.fillRect(-130, G.asientoY, 260, 60);
  g.fillStyle = gradH(g, -100, -52, LATON); g.fillRect(-100, G.asientoY - 16, 48, 16);
  g.fillStyle = gradH(g, 52, 100, LATON); g.fillRect(52, G.asientoY - 16, 48, 16);
  g.strokeStyle = "rgba(70,40,6,0.8)"; g.lineWidth = 3; g.strokeRect(-100, G.asientoY - 16, 48, 16); g.strokeRect(52, G.asientoY - 16, 48, 16);
  // el agua de la entrada (a presión)
  const ag = g.createLinearGradient(-50, 0, 50, 0);
  ag.addColorStop(0, "#1a78d6"); ag.addColorStop(0.35, "#6fcdfb"); ag.addColorStop(0.7, "#2f95ec"); ag.addColorStop(1, "#115dc0");
  g.fillStyle = ag; g.fillRect(-50, G.asientoY, 100, 880 - G.asientoY);
  g.save(); g.beginPath(); g.rect(-50, G.asientoY, 100, 880 - G.asientoY); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 4; g.lineCap = "round";
  for (let i = 0; i < 6; i++) { const f = ((t * 0.9 + i / 6) % 1), yy = 880 - f * (880 - G.asientoY); g.beginPath(); g.moveTo(-26 + (i % 3) * 22, yy); g.lineTo(-26 + (i % 3) * 22, yy - 50); g.stroke(); }
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el agua que sale por la boca
// flujo: 0..1 lo que corre por la salida. gotas: tiempos en que cae una gota.
export function dibujaSalida(g, t, o) {
  const f = o.flujo ?? 0, al = o.alCuerpo ?? 1;
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // el agua en la cámara y en la salida
  if (f > 0.01) {
    const h = 6 + 56 * Math.min(1, f);
    g.save();
    g.beginPath(); g.rect(130, 460, 370, 70); g.clip();
    g.fillStyle = gradV(g, 495 - h / 2, 495 + h / 2, [[0, "rgba(150,226,255,0.95)"], [1, "rgba(34,126,226,0.95)"]]); g.fillRect(130, 495 - h / 2 + 8, 370, h);
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 3;
    for (let i = 0; i < 6; i++) { const q = (t * (0.9 + f) + i / 6) % 1; g.beginPath(); g.moveTo(130 + q * 370, 492 + (i % 3) * 6); g.lineTo(130 + q * 370 + 28, 492 + (i % 3) * 6); g.stroke(); }
    g.restore();
    // la cámara
    g.save(); g.beginPath(); g.rect(-130, 430, 260, 126); g.clip();
    g.fillStyle = `rgba(60,160,240,${0.85 * Math.min(1, f * 1.4)})`; g.fillRect(-130, o.vastagoBot ?? 500, 260, 70); g.restore();
  }
  // la gota que cuelga de la boca y las que caen
  for (const [i, it] of (o.gotasSalida || []).entries()) {
    const [Tr, cr] = Array.isArray(it) ? it : [it, 0.8];
    if (t < Tr - cr) continue;
    const [bx, by] = G.pico;
    const u = tr(t, Tr - cr, Tr);
    if (t < Tr) {
      const r = 30 * (0.2 + 0.8 * su(u)), est = 1 + 0.3 * tr(u, 0.8, 1);
      gota(g, bx - 22, by + r * 1.1 * est, r, 1, est);
    } else {
      const tau = t - Tr, y = by + 36 + 0.5 * 4200 * tau * tau;
      if (y < 1700) gota(g, bx - 22, y, 26, 1, 1 + Math.min(0.5, tau * 0.8));
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la tuerca hexagonal, vista de lado
export function tuerca(g, y0, y1, ang, al = 1, resalta = 0) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const R = hexRad, vs = [];
  for (let i = 0; i < 6; i++) { const a = ang + (i * Math.PI) / 3; if (Math.cos(a) >= -0.0001) vs.push({ a, x: R * Math.sin(a) }); }
  vs.sort((p, q) => p.x - q.x);
  for (let i = 0; i < vs.length - 1; i++) {
    const A = vs[i], B = vs[i + 1], n = (A.a + B.a) / 2, luz = Math.max(0, Math.cos(n + 0.9)), c = 120 + 130 * luz;
    g.fillStyle = gradV(g, y0, y1, [[0, `rgb(${c + 14 | 0},${c + 20 | 0},${c + 28 | 0})`], [0.5, `rgb(${c * 0.78 | 0},${c * 0.85 | 0},${c * 0.92 | 0})`], [1, `rgb(${c * 0.5 | 0},${c * 0.56 | 0},${c * 0.62 | 0})`]]);
    g.fillRect(A.x, y0, B.x - A.x + 0.6, y1 - y0);
    g.strokeStyle = "rgba(20,30,40,0.55)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(B.x, y0); g.lineTo(B.x, y1); g.stroke();
  }
  const xl = vs[0].x, xr = vs[vs.length - 1].x;
  g.strokeStyle = "rgba(20,30,40,0.7)"; g.lineWidth = 4; g.strokeRect(xl, y0, xr - xl, y1 - y0);
  g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(xl + 3, y0 + 3, xr - xl - 6, 5);
  if (resalta > 0.01) k.brillo(g, 0, (y0 + y1) / 2, 520, "255,236,160", resalta * 0.7);
  g.restore();
}

// ---------------------------------------------------------------- la maneta de cuatro brazos (desde el vástago)
export function maneta(g, dy, giro, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(0, dy);
  const wp = 380 * Math.abs(Math.cos(giro)) + 96 * Math.abs(Math.sin(giro));
  ruedo(g, -64, -270, 128, 90, 22, CROMO);
  g.beginPath(); k.redondo(g, -wp / 2, -330, wp, 70, 30); g.fillStyle = gradH(g, -wp / 2, wp / 2, CROMO); g.fill();
  g.strokeStyle = "rgba(25,35,45,0.55)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(-wp / 2 + 30, -322, wp - 60, 7);
  g.beginPath(); k.redondo(g, -54, -376, 108, 56, 22); g.fillStyle = gradH(g, -54, 54, CROMO); g.fill(); g.strokeStyle = "rgba(25,35,45,0.5)"; g.lineWidth = 3; g.stroke();
  const cg = g.createRadialGradient(-12, -372, 4, 0, -366, 40); cg.addColorStop(0, "#ff9a86"); cg.addColorStop(0.5, "#e93a2a"); cg.addColorStop(1, "#8e1410");
  g.fillStyle = cg; g.beginPath(); g.ellipse(0, -378, 38, 20, 0, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-14, -386, 12, 5, -0.3, 0, 6.2832); g.fill();
  g.restore();
}

// la arandela con su tornillo, en su sitio (dy: cuánto se aparta hacia abajo)
export function conjuntoArandela(g, dy, d, { apreta = 0, tn = {}, nuevaLuz = 1 } = {}) {
  const ay = G.arandelaY + dy;
  if ((tn.al ?? 1) > 0.01) {
    const ty = G.arandelaY + 22 + dy + (tn.dy ?? 0);
    g.save(); g.globalAlpha *= tn.al ?? 1;
    g.fillStyle = gradH(g, -10, 10, LATON); g.fillRect(-10, ty - 30, 20, 70);
    g.beginPath(); k.redondo(g, -26, ty + 18, 52, 18, 8); g.fillStyle = gradH(g, -26, 26, LATON); g.fill(); g.strokeStyle = "#6a430c"; g.lineWidth = 3; g.stroke();
    g.fillStyle = "#3a2505"; g.fillRect(-15 + Math.sin((tn.gira ?? 0) * 6) * 3, ty + 24, 30 - Math.abs(Math.sin((tn.gira ?? 0) * 6)) * 3, 4);
    g.restore();
  }
  arandela(g, 0, ay + 4 * apreta, d, { apreta, nuevaLuz });
}

// ---------------------------------------------------------------- el vástago con su copa, su arandela y su tornillo
// dy: cuánto sube todo. o: { desgaste, apreta, arandelaAl, tornillo:{dy, al, gira}, arandela:{dy}, vieja:{dx,dy,rot,al} }
export function dibujaVastago(g, t, dy, o = {}) {
  g.save(); g.translate(0, dy);
  // el eje roscado
  const top = G.vastagoTop, bot = G.copaY;
  g.fillStyle = gradH(g, -70, 70, ACERO); g.fillRect(-70, 30, 140, bot - 30);
  g.fillStyle = gradH(g, -34, 34, ACERO); g.fillRect(-34, top, 68, 30 - top + 2);
  g.strokeStyle = "rgba(30,40,50,0.55)"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-28 + i * 7, top); g.lineTo(-28 + i * 7, 30); g.stroke(); }
  // la rosca
  g.strokeStyle = "rgba(20,30,40,0.6)"; g.lineWidth = 5; g.lineCap = "round";
  for (let y = 70; y < bot - 20; y += 22) { g.beginPath(); g.moveTo(-70, y + 12); g.lineTo(70, y - 8); g.stroke(); }
  g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 2.5;
  for (let y = 70; y < bot - 20; y += 22) { g.beginPath(); g.moveTo(-70, y + 8); g.lineTo(70, y - 12); g.stroke(); }
  // la copa de latón
  g.beginPath(); k.redondo(g, -100, bot, 200, 50, 14); g.fillStyle = gradH(g, -100, 100, LATON); g.fill();
  g.strokeStyle = "rgba(80,48,8,0.9)"; g.lineWidth = 4; g.stroke();
  // la arandela y su tornillo
  if ((o.arandelaAl ?? 1) > 0.01) {
    g.save(); g.globalAlpha *= o.arandelaAl ?? 1;
    conjuntoArandela(g, (o.arandela ?? {}).dy ?? 0, o.desgaste ?? 0, { apreta: o.apreta ?? 0, tn: o.tornillo ?? {} });
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- las flechas de la presión
export function flechasPresion(g, t, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  for (const x of [-30, 0, 30]) {
    const f = (t * 1.6 + x / 120) % 1, y = G.asientoY + 150 - 60 * (0.5 - 0.5 * Math.cos(f * 6.2832));
    g.fillStyle = "rgba(235,250,255,0.95)"; g.strokeStyle = "rgba(20,100,200,0.9)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x, y - 52); g.lineTo(x + 20, y - 18); g.lineTo(x + 8, y - 18); g.lineTo(x + 8, y + 24); g.lineTo(x - 8, y + 24); g.lineTo(x - 8, y - 18); g.lineTo(x - 20, y - 18); g.closePath(); g.fill(); g.stroke();
  }
  k.brillo(g, 0, G.asientoY - 8, 300, "120,220,255", 0.5 * al);
  g.restore();
}

// ---------------------------------------------------------------- el fondo del taller
export function fondoTaller(g, t) {
  g.fillStyle = gradV(g, -900, 1400, [[0, "#12384a"], [0.5, "#0e2a3a"], [1, "#071622"]]); g.fillRect(-1600, -1200, 3200, 2800);
  k.brillo(g, -300, -200, 1800, "140,220,240", 0.18);
  k.brillo(g, 400, 600, 1400, "255,220,150", 0.08);
}

// la escena de corte completa. o: ver arriba
export function dibujaCorte(g, t, o) {
  g.fillStyle = "#06141e"; g.fillRect(0, 0, 1080, 1920);
  g.save(); camara(g, o.cam);
  fondoTaller(g, t);
  dibujaCuerpo(g, t, o);
  if (o.antesVastago) o.antesVastago(g, t);
  dibujaSalida(g, t, o);
  const vy = o.vastagoDy ?? 0;
  if ((o.alVastago ?? 1) > 0.01) { g.save(); g.globalAlpha *= o.alVastago ?? 1; dibujaVastago(g, t, vy, o); g.restore(); }
  if (o.presion) flechasPresion(g, t, o.presion);
  if (o.llave) llave(g, o.llave.x, o.llave.y ?? -30, o.llave.ext ?? 1, o.llave.esc ?? 1, o.llave.al ?? 1);
  if (o.tuerca) tuerca(g, G.tuercaY0 + (o.tuerca.dy ?? 0), G.tuercaY1 + (o.tuerca.dy ?? 0), o.tuerca.ang ?? 0, o.tuerca.al ?? 1, o.tuerca.resalta ?? 0);
  if (o.maneta) maneta(g, o.maneta.dy ?? 0, o.maneta.giro ?? 0, o.maneta.al ?? 1);
  if (o.despues) o.despues(g, t);
  g.restore();
}

// ---------------------------------------------------------------- la arandela como anillo, en perspectiva (para el plano grande)
const lienzoDisco = k.lienzo(900, 700);
export function arandelaDisco(g, cx, cy, rx, ry, th, d = 0) {
  const c = lienzoDisco.getContext("2d");
  c.clearRect(0, 0, 900, 700);
  const x = 450, y = 330, base = mezA(RUBI, VIEJA, d), luz = mezA(RUBI_LUZ, VIEJA_LUZ, d);
  const elip = (yy, rxx, ryy) => { c.beginPath(); c.ellipse(x, yy, rxx, ryy, 0, 0, 6.2832); };
  // el canto: dos elipses y lo de en medio
  elip(y + th, rx, ry); c.fillStyle = rgb(mezA(base, [0, 0, 0], 0.55)); c.fill();
  c.fillStyle = gradH(c, x - rx, x + rx, [[0, rgb(mezA(base, [0, 0, 0], 0.45))], [0.35, rgb(mezA(base, luz, 0.3))], [0.7, rgb(mezA(base, [0, 0, 0], 0.4))], [1, rgb(mezA(base, [0, 0, 0], 0.65))]]);
  c.fillRect(x - rx, y, 2 * rx, th);
  elip(y + th, rx, ry); c.fillStyle = gradH(c, x - rx, x + rx, [[0, rgb(mezA(base, [0, 0, 0], 0.5))], [0.4, rgb(mezA(base, luz, 0.15))], [1, rgb(mezA(base, [0, 0, 0], 0.65))]]);
  c.save(); c.globalCompositeOperation = "destination-over"; c.fill(); c.restore();
  // la cara de arriba
  elip(y, rx, ry);
  const gr = c.createRadialGradient(x - rx * 0.35, y - ry * 0.35, rx * 0.1, x, y, rx * 1.05);
  gr.addColorStop(0, rgb(luz)); gr.addColorStop(0.55, rgb(base)); gr.addColorStop(1, rgb(mezA(base, [0, 0, 0], 0.4)));
  c.fillStyle = gr; c.fill();
  c.strokeStyle = "rgba(255,230,210,0.5)"; c.lineWidth = 4; c.stroke();
  // el agujero
  c.globalCompositeOperation = "destination-out"; elip(y, rx * 0.36, ry * 0.36); c.fill();
  elip(y + th, rx * 0.36, ry * 0.36); c.fill();
  c.fillRect(x - rx * 0.36, y, rx * 0.72, th);
  c.globalCompositeOperation = "source-over";
  // el borde interior del agujero y un brillo
  c.strokeStyle = rgb(mezA(base, [0, 0, 0], 0.6)); c.lineWidth = 5; elip(y, rx * 0.36, ry * 0.36); c.stroke();
  c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.ellipse(x - rx * 0.5, y - ry * 0.42, rx * 0.22, ry * 0.07, -0.2, 0, 6.2832); c.fill();
  g.drawImage(lienzoDisco, cx - 450, cy - 330);
}
