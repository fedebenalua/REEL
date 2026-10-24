// «Lo que sí eligen es el olor raro»: deja el olor apagado y se mete en el raro.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio - 0.04;

export function dibuja(g, t) {
  const raro = v.frase(10).t("raro");
  const va = k.suave(k.tramo(t, raro - 0.15, raro + 0.55));
  const c = cam(5.3, k.mez(340, 520, va), -62);
  parqueListo(g, c, t, 0.1);
  olor(g, 280, -16, "140,120,90", t, { n: 6, fuerza: 0.7, alfa: 0.28 });
  olor(g, 560, -18, "40,220,255", t, { n: 12, fuerza: 0.8 + va * 0.8, alfa: 0.55 });
  perro(g, {
    x: k.mez(300, 500, va), t, marcha: 0.75 * (0.3 + va), fase: t * 2.4, cola: 0.4 + 0.5 * va,
    cuelloBaja: 0.7 * va, pitch: 0.12 * va,
    cabeza: { abre: 0.2, ojo: va > 0.5 ? 1 : 0, olfato: 1, oreja: 0.3 * va },
  });
  cierra(g, 0.42);
}
