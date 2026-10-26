// «Envíaselo...» Corre hacia el sofá.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(14).inicio - 0.04;
const f = v.frase(14);
const fin = f.t("sofa") - 0.04;
const Tmete = f.t("mete");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.t("perro"), Tmete + 0.25));
  const Z = k.mez(4.15, 4.55, u);
  const x = k.mez(180, 500, u);
  const c = { Z, cx: x + 30, cy: m.pies(Z, 1320) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  const marcha = k.mez(1, 0.15, q);
  m.perro(g, {
    x, t, dir: 1, marcha, fase: t * 3.4,
    cola: 0.35, pitch: 0.08 * marcha, cabeza: { ang: 0.12, oreja: 0.05, ojo: 0 },
  });
  if (marcha > 0.3) m.polvoCorre(g, t, x - 36, 1);
  m.sinVista(g);
  m.cierra(g, 0.5);
}
