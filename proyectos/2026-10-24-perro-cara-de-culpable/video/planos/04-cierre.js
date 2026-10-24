// De vuelta al salón del desastre: la cara de culpable, otra vez a lo grande (el último fotograma lleva al primero).
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

const f13 = v.frase(13);
export const desde = f13.inicio;

export function camara(t) {
  const tc = f13.t("culpable");
  const Z = k.claves([[f13.inicio, 4.05], [tc - 0.5, 4.05], [tc + 0.55, 9.4], [f13.fin + 3, 9.4]])(t);
  const cx = k.claves([[f13.inicio, 392], [tc - 0.5, 392], [tc + 0.55, 422], [f13.fin + 3, 422]])(t);
  const cy = k.claves([[f13.inicio, -74], [tc - 0.5, -76], [tc + 0.55, -96], [f13.fin + 3, -96]])(t);
  return { Z, cx, cy };
}

export function dibuja(g, t) {
  const c = camara(t);
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  m.cojinRoto(g, m.COJIN_X);
  const cree = f13.t("cree");
  const lam = k.tramo(t, cree - 0.2, cree + 0.6);
  m.perroFrente(g, { x: m.OX, t, culpa: 1, cola: 0, lamido: lam > 0 && lam < 1 ? lam : 0, cabeza: { mira: 0, ladea: 0.03 * Math.sin(t * 1.3) } });
  m.plumas(g, t + 6);
  m.velo(g, 0.35);
}
