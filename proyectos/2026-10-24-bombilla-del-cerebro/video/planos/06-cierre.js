// Frase 14. Otra vez el cerebro: la cámara se lanza a los pliegues, como al empezar.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, chispas, velo, fondo, bombilla, rayas } from "../mundo.js";

export const desde = "enviaselo";

const { tramo: tr, mez, orbita, mira, proyecta, tamano } = k;
const f = v.frase(14);

export function dibuja(g, t) {
  const u = tr(t, f.inicio + 0.15, f.fin + 0.05);
  const uu = u * u;
  const dist = mez(3.05, 1.48, uu);
  const ang = mez(0.05, 1.15, u);
  const alt = mez(0.02, 0.2, uu);
  const cam = mira(orbita(ang, dist, alt), [0.12 * (1 - uu), 0.04, 0]);
  fondo(g, 1, 1);
  const seVa = 1 - k.suave(tr(t, f.t("diez") - 0.1, f.t("diez") + 0.35));
  const P = proyecta(cam, [1.35, -0.2, 0.1]);
  if (P) bombilla(g, P.x, P.y, tamano(1.15, P.z), t, seVa, 1);
  cerebro(g, cam, t, { al: 1 });
  chispas(g, cam, t, 0.85);
  const late = k.pulso(t, f.t("diez") + 0.05, 0.16);
  const C = proyecta(cam, [0, 0, 0]);
  if (C) k.brillo(g, C.x, C.y, tamano(2.2, C.z), "255,180,80", 0.55 * late);
  rayas(g, t, uu * 0.85, 1);
  velo(g, 0.55);
}
