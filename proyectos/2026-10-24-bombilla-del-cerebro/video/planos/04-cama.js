// Frase 12. Otro sitio: la cama. La bombilla sigue igual de encendida.
import * as k from "#kit";
import { v } from "#voz";
import { dormitorio, bombilla, velo } from "../mundo.js";

export const desde = "tumbado";

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(12);
const Tquieto = v.t("asi") - 0.26;

export function dibuja(g, t) {
  const tc = Math.min(t, Tquieto);
  const z = mez(1, 1.08, su(tr(tc, f.inicio, f.t("nada"))));
  g.save();
  g.translate(540, 1000);
  g.scale(z, z);
  g.translate(-540, -1000);
  dormitorio(g, tc, 1);
  const pulso = 0.92 + 0.08 * Math.sin(t * 3);
  bombilla(g, 810, 1125, 210, t, 1, pulso);
  g.restore();
  velo(g, 0.66);
}
