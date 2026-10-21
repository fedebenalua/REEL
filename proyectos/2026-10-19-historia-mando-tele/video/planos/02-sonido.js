// «Así que al año siguiente lo cambiaron por sonido: unos martillitos golpeaban varillas de aluminio. Sonaba tan agudo
// que tú no lo oías, pero un perro sí.»
// Otro sitio: el salón de 1956, con un hombre en su sillón con el mando nuevo y un perro dormido en la alfombra. Una
// sola cámara. Se entra con un corte en «Así».
// - «Así que al año siguiente»: «1956»; el hombre aprieta el botón y salen ondas de sonido de colores.
// - «martillitos golpeaban varillas de aluminio»: el mando crece al centro y se abre: cuatro varillas de aluminio de
//   distinto largo y un martillito que golpea cada una en su palabra; cada una suena de un color.
// - «Sonaba tan agudo que tú no lo oías»: el mando vuelve a su mano y la cámara va a su oreja: las ondas pasan y él
//   ni se inmuta.
// - «pero un perro sí»: la cámara baja al perro: en «perro» levanta las orejas y alza la cabeza.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { salon56, sillonYHombre, sillonDelante, brazoIzq, dedos, perro, mando56, VARILLAS, topeVarilla, ondas, MANO } from "../objetos56.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez } = k;
const f4 = v.frase(4), f5 = v.frase(5);
const T0 = f4.inicio, Tson = f4.t("sonido"), Tmar = f4.t("martillitos"), Tgol = f4.t("golpeaban"), Tvar = f4.t("varillas"), Talu = f4.t("aluminio");
const Tagu = f5.t("agudo"), Tper = f5.t("perro"), Tfin = f5.fin;
export const GOLPES = [Tmar, Tgol, Tvar, Talu];
const DOG = [340, 700], BIG = [-30, 90], ESC = 1.4;
const PULSA = Tson - 0.32;

const cam = camino2D([
  [T0, [1.15, -30, 90]], [Talu + 0.7, [1.15, -30, 90]], [Tagu + 0.55, [1.7, -10, -170]], [Tper - 0.8, [1.7, -10, -170]],
  [Tper - 0.25, [1.3, 300, 640]], [Tfin, [1.3, 300, 640]],
]);
const grande = (t) => su(tr(t, Tson + 0.4, Tmar - 0.12)) * (1 - su(tr(t, Talu + 0.65, Talu + 1.15)));
const pose = (t) => {
  const u = grande(t), bob = (1 - u) * 5 * Math.sin(t * 2.2);
  return { x: mez(MANO[0], BIG[0], u), y: mez(MANO[1] - 40 + bob, BIG[1], u), s: mez(0.36, ESC, u), a: mez(-0.4, 0, u), u };
};
const COL = ["120,230,255", "150,255,180", "255,200,110", "255,130,200"];

function listaOndas() {
  const L = [], h = (t0) => { const p = pose(t0), c = Math.cos(p.a), s = Math.sin(p.a), tx = 0, ty = -250 * p.s; return { x: p.x + tx * c - ty * s, y: p.y + tx * s + ty * c }; };
  [0, 0.12, 0.24].forEach((d, i) => { const q = h(PULSA + d + 0.1); L.push({ t: PULSA + 0.1 + d, ...q, col: COL[i], al: 0.9 }); });
  GOLPES.forEach((tg, i) => { const [rx, ry] = topeVarilla(i), p = pose(tg); L.push({ t: tg, x: p.x + p.s * rx, y: p.y + p.s * ry, col: VARILLAS[i].col, al: 1 }); });
  for (let q = 0; q < 6; q++) { const t0 = Talu + 0.75 + q * 0.5, c = h(t0); L.push({ t: t0, ...c, col: COL[q % 4], al: 0.75 }); }
  for (const o of L) o.fin = Tfin - 0.15;
  return L;
}
const ONDAS = listaOndas();

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t), p = pose(t);
  vista(g, Z, cx, cy);
  salon56(g, t);
  k.brillo(g, -760, -120, 1500, "120,170,255", 0.3);
  // el perro, en su sitio, con las orejas que se levantan
  g.save(); g.translate(DOG[0], DOG[1]); perro(g, t, su(tr(t, Tper - 0.05, Tper + 0.17)), 1 - su(tr(t, Tfin - 0.6, Tfin - 0.15))); g.restore();
  sillonYHombre(g, t);
  brazoIzq(g);
  sillonDelante(g, t);
  // el mando, en su mano o enorme en el centro
  const dim = 0.66 * p.u;
  if (dim > 0.01) { g.fillStyle = `rgba(4,3,8,${dim})`; g.fillRect(-1100, -1500, 2200, 3200); }
  ondas(g, t, ONDAS);
  g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.scale(p.s, p.s);
  const pulsa = su(tr(t, PULSA, PULSA + 0.1)) * (1 - su(tr(t, PULSA + 0.3, PULSA + 0.45)));
  mando56(g, t, { corte: su(tr(t, Tson + 0.55, Tmar - 0.15)) * (1 - su(tr(t, Talu + 0.7, Talu + 1.1))), golpes: GOLPES, pulsa });
  g.restore();
  if (p.u < 0.5) dedos(g);
  sinVista(g);
  // «1956», quieto, en lo que se dice «al año siguiente»
  const an = su(tr(t, T0 + 0.1, T0 + 0.4)) * (1 - su(tr(t, PULSA - 0.1, PULSA + 0.15)));
  k.pastilla(g, 540, 1390, "1956", "", "255,226,160", an, 120);
  velo(g, 0.5);
  vineta(g, 0.4);
}

export const momentos = { pulsa: PULSA, golpes: GOLPES, perro: Tper };
