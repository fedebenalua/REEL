// El hook (el creador eligió esta; la otra, la taza, está en aperturas/01-cafe.js): desde el fotograma 0 la cámara sube a toda velocidad por una torre
// de tazas que derraman monedas, con el contador corriendo, hasta llegar arriba, a la cafetera, en «quinientos».
import { escenaCafe } from "../cafe.js";

export const desde = 0;
export function dibuja(g, t) { escenaCafe(g, t, "torre"); }
