// La carta del bar, borrosa, y un agujero que la pone nítida. Frases 1 a 3.
import * as k from "#kit";
import { v } from "#voz";
import { escenaCafe } from "../mundo.js";

export const desde = 0;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);

const camara = k.ruta([
  [-0.5, { pos: [0.35, 0.3, 9.8], mira: [0, 0.05, 0] }],
  [0.55, { pos: [0, 0.05, 5.8], mira: [0, 0.05, 0] }],
  [f1.t("vision"), { pos: [0, 0.05, 3.7], mira: [0, 0.05, 0] }],
  [f1.fin, { pos: [0, 0.05, 4.15], mira: [0, 0.05, 0] }],
  [f2.t("borroso"), { pos: [0, 0.05, 5.05], mira: [0, 0.05, 0] }],
  [f3.t("arroz"), { pos: [0, 0.05, 4.4], mira: [0, 0.05, 0] }],
  [f3.fin, { pos: [0, 0.05, 4.4], mira: [0, 0.05, 0] }],
]);

export function dibuja(g, t) {
  const cam = camara(t);
  const llega = k.entra(k.tramo(t, 0.04, 0.72));
  const hx = 540 + (1 - llega) * 1280, hy = 960;
  const dentro = k.claves([
    [0.2, 18],
    [0.82, 0],
    [f3.fin, 0],
  ]);
  const gafasU = k.claves([
    [f2.inicio, 0],
    [f2.t("gafas") + 0.45, 1],
    [f3.inicio, 1],
    [f3.t("fino"), 0],
    [f3.fin, 0],
  ]);
  const arrozU = k.claves([
    [f3.t("mas"), 0],
    [f3.t("arroz") + 0.25, 1],
    [f3.fin, 1],
  ]);
  escenaCafe(g, cam, {
    vel: Math.max(0, 1 - k.suave(k.tramo(t, 0.1, 0.95))),
    blurFuera: 32,
    blurDentro: dentro(t),
    hx, hy,
    hr: 24 + llega * 78,
    tarjeta: llega,
    gafas: { x: 430, y: 1400, s: 1.15, u: gafasU(t) },
    arroz: { x: 168, y: 1040, L: 560, u: arrozU(t) },
    velo: 0.72,
  });
}
