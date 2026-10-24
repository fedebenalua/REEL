// Diez dueños con su perro: seis se ablandan al ver la cara, cuatro siguen regañando.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

const f12 = v.frase(12);
export const desde = f12.inicio;

const tr = k.tramo, su = k.suave, mez = k.mez;
const tRegañan = f12.t("reganan"), tMenos = f12.t("menos");

const GENTE = (() => {
  const az = k.azar(4242), L = [];
  const pelos = ["#3a2417", "#7a4a2a", "#1d1a1a", "#b0793a", "#5a3a22"];
  const chaq = [["#ff8a6b", "#e8503a", "#a82c20"], ["#6fb6ff", "#3f86d8", "#25549a"], ["#ffd36a", "#e8a82f", "#a8741a"], ["#9be07a", "#5db340", "#38802a"], ["#d79aff", "#a461d8", "#6c3a96"]];
  let n = 0;
  for (const [y, s, desp] of [[0, 0.5, -16], [92, 0.58, 18]]) {
    for (let i = 0; i < 5; i++) L.push({ x: 470 + (i - 2) * 78 + desp, y, s, i: n, ph: az() * 6, pelo: pelos[(n * 2) % 5], chaqueta: chaq[(n + (y ? 2 : 0)) % 5], n: n++ });
  }
  // el orden en que se ablandan: los seis primeros de una lista mezclada
  const orden = L.map((_, i) => i).sort(() => az() - 0.5);
  L.forEach((d, i) => { d.rank = orden.indexOf(i); d.suave = d.rank < 6; });
  return L;
})();

export function camara(t) {
  const Z = k.claves([[f12.inicio, 2.5], [f12.fin, 2.36]])(t);
  return { Z, cx: 498, cy: -46 };
}

export function dibuja(g, t) {
  const c = camara(t);
  m.salon(g, c, t, 0.9);
  m.ponVista(g, c);
  for (const row of [0, 92]) {
    for (const d of GENTE.filter((q) => q.y === row)) {
      const pop = k.entra(tr(t, f12.inicio - 0.45 + 0.1 * d.n, f12.inicio - 0.45 + 0.1 * d.n + 0.3));
      if (pop <= 0.01) continue;
      const bl = d.suave ? su(tr(t, tRegañan - 0.05 + 0.085 * d.rank, tRegañan + 0.4 + 0.085 * d.rank)) : 0;
      m.pareja(g, d.x, d.y, d.s * pop, { t: t + d.ph, ablanda: bl, culpa: 1 - 0.72 * bl, fase: d.ph, chaqueta: d.chaqueta, pelo: d.pelo, cola: bl > 0.5 ? 0.6 : 0 });
    }
  }
  m.velo(g, 0.35);
}
