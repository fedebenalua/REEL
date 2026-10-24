// «Igual que la tapa de una olla, que tampoco se cae dentro.»
// La tapa baja, el borde de la olla la para y se queda fuera.
import * as k from "#kit";
import { v } from "#voz";
import { camara, olla, sinVista, velo, vista } from "../mundo.js";

export const desde = "igual";

const f = v.frase(7);
const Tolla = f.t("olla");
const fin = v.t("asi") - 0.04;

const cam = camara([
  [f.inicio - 0.25, 1.38, 0, 20],
  [Tolla, 1.52, 0, -10],
  [fin - 0.4, 1.48, 0, -6],
  [fin, 1.48, 0, -6],
]);

const bajaC = k.claves([
  [f.inicio - 0.35, -280],
  [Tolla, 0],
  [fin, 0],
]);

export function dibuja(g, t) {
  const c = cam(Math.min(t, fin));
  const rebote = 22 * Math.sin(k.tramo(t, Tolla, Tolla + 0.55) * Math.PI) * (t < Tolla + 0.55 ? 1 : 0);
  const baja = bajaC(t) - (t >= Tolla && t < Tolla + 0.55 ? rebote : 0);
  const vapor = t < Tolla ? t : Tolla;
  g.save();
  vista(g, c.z, c.x, c.y);
  olla(g, baja, vapor);
  g.restore();
  sinVista(g);
  velo(g, 0.7);
}
