// «...and the drip is gone.»
// La punta del grifo, seca: la cámara se acerca a la misma gota que no se forma; un destello en «gone».
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCocina } from "../cocina.js";
import { rutaCam, velo, viñeta } from "../mundo.js";

const F10 = v.frase(10);
export const desde = F10.t("and") - 0.04;
export const FIN = v.frase(11).inicio - 0.04;
const { suave: su, tramo: tr } = k;
const Tgone = F10.t("gone");
const CAMS = [[desde, { x: 110, y: 380, s: 1.3 }], [Tgone, { x: 180, y: 345, s: 2.6 }], [FIN, { x: 180, y: 345, s: 2.6 }]];

export function dibuja(g, t) {
  dibujaCocina(g, t, { cam: rutaCam(t, CAMS), gotas: [], nivel: 0 });
  const u = tr(t, Tgone - 0.1, Tgone + 0.3);
  if (u > 0 && u < 1) { const [x, y] = [540 + (180 - 180) * 2.6, 960 + (360 - 345) * 2.6]; k.brillo(g, 540, 1000, 700, "230,252,255", 0.6 * Math.sin(u * Math.PI)); }
  velo(g, 0.34); viñeta(g, 0.45);
}
