// «A unos pocos les dura semanas.» Sigue de noche, metido bajo el sofá.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(8).inicio - 0.04;
const f = v.frase(8);
const fin = v.frase(9).t("si") - 0.04;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.t("semanas")));
  const Z = k.mez(5.8, 7.1, u);
  const x = 560;
  const c = { Z, cx: x - 40, cy: m.pies(Z, k.mez(1280, 1360, u)) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x, t, dir: -1, tumbado: 1, marcha: 0, fase: 0.1,
    cola: 0.02, cabeza: { ang: 0.15, oreja: -0.4, ojo: 0 },
  });
  m.sofaTapa(g, 470);
  m.sinVista(g);
  m.cierra(g, 0.55);
}
