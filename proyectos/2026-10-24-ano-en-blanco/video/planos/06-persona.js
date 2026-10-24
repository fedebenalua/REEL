// «En personas, eso no está igual de claro.»
// Una cara grande, ya en el primer fotograma. A la derecha, los hilos se quedan a medias.
import * as k from "#kit";
import { v } from "#voz";
import { cara, fondoCueva, neuronas, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
const f8 = v.frase(8);
const Tc = f8.t("claro");
const Fin = v.frase(9).inicio;

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#2a1020");
  bg.addColorStop(0.45, "#ffb088");
  bg.addColorStop(1, "#e08858");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  const u = k.suave(k.tramo(t, f8.inicio + 0.05, Tc));
  const congelado = Math.min(t, Fin - 0.24);
  g.save();
  g.beginPath();
  g.rect(500, 420, 580, 1300);
  g.clip();
  fondoCueva(g, ["#4a1860", "#1a1028", "#120810"]);
  neuronas(g, congelado, 0.45 * u);
  g.restore();

  cara(g, 340, 1080, 1.7);
  const pulso = t < Fin - 0.3 ? 0.22 : 0.12;
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 760, 1000, 420, "violeta", pulso * (1 - k.suave(k.tramo(t, Fin - 0.34, Fin - 0.18))));
  g.restore();
  veloArriba(g, 0.78);
}
