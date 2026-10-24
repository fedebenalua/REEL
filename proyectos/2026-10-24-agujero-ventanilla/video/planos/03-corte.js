// El agujero, la presión y la lámina que se rompe. El mismo sitio, otra vez, desde el lado.
import { v } from "#voz";
import { ventana } from "../mundo.js";

export const desde = () => v.frase(5).t("agujero") - 0.04;

export function dibuja(g, t) {
  ventana(g, t, "cielo");
}
