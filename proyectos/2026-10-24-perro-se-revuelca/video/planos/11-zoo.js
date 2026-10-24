// «Años después, en un zoo»: la valla, el curry humeando, el perro que llega.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, valla, curry, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio - 0.04;

export function dibuja(g, t) {
  const a = desde(v);
  const llega = k.suave(k.tramo(t, a + 0.2, a + 1.6));
  const c = cam(4.2, k.mez(300, 460, llega), -66);
  parqueListo(g, c, t, 0.45);
  valla(g, 200);
  curry(g, 520, t);
  perro(g, {
    x: k.mez(180, 400, llega), t, marcha: 0.8 * (1 - k.suave(k.tramo(t, a + 1.3, a + 1.8))), fase: t * 2.3, cola: 0.8,
    cabeza: { abre: 0.4, ojo: 1, olfato: 0.6, oreja: 0.2 },
  });
  cierra(g, 0.4);
}
