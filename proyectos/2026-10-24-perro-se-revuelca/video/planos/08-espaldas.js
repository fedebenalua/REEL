// «se tiraron de espaldas»: el perro, panza arriba, entre el perfume y el aceite.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, perfume, aceite, olor, perroRueda, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(5).t("tiraron") - 0.04;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, desde(v), desde(v) + 0.45));
  const c = cam(k.mez(5.2, 7.6, u), 450, k.mez(-60, -70, u));
  parqueListo(g, c, t, 0.2);
  perfume(g, 300, 1.3, t);
  aceite(g, 600, 1.15);
  olor(g, 400, -16, "255,90,170", t, { n: 10, fuerza: 1.4, alfa: 0.5 });
  olor(g, 520, -14, "255,160,40", t + 0.5, { n: 8, fuerza: 1.2, alfa: 0.45 });
  perroRueda(g, 460, t);
  cierra(g, 0.5);
}
