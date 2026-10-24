// «en cosas que huelen fatal»: el hocico dentro del olor, todavía de espaldas.
import { v } from "#voz";
import { parqueListo, cierra, monton, olor, perroRueda, cam, ENGANCHE } from "../mundo.js";

export const desde = (vz) => vz.frase(1).t("cosas") - 0.04;

export function dibuja(g, t) {
  const u = (t - desde(v)) / 2.4;
  const c = cam(8.4 - u * 0.4, ENGANCHE.x + 36, -62);
  parqueListo(g, c, t, 0.15);
  monton(g, ENGANCHE.pila, t, 1.05);
  olor(g, ENGANCHE.pila, -8, "186,220,60", t, { n: 14, fuerza: 1.6, alfa: 0.55 });
  perroRueda(g, ENGANCHE.x + Math.sin(t * 3) * 8, t);
  olor(g, ENGANCHE.x + 30, -36, "210,235,90", t + 1, { n: 6, fuerza: 0.8, alfa: 0.3 });
  cierra(g, 0.55);
}
