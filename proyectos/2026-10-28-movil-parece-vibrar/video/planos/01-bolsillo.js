// Hook: el móvil parece vibrar dentro del bolsillo. En «no» los anillos eran la tela.
// En «apagada» la pantalla, negra y quieta.
import * as k from "#kit";
import { v } from "#voz";
import { anillos, bolsillo, hilosCobre, mano, movil, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1);
const f2 = v.frase(2);
const Tvibra = f1.t("vibrar");
const Tno = f1.t("no");
const Tsacas = f2.t("sacas");
const Tapag = f2.t("apagada");

export function dibuja(g, t) {
  const rush = k.entra(k.tramo(t, 0, 1.15));
  const miente = 1 - k.suave(k.tramo(t, Tno - 0.08, Tno + 0.55));
  const saca = k.suave(k.tramo(t, Tsacas - 0.05, Tapag - 0.2));
  const zoom = k.mez(0.96, 1.22, rush) * (1 + 0.05 * saca);
  const x = 520;
  const y = k.mez(1140, 1060, rush) + saca * 20;
  const zumba = miente * Math.sin(t * 36) * 7;
  bolsillo(g, t, { rush, calor: 1 - miente });
  const pulso = 0.85 + 0.15 * k.pulso(t, Tvibra, 0.18);
  k.brillo(g, x, y, 900, "cian", 0.28 * miente * pulso);
  hilosCobre(g, t, (1 - miente) * (1 - saca * 0.35));
  movil(g, x + zumba, y, 480 * zoom * (1 + miente * 0.02 * Math.sin(t * 36)), -0.08 + saca * 0.12);
  anillos(g, x, y, t, miente * pulso, 0.62, 1.7);
  mano(g, x, y + 460, 1.05, saca);
  velo(g, 0.82);
}
