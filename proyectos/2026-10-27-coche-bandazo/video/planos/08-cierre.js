// Rasca el hielo y el volante quema. La calle de debajo es la misma del remate.
import * as k from "#kit";
import { v } from "#voz";
import { calleDelFinal, enVidrio, mano, rasqueta, volante } from "../mundo.js";

export const desde = "enviaselo";
export const entrada = "sigue";

const f10 = v.frase(10);

export function dibuja(g, t) {
  const c = calleDelFinal(g, t);
  const rasca = k.suave(k.tramo(t, f10.t("rasca"), f10.t("luego")));
  const cristal = k.proyecta(c, enVidrio(0.35 + rasca * 0.3, 0.45));
  if (cristal && t < f10.t("volante") - 0.08 && rasca > 0.02) rasqueta(g, cristal.x, cristal.y + 30, 280, -0.5);
  const calorV = k.suave(k.tramo(t, f10.t("puede"), f10.t("volante") + 0.12));
  const centro = calorV > 0.04 ? volante(g, c, calorV) : null;
  if (centro && calorV > 0.15) {
    const aparta = k.suave(k.tramo(t, f10.t("volante"), f10.finDe("volante") + 0.2));
    mano(g, centro.x + 90 + aparta * 240, centro.y + 20, 230, -0.15 + aparta * 0.45, 1);
  }
}
