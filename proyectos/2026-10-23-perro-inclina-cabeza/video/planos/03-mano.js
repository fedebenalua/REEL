// «como la mano con la que escribes.» El escritorio, y el boli se para.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "mano";

const f6 = v.frase(6);
const Tescribes = f6.t("escribes");
const Tautores = v.frase(7).t("autores");

export function dibuja(g, t) {
  const u = k.claves([
    [f6.t("mano") - 0.08, 0.15],
    [Tescribes + 0.12, 1],
    [Tautores, 1],
  ])(t);
  const alza = k.claves([
    [Tescribes + 0.2, 0],
    [Tescribes + 0.7, 1],
    [Tautores, 1],
  ])(t);
  m.escritorio(g, u, alza);
  m.velo(g, 0.45);
}
