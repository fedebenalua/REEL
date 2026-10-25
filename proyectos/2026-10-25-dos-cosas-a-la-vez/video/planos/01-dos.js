// «Dos cosas a la vez, y una siempre espera.»
// La mesa: una boca que habla y una mano que escribe. La mano se queda atrás.
import * as k from "#kit";
import { v } from "#voz";
import { anillos, boca, manoEscribe, sala, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tespera = f1.t("espera");
const Thablan = f2.t("hablan"), Tescribes = f2.t("escribes"), Tdos = f2.t("dos");
const Tpuede = f3.t("puede");
const Tatras = f4.t("atras");
const corte = v.frase(5).inicio - 0.04;

const zCam = k.curva([
  [-0.45, 0.86],
  [1.05, 1.28],
  [Tespera, 1.12],
  [Thablan - 0.05, 1.15],
  [Thablan + 0.3, 1.62],
  [Tescribes, 1.58],
  [Tdos, 0.98],
  [Tpuede, 1.05],
  [Tatras, 1.08],
  [corte - 0.05, 1.02],
], undefined, 0);
const cxCam = k.curva([
  [-0.35, 520],
  [1.0, 700],
  [Tespera, 790],
  [Thablan, 300],
  [Tescribes, 800],
  [Tdos, 540],
  [corte, 540],
], undefined, 0);
const cyCam = k.curva([
  [-0.3, 1040],
  [Tespera, 1080],
  [Thablan, 900],
  [Tescribes, 1160],
  [Tdos, 1020],
  [corte, 1020],
], undefined, 0);

export function dibuja(g, t) {
  sala(g, "#14081f", "#07060f", 540, 900, 900);
  const z = zCam(t), cx = cxCam(t), cy = cyCam(t);
  g.save();
  g.translate(540, 980);
  g.scale(z, z);
  g.translate(-cx, -cy);

  const habla = 0.55 + 0.45 * Math.max(0, Math.sin(t * 9));
  const cree = k.suave(k.tramo(t, f3.inicio, Tpuede));
  const lag = k.suave(k.tramo(t, f4.inicio + 0.15, Tatras));
  const calma = k.suave(k.tramo(t, Tatras + 0.35, corte));
  const avanza = cree * (1 - lag);
  const abre = k.mez(habla, 0.2, calma);
  const pulso = 0.75 + 0.25 * Math.sin(t * 2.2);
  const alGota = (0.35 + 0.65 * k.suave(k.tramo(t, 0.15, Tespera))) * (1 - 0.85 * calma) * pulso;

  // mesa
  g.fillStyle = "#1a1224";
  g.beginPath();
  g.ellipse(540, 1380, 620, 120, 0, 0, 6.2832);
  g.fill();
  boca(g, 300, 860, 1.25, abre);
  anillos(g, 300, 980, t, "80,220,255", (1 - calma) * abre);
  manoEscribe(g, 800, 1120, 1, 0.08 + 0.7 * avanza, alGota * (1 - cree * 0.7));
  g.restore();
  velo(g, 0.62);
}
