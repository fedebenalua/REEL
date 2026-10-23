// La cocina de perfil: el grifo de cuello de cisne, su maneta a un lado, la encimera y el fregadero cortado por la
// mitad con su desagüe. Una sola función que dibuja todo lo que pasa aquí, según el estado que le pasen los planos.
import * as k from "#kit";
import { camara, CROMO, LATON, ACERO, PORCELANA, gradH, gradV, cilV, cilH, tubo, ruedo, gota, salpica, chorro, destornillador, pared } from "./mundo.js";

const { mez, suave: su, tramo: tr } = k;

export const TIPX = 180, TIPY = 214, SUELO = 920, DRENX = 180, MANX = -520, MANY = 420;
export const R_GOTA = 56;
const G = 4200; // px/s²: caída de la gota

// el cuello de cisne: de la base sube, se curva por arriba y baja hasta la punta
const PICO = (() => {
  const p = [[-260, 420], [-260, 10]];
  for (let i = 0; i <= 28; i++) { const th = Math.PI * (1 - i / 28); p.push([-40 + 220 * Math.cos(th), 10 - 230 * Math.sin(th)]); }
  p.push([TIPX, 160]);
  return p;
})();

// ---- las gotas
// Una gota que se forma colgando de la punta y cae en Trel; devuelve dónde está y si cae en el agua
export function estadoGota(t, Trel, crece = 0.85) {
  if (t < Trel - crece) return null;
  const u = tr(t, Trel - crece, Trel);
  if (u < 1 || t === Trel) {
    const r = R_GOTA * (0.18 + 0.82 * Math.pow(su(u), 0.8)), est = 1 + 0.35 * Math.pow(tr(u, 0.85, 1), 1.5);
    return { colgando: true, r, est, y: TIPY + r * 1.15 * est, x: TIPX };
  }
  const tau = t - Trel, y0 = TIPY + R_GOTA * 1.5, y = y0 + 0.5 * G * tau * tau, yf = SUELO - 24;
  if (y < yf) return { colgando: false, r: R_GOTA * 0.86, est: 1 + Math.min(0.5, tau * 0.8), y, x: TIPX };
  const taui = Math.sqrt((2 * (yf - y0)) / G);
  return { choque: Trel + taui };
}
export function dibujaGotas(g, t, lista, esc = 1) {
  for (const [i, it] of lista.entries()) {
    const [Tr, cr] = Array.isArray(it) ? it : [it, 0.85];
    const e = estadoGota(t, Tr, cr);
    if (!e) continue;
    if (e.choque !== undefined) { salpica(g, TIPX, SUELO - 6, t - e.choque, 0.9, 3 + i, 130); continue; }
    gota(g, e.x, e.y, e.r, 1, e.est);
  }
}

// ---- la maneta (la válvula de la izquierda). o: { rot, sube, tapa:{dx,dy,rot,al}, tornillo:{dy,al,gira}, maneta:{dy,dx,rot,al}, vastago:bool }
export function dibujaManeta(g, t, o = {}) {
  const X = MANX, Y = MANY;
  // la brida y el cuello
  ruedo(g, X - 92, Y - 44, 184, 48, 14, CROMO);
  cilV(g, X, Y - 150, Y - 40, 96, CROMO);
  ruedo(g, X - 70, Y - 178, 140, 40, 12, CROMO);
  // el vástago de acero, si la maneta ya no está
  if (o.vastago) {
    const sy = o.vastagoY ?? 0;
    cilV(g, X, Y - 332 + sy, Y - 176, 56, ACERO);
    g.strokeStyle = "rgba(40,50,60,0.55)"; g.lineWidth = 3;
    for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(X - 28 + i * 7, Y - 330 + sy); g.lineTo(X - 28 + i * 7, Y - 180); g.stroke(); }
    g.fillStyle = gradH(g, X - 30, X + 30, ACERO); g.beginPath(); g.ellipse(X, Y - 332 + sy, 28, 7, 0, 0, 6.2832); g.fill();
  }
  const m = o.maneta ?? {};
  if ((m.al ?? 1) > 0.01) {
    g.save(); g.globalAlpha *= m.al ?? 1;
    const dy = (m.dy ?? 0) - (o.sube ?? 0), dx = m.dx ?? 0, rot = m.rot ?? o.rot ?? 0;
    g.translate(X + dx, Y + dy); if (m.giro) g.rotate(m.giro);
    // el cubo y el plato de cuatro brazos (visto de lado, se achata al girar)
    const wp = 270 * Math.abs(Math.cos(rot)) + 74 * Math.abs(Math.sin(rot));
    ruedo(g, -56, -230, 112, 56, 18, CROMO);
    g.beginPath(); k.redondo(g, -wp / 2, -268, wp, 64, 28); g.fillStyle = gradH(g, -wp / 2, wp / 2, CROMO); g.fill();
    g.strokeStyle = "rgba(25,35,45,0.55)"; g.lineWidth = 3; g.stroke();
    g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(-wp / 2 + 26, -262, wp - 52, 7);
    // el hueco de arriba y lo que lleva
    g.beginPath(); k.redondo(g, -50, -312, 100, 54, 22); g.fillStyle = gradH(g, -50, 50, CROMO); g.fill();
    g.strokeStyle = "rgba(25,35,45,0.5)"; g.lineWidth = 3; g.stroke();
    g.fillStyle = "#171d24"; g.beginPath(); g.ellipse(0, -312, 40, 9, 0, 0, 6.2832); g.fill();
    // el tornillo en su hueco
    const tn = o.tornillo ?? { dy: 0, al: 0 };
    if ((tn.al ?? 0) > 0.01) {
      g.save(); g.globalAlpha *= tn.al;
      const ty = -316 + (tn.dy ?? 0);
      g.fillStyle = gradH(g, -22, 22, LATON); g.fillRect(-9, ty, 18, 70);
      g.beginPath(); k.redondo(g, -26, ty - 22, 52, 26, 10); g.fillStyle = gradH(g, -26, 26, LATON); g.fill();
      g.strokeStyle = "#6a430c"; g.lineWidth = 3; g.stroke();
      g.fillStyle = "#3a2505"; g.fillRect(-14, ty - 12, 28, 4);
      g.restore();
    }
    // la tapa roja
    const tp = o.tapa ?? { dy: 0, al: 1 };
    if ((tp.al ?? 1) > 0.01) {
      g.save(); g.globalAlpha *= tp.al ?? 1; g.translate(tp.dx ?? 0, (tp.dy ?? 0) - 322); g.rotate(tp.rot ?? 0);
      const cg = g.createRadialGradient(-12, -10, 4, 0, 0, 40); cg.addColorStop(0, "#ff9a86"); cg.addColorStop(0.5, "#e93a2a"); cg.addColorStop(1, "#8e1410");
      g.fillStyle = cg; g.beginPath(); g.ellipse(0, 0, 38, 22, 0, 0, 6.2832); g.fill();
      g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-14, -8, 12, 5, -0.3, 0, 6.2832); g.fill();
      g.restore();
    }
    g.restore();
  }
}

