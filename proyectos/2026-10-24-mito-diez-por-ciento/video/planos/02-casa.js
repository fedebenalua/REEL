// «Como si de tu casa solo sirviera el recibidor, y el resto estuviera vacío.»
import * as k from "#kit";
import { v } from "#voz";
import { casa, velo } from "../mundo.js";

export const desde = "como";

export function dibuja(g, t) {
  const f = v.frase(3);
  const Trec = f.t("recibidor");
  const Tvac = f.t("vacio");
  const acerca = k.suave(k.tramo(t, f.inicio, Trec + 0.25));
  const vacio = k.suave(k.tramo(t, Tvac - 0.1, Tvac + 0.35));
  const pan = k.suave(k.tramo(t, Tvac - 0.05, Tvac + 0.4));
  g.save();
  g.translate(pan * -70, 0);
  casa(g, t, acerca, vacio);
  g.restore();
  velo(g, 0.7);
}
