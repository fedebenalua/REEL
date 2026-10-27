// «Sentías su mano como si fuera tuya, y aun así, tus cosquillas no hacían nada.»
// Lo que ve el otro, ya llenando la pantalla (viene de la lente de 02-gafas, sin corte).
// - «como si fuera tuya»: la mano roja se ilumina con un borde azul, el tuyo.
// - «aun así»: tu mano (manga azul) mueve la varilla, y la espuma le roza la palma.
// - «tus cosquillas»: salen chispas pequeñas; «nada»: se apagan en humo gris y la varilla para antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, velo } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez } = k;
const f4 = v.frase(4);
const Tmano = f4.t("mano"), Ttuya = f4.t("tuya"), Taun = f4.t("aun"), Tcos = f4.t("cosquillas"), Tnada = f4.t("nada"), Tfin = v.frase(5).inicio;

export function dibuja(g, t) {
  const z = mez(1, 1.12, su(tr(t, f4.inicio, Tfin)));
  const bordeAl = Math.pow(su(tr(t, Tmano - 0.15, Ttuya + 0.2)), 2.2) * (1 - 0.5 * su(tr(t, Tnada, Tfin)));
  const mano = 1;
  const mueve = mez(0.15, 1, su(tr(t, Taun - 0.1, Taun + 0.35))) * (1 - su(tr(t, Tnada + 0.1, Tfin - 0.3)));
  const chispa = 0.45 * su(tr(t, Tcos - 0.3, Tcos + 0.1)) * (1 - su(tr(t, Tnada - 0.25, Tnada + 0.1)));
  const apaga = tr(t, Tnada - 0.15, Tnada + 0.55);
  g.save();
  g.translate(540, 1100); g.scale(z, z); g.translate(-540, -1100);
  vista(g, t, { mueve, bordeAl, chispa, apaga: apaga > 0 && apaga < 1 ? apaga : -1, mano });
  g.restore();
  velo(g, 0.7);
}
