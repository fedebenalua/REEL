// «Un folio mide una décima de milímetro. Pero cada vez que lo doblas, su grosor se duplica: dos capas, cuatro, ocho.»
// Otro sitio: una mesa de madera, de cerca, con la luz cálida de una lámpara. Se entra con un corte en «Un».
// - «Un folio»: el canto del folio tumbado en la mesa, enorme, con sus fibras; la regla de milímetros, de pie a su
//   lado, ya entrando. «mide»: la regla se para; su primera raya, la del milímetro, muy por encima del folio.
// - «una décima»: ese milímetro se parte en diez rayitas, de abajo arriba, y el folio llena justo la primera: «0,1 mm».
// - «Pero cada vez que lo doblas»: la cámara se aleja hasta ver el folio entero y, en «doblas», su mitad derecha se
//   levanta, gira por encima y cae sobre la otra: dos capas. «se duplica»: el taco late.
// - «dos capas»: la cámara se acerca; «cuatro»: otro doblez; «ocho»: otro. Ocho capas, una encima de otra, quietas
//   hasta el corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4);
const T0 = f3.inicio, Tdecima = f3.t("decima"), Tpero = f4.t("pero"), Tdoblas = f4.t("doblas"), Tduplica = f4.t("duplica");
const Tdos = f4.t("dos"), Tcuatro = f4.t("cuatro"), Tocho = f4.t("ocho");
// los tres dobleces: cada uno acaba en su palabra
const DOBLECES = [[Tdoblas - 0.12, Tdoblas + 0.42], [Tcuatro - 0.42, Tcuatro + 0.02], [Tocho - 0.42, Tocho + 0.02]];
export const golpes = DOBLECES.map((d) => d[1]);

// ---------------------------------------------------------------- la cámara (en milímetros)
// s: píxeles por mm; xc: el mm que queda en el centro; la mesa, a la altura yMesa de la pantalla.
const ANCHO = 210, L = -105;
const anchoTras = (n) => ANCHO / Math.pow(2, n);
const centroTras = (n) => L + anchoTras(n) / 2;
const camS = k.curva([[T0, Math.log(860)], [Tdecima, Math.log(900)], [Tpero, Math.log(900)], [Tdoblas - 0.15, Math.log(4.3)], [Tdoblas + 0.5, Math.log(4.3)], [Tduplica, Math.log(9)], [Tcuatro + 0.1, Math.log(16)], [Tocho + 0.1, Math.log(29)], [Tocho + 1, Math.log(30)]], 0, 0);
const camX = k.curva([[T0, 105.3], [Tpero, 105.3], [Tdoblas - 0.15, 0], [Tdoblas + 0.5, centroTras(1) + 18], [Tduplica, centroTras(1)], [Tcuatro + 0.1, centroTras(2)], [Tocho + 0.1, centroTras(3)], [Tocho + 1, centroTras(3)]], 0, 0);
const yMesa = (t) => mez(1380, 1240, su(tr(t, Tpero, Tdoblas)));

// ---------------------------------------------------------------- la habitación
const azH = k.azar(8);
const BOKEH = Array.from({ length: 22 }, () => ({ x: azH() * 1080, y: 200 + azH() * 800, r: 30 + azH() * 90, c: ["255,196,120", "255,170,90", "255,226,170", "120,190,255", "90,220,230"][Math.floor(azH() * 5)], f: azH() * 6 }));
const madera = (() => {
  const l = k.lienzo(1080, 900), c = l.getContext("2d"), a = k.azar(15);
  const gr = c.createLinearGradient(0, 0, 0, 900);
  gr.addColorStop(0, "#c98a52"); gr.addColorStop(0.2, "#a8673a"); gr.addColorStop(1, "#4a2614");
  c.fillStyle = gr; c.fillRect(0, 0, 1080, 900);
  // las vetas, horizontales y algo onduladas
  for (let i = 0; i < 70; i++) {
    const y = a() * 900, al = 0.08 + a() * 0.18, w = 1 + a() * 3;
    c.strokeStyle = `rgba(${a() < 0.5 ? "70,32,12" : "230,170,110"},${al})`; c.lineWidth = w;
    c.beginPath(); c.moveTo(0, y);
    for (let x = 0; x <= 1080; x += 60) c.lineTo(x, y + Math.sin(x * 0.006 + i) * (6 + a() * 10));
    c.stroke();
  }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.3; c.drawImage(k.manchas, 0, 0, 1080, 900);
  return l;
})();

