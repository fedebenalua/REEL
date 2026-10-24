// Otra apertura: el primer segundo recorre el cable a toda prisa y acaba en el mismo dial.
import { camaraPorElCable, escenaVieja } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  escenaVieja(g, t, camaraPorElCable(t));
}
