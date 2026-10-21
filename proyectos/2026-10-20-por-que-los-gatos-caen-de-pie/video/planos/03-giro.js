// «Entonces encoge las patas de delante y gira solo la mitad delantera. Luego encoge las de atrás, y gira la otra
// mitad.»
// El mismo gato en el vacío; la cámara acaba de salir de su oído y lo ve entero, de lado.
// - «encoge las patas de delante»: las pega al pecho; las de atrás se estiran.
// - «gira solo la mitad delantera»: la mitad de delante se ilumina en naranja y da la vuelta (las rayas del lomo
//   ruedan); la de atrás sigue boca arriba y gira un poco al revés.
// - «Luego encoge las de atrás»: las de atrás se recogen y las de delante se estiran.
// - «gira la otra mitad»: la mitad de atrás se ilumina en azul y da la vuelta; el gato, de pie en el aire.
import * as k from "#kit";
import { caida, camVacio, gato, vacio, velo, vineta } from "../mundo.js";

export const desde = "encoge";
export const entrada = "sigue";

export function dibuja(g, t) {
  const cam = camVacio(t), st = caida(t);
  vacio(g, t, 0.5, 40);
  gato(g, { ...st, x: cam.x, y: cam.y, esc: cam.esc, ang: cam.ang });
  vineta(g, 0.45);
  velo(g, 0.45);
}
