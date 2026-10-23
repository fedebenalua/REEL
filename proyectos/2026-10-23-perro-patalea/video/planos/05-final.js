// Otra vez el salón: no se ríe, la pata rasca el sitio de la mano, y se cierra en la misma pata del principio.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "asi";

const f9 = v.frase(9), f10 = v.frase(10);
const Triendo = f9.t("riendo");
const Trascar = f9.t("rascar");
const Ttu = f9.t("tu");
const Tpatadas = f10.t("patadas");
const fin = v.duracion;

export function dibuja(g, t) {
  const lengua = 1 - k.suave(k.tramo(t, Triendo - 0.12, Triendo + 0.28));
  const llega = k.suave(k.tramo(t, Trascar - 0.45, Trascar + 0.05));
  const rasca = Math.sin((t - Trascar) * 24) * k.suave(k.tramo(t, Trascar, Trascar + 0.15))
    * (1 - k.suave(k.tramo(t, Ttu - 0.15, Ttu + 0.2)));
  const entraZoom = k.suave(k.tramo(t, Tpatadas - 0.05, fin - 0.35));

  let fase;
  let ampl;
  if (t < Trascar - 0.45) {
    fase = 0.02;
    ampl = 0.3;
  } else if (t < f10.inicio) {
    fase = 0.5 * llega + rasca * 0.04;
    ampl = k.mez(0.35, 1, llega);
  } else {
    fase = (0.5 + (t - f10.inicio) * 4) % 1;
    ampl = 0.92;
  }

  const cara = [m.DOG.x + 250, m.DOG.y - 90];
  const contacto = m.mundoDe([30, -10]);
  const zBase = k.claves([
    [f9.inicio, 1.35],
    [Triendo, 1.45],
    [Trascar, 1.72],
    [Ttu, 1.55],
    [f10.inicio, 1.02],
    [Tpatadas - 0.1, 0.98],
  ])(t);
  const z = k.mez(zBase, 2.35, entraZoom);
  const fxB = k.claves([
    [f9.inicio, cara[0]],
    [Triendo, cara[0] - 20],
    [Trascar, contacto[0]],
    [Ttu, contacto[0]],
    [f10.inicio, m.DOG.x + 40],
    [Tpatadas, m.DOG.x + 10],
  ])(t);
  const fyB = k.claves([
    [f9.inicio, cara[1]],
    [Trascar, contacto[1]],
    [Ttu, contacto[1]],
    [f10.inicio, m.DOG.y + 20],
    [Tpatadas, m.DOG.y + 30],
  ])(t);
  const fx = k.mez(fxB, contacto[0], entraZoom);
  const fy = k.mez(fyB, contacto[1], entraZoom);

  const alta = m.mundoDe([55, -36]);
  m.conCam(g, { z, fx, fy }, () => {
    m.salon(g, t);
    m.perroLado(g, {
      t, fase, ampl, lengua, alegre: lengua * 0.8, zona: llega, estela: entraZoom,
    });
    m.mano(g, alta[0] + 55, alta[1] - 18, 1.25, Trascar);
  });
  m.velo(g, 0.9);
}
