// «A la mañana siguiente, tres de cada cuatro ya está bien.» Amanece, cola alta.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(7).inicio - 0.04;
const f = v.frase(7);
const fin = v.frase(8).inicio - 0.04;
const Tbien = f.t("bien");
const T4 = f.t("cuatro");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, fin - 0.25));
  const Z = k.mez(9.2, 10.6, u);
  const x = 420;
  const c = { Z, cx: x + 2, cy: k.mez(-90, -94, u) };
  m.salon(g, c, t, m.DIA);
  m.ponVista(g, c);
  m.perroFrente(g, {
    x, t, cola: 0.9,
    cabeza: { ojo: 1, oreja: 0.45, ladea: 0.12 * Math.sin(t * 1.4), abre: 0.2 },
  });
  m.sinVista(g);
  const al = k.suave(k.tramo(t, T4 - 0.05, T4 + 0.25));
  m.cifra(g, 540, 600, "3/4", al, "120,220,140");
  m.cierra(g, 0.38);
}
