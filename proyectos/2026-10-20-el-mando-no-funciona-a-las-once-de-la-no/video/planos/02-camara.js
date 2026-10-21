// «Antes de abrirlo, haz esto: apúntalo a la cámara del móvil y pulsa un botón.»
// «Si ves una lucecita morada, el mando está bien. Si no ves nada, son las pilas.»
// La punta del mando de frente y el móvil, en el salón a oscuras. Se entra con un corte en «Antes».
// - «Antes de abrirlo»: la punta del mando, enorme, en el centro.
// - «apúntalo a la cámara del móvil»: el mando se aparta arriba a la izquierda y sube el móvil con la cámara abierta.
// - «pulsa un botón»: el botón rojo se hunde y en la pantalla del móvil la punta se enciende morada.
// - «el mando está bien»: «bien», en verde. «Si no ves nada»: otro golpe y en el móvil no sale nada; «son las pilas»:
//   entran dos pilas grandes, vacías.
import * as k from "#kit";
import { v } from "#voz";
import { camaraDelMovil, fondoOscuro, movil, pila, puntaDeFrente, temblor } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2), f3 = v.frase(3);
export const desde = (vz) => vz.frase(2).inicio;
const T2 = f2.inicio, Tapu = f2.t("apuntalo"), Tpul = f2.t("pulsa"), Tluc = f3.t("lucecita"), Tbien = f3.t("bien"), Tsi2 = f3.t("si", 2), Tpil = f3.t("pilas"), Tson = f3.t("son"), Fin = v.frase(4).inicio;
const BUENOS = [Tpul + 0.1, Tluc - 0.1, Tluc + 0.45], MALOS = [Tsi2 + 0.1, Tsi2 + 0.55];
const MANDO = { x: 330, y: 790, w: 560 }, MOVIL = { x: 720, y: 1200, w: 500, ang: 0.07 };

export function dibuja(g, t) {
  fondoOscuro(g);
  const golpes = [...BUENOS, ...MALOS];
  const p = golpes.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.09)), 0);
  const ap = su(tr(t, Tapu - 0.15, Tapu + 0.45));
  const mx = mez(540, MANDO.x, ap), my = mez(1000, MANDO.y, ap), mw = mez(900, MANDO.w, ap);
  puntaDeFrente(g, mx, my + 6 * Math.sin(t * 1.3), mw, 0, p);
  temblor(g, mx, my, mw, t, BUENOS);
  const en = entra(tr(t, Tapu - 0.1, Tapu + 0.5));
  if (en > 0) {
    const led = BUENOS.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.06, 0.12)), 0) + 0.35 * su(tr(t, Tluc - 0.2, Tluc)) * (1 - su(tr(t, Tbien + 0.3, Tsi2)));
    movil(g, MOVIL.x, mez(2600, MOVIL.y, en), MOVIL.w, MOVIL.ang, camaraDelMovil(Math.min(1, led), p));
  }
  // «bien»
  const bien = su(tr(t, Tbien - 0.15, Tbien + 0.1)) * (1 - su(tr(t, Tsi2 - 0.1, Tsi2 + 0.15)));
  k.etiqueta(g, 560, 610, "está bien", "120,255,140", bien, 56);
  // «son las pilas»
  const e1 = entra(tr(t, Tson, Tson + 0.35)), e2 = entra(tr(t, Tson + 0.1, Tson + 0.45));
  if (e1 > 0) pila(g, mez(-500, 520, e1), 1060, 760, -0.12, 0.06, t);
  if (e2 > 0) pila(g, mez(1600, 560, e2), 1300, 760, -0.06, 0.06, t);
}

export const momentos = { buenos: BUENOS, malos: MALOS, pilas: Tson };
