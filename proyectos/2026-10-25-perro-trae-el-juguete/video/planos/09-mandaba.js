// «Ganar no cambió quién mandaba.»
// De frente, sentado, mirando arriba. Ni se pone encima ni se esconde.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(12).inicio - 0.04;

const f = v.frase(12);
const Tmando = f.t("mandaba");

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, Tmando - 0.15, Tmando + 0.25));
  const Z = k.mez(7.2, 8.4, llega);
  const c = { Z, cx: 408, cy: -86 };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  m.pelotaSuelo(g, 500, 1.05, 0.15);
  m.perroFrente(g, {
    x: 400, t, cola: 0.55, escala: 1,
    cabeza: { ladea: 0.18 * llega, ojo: 1, mira: 0.05, miraY: -0.15, oreja: 0.15 },
  });
  m.cierra(g, 0.48);
}
