// La sala del estudio: una persona quieta dentro del escáner.
// En «once» la cámara sale y se ve el campo de cerebros, con la cifra.
// El bloque y la pintura intentan aparecer y se apagan: aquí no se calcula ni se inventa.
import * as k from "#kit";
import { v } from "#voz";
import { bloque, campo, escaner, pintura, sala, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(8).inicio;

const f8 = v.frase(8), f9 = v.frase(9);
const Tonce = f8.t("once");
const Treposo = f8.t("reposo");
const Tsiete = f9.t("siete");
const Tanos = f9.t("anos");
const Tcal = f9.t("calcular");
const Tinv = f9.t("inventar");
const Fin = f9.fin;

const cam = k.ruta([
  [f8.inicio, { pos: [0, 0.05, 2.05], mira: [0, -0.05, 0.1] }],
  [Tonce - 0.15, { pos: [0, 0.15, 2.35], mira: [0, 0, 0] }],
  [Tonce + 0.55, { pos: [0, 0.35, 5.35], mira: [0, 0.05, 2.2] }],
  [Treposo, { pos: [0, 0.28, 5.05], mira: [0, 0.02, 2.3] }],
  [Tsiete, { pos: [-0.55, 0.12, 4.55], mira: [-0.35, -0.05, 1.8] }],
  [Tanos, { pos: [0.5, 0.18, 4.25], mira: [0.3, 0.02, 1.7] }],
  [Tcal, { pos: [0.05, 0.08, 3.95], mira: [0, 0.05, 1.6] }],
  [Tinv, { pos: [-0.15, 0.2, 4.2], mira: [0, 0.08, 1.9] }],
  [Fin - 0.28, { pos: [0, 0.55, 7.4], mira: [0, 0.15, 1.2] }],
  [Fin + 0.3, { pos: [0, 0.55, 7.4], mira: [0, 0.15, 1.2] }],
]);

export function dibuja(g, t) {
  const c = cam(t);
  sala(g, 0.25, 0.18);
  const entra = 0.55 + 0.15 * k.suave(k.tramo(t, f8.inicio, Treposo));
  escaner(g, c, entra, 1);
  const llegaCampo = k.suave(k.tramo(t, Tonce - 0.05, Tonce + 0.5));
  campo(g, c, llegaCampo);
  const num = k.suave(k.tramo(t, Tonce - 0.05, Tonce + 0.25)) * (1 - k.suave(k.tramo(t, Tsiete - 0.05, Tsiete + 0.2)));
  if (num > 0.02) k.pastilla(g, 540, 1120, "1011", "cerebros", "186,220,255", num, 104);
  const edad = k.suave(k.tramo(t, Tsiete, Tsiete + 0.25)) * (1 - k.suave(k.tramo(t, Tcal - 0.15, Tcal + 0.15)));
  if (edad > 0.02) k.pastilla(g, 540, 1120, "7–29", "años", "255,214,150", edad, 104);
  // el bloque y la pintura nacen y se apagan: no es un trabajo que se esté haciendo
  const muere = (t0) => {
    const n = k.suave(k.tramo(t, t0 - 0.05, t0 + 0.28));
    const m = k.suave(k.tramo(t, t0 + 0.32, t0 + 0.7));
    return n * (1 - m);
  };
  const b1 = muere(Tcal);
  if (b1 > 0.02) bloque(g, 540, 1020, 320 * (0.35 + 0.65 * b1), b1, (1 - b1) * 0.6);
  const b2 = muere(Tinv);
  if (b2 > 0.02) pintura(g, 540, 980, 260 * (0.3 + 0.7 * b2), "255,80,40", b2);
  velo(g, 0.66);
}
