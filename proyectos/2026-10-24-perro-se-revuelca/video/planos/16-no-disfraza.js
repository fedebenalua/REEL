// «Así que no se disfraza para cazar»: el verde se apaga y el ciervo se va, tranquilo.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, ciervo, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio - 0.04;

export function dibuja(g, t) {
  const seVa = k.suave(k.tramo(t, v.frase(11).t("cazar") - 0.2, v.frase(11).t("cazar") + 0.55));
  const vida = t - desde(v);
  const c = cam(4.7 - vida * 0.18, 430 + vida * 36, -64);
  parqueListo(g, c, t, 0.08);
  olor(g, 360, -34, "46,170,70", t, { n: 8, fuerza: 1.1 * (1 - seVa), alfa: 0.4 * (1 - seVa) });
  ciervo(g, 600 + vida * 70, t, 0.8);
  perro(g, { x: 340, t, marcha: 0, cola: 0.35, cabeza: { ang: 0.05, ojo: 0, abre: 0 } });
  cierra(g, 0.4);
}
