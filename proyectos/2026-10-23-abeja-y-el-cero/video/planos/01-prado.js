// Hook: vuelo entre flores hasta posarse en la carta vacía.
import * as k from "#kit";
import { v } from "#voz";
import { FLORES, abeja, carta, flor, prado, velo } from "../mundo.js";

export const desde = 0;

const { proyecta, tamano, curva } = k;
const f1 = v.frase(1);
const f2 = v.frase(2);
const Tpunto = f1.t("punto");
const Tvacia = f1.t("vacia");
const Tmenos = f2.t("menos");
const Fin = f2.fin;

const cam = k.ruta([
  [-0.4, { pos: [0.1, 0.7, 13.5], mira: [0.4, 0.05, 3] }],
  [Tpunto, { pos: [-0.35, 0.28, 6.4], mira: [-1.0, 0.0, 0.4] }],
  [Tvacia - 0.05, { pos: [0.85, 0.16, 3.5], mira: [1.2, -0.02, 0] }],
  [Tvacia + 0.4, { pos: [1.22, 0.06, 2.7], mira: [1.15, -0.02, 0] }],
  [Tmenos - 0.15, { pos: [0.35, 0.18, 4.15], mira: [0.15, 0, 0] }],
  [Fin - 0.05, { pos: [0.35, 0.16, 4.15], mira: [0.15, 0, 0] }],
]);

const bx = curva([[-0.3, -0.15], [Tpunto, -1.15], [Tpunto + 0.55, 0.15], [Tvacia + 0.15, 1.22], [Fin, 1.22]], undefined, 0);
const by = curva([[-0.3, 0.35], [Tpunto, 0.18], [Tvacia, 0.12], [Tvacia + 0.35, -0.02], [Fin, -0.02]], undefined, 0);
const bz = curva([[-0.3, 8.2], [Tpunto, 1.6], [Tvacia, 0.85], [Tvacia + 0.3, 0.48], [Fin, 0.46]], undefined, 0);

const PUNTO = [-1.35, 0, 0];
const VACIA = [1.28, 0, 0];

function mundoCarta(g, camara, centro, w, h, n, o) {
  const p = proyecta(camara, centro);
  if (!p) return;
  const pw = tamano(w, p.z);
  const ph = tamano(h, p.z);
  carta(g, p.x, p.y, pw, ph, n, o);
}

export function dibuja(g, t) {
  const c = cam(t);
  prado(g, t, 1);
  const cosas = [];
  for (const f of FLORES) {
    const p = proyecta(c, [f.x, f.y, f.z]);
    if (!p) continue;
    const r = tamano(f.r, p.z);
    if (r < 8 || r > 1400) continue;
    cosas.push({ z: p.z, dibuja: () => flor(g, p.x, p.y, r, f.tono, f.fase + t * 0.15) });
  }
  const bee = [bx(t), by(t), bz(t)];
  const pb = proyecta(c, bee);
  cosas.push({
    z: pb ? pb.z + 0.02 : 0,
    dibuja: () => mundoCarta(g, c, PUNTO, 1.7, 2.25, 1, { forma: 0 }),
  });
  cosas.push({
    z: pb ? pb.z + 0.01 : 0,
    dibuja: () => mundoCarta(g, c, VACIA, 1.7, 2.25, 0, {}),
  });
  if (pb) {
    const largo = tamano(1.15, pb.z);
    const vuelo = 1 - k.suave(k.tramo(t, Tvacia - 0.05, Tvacia + 0.35));
    const antes = proyecta(c, [bx(t - 0.05), by(t - 0.05), bz(t - 0.05)]);
    let rumbo = 0.15;
    if (antes) rumbo = Math.atan2(pb.y - antes.y, pb.x - antes.x);
    if (vuelo < 0.2) rumbo = k.mez(rumbo, 0.08, 1 - vuelo);
    cosas.push({
      z: pb.z,
      dibuja: () => abeja(g, pb.x, pb.y, Math.max(80, largo), t, { vuelo, rumbo, mira: 1 }),
    });
  }
  // la carta del punto se aleja en «menos»: ya está en el mundo; la cámara se queda en la vacía
  k.deLejosACerca(cosas);
  // un borde de miel en la vacía cuando ya se ha posado, para que «no se ha equivocado» se vea
  const borde = k.suave(k.tramo(t, f2.t("equivocado"), f2.t("equivocado") + 0.35)) * (1 - 0.3 * k.tramo(t, Tmenos, Fin));
  if (borde > 0.02) {
    const p = proyecta(c, VACIA);
    if (p) {
      const pw = tamano(1.7, p.z);
      const ph = tamano(2.25, p.z);
      g.save();
      g.globalAlpha = borde;
      g.strokeStyle = "rgba(255,196,60,0.95)";
      g.lineWidth = 14;
      k.redondo(g, p.x - pw / 2, p.y - ph / 2, pw, ph, 36);
      g.stroke();
      g.restore();
    }
  }
  velo(g, 0.7);
}
