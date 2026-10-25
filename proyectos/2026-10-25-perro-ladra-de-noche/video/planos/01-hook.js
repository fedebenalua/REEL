// «¿Por qué tu perro ladra a la nada, de noche?» La cara, ya ladrando, y el pitido que sale.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;
const fin = v.frase(2).inicio;

export function dibuja(g, t) {
  const quieto = k.suave(k.tramo(t, fin - 0.4, fin - 0.14));
  const u = k.suave(k.tramo(t, 0.05, fin - 0.45));
  const Z = k.mez(15.5, 12.4, u);
  const c = { Z, cx: m.PX + 4, cy: k.mez(-112, -104, u) };
  const tt = k.mez(t, fin - 0.4, quieto);
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.cara(g, m.PX, t, { ladra: k.mez(m.ladrido(tt, 0.34, 0.07), 0.92, quieto) });
  m.ondas(g, m.PX + 8, -72, tt, { radio: 62, fuerza: 1, color: "170,230,255", n: 6, cada: 0.38, grosor: 3.4 });
  m.rellena(g, 0.55);
}
