// La otra apertura: una montaña de ropa ya está cayendo dentro de la lavadora.
import { v } from "#voz";
import { monton } from "../mundo.js";

export const desde = 0;
const corte = v.frase(2).inicio - 0.04;

export function dibuja(g, t) {
  monton(g, t, corte);
}
