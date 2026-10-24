// «¿Por qué tu perro se revuelca en cosas que huelen fatal?» hasta «cosas».
// Fotograma 0: el perro ya está de espaldas en el montón, las gotas y el olor llenan el plano, y la cámara se acerca.
import * as k from "#kit";
import { parqueListo, cierra, monton, olor, perroRueda, hookCam, hookPerro, ENGANCHE } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  const c = hookCam(t), p = hookPerro(t);
  parqueListo(g, c, t, 0.15);
  monton(g, ENGANCHE.pila, t, 1);
  olor(g, ENGANCHE.pila - 10, -10, "186,220,60", t, { n: 12, fuerza: 1.45, alfa: 0.5 });
  perroRueda(g, p.x, t);
  olor(g, p.x + 20, -40, "210,230,80", t + 0.4, { n: 5, fuerza: 0.65, alfa: 0.25 });
  cierra(g, 0.5);
}
