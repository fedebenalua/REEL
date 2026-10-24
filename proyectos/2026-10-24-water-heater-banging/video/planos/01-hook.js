// «Why is your water heater banging?» y la cal que atrapa el vapor.
import * as k from "#kit";
import { v } from "#voz";
import { interior, tanque } from "../cosas.js";
import { camara, cuarto, rutaCam, suelo, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2);
const Tb = f1.t("banging");
const Ts = f2.t("steam");
const Tfin = v.frase(3).inicio;

const CAMIN = [
  [0, { x: 0, y: 30, s: 1.2 }],
  [0.4, { x: 0, y: 50, s: 1.28 }],
];
const CAMBACK = [
  [2.2, { x: 0, y: 40, s: 1.18 }],
  [Ts, { x: 0, y: 170, s: 1.42 }],
  [Tfin, { x: 0, y: 180, s: 1.4 }],
];
const CAMOUT = [
  [0, { x: 0, y: 20, s: 1.52 }],
  [Tb, { x: 0, y: -10, s: 1.62 }],
  [2.15, { x: 0, y: 40, s: 1.52 }],
];

export function estadoInterior(t) {
  let pop, corona;
  if (t < 2.15) {
    pop = 1;
    corona = k.mez(0.72, 1, k.suave(k.tramo(t, 0, 0.9)));
  } else if (t < Ts) {
    pop = k.suave(k.tramo(t, 2.7, Ts - 0.05));
    corona = 0;
  } else {
    pop = 1;
    corona = k.suave(k.tramo(t, Ts, Ts + 0.5));
  }
  const jolt = Math.sin((t - Ts) * 28) * 16 * k.pulso(t, Ts + 0.05, 0.09);
  return { pop, corona, jolt, calor: 1, costra: 1 };
}

export function dibuja(g, t) {
  const dentro = t < 0.42 ? 1 : t < 0.95 ? 1 - k.suave(k.tramo(t, 0.42, 0.92)) : t < 2.25 ? 0 : k.suave(k.tramo(t, 2.25, 3.35));
  const hop = Math.sin(Math.min(1, k.tramo(t, Tb - 0.05, Tb + 0.42)) * Math.PI) * -78;

  if (dentro < 0.995) {
    g.save();
    g.globalAlpha = 1 - dentro;
    camara(g, rutaCam(t, CAMOUT));
    cuarto(g, "servicio");
    suelo(g, 520, "#1a120c");
    tanque(g, 0, 30, { calor: 1, salto: hop, nivel: 1 });
    g.restore();
  }
  if (dentro > 0.005) {
    g.save();
    g.globalAlpha = dentro;
    camara(g, t < 2.2 ? rutaCam(t, CAMIN) : rutaCam(t, CAMBACK));
    interior(g, t < 2.2 ? t : t, estadoInterior(t));
    g.restore();
  }
  const flash = k.pulso(t, 0.55, 0.07) * 0.85 + k.pulso(t, Tb, 0.06) * 0.55;
  if (flash > 0.04) {
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = `rgba(255, 236, 210, ${0.55 * flash})`;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  viñeta(g, 0.42);
  velo(g, 0.74);
}
