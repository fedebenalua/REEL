// «En el césped, se le deja.»
// El parque, suelto. Corre y se queda en la hierba, contento, antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "en";

const f9 = v.frase(9);
const t0 = f9.inicio, x0 = 180, vel = 320;
const tA = f9.t("deja") - 0.05, tB = f9.t("deja") + 0.38;
const xEn = (t) => m.frenazo(t, t0, x0, vel, tA, tB);

export function dibuja(g, t) {
  const x = xEn(t);
  const sp = Math.max(0, m.velocidad(xEn, t));
  const corre = k.suave(k.tramo(sp, 30, 140));
  const Z = k.mez(5.3, 4.7, 1 - corre);
  const c = m.cam(Z, x + 16, -340 / Z);
  m.parque(g, c, t, 0.15);
  m.ponVista(g, c);
  m.polvoCarrera(g, t, x, 1, corre * 0.7);
  m.perro(g, {
    x, dir: 1, t,
    fase: Math.max(0, (x - x0) / 44),
    marcha: corre > 0.25 ? 1 : 0,
    pitch: 0.12 * corre,
    cola: 0.95,
    colaTuck: 0.2 * corre,
    cabeza: { ang: -0.04, abre: 0.55, ojo: 1, oreja: 0.15 },
  });
  m.sinVista(g);
  m.ambiente(g, 0.35, 0.85);
  m.cierra(g, 0.28);
}
