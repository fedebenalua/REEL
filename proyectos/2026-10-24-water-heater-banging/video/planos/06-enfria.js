// «Now wait until the tank is cool.»
import * as k from "#kit";
import { v } from "#voz";
import { tanque } from "../cosas.js";
import { camara, cuarto, rutaCam, suelo, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(7).inicio;
export const entrada = "corte";

const f = v.frase(7);
const Tc = f.t("cool");
const fin = v.frase(8).inicio;
const CAM = [
  [f.inicio, { x: 0, y: 30, s: 1.5 }],
  [Tc, { x: 0, y: 140, s: 1.68 }],
  [fin, { x: 0, y: 150, s: 1.66 }],
];

export function dibuja(g, t) {
  const calor = 1 - k.suave(k.tramo(t, f.inicio + 0.1, Tc));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  suelo(g, 540, "#1a120c");
  tanque(g, 0, 20, { calor, nivel: 1 });
  g.save();
  g.globalAlpha = 0.45 * calor;
  for (let i = 0; i < 4; i++) {
    const p = (t * 0.35 + i / 4) % 1;
    g.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`;
    g.beginPath();
    g.ellipse(-40 + i * 28, 360 - p * 220, 26 + p * 18, 40, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.7);
}
