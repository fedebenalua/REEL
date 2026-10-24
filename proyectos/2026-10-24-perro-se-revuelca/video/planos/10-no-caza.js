// «Un disfraz de caza no huele a perfume.» El verde se va y queda el rosa. El ciervo lo está viendo.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, perfume, ciervo, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio - 0.04;

export function dibuja(g, t) {
  const rosa = k.suave(k.tramo(t, v.frase(7).t("huele") - 0.1, v.frase(7).t("perfume") + 0.2));
  const vida = t - desde(v);
  const c = cam(5.05 - vida * 0.22, 400 + vida * 28, -64 - vida * 2);
  parqueListo(g, c, t, 0.1);
  olor(g, 360, -36, "46,170,70", t, { n: 8, fuerza: 1.2 * (1 - rosa), alfa: 0.4 * (1 - rosa) });
  olor(g, 380, -34, "255,90,170", t, { n: 12, fuerza: 0.5 + rosa * 1.2, alfa: 0.55 * rosa });
  perfume(g, 250, 1.2 + rosa * 0.4, t);
  ciervo(g, 700, t, 0.2);
  perro(g, {
    x: 400, t, marcha: 0, cola: 0.5 + 0.4 * rosa, cabeza: { abre: 0.3 * rosa, ojo: rosa > 0.6 ? 1 : 0, oreja: 0.2 },
  });
  cierra(g, 0.42);
}
