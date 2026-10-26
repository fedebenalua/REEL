// «No es miedo a todo.» De día, suelto, junto al cuenco. Nada estalla.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(4).t("no") - 0.04;
const f = v.frase(4);
const fin = v.frase(5).t("petardo") - 0.04;

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.inicio, f.fin - 0.05));
  const Z = k.mez(5.6, 6.3, u);
  const x = 400;
  const c = { Z, cx: x + 10, cy: m.pies(Z, 1340) };
  m.salon(g, c, t, m.DIA);
  m.ponVista(g, c);
  m.cuenco(g, x + 78);
  m.perro(g, {
    x, t, dir: 1, marcha: 0.15 * (1 - q), fase: t * 1.2,
    cola: 0.85, cuelloBaja: 0.35, cabeza: { ang: 0.25, oreja: 0.15, ojo: 1, abre: 0.15 },
  });
  m.sinVista(g);
  m.cierra(g, 0.42);
}
