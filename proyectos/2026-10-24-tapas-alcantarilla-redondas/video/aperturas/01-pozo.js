// Otra apertura: desde dentro del pozo, la tapa cae hacia la cámara y el reborde la para.
// El vídeo se queda con la de la calle, porque en el primer segundo se ve que es redonda.
import * as k from "#kit";
import { v } from "#voz";
import { pozo, velo } from "../mundo.js";

export const desde = 0;

const fin = v.t("cuadrada") - 0.04;
const golpe = 0.7;

export function dibuja(g, t) {
  const cae = k.claves([
    [-0.15, 1.65],
    [golpe, 1],
    [fin, 1],
  ])(t);
  const zoom = k.claves([
    [-0.2, 1.25],
    [golpe, 1.05],
    [2.4, 1.02],
    [fin, 1.02],
  ])(t);
  pozo(g, t, {
    zoom,
    escTapa: cae,
    sube: k.de(t, golpe, 2.2, 0, 16),
    tMota: Math.min(t, fin - 0.35),
  });
  if (t > golpe && t < golpe + 0.35) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(255,200,120,${0.35 * (1 - (t - golpe) / 0.35)})`;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  velo(g, 0.6);
}
