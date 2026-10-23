// El salón: la pata enorme, la gracia que parece, y el costado de verdad.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tbarriga = f1.t("barriga");
const Tgracia = f2.t("gracia");
const Tb2 = f3.t("barriga");
const Tcostado = f3.t("costado");
const Tllega = f3.t("llega");
const Tcorte = v.t("medula");
const TPOSA = 8.945; // el ciclo cae en fase 0 y, desde ahí, la pata sube al costado

export function dibuja(g, t) {
  let fase;
  let ampl = 0.88;
  let estela = 1;
  if (t < TPOSA) {
    fase = m.ritmo(t);
  } else {
    const sube = k.suave(k.tramo(t, TPOSA, Tllega + 0.08));
    const quieto = k.suave(k.tramo(t, 10.85, 11.55));
    const rasca = Math.sin((t - Tllega) * 26) * (1 - quieto) * k.suave(k.tramo(t, Tllega, Tllega + 0.2));
    fase = 0.5 * sube + rasca * 0.035;
    ampl = k.mez(0.88, 1, sube);
    estela = 1 - sube;
  }

  const blanco = m.mundoDe(m.pataLocal(0.32, 0.9));
  const costado = m.mundoDe([24, -6]);
  const sigue = 1 - k.suave(k.tramo(t, 0.28, 1.05));
  const z = k.claves([
    [0, 2.35],
    [0.95, 1.28],
    [Tbarriga, 0.96],
    [Tgracia - 0.15, 1.12],
    [Tgracia + 0.55, 1.16],
    [f3.inicio, 1.0],
    [Tb2, 1.08],
    [Tcostado, 1.62],
    [Tllega, 1.78],
    [Tcorte - 0.28, 1.7],
  ])(t);
  const fxC = k.claves([
    [0, blanco[0]],
    [Tbarriga, m.DOG.x + 10],
    [Tgracia, m.DOG.x + 210],
    [Tb2, m.DOG.x + 40],
    [Tcostado, costado[0]],
    [Tcorte - 0.28, costado[0]],
  ])(t);
  const fyC = k.claves([
    [0, blanco[1]],
    [Tbarriga, m.DOG.y + 90],
    [Tgracia, m.DOG.y - 110],
    [Tb2, m.DOG.y + 70],
    [Tcostado, costado[1]],
    [Tcorte - 0.28, costado[1]],
  ])(t);
  const fx = k.mez(fxC, blanco[0], sigue);
  const fy = k.mez(fyC, blanco[1], sigue);

  const lengua = k.suave(k.tramo(t, f2.inicio + 0.05, Tgracia + 0.12))
    * (1 - k.suave(k.tramo(t, f3.inicio, f3.inicio + 0.55)));
  const marcaBarriga = k.suave(k.tramo(t, Tbarriga - 0.2, Tbarriga + 0.12))
    * (1 - k.suave(k.tramo(t, Tb2, Tcostado - 0.05)));
  const zona = k.suave(k.tramo(t, Tcostado - 0.28, Tcostado + 0.18));

  const baja = m.mundoDe([48, 72]);
  const alta = m.mundoDe([55, -36]);
  const uM = k.suave(k.tramo(t, Tb2 - 0.05, Tcostado + 0.02));
  const mx = k.mez(baja[0] + 70, alta[0] + 55, uM);
  const my = k.mez(baja[1] - 30, alta[1] - 20, uM);

  m.conCam(g, { z, fx, fy }, () => {
    m.salon(g, t);
    m.perroLado(g, {
      t, fase, ampl, lengua, alegre: lengua, barriga: marcaBarriga, zona, estela,
    });
    m.mano(g, mx, my, 1.25, t < TPOSA ? t : TPOSA);
  });
  m.velo(g, 0.9);
}
