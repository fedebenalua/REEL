// «Si hay dos juguetes, cada perro se queda el suyo.»
// Una cuerda y una pelota. Cada uno coge la suya y se separan.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(6).inicio - 0.04;

const f = v.frase(6);
const Tcada = f.t("cada"), Tsuyo = f.t("suyo");

export function dibuja(g, t) {
  const parte = k.suave(k.tramo(t, Tcada - 0.05, Tsuyo + 0.15));
  const xL = k.mez(340, 250, parte);
  const xR = k.mez(500, 610, parte);
  const Z = k.mez(5.3, 4.15, parte);
  const cx = k.mez(420, 430, parte);
  const c = { Z, cx, cy: -48 };
  m.parque(g, c, t, 0.05);
  m.ponVista(g, c);
  const izq = m.perro(g, {
    x: xL, dir: 1, fase: parte * 2.2, marcha: parte * 0.7, t, cola: 0.6,
    cabeza: { ang: 0.15 * (1 - parte), abre: 0.1, oreja: 0.1 },
  });
  const der = m.perro(g, {
    x: xR, dir: -1, fase: parte * 2.4 + 0.4, marcha: parte * 0.7, t, cola: 0.7,
    cabeza: { ang: 0.1, abre: 0.12, ojo: parte > 0.5 ? 1 : 0 },
  });
  const bocaL = m.enBoca(izq.nariz, 1, 3);
  const bocaR = m.enBoca(der.nariz, -1, 3);
  // La cuerda pasa del suelo a la boca del de la izquierda. La pelota, a la del de la derecha.
  const cuerdaSuelo = [390, -8];
  const pelotaSuelo = [460, -14];
  const a = [k.mez(cuerdaSuelo[0], bocaL[0], parte), k.mez(cuerdaSuelo[1], bocaL[1], k.entra(parte))];
  const b = [k.mez(cuerdaSuelo[0] + 36, bocaL[0] + 28, parte), k.mez(-6, bocaL[1] + 8, parte)];
  m.cuerda(g, a[0], a[1], b[0], b[1], t, 0.4 + 0.4 * parte);
  const px = k.mez(pelotaSuelo[0], bocaR[0], parte);
  const py = k.mez(pelotaSuelo[1], bocaR[1], k.entra(parte)) - Math.sin(parte * Math.PI) * 18;
  if (parte < 0.85) m.sombra(g, pelotaSuelo[0], 14, 0.25 * (1 - parte));
  m.pelota(g, px, py, 1.15, parte * 1.2);
  m.cierra(g, 0.4);
}
