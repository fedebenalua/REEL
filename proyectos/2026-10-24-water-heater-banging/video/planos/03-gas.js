// «If it's gas, stop. Electric? Flip the breaker off.»
import * as k from "#kit";
import { v } from "#voz";
import { cuadro, mandoGas, tanque } from "../cosas.js";
import { camara, cuarto, guante, rutaCam, suelo, telefono, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(4).inicio;
export const entrada = "corte";

const f = v.frase(4);
const Tstop = f.t("stop");
const Tcall = f.t("call");
const Tflip = f.t("flip");
const fin = v.frase(5).inicio;
const CAM = [
  [f.inicio, { x: 340, y: 20, s: 1.62 }],
  [Tstop, { x: 360, y: 10, s: 1.75 }],
  [Tcall + 0.55, { x: 320, y: 30, s: 1.55 }],
  [Tflip - 0.12, { x: 800, y: 0, s: 1.95 }],
  [fin, { x: 810, y: -10, s: 1.95 }],
];

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, f.inicio + 0.05, Tstop - 0.05));
  const huye = k.suave(k.tramo(t, Tstop, Tstop + 0.55));
  const tel = k.suave(k.tramo(t, Tcall, Tcall + 0.25)) * (1 - k.suave(k.tramo(t, Tflip - 0.55, Tflip - 0.25)));
  const on = 1 - k.suave(k.tramo(t, Tflip, Tflip + 0.55));
  const manoCuadro = k.suave(k.tramo(t, Tflip - 0.35, Tflip + 0.1));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  suelo(g, 560, "#1a120c");
  tanque(g, -40, 80, { calor: 0.25, nivel: 1, esc: 0.92 });
  mandoGas(g, 250, 40);
  const mx = k.mez(700, 490, llega);
  const mx2 = k.mez(mx, 820, huye);
  guante(g, mx2, 80, -0.2, 1.2, 1 - k.suave(k.tramo(t, Tcall + 0.15, Tcall + 0.45)));
  telefono(g, 40, 160, tel, 1.3);
  cuadro(g, 800, 10, on);
  guante(g, 860, k.mez(40, 130, 1 - on), 0.4, 1.05, manoCuadro);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.72);
}
