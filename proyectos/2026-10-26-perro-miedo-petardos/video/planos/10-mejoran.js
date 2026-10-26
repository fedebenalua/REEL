// «Tres de cada diez mejoran.» Sale un poco, la cola se suelta.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(10).t("tres") - 0.04;
const f = v.frase(10);
const fin = v.frase(11).t("y") - 0.04;
const Tm = f.t("mejoran");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, Tm + 0.15));
  const Z = k.mez(5.4, 6.2, u);
  const x = k.mez(480, 420, u);
  const c = { Z, cx: x + 16, cy: m.pies(Z, 1340) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x, t, dir: 1, marcha: 0.35 * (1 - k.suave(k.tramo(t, Tm, Tm + 0.25))), fase: t * 2.2,
    cola: k.mez(0.15, 0.75, u), cabeza: { ang: k.mez(0.3, -0.05, u), oreja: 0.05, ojo: u > 0.6 ? 0.4 : 0 },
  });
  m.sinVista(g);
  const al = k.suave(k.tramo(t, f.t("diez") - 0.05, f.t("diez") + 0.22));
  m.cifra(g, 540, 600, "3/10", al, "140,220,160");
  m.cierra(g, 0.5);
}
