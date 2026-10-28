// La tela roza y, debajo, el músculo pega un salto. Las dos cosas que el estudio propone.
import * as k from "#kit";
import { v } from "#voz";
import { pielSalto, telar, velo } from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(6);
const Troza = f.t("roza");
const Ttela = f.t("tela");
const Tmus = f.t("musculo");
const Tsalto = f.t("salto");

export function dibuja(g, t) {
  const roce = k.suave(k.tramo(t, Troza - 0.12, Ttela + 0.15));
  const abierto = k.suave(k.tramo(t, Tmus - 0.15, Tmus + 0.35));
  const salto = k.entra(k.tramo(t, Tsalto - 0.12, Tsalto + 0.22));
  telar(g, t, roce * (1 - abierto * 0.85));
  pielSalto(g, t, salto, abierto);
  velo(g, 0.72);
}
