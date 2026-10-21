// Lo que comparten los planos: el cubo de monedas con sus cinco agujeros, la moneda y sus chorros, y la cámara 2D.
// Todo en coordenadas del mundo (px con zoom 1). Cada fuga tiene su color: lo invisible, en un color.
import * as k from "#kit";

const { azar, lienzo, redondo, tramo: tr, suave: su, mez } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (zoom en log: se acerca con ritmo parejo).
export function camino2D(cl) {
  const Zs = k.claves(cl.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(cl.map(([t, c]) => [t, c[1]])), Y = k.claves(cl.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

// ---------------------------------------------------------------- los colores de las cinco fugas
export const COL = {
  fibra: "120,230,255", subs: "190,140,255", comida: "150,255,100", banco: "255,178,107", luz: "255,110,150",
};
export const FUGAS = ["fibra", "subs", "comida", "banco", "luz"];

// ---------------------------------------------------------------- la moneda
let CARA = null, CANTO = null, BORDE = null;
function sprites() {
  if (CARA) return;
  const N = 192, l = lienzo(N), c = l.getContext("2d"), r = N / 2 - 4;
  const gr = c.createRadialGradient(N / 2 - r * 0.32, N / 2 - r * 0.36, r * 0.08, N / 2, N / 2, r);
  gr.addColorStop(0, "#fff6bd"); gr.addColorStop(0.45, "#ffc93c"); gr.addColorStop(1, "#cf8410");
  c.fillStyle = gr; c.beginPath(); c.arc(N / 2, N / 2, r, 0, 6.2832); c.fill();
  c.strokeStyle = "#a2620c"; c.lineWidth = r * 0.1; c.beginPath(); c.arc(N / 2, N / 2, r * 0.96, 0, 6.2832); c.stroke();
  c.strokeStyle = "rgba(255,246,196,0.85)"; c.lineWidth = r * 0.06; c.beginPath(); c.arc(N / 2, N / 2, r * 0.76, 0, 6.2832); c.stroke();
  c.fillStyle = "#a35e0a"; c.font = `800 ${r * 1.05}px Figtree`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("€", N / 2, N / 2 + r * 0.05);
  c.fillStyle = "rgba(255,255,255,0.55)"; c.font = `800 ${r * 1.05}px Figtree`; c.fillText("€", N / 2 - r * 0.025, N / 2 + r * 0.025);
  CARA = l;
  const e = lienzo(32, 192), d = e.getContext("2d"), eg = d.createLinearGradient(0, 0, 32, 0);
  eg.addColorStop(0, "#ffe27a"); eg.addColorStop(0.5, "#b97410"); eg.addColorStop(1, "#6e3f08");
  d.fillStyle = eg; d.fillRect(0, 0, 32, 192);
  CANTO = e;
  const bo = lienzo(N), bc = bo.getContext("2d"), bg2 = bc.createRadialGradient(N / 2, N / 2, r * 0.2, N / 2, N / 2, r);
  bg2.addColorStop(0, "#b97410"); bg2.addColorStop(1, "#6e3f08");
  bc.fillStyle = bg2; bc.beginPath(); bc.arc(N / 2, N / 2, r, 0, 6.2832); bc.fill();
  BORDE = bo;
}

// Una moneda de radio r en (x, y), girando (ang) alrededor de su eje vertical: de frente enseña el €, de canto es una raya.
export function moneda(g, x, y, r, ang, al = 1) {
  if (al <= 0.003 || r < 0.6) return;
  sprites();
  const c = Math.cos(ang), a = Math.abs(c), s = Math.sin(ang);
  const A = g.globalAlpha;
  if (al < 1) g.globalAlpha = A * al;
  const grueso = r * 0.3 * Math.abs(s); // el canto que se ve, de un lado
  if (a < 0.14) {
    const w = Math.max(r * 0.2, 2.4);
    g.drawImage(CANTO, x - w / 2, y - r, w, 2 * r);
  } else {
    // el canto asoma por el lado contrario al que gira
    if (grueso > 0.8) g.drawImage(BORDE, x - r * a + grueso * Math.sign(c * s) * -1, y - r, r * a * 2, 2 * r);
    g.drawImage(CARA, x - r * a, y - r, r * a * 2, 2 * r);
  }
  if (al < 1) g.globalAlpha = A;
}

// Una moneda plana (de frente), pero con la tinta de un color encima (para las que se pasan a gratis, por ejemplo).
export const monedaQuieta = (g, x, y, r, al = 1) => moneda(g, x, y, r, 0, al);

// ---------------------------------------------------------------- los chorros de monedas
// Un chorro: monedas que salen de (h.x, h.y), vuelan hacia la cámara (crecen) y caen. env(tn): 0..1, cuánto fluye en
// el segundo tn en que se lanza cada moneda (lo que fluye antes de 0 ya estaba fluyendo: el primer fotograma ya está lleno).
export function chorro(g, t, h, o = {}) {
  const { semilla = 1, rate = 13, vida = 1.7, env = () => 1, r0 = 26, centroX = 540, fuerza = 1, color = null, gravedad = 2400, crece = 1.1 } = o;
  const n0 = Math.floor((t - vida) * rate), n1 = Math.floor(t * rate);
  for (let n = n0; n <= n1; n++) {
    const tn = n / rate + (azar(semilla * 977 + n * 31 + 3)() - 0.5) * (0.5 / rate);
    const tt = t - tn;
    if (tt < 0 || tt > vida) continue;
    const az = azar(semilla * 7919 + n * 131 + 7);
    if (az() > env(tn)) continue;
    const dir = Math.sign(h.x - centroX) || (az() > 0.5 ? 1 : -1);
    const vx = (dir * (70 + az() * 260) + (az() - 0.5) * 220) * fuerza;
    const vy = -(60 + az() * 340) * fuerza;
    const x = h.x + vx * tt, y = h.y + vy * tt + 0.5 * gravedad * tt * tt;
    const r = r0 * (0.7 + az() * 0.4) * (1 + crece * tt * (0.8 + az() * 0.6));
    const ang = az() * 6.2832 + tt * (7 + az() * 11);
    if (y > 2900 || y < -800) continue;
    if (color) k.brillo(g, x, y, r * 3.4, color, 0.22 * Math.min(1, (vida - tt) * 2));
    moneda(g, x, y, r, ang);
  }
}

// ---------------------------------------------------------------- el cubo
// Medidas del cubo (la cara de delante): la boca, el fondo y los cinco agujeros.
export const CUBO = {
  cx: 540, boca: 770, rxBoca: 335, ryBoca: 64, fondo: 1560, rxFondo: 255, ryFondo: 48,
  agujeros: [
    { x: 362, y: 1010, col: "fibra" }, { x: 704, y: 955, col: "subs" }, { x: 540, y: 1160, col: "comida" },
    { x: 400, y: 1345, col: "banco" }, { x: 676, y: 1330, col: "luz" },
  ],
};
const semiAncho = (y) => mez(CUBO.rxBoca, CUBO.rxFondo, tr(y, CUBO.boca, CUBO.fondo));

// El montón de monedas de la boca, hecho una vez (posiciones con semilla).
const MONTON = (() => {
  const az = azar(4242), L = [];
  for (let i = 0; i < 190; i++) {
    const u = (az() * 2 - 1), x = CUBO.cx + u * CUBO.rxBoca * 0.9, alto = (1 - u * u) * 150 + az() * 26;
    L.push({ x, y: CUBO.boca - alto + (az() - 0.5) * 40 + 30, r: 34 + az() * 12, ang: az() * 6.2832 });
  }
  L.sort((a, b) => a.y - b.y);
  return L;
})();

function trazoCuerpo(g) {
  const { cx, boca, rxBoca, ryBoca, fondo, rxFondo, ryFondo } = CUBO;
  g.beginPath();
  g.moveTo(cx - rxBoca, boca);
  g.ellipse(cx, boca, rxBoca, ryBoca, 0, Math.PI, 0, true); // el arco de la boca hacia abajo: de izquierda a derecha por delante
  g.lineTo(cx + rxFondo, fondo);
  g.ellipse(cx, fondo, rxFondo, ryFondo, 0, 0, Math.PI, false);
  g.closePath();
}

// El cubo entero, con su montón, sus agujeros y lo que haga falta. o:
//   brillo: 0..1 cuánto se ven los anillos de color de los agujeros (un array de 5, o un número)
//   tapones: array de 5 (0..1) cuánto está puesto cada tapón
//   monton: cuánto sube el montón (0..1.4, 1 = lleno)
export function cubo(g, t, o = {}) {
  const { cx, boca, rxBoca, ryBoca, fondo, rxFondo, ryFondo, agujeros } = CUBO;
  const br = (i) => (Array.isArray(o.brillo) ? o.brillo[i] : (o.brillo ?? 0));
  const tap = (i) => (Array.isArray(o.tapones) ? o.tapones[i] : (o.tapones ?? 0));
  const monton = o.monton ?? 1;
  // sombra en el suelo
  g.save();
  const sg = g.createRadialGradient(cx, fondo + 20, 20, cx, fondo + 20, 420);
  sg.addColorStop(0, "rgba(0,0,0,0.55)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sg; g.save(); g.translate(0, fondo + 20); g.scale(1, 0.2); g.translate(0, -(fondo + 20)); g.fillRect(cx - 440, fondo - 260, 880, 520); g.restore();
  g.restore();

  // el fondo de la boca (interior), oscuro
  g.save();
  g.beginPath(); g.ellipse(cx, boca, rxBoca, ryBoca, 0, 0, 6.2832); g.fillStyle = "#07080c"; g.fill();
  g.strokeStyle = "#5f6e82"; g.lineWidth = 12; g.beginPath(); g.ellipse(cx, boca, rxBoca, ryBoca, 0, Math.PI, 6.2832); g.stroke();
  g.restore();
  // el montón (recortado a la boca y a lo de arriba)
  g.save();
  g.beginPath(); g.rect(-400, -2000, 2000, 2000 + boca); g.clip();
  const altura = (monton - 1) * 110;
  for (const m of MONTON) {
    const yy = m.y - altura * (1 - Math.abs(m.x - cx) / rxBoca * 0.4);
    // las monedas de abajo se ven oscuras (dentro del cubo); las de arriba brillan
    const luz = Math.max(0, Math.min(1, (boca - yy + 40) / 150));
    moneda(g, m.x, yy, m.r, m.ang);
    if (luz < 0.99) { g.fillStyle = `rgba(6,4,2,${0.6 * (1 - luz)})`; g.beginPath(); g.arc(m.x, yy, m.r * 0.96, 0, 6.2832); g.fill(); }
  }
  g.restore();
  if (o.dentro) o.dentro(g); // lo que cae dentro del cubo (se dibuja antes del cuerpo, que lo tapa al entrar)
  // brillo cálido que sube de las monedas
  k.brillo(g, cx, boca - 120, 900, "amarilla", 0.20 * Math.min(1.2, monton));

  // el cuerpo: metal con bandas, cepillado y las dos molduras
  g.save();
  trazoCuerpo(g); g.clip();
  const mg = g.createLinearGradient(cx - rxBoca, 0, cx + rxBoca, 0);
  mg.addColorStop(0, "#3d4a5c"); mg.addColorStop(0.12, "#7f90a6"); mg.addColorStop(0.3, "#d8e2ee"); mg.addColorStop(0.42, "#a9b8ca");
  mg.addColorStop(0.62, "#6c7d93"); mg.addColorStop(0.82, "#9fb0c4"); mg.addColorStop(0.94, "#4c5a6d"); mg.addColorStop(1, "#27303c");
  g.fillStyle = mg; g.fillRect(cx - rxBoca - 20, boca - 80, rxBoca * 2 + 40, fondo - boca + 160);
  // se oscurece hacia abajo y se calienta arriba (la luz de las monedas)
  const vg = g.createLinearGradient(0, boca, 0, fondo + 40);
  vg.addColorStop(0, "rgba(255,196,90,0.28)"); vg.addColorStop(0.28, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,4,8,0.62)");
  g.fillStyle = vg; g.fillRect(cx - rxBoca - 20, boca - 80, rxBoca * 2 + 40, fondo - boca + 160);
  // cepillado fino
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.05;
  g.drawImage(k.manchas, cx - 400, boca - 40, 800, 900);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // vetas verticales finas del metal
  g.globalAlpha = 0.07; g.fillStyle = "#fff";
  for (let x = cx - rxBoca; x < cx + rxBoca; x += 9) g.fillRect(x + ((x * 7) % 5), boca, 1.5, fondo - boca + 80);
  g.globalAlpha = 1;
  // las dos molduras (arcos por delante)
  for (const yb of [905, 1440]) {
    const rx = semiAncho(yb), ry = mez(ryBoca, ryFondo, tr(yb, boca, fondo));
    g.strokeStyle = "rgba(10,14,20,0.55)"; g.lineWidth = 16; g.beginPath(); g.ellipse(cx, yb + 8, rx, ry, 0, 0.02, Math.PI - 0.02); g.stroke();
    g.strokeStyle = "rgba(235,245,255,0.55)"; g.lineWidth = 6; g.beginPath(); g.ellipse(cx, yb - 2, rx, ry, 0, 0.02, Math.PI - 0.02); g.stroke();
  }
  // un reflejo vertical largo
  const rg = g.createLinearGradient(0, boca, 0, fondo);
  rg.addColorStop(0, "rgba(255,255,255,0.5)"); rg.addColorStop(1, "rgba(255,255,255,0.06)");
  g.fillStyle = rg; redondo(g, cx - 212, boca + 70, 26, 700, 13); g.fill();
  g.restore();

  // los agujeros: el hueco oscuro, su aro de color, y el tapón si lo hay
  agujeros.forEach((h, i) => {
    const col = COL[h.col], b = br(i), p = tap(i);
    g.save();
    // el borde del metal de dentro
    g.beginPath(); g.ellipse(h.x, h.y, 54, 43, 0, 0, 6.2832); g.fillStyle = "#04060a"; g.fill();
    g.strokeStyle = "rgba(200,215,235,0.55)"; g.lineWidth = 6; g.beginPath(); g.ellipse(h.x, h.y, 57, 46, 0, 0, 6.2832); g.stroke();
    g.restore();
    if (b > 0.01) {
      k.brillo(g, h.x, h.y, 420, col, 0.7 * b);
      g.save(); g.globalCompositeOperation = "lighter";
      g.strokeStyle = `rgba(${col},${0.95 * b})`; g.lineWidth = 13; g.beginPath(); g.ellipse(h.x, h.y, 63, 51, 0, 0, 6.2832); g.stroke();
      g.restore();
    }
    if (p > 0.01) tapon(g, h.x, h.y, col, p);
  });

  // el borde de la boca por delante (el labio enrollado)
  g.save();
  g.strokeStyle = "rgba(20,26,36,0.8)"; g.lineWidth = 22; g.beginPath(); g.ellipse(cx, boca + 6, rxBoca, ryBoca, 0, 0.01, Math.PI - 0.01); g.stroke();
  const lg = g.createLinearGradient(cx - rxBoca, 0, cx + rxBoca, 0);
  lg.addColorStop(0, "#6c7a8d"); lg.addColorStop(0.3, "#f3f8ff"); lg.addColorStop(0.55, "#aebdd0"); lg.addColorStop(0.85, "#e4edf8"); lg.addColorStop(1, "#5d6a7c");
  g.strokeStyle = lg; g.lineWidth = 14; g.beginPath(); g.ellipse(cx, boca, rxBoca, ryBoca, 0, 0.0, Math.PI); g.stroke();
  g.restore();
}

// Un tapón de goma/metal en (x, y), del color de su fuga. u: 0 (fuera, grande y lejos) → 1 (puesto).
export function tapon(g, x, y, col, u = 1) {
  const e = k.entra(Math.min(1, u)), esc = 1 + (1 - e) * 1.6, al = Math.min(1, u * 4);
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha = (g.globalAlpha ?? 1) * al;
  g.beginPath(); g.ellipse(0, 0, 53, 42, 0, 0, 6.2832);
  const gr = g.createRadialGradient(-14, -14, 4, 0, 0, 56);
  gr.addColorStop(0, `rgb(${col.split(",").map((v) => Math.min(255, +v + 70)).join(",")})`); gr.addColorStop(0.5, `rgb(${col})`); gr.addColorStop(1, `rgb(${col.split(",").map((v) => Math.round(+v * 0.4)).join(",")})`);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.65)"; g.lineWidth = 3; g.beginPath(); g.ellipse(0, -2, 34, 25, 0, Math.PI * 1.05, Math.PI * 1.7); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- el fondo
// Un fondo con profundidad (azul noche con una luz cálida detrás del cubo y unas luces lejanas), en pantalla.
const BOKEH = (() => { const az = azar(77), L = []; for (let i = 0; i < 16; i++) L.push({ x: az() * 1080, y: 200 + az() * 1500, r: 80 + az() * 200, c: ["120,230,255", "190,140,255", "255,178,107", "255,110,150", "150,255,100"][i % 5], a: 0.05 + az() * 0.06 }); return L; })();
export function fondo(g, acento = "255,196,90", fuerza = 1, y = 1000) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050914"); bg.addColorStop(0.55, "#0a1428"); bg.addColorStop(1, "#04070f");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const rg = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); rg.addColorStop(0, `rgba(${b.c},${b.a * fuerza})`); rg.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = rg; g.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2); }
  const wg = g.createRadialGradient(540, y, 20, 540, y, 900);
  wg.addColorStop(0, `rgba(${acento},${0.26 * fuerza})`); wg.addColorStop(0.5, `rgba(${acento},${0.08 * fuerza})`); wg.addColorStop(1, `rgba(${acento},0)`);
  g.fillStyle = wg; g.fillRect(-200, 0, 1480, 1920);
  g.restore();
}

// Un velo oscuro arriba (detrás del subtítulo) para que se lea sobre las monedas.
export function velo(g, al = 0.7) {
  const vg = g.createLinearGradient(0, 120, 0, 620);
  vg.addColorStop(0, "rgba(2,5,12,0)"); vg.addColorStop(0.3, `rgba(2,5,12,${al})`); vg.addColorStop(0.62, `rgba(2,5,12,${al * 0.85})`); vg.addColorStop(1, "rgba(2,5,12,0)");
  g.fillStyle = vg; g.fillRect(0, 120, 1080, 500);
}

// ---------------------------------------------------------------- una pila de monedas de canto (lo que se queda)
// Apoyada en (x, yBase). tiempos: el segundo en que cae cada moneda, de abajo arriba. Cada una llega desde arriba y
// se posa con un bote pequeño. rx: el ancho de cada moneda.
export function pila(g, x, yBase, tiempos, t, rx = 80, grueso = 22) {
  const ry = rx * 0.32;
  for (let i = 0; i < tiempos.length; i++) {
    const u = t - tiempos[i];
    if (u < -0.001) continue;
    const dur = 0.42, f = Math.min(1, Math.max(0, u / dur));
    let dy = f < 1 ? -(1 - f * f) * 700 : 0;
    if (u > dur) { const b = u - dur; dy = -Math.abs(Math.sin(b * 14)) * 12 * Math.exp(-b * 9); }
    const yy = yBase - i * grueso * 0.9 + dy;
    const eg = g.createLinearGradient(x - rx, 0, x + rx, 0);
    eg.addColorStop(0, "#8d550a"); eg.addColorStop(0.35, "#e9a722"); eg.addColorStop(0.6, "#ffd45c"); eg.addColorStop(1, "#8d550a");
    g.fillStyle = eg; g.beginPath(); g.ellipse(x, yy + grueso, rx, ry, 0, 0, Math.PI); g.lineTo(x - rx, yy); g.lineTo(x + rx, yy); g.closePath(); g.fill();
    g.fillStyle = eg; g.fillRect(x - rx, yy, rx * 2, grueso);
    g.beginPath(); g.ellipse(x, yy + grueso, rx, ry, 0, 0, Math.PI); g.fill();
    const tg = g.createRadialGradient(x - rx * 0.3, yy - ry * 0.3, 4, x, yy, rx);
    tg.addColorStop(0, "#fff2a8"); tg.addColorStop(0.6, "#ffc93c"); tg.addColorStop(1, "#d68a12");
    g.fillStyle = tg; g.beginPath(); g.ellipse(x, yy, rx, ry, 0, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(160,98,12,0.8)"; g.lineWidth = 3; g.beginPath(); g.ellipse(x, yy, rx * 0.8, ry * 0.8, 0, 0, 6.2832); g.stroke();
  }
}
