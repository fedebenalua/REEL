// Por dentro: el aviso baja a la médula y la pata de ese lado dispara, cuatro veces por segundo,
// y más fuerte llega más lejos sin ir más deprisa.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "medula";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const Tmed = f4.t("medula");
const Tdis = f4.t("dispara");
const Tlado = f4.t("lado");
const Tcuatro = f5.t("cuatro");
const Tfuerte = f6.t("fuerte");
const Tlejos = f6.t("lejos");
const Tcorte = v.t("como");
// el ciclo de 4 Hz cae en el punto alto justo en «lejos»
const TPICO = Tdis + 29.5 / 4;

export function dibuja(g, t) {
  const viaja = k.suave(k.tramo(t, Tmed - 0.05, Tdis - 0.05));
  let fase = 0;
  let ampl = 0.2;
  let estela = 0;
  if (t >= Tdis && t < TPICO) {
    fase = ((t - Tdis) * 4) % 1;
    const crece = k.suave(k.tramo(t, Tfuerte, TPICO - 0.15));
    ampl = k.mez(0.72, 1.16, crece);
    estela = 1;
  } else if (t >= TPICO) {
    fase = 0.5;
    ampl = 1.16;
    estela = 0;
  }

  const pulso = viaja;
  const late = t >= Tdis && t < TPICO ? Math.pow(Math.max(0, Math.sin(((t - Tdis) * 4) % 1 * Math.PI)), 1.4) : (t >= TPICO ? 0.35 : 0);
  const cerebro = 0.28;

  const pata = m.mundoDe(m.pataLocal(0.5, 0.9));
  const z = k.claves([
    [Tmed, 1.2],
    [Tdis, 1.4],
    [Tlado, 1.32],
    [Tcuatro, 2.05],
    [Tfuerte, 1.62],
    [Tlejos, 1.18],
    [Tcorte - 0.25, 1.12],
  ])(t);
  const fx = k.claves([
    [Tmed, m.DOG.x + 80],
    [Tdis, m.DOG.x + 10],
    [Tcuatro, pata[0]],
    [Tfuerte, pata[0] - 20],
    [Tlejos, m.DOG.x - 10],
    [Tcorte - 0.25, m.DOG.x],
  ])(t);
  const fy = k.claves([
    [Tmed, m.DOG.y - 70],
    [Tdis, m.DOG.y],
    [Tcuatro, pata[1]],
    [Tfuerte, pata[1] - 10],
    [Tlejos, m.DOG.y + 10],
    [Tcorte - 0.25, m.DOG.y],
  ])(t);

  m.conCam(g, { z, fx, fy }, () => {
    m.oscuro(g);
    m.perroLado(g, {
      t, fase, ampl, estela, luz: 1, pulso, late, cerebro, lengua: 0, alegre: 0,
    });
  });
  m.velo(g, 0.55);
}
