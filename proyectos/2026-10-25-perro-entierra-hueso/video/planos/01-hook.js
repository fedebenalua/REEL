// «¿Por qué tu perro entierra el hueso, si ya ha comido?»
// Fotograma 0: ya cava, enorme, con tierra en el aire y el hueso en el hoyo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const fin = v.frase(2).inicio;

export function dibuja(g, t) {
  const viaje = k.suave(k.tramo(t, 0, fin - 0.25));
  const x = 470;
  const cam = { Z: k.mez(7.8, 7.1, viaje), cx: x + k.mez(-6, 18, viaje), cy: k.mez(-36, -28, viaje) };
  const u = k.suave(k.tramo(t, 0.1, fin - 0.45));
  const fuerza = 1 - k.suave(k.tramo(t, fin - 0.32, fin - 0.08));
  m.parque(g, cam, t, 0.08);
  m.ponVista(g, cam);
  m.lecho(g, x + 55);
  m.hoyo(g, x + 58, 0.4 + 0.5 * u);
  const info = m.cavando(g, x, t, 3.4);
  m.hueso(g, info.nariz[0] + 14, -4 + 12 * u, 1 - u * 0.75, -0.35, 1.2);
  m.tierra(g, info.pataDel[0], info.pataDel[1], t, fuerza);
  m.cierra(g, 0.5);
}
