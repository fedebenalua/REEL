// «Y uno de cada cinco empeora.» Más abajo, y el petardo vuelve más grande.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(11).t("y") - 0.04;
const f = v.frase(11);
const fin = v.frase(12).t("si") - 0.04;
const Te = f.t("empeora");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.inicio, Te));
  const Z = k.mez(6.2, 7.4, u);
  const x = 520;
  const c = { Z, cx: x - 30, cy: m.pies(Z, 1360) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x: x + m.temblor(t, (1 - q) * 0.6), t, dir: -1, tumbado: 1, marcha: 0,
    cola: 0.02, cabeza: { ang: 0.2, oreja: -0.45, ojo: 0 },
  });
  m.sofaTapa(g, 430);
  m.sinVista(g);
  const [vx, vy] = m.ventana(c);
  m.fuegos(g, vx, Math.max(540, vy), m.avance(t, Te - 0.05, 0.7), 15, 1.25);
  m.tinte(g, m.avance(t, Te - 0.05, 0.7), "255,120,70", 0.26);
  const al = k.suave(k.tramo(t, f.t("cinco") - 0.04, f.t("cinco") + 0.24));
  m.cifra(g, 540, 600, "1/5", al, "255,140,110");
  m.cierra(g, 0.52);
}