export function dibujaGrifo(g, t, o = {}) {
  // el cuello de cisne con su sombra sobre los azulejos
  g.save(); g.translate(26, 20); g.globalAlpha *= 0.28; tubo(g, PICO, 82, ["#02202a", "#02202a", "#02202a"]); g.restore();
  tubo(g, PICO, 82);
  // la brida de la base
  ruedo(g, -332, 372, 144, 52, 14, CROMO);
  ruedo(g, -306, 346, 92, 36, 10, CROMO);
  // el aireador de la punta
  cilV(g, TIPX, TIPY - 66, TIPY, 100, CROMO);
  g.strokeStyle = "rgba(25,35,45,0.5)"; g.lineWidth = 3;
  for (const dy of [-44, -22]) { g.beginPath(); g.moveTo(TIPX - 50, TIPY + dy); g.lineTo(TIPX + 50, TIPY + dy); g.stroke(); }
  g.fillStyle = gradV(g, TIPY - 3, TIPY + 8, [[0, "#6c7a87"], [1, "#2d3640"]]); g.fillRect(TIPX - 50, TIPY - 2, 100, 10);
}

// ---- el fregadero y el mueble
function fondoCocina(g, t, c) {
  // la pared de azulejos hasta la encimera
  pared(g, -2400, -1900, 2400, 420);
  // la luz de la ventana, de arriba a la izquierda
  k.brillo(g, -1000, -500, 2600, "255,236,180", 0.5);
  k.brillo(g, 500, 100, 1200, "190,255,240", 0.12);
  // la encimera, de mármol, a la izquierda y a la derecha del fregadero
  const losa = (x0, x1) => {
    g.fillStyle = gradV(g, 420, 512, [[0, "#fbfaf6"], [0.12, "#ece8df"], [1, "#a8a396"]]); g.fillRect(x0, 420, x1 - x0, 92);
    g.save(); g.beginPath(); g.rect(x0, 420, x1 - x0, 92); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, x0, 400, x1 - x0, 130); g.restore();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(x0, 420, x1 - x0, 10);
    g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(x0, 506, x1 - x0, 6);
  };
  losa(-2400, -152); losa(508, 2400);
  // el mueble de debajo, en madera oscura
  const mueble = (x0, x1) => {
    g.fillStyle = gradH(g, x0, x1, [[0, "#4a2a18"], [0.5, "#6a3d22"], [1, "#4a2a18"]]); g.fillRect(x0, 512, x1 - x0, 1500);
    g.save(); g.beginPath(); g.rect(x0, 512, x1 - x0, 1500); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.red, x0, 512, x1 - x0, 1500); g.restore();
    g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(x0, 512, x1 - x0, 60);
  };
  mueble(-2400, -152); mueble(508, 2400);
  // el hueco bajo el fregadero, oscuro
  g.fillStyle = gradV(g, 512, 1700, [[0, "#1a0f0a"], [1, "#0d0705"]]); g.fillRect(-152, 512, 660, 1500);
}

