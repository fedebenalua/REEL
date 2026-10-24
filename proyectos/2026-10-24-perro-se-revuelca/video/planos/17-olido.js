// «se pone un olor que no había olido»: se echa de espaldas en el olor raro.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, perroRueda, cam, ENGANCHE } from "../mundo.js";

export const desde = (vz) => vz.frase(11).t("pone") - 0.04;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, desde(v), v.frase(11).t("olido")));
  const c = cam(k.mez(5.4, 7.2, u), ENGANCHE.x, -66);
  parqueListo(g, c, t, 0.18);
  olor(g, ENGANCHE.pila, -12, "40,220,255", t, { n: 12, fuerza: 0.8 + u, alfa: 0.55 });
  olor(g, ENGANCHE.x, -20, "186,220,60", t + 0.7, { n: 6, fuerza: 0.6 * u, alfa: 0.3 });
  perroRueda(g, ENGANCHE.x, t);
  cierra(g, 0.48);
}
