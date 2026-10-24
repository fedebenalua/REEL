// «Perfume y aceite de coche»: los dos, grandes, y el perro se les echa encima.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, perfume, aceite, olor, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio - 0.04;

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, desde(v), v.frase(5).t("coche") + 0.2));
  const c = cam(5.4 + llega * 0.6, 460, -58);
  parqueListo(g, c, t, 0.12);
  perfume(g, 340, 1.5, t);
  aceite(g, 560, 1.35);
  olor(g, 340, -30, "255,90,170", t, { n: 8, fuerza: 1.1, alfa: 0.5 });
  olor(g, 560, -28, "255,160,40", t + 0.6, { n: 8, fuerza: 1, alfa: 0.45 });
  perro(g, {
    x: k.mez(200, 430, llega), t, marcha: 0.7 * (1 - llega), fase: t * 2.5, cola: 0.9, cuelloBaja: 0.55 * llega, pitch: 0.1 * llega,
    cabeza: { abre: 0.6, ojo: 1, oreja: 0.3, olfato: 1 },
  });
  cierra(g, 0.45);
}
