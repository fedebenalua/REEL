// «...debajo del sofá en cuanto oye un petardo.» Se mete y estalla, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(14).t("sofa") - 0.04;
const f = v.frase(14);
const fin = v.duracion;
const Tpet = f.t("petardo");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.t("oye"), Tpet));
  const Z = k.mez(8.4, 9.6, u);
  const x = 590;
  const c = { Z, cx: x - 80, cy: m.pies(Z, 1240) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x: x + m.temblor(t, (1 - q) * (t > Tpet - 0.1 ? 1 : 0.2)),
    t, dir: -1, tumbado: 1, marcha: 0, cola: 0.02,
    cabeza: { ang: 0.18, oreja: -0.4, ojo: 0 },
  });
  m.sofaTapa(g, 450);
  m.sinVista(g);
  const [vx, vy] = m.ventana(c);
  m.fuegos(g, vx, Math.max(560, vy), m.avance(t, Tpet - 0.12, 0.85), 4, 1.3);
  m.tinte(g, m.avance(t, Tpet - 0.12, 0.85), "255,150,60", 0.28);
  m.cierra(g, 0.5);
}
