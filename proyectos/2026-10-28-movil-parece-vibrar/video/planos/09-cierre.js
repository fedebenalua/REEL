// El móvil no vibró: los anillos se vuelven tela. Luego el amigo lo saca y tampoco hay nada.
// El último instante vuelve al primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { anillos, bolsillo, hilosCobre, mano, movil, velo } from "../mundo.js";

export const desde = (v) => v.frase(11).inicio - 0.04;
export const entrada = "corte";

const f11 = v.frase(11);
const f12 = v.frase(12);
const Tvibro = f11.t("vibro");
const Tpuso = f11.t("puso");
const Tamigo = f12.t("amigo");
const Tsaca = f12.t("saca");
const Tnada = f12.t("nada");

export function dibuja(g, t) {
  const miente = 1 - k.suave(k.tramo(t, Tvibro - 0.05, Tvibro + 0.45));
  const muestra = k.suave(k.tramo(t, Tpuso - 0.1, Tpuso + 0.35));
  const amigo = k.suave(k.tramo(t, f12.inicio + 0.05, Tsaca));
  const saca = k.suave(k.tramo(t, Tsaca - 0.05, Tnada - 0.05));
  const vuelta = k.entra(k.tramo(t, v.duracion - 0.7, v.duracion - 0.05));
  const empuje = k.suave(k.tramo(t, Tpuso, Tamigo));
  const anillo = Math.max(miente * (1 - amigo * 0.85), vuelta);
  const x = k.mez(520, 500, vuelta);
  const y = k.mez(1120, 1040, Math.max(empuje * (1 - vuelta), vuelta)) + saca * (1 - vuelta) * 30;
  const zoom = k.mez(1, 1.18, Math.max(empuje * (1 - vuelta), vuelta));
  bolsillo(g, t, { rush: vuelta, calor: (1 - miente) * (1 - vuelta) });
  hilosCobre(g, t, (1 - miente) * (1 - vuelta) * (1 - amigo * 0.5));
  const zumba = anillo * Math.sin(t * 36) * 6;
  movil(g, x + zumba, y, 460 * zoom, -0.08 + saca * 0.12 * (1 - vuelta));
  anillos(g, x, y, t, anillo * (0.75 + 0.25 * vuelta), 0.6, 1.65);
  mano(g, x, y + 440, 1.05, saca * (1 - vuelta), { pulsera: amigo > 0.45 });
  velo(g, 0.82);
}
