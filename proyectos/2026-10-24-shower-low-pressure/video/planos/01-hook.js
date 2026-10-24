// «Why is your shower just a trickle?» «The holes are packed with white chalk...»
// Fotograma 0: el agua, dentro del tubo, contra la cal. Luego la ducha abierta y un hilo.
import * as k from "#kit";
import { v } from "#voz";
import { ducha, FOCO, tubo } from "../ducha.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2);
const Ttrickle = f1.t("trickle");
const Tholes = f2.t("holes");
const Tchalk = f2.t("chalk");
const Tout = f2.t("out");
const Tfin = v.frase(3).inicio;
const impacto = 0.42;
const fx = FOCO.x * 1.05;
const fy = 24 + (70 + FOCO.y * 0.35) * 1.05;

const CAM = [
  [impacto, { x: 0, y: 40, s: 1.22 }],
  [Ttrickle, { x: 0, y: 20, s: 1.42 }],
  [Tholes, { x: fx, y: fy, s: 1.85 }],
  [Tchalk, { x: fx, y: fy, s: 2.25 }],
  [Tout, { x: fx, y: fy + 8, s: 2.35 }],
  [Tfin, { x: fx, y: fy + 8, s: 2.35 }],
];

export function dibuja(g, t) {
  const acerca = k.mez(0.5, 1, k.suave(k.tramo(t, 0.02, impacto)));
  const fuera = k.suave(k.tramo(t, impacto, impacto + 0.36));
  if (fuera < 0.995) {
    g.save();
    g.globalAlpha = 1 - fuera;
    tubo(g, t, acerca);
    g.restore();
  }
  if (fuera > 0.02) {
    g.save();
    g.globalAlpha = fuera;
    camara(g, rutaCam(t, CAM));
    ducha(g, t, { costra: 1, goteo: 1, palanca: 1, chorro: 0 });
    g.restore();
  }
  const flash = k.pulso(t, impacto, 0.07);
  if (flash > 0.04) {
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    const gr = g.createRadialGradient(540, 1040, 30, 540, 1040, 880);
    gr.addColorStop(0, `rgba(255,255,255,${0.8 * flash})`);
    gr.addColorStop(0.45, `rgba(150, 220, 255, ${0.35 * flash})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  viñeta(g, 0.45);
  velo(g, 0.72);
}
