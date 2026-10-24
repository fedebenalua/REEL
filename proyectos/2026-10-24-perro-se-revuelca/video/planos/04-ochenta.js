// «Pues en el ochenta y seis»: el perro, de pie, y los olores del estudio que empiezan a llegar.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, perfume, aceite, caca, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio - 0.04;

export function dibuja(g, t) {
  const a = desde(v);
  const u = k.suave(k.tramo(t, a, a + 1.2));
  const c = cam(3.15 + u * 0.25, 450, -72);
  parqueListo(g, c, t, 0.1);
  const cae = (t0) => k.suave(k.tramo(t, t0, t0 + 0.35));
  if (cae(a + 0.05) > 0.02) { g.save(); g.translate(0, (1 - cae(a + 0.05)) * -80); caca(g, 300, "oveja"); g.restore(); }
  if (cae(a + 0.35) > 0.02) { g.save(); g.translate(0, (1 - cae(a + 0.35)) * -90); perfume(g, 410, 1.15, t); g.restore(); }
  if (cae(a + 0.7) > 0.02) { g.save(); g.translate(0, (1 - cae(a + 0.7)) * -90); aceite(g, 480, 1.05); g.restore(); }
  perro(g, { x: 560, t, dir: -1, marcha: 0, cola: 0.7, cabeza: { ang: -0.05, abre: 0.3, ojo: 1, oreja: 0.2 } });
  cierra(g, 0.4);
}
