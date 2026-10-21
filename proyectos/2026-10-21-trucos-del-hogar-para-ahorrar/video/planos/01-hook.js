// «¿Sabías que cinco trucos de casa te bajan la factura sin que pases frío?» / «Y están en cosas que usas todos los días.»
// Hook A: el contador gira loco y escupe billetes; la cámara se aleja y enseña la casa entera al rojo vivo.
import * as k from "#kit";
import { v } from "#voz";
import { escena, cam, aro, T } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  const c = cam(t);
  escena(g, t);
  // al rojo vivo: un resplandor de alarma que se calma cuando la cámara enseña la casa entera
  k.brillo(g, 540, 900, 2300, "255,60,40", 0.22 * (1 - k.suave(k.tramo(t, 1.4, 3.6))));
  // las cinco cosas laten, una a una, con «cosas que usas todos los días»
  const ts = [4.95, 5.3, 5.66, 6.0, 6.32];
  [["luz", 262, 226], ["calor", 150, 392], ["ducha", 150, 380], ["lavadora", 260, 330], ["nevera", 286, 300]].forEach(([n, ox, oy], i) => aro(g, c, n, ox, oy, t - ts[i], 330));
}
