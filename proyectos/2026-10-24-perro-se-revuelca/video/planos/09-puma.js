// «Lo segundo fue caca de puma y de oso.»
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, caca, puma, oso, olor, perroRueda, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio - 0.04;

export function dibuja(g, t) {
  const osoU = k.suave(k.tramo(t, v.frase(6).t("oso") - 0.15, v.frase(6).t("oso") + 0.35));
  const c = cam(3.7, k.mez(380, 520, osoU), -78);
  parqueListo(g, c, t, 0.25);
  puma(g, 250, t);
  oso(g, 640, t);
  caca(g, 360, "puma");
  caca(g, 520, "oso");
  olor(g, 360, -10, "170,80,255", t, { n: 7, fuerza: 0.9, alfa: 0.4 });
  olor(g, 520, -12, "200,100,40", t + 0.4, { n: 6, fuerza: 0.8, alfa: 0.35 });
  perroRueda(g, 430, t, { escala: 0.82 });
  cierra(g, 0.4);
}
