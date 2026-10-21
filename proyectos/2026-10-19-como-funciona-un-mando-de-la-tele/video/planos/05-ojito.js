// «En la tele, un ojito la recibe, lee el número y hace lo que dice: sube el volumen.»
// La tele del salón, de muy cerca. Se entra con un corte en «En».
// - «En la tele, un ojito»: el borde de abajo de la tele, enorme, con su ventanita oscura; llegan los destellos
//   morados desde abajo. «recibe»: el ojito se enciende.
// - «lee el número»: encima del ojito salen las ocho cifras del chip.
// - «hace lo que dice»: las cifras se van y la cámara se aleja hasta ver la tele; «sube el volumen»: la barra sube.
import * as k from "#kit";
import { v } from "#voz";
import { CODIGO, TV, cifras, destello, ojito, salon } from "../mundo.js";

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
export const desde = (vz) => vz.frase(8).inicio;
const T0 = f8.inicio, Trec = f8.t("recibe"), Tlee = f8.t("lee"), Tnum = f8.t("numero"), Thac = f8.t("hace"), Tsub = f8.t("sube"), Tvol = f8.t("volumen"), Fin = v.frase(9).inicio;

const OJ = { x: 0, y: TV.Y + TV.H / 2 + 13 };
const CERCA = { x: 0, y: OJ.y - 70, z: 7.3 }, LEJOS = { x: 0, y: TV.Y + 60, z: 2.2 };
function camara(t) {
  const u = su(tr(t, Thac - 0.1, Tsub + 0.25));
  const zc = mez(CERCA.z, LEJOS.z, u);
  return { x: 0, y: mez(CERCA.y, LEJOS.y, u), z: zc + 0.15 * su(tr(t, T0, Thac)) };
}
const SALIDAS = []; for (let te = T0 - 0.3; te < Tlee; te += 0.13) SALIDAS.push(te);

export function dibuja(g, t) {
  const cam = camara(t);
  const nivel = mez(0.3, 0.75, su(tr(t, Tsub, Tvol + 0.4)));
  const llega = su(tr(t, Trec - 0.15, Trec + 0.1));
  salon(g, cam, t, { encendida: 1, canal: 1, ojito: llega * (0.6 + 0.4 * Math.max(0, Math.sin(t * 25))) * (1 - su(tr(t, Thac, Tsub))), volumen: nivel, volAl: su(tr(t, Tsub - 0.5, Tsub - 0.1)) });
  const o = ojito(cam);
  // los destellos llegan desde abajo
  for (const te of SALIDAS) destello(g, { x: 560, y: 2000 }, o, (t - te) / 0.6, 140);
  // las cifras: el ojito las lee
  const n = mez(0, 8, tr(t, Tlee, Tnum + 0.3));
  cifras(g, 540, o.y - 230, CODIGO, n, 100, 1 - su(tr(t, Thac - 0.1, Thac + 0.3)));
}

export const momentos = { recibe: Trec, volumen: Tsub };
