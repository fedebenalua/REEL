// «Empezar cuando ya lo tiene no se notaba igual.» La galleta llega y él no sale.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(13).t("empezar") - 0.04;
const f = v.frase(13);
const fin = v.frase(14).inicio - 0.04;
const Tnot = f.t("notaba");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.t("tiene"), Tnot + 0.15));
  const Z = k.mez(5.6, 6.4, u);
  const x = 580;
  const c = { Z, cx: x - 50, cy: m.pies(Z, 1340) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x, t, dir: -1, tumbado: 1, marcha: 0, cola: 0.02,
    cabeza: { ang: 0.05, oreja: -0.35, ojo: 0 },
  });
  m.sofaTapa(g, 470);
  const llega = k.suave(k.tramo(t, f.t("ya"), Tnot));
  const mx = k.mez(300, 430, llega);
  m.mano(g, mx, -34, 0.55, 1.3);
  m.galleta(g, mx + 6, -52, 1.15);
  m.sinVista(g);
  m.cierra(g, 0.52);
}
