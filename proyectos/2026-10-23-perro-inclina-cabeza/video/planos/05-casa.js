// «de las otras veces aún no se sabe» y el remate: no era «te quiero», era la palabra.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "otras";

const f8 = v.frase(8), f9 = v.frase(9);
const Tsabe = f8.t("sabe");
const Tasi = f9.t("asi");
const Tquiero = f9.t("quiero");
const Tsignificaba = f9.t("significaba");
const Tamigo = v.t("amigo");

export function dibuja(g, t) {
  const z = k.claves([
    [f8.t("otras") - 0.05, 1.02],
    [Tsabe, 1.04],
    [Tasi, 1.06],
    [Tquiero - 0.15, 1.45],
    [Tsignificaba, 1.55],
    [Tamigo - 0.25, 1.5],
  ])(t);
  const fy = k.claves([
    [f8.t("otras"), 1120],
    [Tasi, 1100],
    [Tquiero, 920],
    [Tamigo, 900],
  ])(t);
  const cam = { z, fx: 540, fy };
  m.conCam(g, cam, () => m.salon(g, t, 0.15));

  const aHueco = (1 - k.suave(k.tramo(t, Tasi + 0.1, Tquiero - 0.35)));
  m.conCam(g, cam, () => {
    m.hueco(g, 780, 860, 120, aHueco);
    m.perro(g, 540, 1180, 1.45, {
      t, ladeo: m.LADEO, oreja: 0.22, alerta: 0.5, sem: 0.6,
      miraX: aHueco * 10,
    });
  });

  const aCor = k.suave(k.tramo(t, Tquiero - 0.12, Tquiero + 0.22)) * (1 - k.suave(k.tramo(t, Tquiero + 0.4, Tquiero + 0.9)));
  const rompe = k.tramo(t, Tquiero + 0.28, Tquiero + 1.0);
  m.conCam(g, cam, () => {
    if (aCor > 0.02) m.corazon(g, 540, 780, 2.2, aCor);
    m.trozos(g, 540, 820, rompe);
    const aBola = k.suave(k.tramo(t, Tsignificaba - 0.12, Tsignificaba + 0.35)) * (1 - k.suave(k.tramo(t, Tamigo - 0.45, Tamigo - 0.2)));
    if (aBola > 0.02) m.pelota(g, 540, 860, 110, aBola);
  });

  m.velo(g, 0.55);
}
