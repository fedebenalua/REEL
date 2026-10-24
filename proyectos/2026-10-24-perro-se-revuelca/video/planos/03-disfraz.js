// «Dicen que se disfraza, para cazar sin que lo huelan.» El disfraz verde, y el ciervo que lo ve igual.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, ciervo, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(2).t("disfraza") - 0.04;
const f = () => v.frase(2);

export function dibuja(g, t) {
  const cazar = f().t("cazar"), huelan = f().t("huelan");
  const alCiervo = k.suave(k.tramo(t, cazar - 0.05, cazar + 0.45));
  const mira = k.suave(k.tramo(t, huelan - 0.2, huelan + 0.25));
  const c = cam(k.mez(5.6, 4.3, alCiervo), k.mez(380, 560, alCiervo), k.mez(-62, -70, alCiervo));
  parqueListo(g, c, t, 0.05);
  olor(g, 360, -30, "46,170,70", t, { n: 12, fuerza: 1.3 + 0.4 * (1 - mira), alfa: 0.45 });
  ciervo(g, 690 + mira * 30, t, 0.15 + mira);
  perro(g, {
    x: 340, t, marcha: 0.15, fase: t * 1.4, cola: 0.3, cuelloBaja: 0.75 * (1 - mira * 0.3), pitch: 0.12,
    cabeza: { ang: 0.25, abre: 0, ojo: 0, oreja: -0.1 },
  });
  cierra(g, 0.42);
}
