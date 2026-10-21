// «El primero para la tele llegó en 1950, y iba con un cable hasta tu sillón. Como cruzaba el salón, la gente se
// tropezaba.»
// Otro sitio: el salón de 1950, de noche: la tele de madera a la izquierda y, a la derecha, el hombre en su sillón con
// la cajita del primer mando. Una sola cámara. Se entra con un corte en «El».
// - «El primero para la tele llegó en 1950»: la cámara empuja despacio hacia la tele; sale «1950».
// - «y iba con un cable hasta tu sillón»: un cable negro crece desde la tele por el suelo, y la cámara lo sigue hasta la
//   cajita que el hombre tiene en la mano.
// - «Como cruzaba el salón»: la cámara se abre y se ve el cable cruzando el suelo de lado a lado.
// - «la gente se tropezaba»: una señora entra por la derecha con un cuenco de palomitas; en «tropezaba» el cable le pilla el pie; cae,
//   y las palomitas y el cuenco salen volando. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, salon50, ventana, teleVieja } from "../mundo.js";
import { sillonYHombre, sillonDelante, brazoIzq, dedos, MANO } from "../objetos56.js";
import { persona, cuenco, PIE_DELANTE } from "../personas.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar, redondo } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tan = f5.t("1950"), Tiba = f5.t("iba"), Tsil = f5.t("sillon"), Ttrip = f6.t("tropezaba");
const FIN = v.frase(7).inicio;

const cam = camino2D([
  [T0, [0.85, -250, 150]], [T0 + 1.1, [0.95, -250, 170]], [Tiba - 0.1, [0.95, -250, 170]], [Tsil + 0.05, [1.1, 640, 300]], [f6.inicio - 0.05, [1.1, 640, 300]],
  [f6.inicio + 0.7, [0.72, 230, 170]], [FIN, [0.72, 230, 170]],
]);

// ------------------------------------------------------------ el cable: de la tele a la mano del hombre
const TELE_X = -250, SILLON = [840, 90, 1.5];
const bez = (p0, p1, p2, p3, u) => { const w = 1 - u; return [w * w * w * p0[0] + 3 * w * w * u * p1[0] + 3 * w * u * u * p2[0] + u * u * u * p3[0], w * w * w * p0[1] + 3 * w * w * u * p1[1] + 3 * w * u * u * p2[1] + u * u * u * p3[1]]; };
const SUELO = [[100, 592], [120, 900], [380, 980], [432, 740]];
const COLGADO = [[432, 740], [440, 600], [520, 420], [502, 224]];
const XT = 300, YW = Math.round(bez(...SUELO, 0.6)[1]);      // dónde se tropieza, y a qué altura camina la señora
const N1 = 150, N2 = 70;
function cable(t) {
  const lf = su(tr(t, Ttrip - 0.05, Ttrip + 0.25)) * (1 - su(tr(t, Ttrip + 0.55, Ttrip + 0.95)));
  const P = [];
  for (let i = 0; i <= N1; i++) { const p = bez(...SUELO, i / N1); p[1] -= 125 * lf * Math.exp(-(((p[0] - XT) / 95) ** 2)); P.push(p); }
  for (let i = 1; i <= N2; i++) P.push(bez(...COLGADO, i / N2));
  return P;
}
function trazo(g, P, a, b) {
  if (b - a < 1) return;
  const ruta = () => { g.beginPath(); for (let i = a; i <= b; i++) i === a ? g.moveTo(P[i][0], P[i][1]) : g.lineTo(P[i][0], P[i][1]); };
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.translate(0, 12); ruta(); g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 20; g.stroke(); g.translate(0, -12);
  ruta(); g.strokeStyle = "#0a0a0e"; g.lineWidth = 18; g.stroke();
  ruta(); g.strokeStyle = "rgba(255,255,255,0.28)"; g.lineWidth = 4; g.translate(-3, -4); g.stroke();
  g.restore();
}

