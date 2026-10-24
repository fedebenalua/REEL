// En reposo el cerebro no está a oscuras: salen redes por todas partes.
// No todas a la vez: un amago de crisis y vuelve el latido de una en una.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, fondo, personaTumbada, sofa, velo } from "../mundo.js";

export const desde = "reposo";

export function dibuja(g, t) {
  const f12 = v.frase(12), f13 = v.frase(13);
  const Tno = f12.t("no");
  const Tred = f12.t("redes");
  const Tcrisis = f13.t("crisis");
  const fin = v.t("nunca");
  const quieto = t > fin - 0.4 ? fin - 0.4 : t;

  const entra = k.suave(k.tramo(t, Tno - 0.08, f12.t("oscuras") + 0.1));
  const redes = k.suave(k.tramo(t, Tred - 0.12, f12.t("partes") + 0.05));
  const crisis = k.pulso(quieto, Tcrisis, 0.2) * (1 - k.suave(k.tramo(t, Tcrisis + 0.25, Tcrisis + 0.6)));
  const zoom = k.mez(1, 1.35, k.suave(k.tramo(t, Tred - 0.15, f12.fin)));

  fondo(g, "#101428", "#1a0c16");
  k.brillo(g, 180, 1500, 200, "amarilla", 0.2);

  g.save();
  g.translate(540, 1000);
  g.scale(zoom, zoom);
  g.translate(-540, -1000);

  const sofaAl = 1 - k.suave(k.tramo(t, Tred, f12.fin));
  if (sofaAl > 0.02) {
    g.save();
    g.globalAlpha = sofaAl;
    sofa(g, 540, 1320, 820);
    personaTumbada(g, 280, 1180, 700);
    g.restore();
  }
  const s = k.mez(0.7, 1.85, k.suave(k.tramo(t, Tno, f12.t("partes"))));
  const cy = k.mez(1120, 980, redes);
  cerebro(g, 520, cy, s, {
    t: quieto,
    vivo: 0.25 + 0.75 * entra,
    nucleo: (1 - entra) * 0.4,
    redes,
    crisis,
  });
  g.restore();
  velo(g, 0.78);
}
