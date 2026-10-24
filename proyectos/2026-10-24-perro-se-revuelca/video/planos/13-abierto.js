// «El motivo exacto sigue abierto.» La cara, de frente, ladeándose. Los olores siguen ahí, sin ganador.
import * as k from "#kit";
import { parqueListo, cierra, olor, perroFrente, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;

export function dibuja(g, t) {
  const c = cam(7.8 + Math.sin(t * 1.4) * 0.15, 420, -108);
  parqueListo(g, c, t, 0.2);
  olor(g, 330, -70, "255,90,170", t, { n: 5, fuerza: 0.7, alfa: 0.35 });
  olor(g, 510, -80, "186,220,60", t + 1, { n: 5, fuerza: 0.7, alfa: 0.3 });
  olor(g, 420, -40, "40,210,255", t + 0.5, { n: 4, fuerza: 0.55, alfa: 0.3 });
  perroFrente(g, {
    x: 420, t, cola: 0.7,
    cabeza: { ladea: Math.sin(t * 1.6) * 0.28, ojo: 0, oreja: 0.15, mira: Math.sin(t * 0.8) * 0.4 },
  });
  cierra(g, 0.5);
}
