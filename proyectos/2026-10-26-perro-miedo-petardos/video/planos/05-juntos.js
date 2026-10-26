// «El petardo, el trueno y el disparo van juntos.» Tres estallidos, y él se agacha en los tres.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(5).t("petardo") - 0.04;
const f = v.frase(5);
const fin = v.frase(6).t("en") - 0.04;
const Tp = f.t("petardo");
const Tt = f.t("trueno");
const Td = f.t("disparo");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, Tp, f.t("juntos")));
  const Z = k.mez(5.2, 6.8, u);
  const x = m.PX + 20;
  const c = { Z, cx: k.mez(250, x, u), cy: m.pies(Z, k.mez(1220, 1320, u)) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  const golpes = (t > Tp ? 1 : 0) + (t > Tt ? 1 : 0) + (t > Td ? 1 : 0);
  m.perro(g, {
    x: x + m.temblor(t, (1 - q) * 0.8), t, dir: -1, marcha: 0, fase: 0.22,
    cola: 0.03, pitch: 0.04, cabeza: { ang: -0.15 - 0.08 * golpes, oreja: -0.75, ojo: 0 },
  });
  m.sinVista(g);
  const [vx, vy] = m.ventana(c);
  const yv = Math.max(560, vy);
  m.fuegos(g, vx, yv, m.avance(t, Tp - 0.02, 0.7), 6, 1.05);
  m.trueno(g, vx + 40, yv + 20, m.avance(t, Tt - 0.02, 0.62));
  m.disparo(g, vx - 30, yv + 10, m.avance(t, Td - 0.02, 0.38));
  m.tinte(g, m.avance(t, Tp - 0.02, 0.7), "255,150,60", 0.22);
  m.tinte(g, m.avance(t, Tt - 0.02, 0.62), "180,200,255", 0.2);
  m.tinte(g, m.avance(t, Td - 0.02, 0.38), "255,244,220", 0.16);
  m.cierra(g, 0.5);
}
