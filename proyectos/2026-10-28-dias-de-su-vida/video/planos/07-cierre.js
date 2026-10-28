// No guardan el mundo: guardan sus días. El plato de ayer se vacía. El último fotograma vuelve al túnel.
import * as k from "#kit";
import { v } from "#voz";
import { plato, tenedor, tunel, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio - 0.04;
export const entrada = "corte";

const f11 = v.frase(11);
const f12 = v.frase(12);
const Tmundo = f11.t("mundo");
const Tdias = f11.t("dias");
const Tamigo = f12.t("amigo");
const Tceno = f12.t("ceno");
const Tayer = f12.t("ayer");

const zCam = k.claves([
  [f11.inicio, 12.5],
  [Tmundo, 12.3],
  [Tdias, 13.15],
  [Tamigo, 13.45],
  [Tayer + 0.2, 13.5],
  [Tayer + 0.7, 13.45],
  [v.duracion, 4.0],
]);

export function dibuja(g, t) {
  const z = zCam(t);
  const cam = k.mira([0, 0.04, z], [0, 0.08, z + 7]);
  const tierra = 1 - k.suave(k.tramo(t, Tmundo - 0.08, Tmundo + 0.55));
  const dias = k.suave(k.tramo(t, Tdias - 0.1, Tdias + 0.4));
  tunel(g, cam, { escenaHero: 0.45 + 0.55 * dias, alTarjeta: () => 0.55 + 0.45 * dias });
  if (tierra > 0.02) {
    const p = k.proyecta(cam, [0.05, 0.15, 15.6]);
    if (p) {
      g.save();
      g.globalAlpha = tierra;
      k.tierra(g, p.x, p.y, k.tamano(0.7, p.z), t * 0.04, -0.6, -0.2);
      g.restore();
    }
  }
  const entraPlato = k.entra(k.tramo(t, Tamigo - 0.08, Tamigo + 0.45));
  const come = 1 - k.suave(k.tramo(t, Tceno - 0.05, Tayer + 0.15));
  const seVa = k.suave(k.tramo(t, Tayer + 0.72, v.duracion - 0.08));
  if (entraPlato > 0.02 && seVa < 0.98) {
    const y = k.mez(1680, 1240, entraPlato) + seVa * 560;
    const al = entraPlato * (1 - seVa);
    g.save();
    g.globalAlpha = al;
    plato(g, 540, y, 1.55, come);
    tenedor(g, 820, y - 40, 1.1, -0.4);
    g.restore();
  }
  velo(g, 0.72);
}
