// «Pero sin pilas, la lucecita no se enciende, y el mando ya no sirve para nada.»
// El salón, con el mando delante de la tele. Se entra con un corte en «Pero».
// - «sin pilas»: dos pilas salen disparadas del mando hacia la cámara, grandes, con su marca roja: vacías; luego caen.
// - «la lucecita no se enciende»: el botón se hunde una y otra vez y de la punta no sale nada; la tele, igual.
// - «ya no sirve para nada»: el mando se apaga, se ladea y cae fuera de la imagen.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, MANDO, mando, pila, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f7 = v.frase(7);
export const desde = (vz) => vz.frase(7).inicio;
const Tsin = f7.t("sin"), Tpil = f7.t("pilas"), Tluc = f7.t("lucecita"), Tenc = f7.t("enciende"), Tya = f7.t("ya"), Tnad = f7.t("nada"), Fin = v.frase(8).inicio;
const GOLPES = [Tluc - 0.05, Tluc + 0.45, Tenc + 0.05, Tenc + 0.5];

export function dibuja(g, t) {
  const cam = { x: 0, y: 20, z: 0.6 };
  salon(g, cam, t, { encendida: 1, canal: 0 });
  const p = GOLPES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.06, 0.09)), 0);
  // el mando: al final se ladea y cae
  const cae = sale(tr(t, Tya, Tnad + 0.35));
  const M = { X: MANDO.X - 40 * cae, Y: MANDO.Y + 900 * cae, Z: MANDO.Z, ang: MANDO.ang - 0.9 * cae };
  mando(g, cam, t, { pulsa: p }, M);
  // apagado: un velo gris sobre todo cuando ya no sirve
  const gris = su(tr(t, Tya - 0.1, Tya + 0.4));
  if (gris > 0) { g.fillStyle = `rgba(10,8,20,${0.35 * gris})`; g.fillRect(0, 0, 1080, 1920); }
  // las pilas: salen hacia la cámara y luego caen
  const sale1 = entra(tr(t, Tsin - 0.05, Tpil + 0.25)), sale2 = entra(tr(t, Tsin + 0.05, Tpil + 0.35));
  const caen = Math.pow(Math.max(0, t - (Tluc - 0.1)), 2) * 2600;
  const nivel = mez(0.5, 0.06, su(tr(t, Tpil, Tpil + 0.4)));
  if (sale1 > 0) pila(g, mez(560, 470, sale1), mez(1300, 1000, sale1) + caen, mez(200, 760, sale1), mez(-0.6, -0.12, sale1), nivel, t);
  if (sale2 > 0) pila(g, mez(600, 610, sale2), mez(1330, 1240, sale2) + caen * 1.1, mez(200, 760, sale2), mez(-0.4, 0.08, sale2), nivel, t);
  velo(g, 0.45);
}

export const momentos = { pilas: Tsin, golpes: GOLPES, cae: Tya };
