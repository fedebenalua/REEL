// «también se revolcaron en curry y en lana.»
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, valla, curry, lana, olor, perroRueda, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(8).t("revolcaron") - 0.04;

export function dibuja(g, t) {
  const aLana = v.frase(8).t("lana");
  const u = k.suave(k.tramo(t, aLana - 0.75, aLana + 0.2));
  const c = cam(6.4, k.mez(470, 680, u), -64);
  parqueListo(g, c, t, 0.45);
  valla(g, 200);
  curry(g, 430, t);
  lana(g, 700, t);
  olor(g, k.mez(430, 700, u), -16, u < 0.5 ? "255,170,40" : "255,230,190", t, { n: 9, fuerza: 1.2, alfa: 0.5 });
  perroRueda(g, k.mez(450, 680, u), t);
  cierra(g, 0.42);
}
