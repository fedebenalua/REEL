// «Con otro perro, si gana la cuerda, casi no la suelta.»
// Dos perros tiran. El de la derecha gana y se queda la cuerda en la boca.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(3).inicio - 0.04;

const f = v.frase(3);
const Tgana = f.t("gana"), Tcuerda = f.t("cuerda"), Tsuelta = f.t("suelta");

export function dibuja(g, t) {
  const gana = k.suave(k.tramo(t, Tgana - 0.05, Tgana + 0.42));
  const xL = k.mez(300, 250, gana);
  const xR = k.mez(500, 575, gana);
  const Z = k.claves([
    [f.inicio, 5.15], [Tcuerda, 6.4], [Tsuelta, 8.6], [f.fin, 8.8],
  ])(t);
  const cx = k.claves([
    [f.inicio, 400], [Tcuerda, 430], [Tsuelta, xR + 10], [f.fin, xR + 8],
  ])(t);
  const cy = k.claves([
    [f.inicio, -52], [Tcuerda, -46], [Tsuelta, -58], [f.fin, -60],
  ])(t);
  const c = { Z, cx, cy };
  m.parque(g, c, t, 0);
  m.ponVista(g, c);
  const tira = 0.55 + 0.45 * Math.sin(Math.min(t, Tgana + 0.15) * 7) * (1 - gana);
  const izq = m.perro(g, {
    x: xL, dir: 1, fase: t * 1.4, marcha: (1 - gana) * 0.35, t,
    pitch: 0.12 * (1 - gana), cola: 0.55,
    cabeza: { ang: 0.05, abre: 0.2, oreja: 0.1 },
  });
  const der = m.perro(g, {
    x: xR, dir: -1, fase: t * 1.6, marcha: 0.2 + 0.25 * (1 - gana), t,
    pitch: 0.08 + 0.1 * gana, cola: 0.45 + 0.5 * gana,
    cabeza: { ang: 0.08, abre: 0.15, ojo: gana > 0.6 ? 1 : 0, oreja: 0.2 },
  });
  const a = m.enBoca(izq.nariz, 1, 3);
  const b = m.enBoca(der.nariz, -1, 3);
  // Al ganar, el cabo de la izquierda se suelta y la cuerda se queda en el de la derecha.
  const suelto = [k.mez(a[0], b[0] + 16, gana), k.mez(a[1], b[1] + 10 + (1 - gana) * 0, k.sale(gana)) + Math.sin(gana * Math.PI) * -8];
  const tensa = k.mez(0.75 + tira * 0.2, 0.35, gana);
  m.cuerda(g, suelto[0], suelto[1], b[0], b[1], t, tensa);
  m.cierra(g, 0.4);
}
