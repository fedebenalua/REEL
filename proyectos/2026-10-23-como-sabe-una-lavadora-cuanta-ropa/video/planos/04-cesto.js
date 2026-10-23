// «Es como el cesto de la colada: vacío casi no pesa; lleno, te tira del brazo.»
import * as k from "#kit";
import { v } from "#voz";
import { escenaCesto, tiempoQuieto } from "../mundo.js";

export const desde = "es";
const f = v.frase(6);
const corte = v.frase(7).inicio - 0.04;

export function dibuja(g, t) {
  const tm = tiempoQuieto(t, corte);
  const alza = k.suave(k.tramo(tm, f.t("vacio") - 0.08, f.t("pesa") - 0.05))
    * (1 - k.suave(k.tramo(tm, f.t("lleno") - 0.05, f.t("brazo") + 0.05)));
  const lleno = k.suave(k.tramo(tm, f.t("lleno") - 0.04, f.t("lleno") + 0.45));
  const codo = k.suave(k.tramo(tm, f.t("lleno"), f.t("brazo") + 0.15));
  escenaCesto(g, alza, lleno, codo);
}
