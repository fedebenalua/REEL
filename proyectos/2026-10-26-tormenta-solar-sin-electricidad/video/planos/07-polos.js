// «¿Toda la humanidad a oscuras? Los estudios dicen que no: el peligro está sobre todo en las redes cerca de los polos.»
// Otro sitio: la Tierra de noche, grande, con sus ciudades encendidas. Corte en «Toda».
// - «a oscuras»: se apagan todas las ciudades a la vez.
// - «que no»: vuelven a encenderse.
// - «el peligro está...»: la Tierra se inclina y enseña el polo norte, con su óvalo de aurora.
// - «cerca de los polos»: las ciudades de cerca del polo se encienden en rojo, bajo la aurora.
import * as k from "#kit";
import { v } from "#voz";
import { CIELO, tierraNoche } from "../mundo.js";

const f7 = v.frase(7);
export const desde = f7.inicio;

const { suave, tramo } = k;
const T0 = f7.inicio, Tosc = f7.t("oscuras"), Tno = f7.t("no"), Tpel = f7.t("peligro"), Tred = f7.t("redes"), Tpol = f7.t("polos"), Tfin = f7.fin;
const CAM = k.mira([0, 0, 60], [0, 0, -100]);

export function dibuja(g, t) {
  k.fondo(g, CAM);
  k.estrellas(g, CAM, null, CIELO);
  const inclina = suave(tramo(t, Tpel - 0.2, Tred + 0.2));
  const rad = k.mez(330, 430, (u => 0.6 * u + 0.4 * suave(u))(tramo(t, T0, Tfin)));
  const Y = k.mez(1000, 1060, inclina);
  const luces = 1 - suave(tramo(t, Tosc - 0.05, Tosc + 0.3)) * (1 - suave(tramo(t, Tno - 0.05, Tno + 0.35)));
  const rojo = suave(tramo(t, Tpol - 0.3, Tpol + 0.2));
  tierraNoche(g, 540, Y, rad, 2.0 + t * 0.05 + 0.25 * suave(tramo(t, T0, Tpel)), {
    inc: k.mez(0.25, 0.95, inclina),
    luces,
    rojo: (c) => rojo * suave(tramo(c.lat, 0.72, 0.92)),
    aurora: k.mez(0.25, 1, inclina),
    auroraT: t,
  });
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.45)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
