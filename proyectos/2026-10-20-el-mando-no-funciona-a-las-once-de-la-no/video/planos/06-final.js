// «Yo uso una que te dejo en el link de la bio, por si te pasa esta noche.»
// «Y envíaselo a ese amigo que siempre acaba sin mando.»
// El salón de noche, con la serie ya en marcha. Se entra con un corte en «Yo».
// - «Yo uso una»: el móvil delante, con la app; la serie se ve en la tele, moviéndose.
// - «link de la bio»: una etiqueta pequeña, «Link en la bio»; «esta noche»: el reloj del mueble, 23:01.
// - «pasa»: un toque y sube el volumen de la serie; «amigo»: otro toque, otra vez, y la cámara se aleja.
import * as k from "#kit";
import { v } from "#voz";
import { SERIE, appMando, destello, movil, ojito, pr, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(9).inicio;
const T9 = f9.inicio, Tlin = f9.t("link"), Tpas = f9.t("pasa"), Tnoc = f9.t("noche"), T10 = f10.inicio, Tami = f10.t("amigo"), Fin = v.duracion;
const TOQUES = [Tpas, Tami];
const SALEN = []; for (const t0 of TOQUES) for (let te = t0 + 0.05; te < t0 + 0.5; te += 0.12) SALEN.push(te);

export function dibuja(g, t) {
  const al = su(tr(t, T10, Fin));
  const cam = { x: 0, y: 20 + 60 * al, z: 0.6 - 1.6 * al };
  // cada toque, la tele obedece: sube el volumen de la serie
  const volAl = Math.max(su(tr(t, Tpas + 0.2, Tpas + 0.4)) * (1 - su(tr(t, Tpas + 1.3, Tpas + 1.6))), su(tr(t, Tami + 0.2, Tami + 0.4)) * (1 - su(tr(t, Fin - 0.6, Fin - 0.3))));
  const vol = mez(0.35, 0.55, su(tr(t, Tpas + 0.3, Tpas + 0.8))) + 0.25 * su(tr(t, Tami + 0.3, Tami + 0.8));
  salon(g, cam, t, { encendida: 1, canal: SERIE, volumen: vol, volAl });
  const r = pr(cam, 330, -10, 10.3);
  if (r) k.pastilla(g, r.x, r.y - 40 * r.s, "23:01", "", "255,90,90", su(tr(t, Tnoc - 0.3, Tnoc)), 70 * r.s);
  const sube = entra(tr(t, T9 - 0.05, T9 + 0.45));
  const my = mez(2600, 1290, sube) + 120 * al;
  movil(g, 560, my, 460, -0.1, appMando(0.6 * TOQUES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.12)), 0)));
  const b = ojito(cam);
  for (const te of SALEN) destello(g, { x: 530, y: my - 460 }, b, (t - te) / 0.5, 100);
  const bio = entra(tr(t, Tlin - 0.1, Tlin + 0.2));
  if (bio > 0) { g.font = "800 46px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 960 - 20 * (1 - bio), "Link en la bio", "255,140,220", bio, 46); }
  velo(g, 0.45);
}
