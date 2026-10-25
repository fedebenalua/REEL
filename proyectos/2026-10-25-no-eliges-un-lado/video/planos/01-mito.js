// El mito, ya partido: la cámara sale del hueco entre las dos mitades.
// A la izquierda caen bloques de cristal (calcula). A la derecha salta la pintura (inventa).
// En «vives» se separan y, antes del corte, se quedan quietas.
import * as k from "#kit";
import { v } from "#voz";
import { bloque, cerebro, pintura, sala, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tcre = f1.t("creativo");
const Tcal = f2.t("calcula");
const Tinv = f2.t("inventa");
const Tviv = f3.t("vives");
const Tdos = f3.t("dos");
const Fin = f3.fin;

const CUBOS = [0, 1, 2, 3, 4].map((i) => ({ y: -0.62 + i * 0.3, s: 0.24, llega: i * 1.15 }));
const az = k.azar(71);
const GOTAS = Array.from({ length: 14 }, () => ({
  ang: az() * 6.2832,
  rad: 0.12 + az() * 0.5,
  y: (az() - 0.5) * 0.8,
  s: 0.07 + az() * 0.09,
  col: ["255,80,40", "255,170,50", "255,60,130", "255,120,40"][Math.floor(az() * 4)],
  f: az(),
}));

const cam = k.ruta([
  [0, { pos: [0, 0.05, 0.62], mira: [0, 0.02, -1.2] }],
  [1.15, { pos: [0.05, 0.18, 2.15], mira: [0, 0, 0] }],
  [Tcre, { pos: [0.1, 0.22, 3.15], mira: [0, 0.02, 0] }],
  [Tcal - 0.15, { pos: [-1.15, 0.05, 1.85], mira: [-0.72, -0.05, 0.15] }],
  [Tcal + 0.35, { pos: [-1.25, 0.02, 1.7], mira: [-0.78, 0.05, 0.1] }],
  [Tinv - 0.05, { pos: [1.25, 0.08, 1.75], mira: [0.78, 0.02, 0.1] }],
  [Tinv + 0.45, { pos: [1.35, 0.06, 1.85], mira: [0.7, 0.05, 0] }],
  [Tviv, { pos: [0.05, 0.32, 3.7], mira: [0, 0.02, 0] }],
  [Tdos + 0.15, { pos: [0, 0.36, 4.15], mira: [0, 0, 0] }],
  [Fin + 0.55, { pos: [0, 0.36, 4.15], mira: [0, 0, 0] }],
]);

const sepDe = (t) => 0.16 + 0.42 * k.suave(k.tramo(t, Tviv - 0.15, Tdos + 0.2));

function rayas(g, t) {
  const al = 1 - k.suave(k.tramo(t, 0.15, 1.25));
  if (al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (let i = 0; i < 18; i++) {
    const z = 0.4 + ((i * 0.37 - t * 3.2) % 2.4 + 2.4) % 2.4;
    const y = (i - 9) * 0.09;
    const A = k.proyecta(cam(t), [0, y, 0.5 - z]);
    const B = k.proyecta(cam(t), [0, y, 0.15 - z]);
    if (!A || !B) continue;
    g.strokeStyle = `rgba(210,230,255,${0.35 * al})`;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(A.x, A.y);
    g.lineTo(B.x, B.y);
    g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  const c = cam(t);
  const sep = sepDe(t);
  sala(g, 1, 1);
  cerebro(g, c, { t, sep, mito: true, iz: 1, de: 1, chispas: 0.85 * (1 - k.suave(k.tramo(t, Fin - 0.05, Fin + 0.25))) });
  rayas(g, t);
  // bloques: caen junto a la mitad izquierda y se quedan encajados
  for (const cu of CUBOS) {
    const u = k.entra(k.tramo(t, cu.llega, cu.llega + 0.42));
    if (u <= 0) continue;
    const y = k.mez(cu.y + 1.05, cu.y, u);
    const P = k.proyecta(c, [-0.62 - sep, y, 0.35]);
    if (!P) continue;
    const s = (k.F * cu.s) / P.z;
    bloque(g, P.x, P.y, s, Math.min(1, u * 2), (1 - u) * 0.7);
  }
  // pintura girando; el salto fuerte, en «inventa», y ya quieta antes del corte
  const salto = k.pulso(t, Tinv, 0.18);
  const quieta = k.suave(k.tramo(t, Tdos, Tdos + 0.35));
  for (const go of GOTAS) {
    const ang = go.ang + t * 0.9 * (1 - quieta) + go.f;
    const rad = go.rad * (1 + 0.55 * salto);
    const x = 0.62 + sep + Math.cos(ang) * rad;
    const y = go.y + Math.sin(ang * 1.3 + go.f) * 0.12 * (1 - quieta);
    const z = 0.25 + Math.sin(ang) * rad * 0.85;
    const P = k.proyecta(c, [x, y, z]);
    if (!P) continue;
    pintura(g, P.x, P.y, (k.F * go.s * (1 + salto)) / P.z, go.col, 0.85);
  }
  velo(g, 0.72);
}
