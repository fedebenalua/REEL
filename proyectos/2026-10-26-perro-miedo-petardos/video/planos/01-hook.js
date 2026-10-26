// «¿Por qué tu perro tiene miedo a los petardos?»
// Fotograma 0: el petardo ya está enorme. La cámara va de la ventana al perro, que tiembla.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;
const fin = v.frase(2).t("casi") - 0.04;
const Tpet = v.frase(1).t("petardos");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, 0.02, Tpet + 0.15));
  const Z = k.mez(5.4, 7.5, u * (1 - q) + q * 0.92);
  const x = m.PX;
  const c = { Z, cx: k.mez(230, x - 8, u), cy: m.pies(Z, k.mez(1240, 1340, u)) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  const f = 1 - q;
  m.perro(g, {
    x: x + m.temblor(t, f), t, dir: -1, marcha: 0, fase: 0.18,
    cola: 0.02, pitch: 0.04, cabeza: { ang: -0.42, oreja: -0.9, ojo: 0 },
  });
  m.sinVista(g);
  const [vx, vy] = m.ventana(c);
  const yv = Math.min(760, Math.max(560, vy));
  m.fuegos(g, vx, yv, m.avance(t, -0.28, 1.05), 4, 1.7);
  m.fuegos(g, vx - 40, yv + 30, m.avance(t, 0.28, 1.15), 8, 1.45);
  m.fuegos(g, vx + 50, yv + 10, m.avance(t, Tpet - 0.06, 0.7), 11, 0.85);
  m.tinte(g, m.avance(t, -0.28, 1.05), "255,150,60", 0.26);
  m.tinte(g, m.avance(t, 0.28, 1.15), "255,120,200", 0.18);
  m.tinte(g, m.avance(t, Tpet - 0.08, 0.72), "255,190,90", 0.18 * f);
  m.cierra(g, 0.5);
}
