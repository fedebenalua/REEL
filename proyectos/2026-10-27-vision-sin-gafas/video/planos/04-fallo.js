// Si no cambia: la mancha se queda en el propio ojo. Frase 8.
import * as k from "#kit";
import { v } from "#voz";
import { retinaMacro } from "../mundo.js";

const f8 = v.frase(8);
export const desde = "cambia";

export function dibuja(g, t) {
  const lesion = k.entra(k.tramo(t, f8.inicio, f8.t("ojo")));
  retinaMacro(g, { lesion });
}
