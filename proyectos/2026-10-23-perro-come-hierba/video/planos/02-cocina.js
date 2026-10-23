// La cocina: el pienso y el plato de casa se quedan llenos. El perro se va a la hierba.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(6).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(6);
const Tpienso = f.t("pienso");
const Tcomida = f.t("comida");
const Tcasa = f.t("casa");
const Tcomia = f.t("comia");

export function dibuja(g, t) {
  const x = k.claves([
    [f.inicio - 0.2, 360],
    [Tpienso + 0.2, 540],
    [Tcomida + 0.25, 880],
    [Tcasa + 0.7, 1320],
    [Tcomia, 1360],
  ])(t);
  const enPuerta = k.suave(k.tramo(t, Tcasa + 0.35, Tcomia));
  const huele = 1 - enPuerta;
  const z = k.claves([[f.inicio, 0.92], [Tcomida, 0.88], [Tcomia, 0.86]])(t);
  const fx = k.claves([[f.inicio, 820], [Tcomida, 900], [Tcasa, 1100], [Tcomia, 1140]])(t);
  const cam = { z, fx, fy: 1180 };

  m.conCam(g, cam, () => {
    m.cocina(g, t);
    m.cuenco(g, 560, 1280, 1.15, "croqueta");
    m.cuenco(g, 900, 1280, 1.15, "guiso");
    for (let i = 0; i < 8; i++) m.brizna(g, 1340 + i * 28, 760, 70 + (i % 3) * 16, 7, i % 2 ? 12 : -10, i / 8, t, i);
    m.perro(g, x, 1380, 1.35, {
      t, baja: huele * 0.72 + enPuerta * 0.95, come: enPuerta > 0.45,
      miraX: enPuerta > 0.4 ? 6 : 0, sem: 0.4, cola: enPuerta > 0.8 ? 0.12 : 0.4,
    });
  });
  m.velo(g, 0.7);
}
