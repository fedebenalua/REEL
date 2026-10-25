// La mesa: la mano derecha escribe, la tinta sube a la mitad izquierda,
// y el vaso, la lámpara y el libro encienden la derecha. Luego parece partirse.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, lampara, libro, mano, papel, sala, vaso, velo } from "../mundo.js";

export const desde = "escribes";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const Tes = f4.t("escribes");
const Tder = f4.t("derecha");
const Tpal = f5.t("palabras");
const Tizq = f5.t("izquierda");
const Tdel = f6.t("delante");
const Tder2 = f6.t("derecha");
const Teli = f7.t("elige");
const Tmit = f7.t("mitad");
const Fin = f7.fin;

const cam = k.ruta([
  [Tes, { pos: [0.42, -0.05, 1.45], mira: [0.18, -0.42, 0.55] }],
  [Tder, { pos: [0.28, 0.02, 1.28], mira: [0.12, -0.38, 0.5] }],
  [Tpal, { pos: [0.05, 0.25, 1.85], mira: [-0.1, 0.15, 0.1] }],
  [Tizq, { pos: [-0.62, 0.42, 1.55], mira: [-0.42, 0.28, 0.05] }],
  [Tdel - 0.05, { pos: [0.05, 0.02, 1.7], mira: [0.02, -0.15, 0.25] }],
  [Tder2, { pos: [0.72, 0.18, 1.62], mira: [0.38, 0.12, 0.05] }],
  [Teli, { pos: [0.05, 0.28, 2.7], mira: [0, 0.12, 0] }],
  [Tmit + 0.05, { pos: [0, 0.34, 3.45], mira: [0, 0.08, 0] }],
  [Fin + 0.4, { pos: [0, 0.34, 3.45], mira: [0, 0.08, 0] }],
]);

const TINTA = [0, 1, 2, 3, 4, 5].map((i) => ({ i, retraso: i * 0.08 }));

export function dibuja(g, t) {
  const c = cam(t);
  const sep = 0.38 * k.suave(k.tramo(t, Teli - 0.1, Tmit + 0.05));
  const iz = k.suave(k.tramo(t, Tpal - 0.05, Tizq + 0.15));
  const de = k.suave(k.tramo(t, Tdel - 0.05, Tder2 + 0.1));
  const calma = 1 - k.suave(k.tramo(t, Fin - 0.15, Fin + 0.2));
  sala(g, 0.35 + 0.5 * iz, 0.25 + 0.6 * de);
  // mesa
  const tab = [[-1.3, -0.78, 1.15], [1.3, -0.78, 1.15], [0.85, -0.78, -0.35], [-0.85, -0.78, -0.35]].map((p) => k.proyecta(c, p));
  if (tab.every(Boolean)) {
    g.beginPath();
    tab.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
    g.closePath();
    const tg = g.createLinearGradient(tab[0].x, tab[0].y, tab[2].x, tab[2].y);
    tg.addColorStop(0, "#8a5a32");
    tg.addColorStop(0.5, "#5c3a22");
    tg.addColorStop(1, "#2a180e");
    g.fillStyle = tg;
    g.fill();
  }
  papel(g, c, 1);
  cerebro(g, c, { t, sep, iz, de, chispas: 0.45 * calma });
  // trazo que crece mientras escribe
  const trazo = k.suave(k.tramo(t, Tes, f4.t("lado")));
  const A = k.proyecta(c, [-0.15, -0.7, 0.42]);
  const B = k.proyecta(c, [0.22, -0.7, 0.62]);
  if (A && B && trazo > 0.02) {
    g.save();
    g.strokeStyle = `rgba(40,70,160,${0.85})`;
    g.lineWidth = 5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(A.x, A.y);
    g.lineTo(k.mez(A.x, B.x, trazo), k.mez(A.y, B.y, trazo));
    g.stroke();
    g.restore();
  }
  // la tinta vuela a la izquierda
  const vuela = k.tramo(t, Tpal - 0.05, Tizq + 0.25);
  for (const q of TINTA) {
    const u = k.suave(k.tramo(vuela, q.retraso, 0.75 + q.retraso));
    if (u <= 0) continue;
    const x = k.mez(0.05, -0.45 - sep, u);
    const y = k.mez(-0.55, 0.25, u);
    const z = k.mez(0.55, 0.15, u);
    const P = k.proyecta(c, [x, y, z]);
    if (!P) continue;
    k.brillo(g, P.x, P.y, 70, "120,180,255", Math.sin(Math.min(1, u) * Math.PI) * (u < 1 ? 0.9 : 0));
  }
  const objetos = k.suave(k.tramo(t, Tes, Tes + 0.25));
  const luz = k.suave(k.tramo(t, Tdel - 0.1, Tder2));
  const pone = (p, dib) => {
    const P = k.proyecta(c, p);
    if (P) dib(P, (k.F * 0.18) / P.z);
  };
  pone([-0.55, -0.42, 0.35], (P, s) => vaso(g, P.x, P.y, s * 2.1, objetos));
  pone([0.15, -0.28, 0.05], (P, s) => lampara(g, P.x, P.y, s * 2.4, objetos, luz));
  pone([0.58, -0.48, 0.42], (P, s) => libro(g, P.x, P.y, s * 2.2, objetos));
  // mano y bolígrafo, grandes, en primer término
  const H = k.proyecta(c, [0.32, -0.28, 0.78]);
  if (H) {
    const escribiendo = 0.5 + 0.5 * Math.sin(t * 7) * (1 - k.suave(k.tramo(t, Tpal - 0.2, Tpal + 0.15)));
    mano(g, H.x + escribiendo * 8, H.y, (k.F * 0.42) / H.z, 1);
    if (t < Tpal + 0.2) k.brillo(g, H.x - 40, H.y - 30, 80, "255,220,140", 0.35);
  }
  velo(g, 0.62);
}
