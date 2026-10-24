// «¿Por qué tu perro da vueltas antes de echarse?»
// Fotograma 0: ya está girando, enorme, y la cámara sale al salón.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const fin = v.frase(2).inicio;

export function dibuja(g, t) {
  const u = k.tramo(t, 0, fin - 0.28);
  const quieto = m.asienta(t, fin);
  const s = m.giro(0.18 + u * 0.82, 2.4, m.CX, 76);
  const x = k.mez(s.x, m.CX + 10, quieto);
  const Z = k.claves([[0, 11.4], [0.28, 8.6], [0.85, 5.15], [fin - 0.2, 4.7], [fin, 4.65]])(t);
  const c = { Z, cx: x + 6, cy: -52 };
  m.salon(g, c, t, 0.2);
  m.ponVista(g, c);
  m.surco(g, m.CX, Math.min(1, 0.18 + u), 2.4, 76, "rgba(90,24,16,0.82)", 14);
  m.perro(g, {
    x, y: 0, dir: s.dir, fase: s.fase + 0.35, marcha: 1 - quieto, t,
    cola: 0.95, escala: s.escala,
    cabeza: { abre: 0.55 * (1 - quieto), ojo: 0.15, ang: -0.04, oreja: 0.08 },
  });
  m.rellena(g, 0.48);
}
