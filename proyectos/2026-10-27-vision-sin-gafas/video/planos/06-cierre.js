// Quitas el agujero y vuelves a ver igual. El amigo que entrecierra los ojos. Frases 10 y 11.
import * as k from "#kit";
import { v } from "#voz";
import { escenaCafe } from "../mundo.js";

const f10 = v.frase(10), f11 = v.frase(11);
export const desde = "cura";

const camara = k.ruta([
  [f10.inicio, { pos: [0, 0.05, 4.5], mira: [0, 0.05, 0] }],
  [f10.t("quitas"), { pos: [0, 0.04, 4.7], mira: [0, 0.05, 0] }],
  [f10.t("igual"), { pos: [0.08, 0.12, 5.4], mira: [0, 0.05, 0] }],
  [f11.t("entrecierra"), { pos: [0.04, 0.08, 4.8], mira: [0, 0.05, 0] }],
  [f11.t("carta"), { pos: [0.15, 0.25, 6.4], mira: [0, 0.06, 0] }],
  [f11.fin + 0.5, { pos: [0.35, 0.4, 9.2], mira: [0, 0.05, 0] }],
]);

export function dibuja(g, t) {
  const cam = camara(t);
  const cae = k.sale(k.tramo(t, f10.t("quitas") - 0.05, f10.t("agujero") + 0.55));
  const fuera = cae > 0.97;
  const blurDentro = k.claves([
    [f10.inicio, 0],
    [f10.t("quitas"), 1],
    [f10.t("igual"), 36],
    [f11.fin, 36],
  ]);
  const parpado = k.claves([
    [f11.inicio, 0],
    [f11.t("entrecierra"), 0.05],
    [f11.t("ojos"), 0.85],
    [f11.t("carta"), 0.35],
    [f11.fin, 0],
  ]);
  const vel = k.suave(k.tramo(t, f11.t("carta"), f11.fin + 0.4));
  escenaCafe(g, cam, {
    vel,
    blurFuera: 36,
    blurDentro: blurDentro(t),
    hx: 540,
    hy: 960 + cae * 1600,
    hr: fuera ? 0 : 140,
    tarjeta: fuera ? 0 : 1,
    parpado: parpado(t),
    velo: 0.7,
  });
}
