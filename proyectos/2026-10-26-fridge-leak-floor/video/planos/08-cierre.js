// El charco vuelve, y la cámara acaba en el mismo chorro del principio.
import { v } from "#voz";
import { HOOK, camara, charco, chorroPuerta, cocinaFondo, nevera, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "repair";
const f11 = v.frase(11), f12 = v.frase(12);

export function dibuja(g, t) {
  const mancha = kTramo(t);
  const cam = rutaCam(t, [
    [f11.t("repair"), { x: 20, y: 180, s: 1.05 }],
    [f11.t("pricey"), { x: -20, y: 380, s: 1.45 }],
    [f12.t("send"), { x: -60, y: 430, s: 1.9 }],
    [f12.t("leaking"), HOOK],
    [v.duracion, HOOK],
  ]);
  camara(g, cam);
  cocinaFondo(g);
  nevera(g, 1);
  chorroPuerta(g, t, 0.35 + mancha * 0.65);
  charco(g, 180 + mancha * 160, t, mancha);
  velo(g, 0.9);
  viñeta(g, 0.34);
}

function kTramo(t) {
  const a = f11.t("repair"), b = f11.t("pricey") + 0.35;
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
}
