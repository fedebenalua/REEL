// «No van juntas: eliges una cada vez.»
// Dos cartas y una sola ranura. El salto de regla se come casi un segundo.
import * as k from "#kit";
import { v } from "#voz";
import { carta, ranura, sala, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio - 0.04;

const f11 = v.frase(11), f12 = v.frase(12);
const Teliges = f11.t("eliges");
const Tcambiar = f12.t("cambiar"), Tsegundo = f12.t("segundo");
const corte = v.frase(13).inicio - 0.04;

export function dibuja(g, t) {
  sala(g, "#120818", "#07060e", 540, 1000, 860);
  const entra = k.entra(k.tramo(t, f11.inicio, Teliges + 0.15));
  const salto = k.suave(k.tramo(t, Tcambiar, Tcambiar + 0.35));
  const suelta = k.suave(k.tramo(t, Tsegundo + 0.15, Tsegundo + 0.55));
  // durante el segundo, el salto se queda a medias
  const congelado = salto * (1 - suelta);
  const prog = k.mez(salto, 0.42, congelado) ;
  // carta triángulo: entra en la ranura y luego sale
  const triX = k.mez(250, 540, entra) + k.mez(0, -290, prog);
  const triY = k.mez(1180, 1040, entra);
  const triAl = 1;
  // círculo: espera y entra al soltarse
  const cirX = k.mez(830, 540, suelta);
  const cirY = 1180 - 80 * (1 - suelta) * salto;
  ranura(g, 540, 1160, 1.05, 0.4 + 0.6 * entra);
  carta(g, triX, k.mez(1280, 1160, entra), 1.05, "tri", triAl * (1 - 0.35 * suelta));
  carta(g, cirX, k.mez(1280, 1160, suelta), 1.05, "cir", 0.55 + 0.45 * suelta);

  const num = k.suave(k.tramo(t, Tsegundo - 0.45, Tsegundo - 0.12)) * (1 - k.suave(k.tramo(t, corte - 0.4, corte - 0.12)));
  k.pastilla(g, 540, 680, "1", "s", "255,214,120", num, 150);
  // que no lata al cortar
  if (t < Tsegundo - 0.2) k.brillo(g, 540, 1040, 700, "255,200,90", 0.2 * k.pulso(t, Teliges, 0.15));
  velo(g);
}
