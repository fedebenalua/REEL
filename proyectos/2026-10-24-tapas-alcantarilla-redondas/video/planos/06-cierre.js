// «Envíaselo a ese amigo que pasa por encima todos los días.»
// Las zapatillas cruzan la tapa y la cámara acaba pegada a ella, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import { asfalto, camara, sinVista, tapaRedonda, velo, vista, zapatillas } from "../mundo.js";

export const desde = "enviaselo";

const f = v.frase(9);
const Tpasa = f.t("pasa");
const Tdias = f.t("dias");
const fin = v.duracion;

const cam = camara([
  [f.inicio - 0.2, 0.92, -40, 60],
  [Tpasa, 1.05, 0, 20],
  [Tdias, 1.28, 0, 0],
  [fin - 0.45, 1.48, 0, -8],
  [fin, 1.48, 0, -8],
]);

export function dibuja(g, t) {
  const c = cam(Math.min(t, fin));
  const x = k.claves([
    [Tpasa - 0.15, -460],
    [Tdias, 80],
    [fin, 80],
  ])(t);
  const fase = k.tramo(t, Tpasa - 0.1, Tdias);
  const andando = t < Tdias + 0.05 ? fase * 3 : 3;
  g.save();
  vista(g, c.z, c.x, c.y);
  asfalto(g, t);
  tapaRedonda(g, 0, 0.02);
  g.translate(0, 36);
  zapatillas(g, x, andando);
  g.restore();
  sinVista(g);
  velo(g, 0.78);
}
