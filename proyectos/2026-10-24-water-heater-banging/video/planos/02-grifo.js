// «Shut a faucet and it bangs right then? That's the pipes.»
import * as k from "#kit";
import { v } from "#voz";
import { grifo } from "../cosas.js";
import { camara, cuarto, guante, rutaCam, telefono, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(3).inicio;
export const entrada = "corte";

const f = v.frase(3);
const Tb = f.t("bangs");
const Tp = f.t("pipes");
const Tc = f.t("call");
const fin = v.frase(4).inicio;
const CAM = [
  [f.inicio, { x: 20, y: 50, s: 1.5 }],
  [Tb - 0.35, { x: 40, y: 40, s: 1.55 }],
  [Tb + 0.12, { x: 400, y: 10, s: 1.68 }],
  [Tp, { x: 430, y: 0, s: 1.72 }],
  [fin, { x: 380, y: 20, s: 1.58 }],
];

export function dibuja(g, t) {
  const cierra = k.suave(k.tramo(t, f.inicio, Tb - 0.05));
  const golpe = Math.sin(Math.min(1, k.tramo(t, Tb, Tb + 0.36)) * Math.PI);
  const tel = k.suave(k.tramo(t, Tc, Tc + 0.28));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "bano");
  // Tubo dentro de la pared, a la derecha.
  g.save();
  g.translate(420, golpe * -36);
  g.fillStyle = "#c0c8d0";
  k.redondo(g, -28, -420, 56, 780, 20);
  g.fill();
  g.fillStyle = "#8ad0ff";
  g.fillRect(-8, -200, 16, 360);
  g.restore();
  grifo(g, -40, 80, t, { abierto: 1 - cierra, calido: 0.15, escupe: 0 });
  const mano = 1 - k.suave(k.tramo(t, Tb + 0.15, Tp - 0.1));
  guante(g, -150, 40 + (1 - cierra) * 30, -0.4 + cierra * 0.8, 1.15, mano);
  telefono(g, 230, 30, tel, 1.35);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.7);
}
