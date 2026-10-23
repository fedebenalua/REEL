// «No hay una báscula debajo: no la pesa.»
// Cuatro patas y el suelo. En «báscula» entra una báscula; en «pesa» se sacude y sigue en cero.
import * as k from "#kit";
import { v } from "#voz";
import { debajo } from "../mundo.js";

export const desde = "no";
const f = v.frase(2);

export function dibuja(g, t) {
  const entra = k.suave(k.tramo(t, f.t("bascula") - 0.08, f.t("bascula") + 0.42));
  const pico = k.pulso(t, f.t("pesa"), 0.11);
  const sacude = Math.sin((t - f.t("pesa")) * 36) * pico * 22;
  debajo(g, entra, sacude);
}
