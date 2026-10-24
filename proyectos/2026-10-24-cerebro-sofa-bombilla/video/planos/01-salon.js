// Hook: se sale del filamento hasta ver la bombilla-cabeza en el sofá.
import { camHook, dibujaMundo } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  dibujaMundo(g, t, camHook(t), false);
}
