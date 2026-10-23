// La ciudad: la torre de verdad ya ocupa el 3, y la emisora del vídeo se va al 4.
import * as k from "#kit";
import { v } from "#voz";
import { ciudad, velo } from "../mundo.js";

export const desde = "city";

const { suave: su, tramo: tr } = k;
const f6 = v.frase(6);
const Tusing = f6.t("using");

export function dibuja(g, t) {
  const salto = su(tr(t, Tusing - 0.15, Tusing + 0.45));
  ciudad(g, t, salto);
  velo(g);
}
