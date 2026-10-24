// Otra apertura del hook: la bombilla ya llena el fotograma 0 y un fogonazo descubre el sofá.
import { camGolpe, dibujaMundo } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  dibujaMundo(g, t, camGolpe(t), true);
}
