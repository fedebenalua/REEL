// «Si el ruido llega con algo bueno antes del miedo, baja mucho.»
// Un petardo pequeño y una galleta. Él se acerca.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(12).t("si") - 0.04;
const f = v.frase(12);
const fin = v.frase(13).t("empezar") - 0.04;
const Tbueno = f.t("bueno");
const Truido = f.t("ruido");
const Tbaja = f.t("baja");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, Tbueno - 0.1, Tbaja));
  const Z = k.mez(5.8, 6.6, u);
  const x = k.mez(300, 430, u);
  const c = { Z, cx: k.mez(280, 400, u), cy: m.pies(Z, 1320) };
  m.salon(g, c, t, m.DIA);
  m.ponVista(g, c);
  const marcha = 0.7 * (1 - k.suave(k.tramo(t, Tbaja - 0.15, Tbaja + 0.2)));
  m.perro(g, {
    x, t, dir: 1, marcha, fase: t * 2.4,
    cola: k.mez(0.4, 0.95, u), cabeza: { ang: k.mez(0.05, -0.15, u), oreja: 0.25, ojo: u > 0.45 ? 1 : 0, abre: 0.2 },
  });
  if (marcha > 0.2) m.polvoCorre(g, t, x - 30, 1);
  const llega = k.suave(k.tramo(t, Tbueno - 0.15, Tbueno + 0.35));
  const mx = k.mez(x + 160, x + 70, llega);
  const my = k.mez(-20, -36, llega);
  m.mano(g, mx, my, -0.35, 1.35);
  m.galleta(g, mx + 2, my - 22, k.mez(0.7, 1.2, llega));
  m.sinVista(g);
  const [vx, vy] = m.ventana(c);
  m.fuegos(g, vx, Math.max(520, vy), m.avance(t, Truido - 0.05, 0.85), 21, 0.42);
  m.cierra(g, 0.36);
}