// ------------------------------------------------------------ la cajita del primer mando (Lazy Bones)
function lazyBones(g) {
  g.save(); g.translate(MANO[0] - 8, MANO[1] + 26); g.rotate(-0.28);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 14; g.shadowOffsetY = 8;
  redondo(g, -78, -48, 156, 96, 18); const bg = g.createLinearGradient(0, -48, 0, 48); bg.addColorStop(0, "#d8b878"); bg.addColorStop(1, "#7a5a30"); g.fillStyle = bg; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  g.strokeStyle = "rgba(255,240,200,0.5)"; g.lineWidth = 3; redondo(g, -76, -46, 152, 92, 16); g.stroke();
  for (const [bx, c0, c1] of [[-42, "#ff6a5a", "#a01810"], [0, "#f4f0e4", "#a8a090"], [42, "#5a9aff", "#1a4a9a"]]) { const gg = g.createRadialGradient(bx - 6, -8, 2, bx, 0, 24); gg.addColorStop(0, c0); gg.addColorStop(1, c1); g.fillStyle = gg; g.beginPath(); g.arc(bx, 0, 20, 0, 6.2832); g.fill(); g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 3; g.stroke(); }
  g.restore();
}

// ------------------------------------------------------------ la señora y lo que se le cae
const VEL = 520, X_TROPIEZO = XT + PIE_DELANTE;     // camina hacia la izquierda (hacia la tele): el pie de delante queda en XT
const xAndar = (t) => X_TROPIEZO + VEL * (Ttrip - t);
const AZ = azar(1950);
const PALOMITAS = Array.from({ length: 13 }, () => ({ dx: (AZ() - 0.5) * 110, vx: -(-150 + AZ() * 720), vy: -900 + AZ() * 420, r: 13 + AZ() * 7, y: YW + 6 + AZ() * 46 }));
function palomita(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); const pg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, 2, x, y, r); pg.addColorStop(0, "#fffef6"); pg.addColorStop(1, "#ecc872"); g.fillStyle = pg; g.fill(); }
function vuelan(g, t) {
  const d = t - Ttrip; if (d < 0) return;
  const sx = X_TROPIEZO - PIE_DELANTE - 30, sy = YW - 540;
  for (const p of PALOMITAS) {
    const x = sx + p.dx + p.vx * d, y0 = sy + p.vy * d + 0.5 * 3000 * d * d, y = Math.min(y0, p.y);
    palomita(g, x, y, p.r);
  }
  // el cuenco: gira en el aire y se queda donde cae
  const tL = (800 + Math.sqrt(640000 - 6000 * (sy - YW + 6))) / 3000, dd = Math.min(d, tL);
  cuenco(g, sx - 430 * dd, sy - 800 * dd + 1500 * dd * dd, 7 * dd);
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salon50(g, t, 0, 0.5);
  ventana(g, t, 0);
  // el cable por el suelo, bajo la tele; crece desde la tele hasta la mano
  const P = cable(t), prog = su(tr(t, Tiba - 0.05, Tsil + 0.25)), n = Math.round(prog * (P.length - 1));
  const corte = N1;     // a partir de aquí el cable cuelga, por delante del sillón
  trazo(g, P, 0, Math.min(n, corte));
  g.save(); g.translate(TELE_X, 0);
  teleVieja(g, t, { canalN: 0, nv: 0, celdas: [0, 0, 0, 0], perilla: 0 });
  g.restore();
  // el hombre, su sillón y la cajita
  g.save(); g.translate(SILLON[0], SILLON[1]); g.scale(SILLON[2], SILLON[2]);
  sillonYHombre(g, t); brazoIzq(g); sillonDelante(g, t); lazyBones(g); dedos(g);
  g.restore();
  if (n > corte) trazo(g, P, corte, n);
  // la señora con las palomitas
  const u = tr(t, Ttrip, Ttrip + 0.55), phi = 1.45 * u * u, desliza = 110 * su(u);
  if (t > f6.inicio + 0.2) {
    const x = (t < Ttrip ? xAndar(t) : X_TROPIEZO) - desliza;
    persona(g, t, { x, y: YW, flip: -1, ph: x / 70, amp: t < Ttrip ? 1 : 0, phi, susto: su(tr(t, Ttrip - 0.1, Ttrip + 0.2)), bandeja: t < Ttrip ? 1 : 0 });
    vuelan(g, t);
  }
  sinVista(g);
  const an = su(tr(t, Tan - 0.05, Tan + 0.25)) * (1 - su(tr(t, Tiba - 0.35, Tiba - 0.05)));
  k.pastilla(g, 540, 1390, "1950", "", "255,226,160", an, 120);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { cable: Tiba, tropieza: Ttrip };