function fregadero(g, t, o) {
  const pool = o.nivel ?? 22;
  // el interior (la pared del fondo), en porcelana
  g.save();
  g.beginPath(); g.moveTo(-96, 420); g.lineTo(456, 420); g.lineTo(320, SUELO + 8); g.lineTo(40, SUELO + 8); g.closePath(); g.clip();
  g.fillStyle = gradV(g, 420, SUELO, [[0, "#f4f9fc"], [0.35, "#d6e3ec"], [1, "#9fb6c7"]]); g.fillRect(-100, 420, 570, 700);
  g.fillStyle = gradH(g, -96, 456, [[0, "rgba(40,80,110,0.28)"], [0.2, "rgba(255,255,255,0)"], [0.75, "rgba(255,255,255,0)"], [1, "rgba(40,80,110,0.3)"]]); g.fillRect(-100, 420, 570, 700);
  // la sombra del grifo en el fondo del fregadero
  g.fillStyle = "rgba(20,60,90,0.18)"; g.beginPath(); g.ellipse(180, 640, 140, 40, 0, 0, 6.2832); g.fill();
  // el agua del fondo
  if (pool > 0) {
    const wy = SUELO - pool;
    g.fillStyle = gradV(g, wy, SUELO + 8, [[0, "rgba(130,214,255,0.85)"], [1, "rgba(30,120,214,0.9)"]]); g.fillRect(30, wy, 300, pool + 10);
    g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(30, wy, 300, 3);
  }
  g.restore();
  // las paredes cortadas (a izquierda y derecha) y el fondo, en porcelana con su canto
  const B = SUELO + 62;
  const pared1 = [[-150, 420], [-96, 420], [40, SUELO + 8], [40, B], [-150, B]];
  const pared2 = [[456, 420], [510, 420], [510, B], [320, B], [320, SUELO + 8]];
  const suelo = [[40, SUELO + 8], [320, SUELO + 8], [320, B], [40, B]];
  for (const poly of [pared1, pared2, suelo]) {
    g.beginPath(); poly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
    g.fillStyle = gradH(g, -150, 510, PORCELANA); g.fill();
    g.strokeStyle = "rgba(60,90,120,0.55)"; g.lineWidth = 5; g.stroke();
  }
  // el reborde brillante
  g.fillStyle = "rgba(255,255,255,0.95)"; g.fillRect(-150, 416, 58, 8); g.fillRect(452, 416, 58, 8);
  // el desagüe: el agujero, el aro cromado y el tubo de abajo
  g.fillStyle = "#06090d"; g.fillRect(DRENX - 52, SUELO + 8, 104, 56);
  cilV(g, DRENX, B, 1500, 96, [[0, "#2a3138"], [0.3, "#59646e"], [0.5, "#8d99a4"], [0.8, "#3b444d"], [1, "#1e252b"]]);
  ruedo(g, DRENX - 76, SUELO - 8, 152, 24, 8, CROMO);
  g.fillStyle = "#06090d"; g.fillRect(DRENX - 44, SUELO - 6, 88, 6);
}

// el tapón de goma: baja desde arriba y encaja. dy: lo que le falta para encajar (0 = puesto)
export function dibujaTapon(g, dy, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(DRENX, SUELO - 6 + dy);
  g.beginPath(); g.moveTo(-40, 10); g.lineTo(-34, 54); g.lineTo(34, 54); g.lineTo(40, 10); g.closePath();
  g.fillStyle = gradH(g, -40, 40, [[0, "#14181d"], [0.35, "#4a545e"], [0.6, "#262d34"], [1, "#0d1014"]]); g.fill();
  g.beginPath(); k.redondo(g, -78, -16, 156, 30, 14); g.fillStyle = gradH(g, -78, 78, [[0, "#171c22"], [0.3, "#59646f"], [0.5, "#8793a0"], [0.8, "#2c343c"], [1, "#12161b"]]); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-58, -12, 80, 5);
  g.restore();
}

// la escena entera. o: { cam, gotas, chorro:{w, al}, maneta:{...}, nivel, tapon:{dy, al}, antes(g), despues(g) }
export function dibujaCocina(g, t, o) {
  g.fillStyle = "#08202a"; g.fillRect(0, 0, 1080, 1920);
  g.save(); camara(g, o.cam);
  fondoCocina(g, t, o.cam);
  fregadero(g, t, o);
  if (o.tapon) dibujaTapon(g, o.tapon.dy, o.tapon.al);
  if (o.chorro) {
    const c = o.chorro;
    chorro(g, t, TIPX, TIPY, SUELO - 8, c.w, c.al ?? 1);
    if (c.w > 2) salpica(g, TIPX, SUELO - 14, (t * 1.7) % 0.55, 0.9 * Math.min(1, c.w / 40), 9, 130);
  }
  if (o.gotas) dibujaGotas(g, t, o.gotas);
  dibujaGrifo(g, t, o);
  dibujaManeta(g, t, o.maneta ?? {});
  if (o.despues) o.despues(g, t);
  g.restore();
}
