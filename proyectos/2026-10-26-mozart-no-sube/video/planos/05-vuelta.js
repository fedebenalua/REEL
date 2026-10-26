// Vuelta a los pianos: el juego, el cuarto de hora y el ánimo. El cierre.
import * as k from "#kit";
import { v } from "#voz";
import { salaConcierto, piano, folio, reloj, llama, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(16).t("juego") - 0.04;
export const entrada = "corte";

const f16 = v.frase(16);
const f17 = v.frase(17);
const Tj = f16.t("juego");
const Tc = f16.t("cuarto");
const Ta = f16.t("animo");
const Tco = f17.t("cociente");

export function dibuja(g, t) {
  const cierra = k.suave(k.tramo(t, Tco - 0.1, f17.fin - 0.15));
  const cam = k.mez(0, -90, cierra);
  const zoom = k.mez(1, 1.18, cierra);
  salaConcierto(g, 1);
  g.save();
  g.translate(540 + cam, 1080);
  g.scale(zoom, zoom);
  g.translate(-540, -1080);
  piano(g, 200, 1160, 0.92, { brillo: 1, tecla: 0 });
  piano(g, 900, 1140, 0.95, { brillo: 1, espejo: -1, tecla: 0 });
  g.restore();

  const alF = k.entra(k.tramo(t, Tj - 0.02, Tj + 0.32));
  if (alF > 0.02) folio(g, k.mez(140, 250, alF), 1240, 250, 300, { agujeros: 1, pliegue: 0 });

  const alR = k.entra(k.tramo(t, Tc - 0.02, Tc + 0.32));
  reloj(g, 540, k.mez(1500, 1040, alR), 1.2, 15, alR);

  const alL = k.entra(k.tramo(t, Ta - 0.02, Ta + 0.3));
  if (alL > 0.02) llama(g, k.mez(1080, 830, alL), 1220, 1.45, t);
  velo(g, 0.74);
}
