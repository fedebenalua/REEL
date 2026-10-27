// El ojo: la mancha en la retina y el agujero que la encoge. Frases 4 y 5.
import * as k from "#kit";
import { v } from "#voz";
import { ojo } from "../mundo.js";

const f4 = v.frase(4), f5 = v.frase(5);
export const desde = "ojo";

export function dibuja(g, t) {
  const zoom = k.claves([
    [f4.inicio, 1],
    [f4.t("luz"), 1.35],
    [f4.t("mancha"), 1.7],
    [f5.t("encoge"), 1.85],
    [f5.t("punto"), 2.15],
    [f5.fin, 2.15],
  ]);
  const pupila = k.claves([
    [f4.inicio, 0.36],
    [f5.t("agujero"), 0.36],
    [f5.t("bordes"), 0.2],
    [f5.t("punto"), 0.11],
    [f5.fin, 0.11],
  ]);
  const dentro = k.suave(k.tramo(t, f4.t("luz") - 0.1, f4.t("retina") + 0.15));
  ojo(g, {
    zoom: zoom(t),
    pupila: pupila(t),
    dentro,
    limpio: 1,
    blurReflejo: 18,
    abre: 1,
  });
}
