// «Así que es redonda para no caerle encima a quien trabaja abajo.»
// Desde el pozo se ve el cielo tapado. El casco mira arriba. La tapa no cae.
import * as k from "#kit";
import { v } from "#voz";
import { pozo, velo } from "../mundo.js";

export const desde = "asi";

const f = v.frase(8);
const Tabajo = f.t("abajo");
const fin = v.t("enviaselo") - 0.04;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, Tabajo));
  const quieto = t > fin - 0.35;
  pozo(g, t, {
    zoom: k.mez(1, 1.14, quieto ? k.suave(k.tramo(fin - 0.35, f.inicio, Tabajo)) : u),
    escTapa: 1,
    sube: quieto ? 18 : 18 * u,
    tMota: Math.min(t, fin - 0.4),
  });
  velo(g, 0.66);
}
