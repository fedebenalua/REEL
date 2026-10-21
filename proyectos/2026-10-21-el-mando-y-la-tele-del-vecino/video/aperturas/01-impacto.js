// La otra apertura: las dos teles ya en pantalla, la onda a mitad de la pared, y un salto a la del vecino.
import { dibujaCon } from "../planos/01-pared.js";

export const desde = 0;

export function dibuja(g, t) { dibujaCon(g, t, "impacto"); }
