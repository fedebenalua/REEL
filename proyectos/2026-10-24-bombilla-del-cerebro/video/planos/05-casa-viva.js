// Frase 13. La casa entera, ya encendida: la luz cambia de cuarto y ninguno se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { casa, velo } from "../mundo.js";

export const desde = "asi";

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(13);
const Tquieto = v.t("enviaselo") - 0.28;

export function dibuja(g, t) {
  const tc = Math.min(t, Tquieto);
  const todas = 0.72 + 0.28 * su(tr(tc, f.inicio, f.t("guardado") + 0.1));
  const u = su(tr(tc, f.t("cambias"), f.t("luz") + 0.45));
  const giro = Math.min(tc, Tquieto) * 2.2;
  casa(g, 1, giro, todas, mez(3, 0, u));
  // un latido suave de la luz, parado al final
  const late = tc < Tquieto - 0.05 ? 0.5 + 0.5 * Math.sin(tc * 2.2) : 0.5;
  k.brillo(g, 540, 1100, 900, "255,180,90", 0.08 * todas * (0.6 + 0.4 * late));
  velo(g, 0.68);
}