function habitacion(g, t, ym) {
  // la pared del fondo, en penumbra cálida, con la luz de la lámpara arriba a la izquierda
  const wg = g.createLinearGradient(0, 0, 0, ym);
  wg.addColorStop(0, "#1c120e"); wg.addColorStop(0.6, "#3a2418"); wg.addColorStop(1, "#5a3a24");
  g.fillStyle = wg; g.fillRect(0, 0, 1080, ym);
  const lg = g.createRadialGradient(160, 300, 0, 160, 300, 1100);
  lg.addColorStop(0, "rgba(255,200,130,0.5)"); lg.addColorStop(0.4, "rgba(255,170,90,0.16)"); lg.addColorStop(1, "rgba(255,170,90,0)");
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = lg; g.fillRect(0, 0, 1080, ym);
  for (const b of BOKEH) {
    const al = 0.12 + 0.05 * Math.sin(t * 0.7 + b.f), gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    gr.addColorStop(0, `rgba(${b.c},${al})`); gr.addColorStop(0.75, `rgba(${b.c},${al * 0.8})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
  }
  // la luz fría de una ventana, a la derecha
  const vg = g.createRadialGradient(1150, 700, 0, 1150, 700, 900);
  vg.addColorStop(0, "rgba(110,170,255,0.32)"); vg.addColorStop(1, "rgba(110,170,255,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, ym);
  g.restore();
  // la mesa
  g.drawImage(madera, 0, ym, 1080, 1920 - ym + 10);
  const bg = g.createLinearGradient(0, ym, 0, ym + 26);
  bg.addColorStop(0, "rgba(255,214,160,0.55)"); bg.addColorStop(1, "rgba(255,214,160,0)");
  g.fillStyle = bg; g.fillRect(0, ym, 1080, 26);
}

// ---------------------------------------------------------------- el papel
const D = [46, -30];                       // hacia dentro: la cara de arriba del papel, que se ve un poco desde arriba
const fibras = (() => {
  const l = k.lienzo(512, 128), c = l.getContext("2d"), a = k.azar(3);
  c.fillStyle = "#fff"; c.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 500; i++) { c.strokeStyle = `rgba(150,140,130,${0.06 + a() * 0.12})`; c.lineWidth = 0.6 + a(); c.beginPath(); const x = a() * 512, y = a() * 128, an = (a() - 0.5) * 0.6, len = 6 + a() * 30; c.moveTo(x, y); c.lineTo(x + Math.cos(an) * len, y + Math.sin(an) * len); c.stroke(); }
  return l;
})();

// Un taco de m capas de papel: un rectángulo de canto (ancho w px, alto h px) con su cara de arriba, girado `ang`
// alrededor de su esquina (px, py) (la de arriba a la izquierda si no está girado).
function taco(g, px, py, w, h, m, ang, luz = 0) {
  g.save(); g.translate(px, py); g.rotate(ang);
  // en este marco, el canto ocupa [0, w] × [0, h] (y hacia abajo); la cara de arriba, el borde de arriba + D
  const [dx, dy] = [D[0] * Math.cos(-ang) - D[1] * Math.sin(-ang), D[0] * Math.sin(-ang) + D[1] * Math.cos(-ang)];
  // la silueta entera (canto + su copia hacia dentro), en el color de la cara de arriba
  g.beginPath();
  const P = [[0, 0], [w, 0], [w, h], [0, h]], Q = P.map(([x, y]) => [x + dx, y + dy]);
  const todos = [...P, ...Q], cx = todos.reduce((s, p) => s + p[0], 0) / 8, cy = todos.reduce((s, p) => s + p[1], 0) / 8;
  todos.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
  // (la envolvente de un prisma así es el hexágono de sus puntos de fuera: basta con ordenar y quitar los de dentro)
  const env = envolvente(todos);
  env.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  const tg = g.createLinearGradient(0, dy, w, 0);
  tg.addColorStop(0, "#fffaf0"); tg.addColorStop(1, "#efe6d6");
  g.fillStyle = tg; g.fill();
  // el canto: blanco, con la luz por la izquierda, y una raya entre capa y capa
  const cg = g.createLinearGradient(0, 0, w, 0);
  cg.addColorStop(0, "#fffef8"); cg.addColorStop(0.6, "#f6f1e6"); cg.addColorStop(1, "#ddd6ca");
  g.fillStyle = cg; g.fillRect(0, 0, w, h);
  g.save(); g.beginPath(); g.rect(0, 0, w, h); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5;
  for (let x = 0; x < w; x += 512) g.drawImage(fibras, x, 0, 512, Math.max(h, 40));
  g.globalAlpha = 1;
  const capa = h / m;
  g.fillStyle = "rgba(150,130,110,0.85)";
  for (let i = 1; i < m; i++) g.fillRect(0, i * capa - Math.max(0.8, capa * 0.05), w, Math.max(1.4, capa * 0.1));
  g.restore();
  // el borde de luz arriba y la sombra abajo
  g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(0, 0, w, Math.max(1, h * 0.04));
  if (luz > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = luz; g.fillStyle = "rgba(255,210,120,0.5)"; g.fillRect(0, 0, w, h); g.restore(); }
  g.restore();
}
function envolvente(p) {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// ---------------------------------------------------------------- la regla
function regla(g, X, ym, s, al, decimas) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha = al;
  const w = 190, top = -100;
  // plástico transparente con su borde y su reflejo
  k.redondo(g, X, top, w, ym - top + 40, 14);
  g.fillStyle = "rgba(200,230,255,0.16)"; g.fill();
  g.strokeStyle = "rgba(230,245,255,0.6)"; g.lineWidth = 4; g.stroke();
  k.reflejo(g, X + w - 34, top + 40, 12, ym - top - 80, 0.22);
  // las rayas de los milímetros, desde la mesa hacia arriba
  g.fillStyle = "rgba(255,255,255,0.95)"; g.font = "800 64px Figtree"; g.textAlign = "left"; g.textBaseline = "middle";
  for (let mm = 0; mm <= 3; mm++) {
    const y = ym - mm * s;
    if (y < -50) break;
    g.fillRect(X, y - 3, 120, 6);
    g.fillText(`${mm}`, X + 132, y);
  }
  // las décimas del primer milímetro, de abajo arriba
  for (let i = 1; i < 10; i++) {
    const u = tr(decimas, (i - 1) / 9 * 0.7, (i - 1) / 9 * 0.7 + 0.3);
    if (u <= 0) continue;
    const y = ym - (i / 10) * s;
    g.globalAlpha = al * u;
    g.fillRect(X, y - 2, i === 5 ? 80 : 54, 4);
  }
  g.restore();
}

// ---------------------------------------------------------------- cada fotograma
export function dibuja(g, t) {
  const s = Math.exp(camS(t)), xc = camX(t), ym = yMesa(t);
  const X = (mm) => 540 + (mm - xc) * s;
  habitacion(g, t, ym);
  // el grosor de una capa en pantalla: el de verdad cuando se ve; si no, un poco más, para que se vea el papel
  const capa = Math.max(0.1 * s, 18);
  // cuántos dobleces van hechos y cuánto va del que se está haciendo
  let n = 0, u = 0;
  DOBLECES.forEach(([a, b]) => { if (t >= b) n++; else if (t > a) u = tr(t, a, b); });
  const m = Math.pow(2, n), w = anchoTras(n) * s, h = m * capa;
  // el latido de «duplica»
  const late = 0.9 * k.pulso(t, Tduplica + 0.15, 0.25);
  // su sombra sobre la mesa
  const sx = X(L), sw = u > 0 ? w : w;
  const sg = g.createLinearGradient(0, ym, 0, ym + 40);
  sg.addColorStop(0, "rgba(40,16,4,0.5)"); sg.addColorStop(1, "rgba(40,16,4,0)");
  g.fillStyle = sg; g.fillRect(sx - 10, ym, sw + 40, 40);
  if (u > 0) {
    // doblándose: la mitad izquierda se queda; la derecha gira por encima alrededor del centro de arriba
    const mitad = w / 2, ang = -Math.PI * su(u);
    taco(g, sx, ym - h, mitad, h, m, 0);
    // la mitad que gira: su esquina de arriba a la izquierda es el eje; girada π, cae encima de la otra
    taco(g, sx + mitad, ym - h, mitad, h, m, ang, 0.15 * Math.sin(Math.PI * u));
  } else {
    taco(g, sx, ym - h, w, h, m, 0, late);
    if (late > 0.02) k.brillo(g, sx + w / 2, ym - h / 2, w * 1.6, "255,214,140", late * 0.8);
  }
  // la regla: entra desde la derecha al principio y se va al alejarse
  const entraR = entra(tr(t, T0 - 0.1, T0 + 0.5)), dec = tr(t, Tdecima - 0.05, Tdecima + 0.55);
  const alR = 1 - su(tr(t, Tpero, Tpero + 0.45));
  regla(g, mez(1200, X(105) + 70, entraR), ym, s, alR, dec);
  // «0,1 mm», junto al folio, cuando acaban de salir las décimas
  const alP = tr(t, Tdecima + 0.3, Tdecima + 0.5) * alR;
  if (alP > 0) {
    // la primera décima de la regla, encendida a la altura del folio
    const xr = mez(1200, X(105) + 70, entraR);
    g.save(); g.globalAlpha = alP * 0.8; g.globalCompositeOperation = "lighter";
    g.fillStyle = "rgba(255,200,90,0.35)"; g.fillRect(xr, ym - 0.1 * s, 190, 0.1 * s);
    g.fillStyle = "rgba(255,220,140,0.9)"; g.fillRect(X(105) - 40, ym - 0.1 * s - 3, xr - X(105) + 230, 6);
    g.restore();
    k.pastilla(g, 300, ym - 0.1 * s - 200, "0,1", "mm", "255,226,150", alP, 120);
  }
  // cuántas capas lleva: en «dos capas», «cuatro» y «ocho»
  const alC = tr(t, Tduplica, Tduplica + 0.2);
  if (alC > 0) {
    const cuenta = t < Tcuatro ? 2 : t < Tocho ? 4 : 8;
    k.pastilla(g, 540, ym - h - 330, String(cuenta), "capas", "255,226,150", alC, 120);
  }
}
