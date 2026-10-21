// «Así que al año siguiente sacaron otro, sin luz y sin pilas.»
// «Cada botón golpeaba una barrita de metal con un martillo diminuto.»
// El mando del martillito (1956), solo, sobre un fondo de taller. Se entra con un corte en «Así».
// - «al año siguiente»: el mando cae girando y se planta en el centro; «1956».
// - «sin pilas»: se vuelve transparente y se ve por dentro: las barritas, los martillos y el hueco de las pilas,
//   vacío.
// - «Cada botón golpeaba»: la cámara se acerca a las barritas; se hunde un botón y su martillo golpea la barrita, que
//   vibra; «martillo»: otro botón, otro golpe.
import * as k from "#kit";
import { v } from "#voz";
import { camara, martillito, mezCam, CAM0 } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f4 = v.frase(4), f5 = v.frase(5);
export const desde = (vz) => vz.frase(4).inicio;
const T4 = f4.inicio, Tano = f4.t("ano"), Tpil = f4.t("pilas"), Tgol = f5.t("golpeaba"), Tmar = f5.t("martillo"), Fin = v.frase(6).inicio;
export const GOLPES = [[Tgol, 0], [Tmar, 2], [Tmar + 0.55, 1]];

const azB = azar(4);
const PUNTOS = Array.from({ length: 60 }, () => ({ x: azB() * 1080, y: azB() * 1920, r: 1 + azB() * 2.5 }));

export function dibuja(g, t) {
  // el fondo: azul de plano de ingeniero, con su cuadrícula
  const fg = g.createRadialGradient(540, 900, 100, 540, 960, 1300); fg.addColorStop(0, "#1f4a7a"); fg.addColorStop(1, "#0b1a33");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(160,210,255,0.12)"; g.lineWidth = 2;
  for (let x = 0; x <= 1080; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
  for (let y = 0; y <= 1920; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  for (const p of PUNTOS) { g.fillStyle = "rgba(200,230,255,0.25)"; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.2832); g.fill(); }
  const cam = mezCam(CAM0, { Z: 1.75, F: { x: 540, y: 760 } }, su(tr(t, Tgol - 0.6, Tgol)));
  g.save(); camara(g, cam);
  // el mando cae girando y se planta
  const cae = entra(tr(t, T4 - 0.05, Tano + 0.2));
  const y = mez(-700, 980, cae), ang = (1 - cae) * 2.2;
  const golpe = [0, 0, 0, 0], vibra = [0, 0, 0, 0];
  for (const [te, i] of GOLPES) { golpe[i] = Math.max(golpe[i], k.pulso(t, te + 0.05, 0.08)); vibra[i] = Math.max(vibra[i], tr(t, te + 0.05, te + 0.1) * Math.exp(-Math.max(0, t - te - 0.1) * 3)); }
  g.save(); g.translate(540, y); g.rotate(ang);
  martillito(g, 0, 0, 560, t, { rayos: su(tr(t, Tpil - 0.15, Tpil + 0.3)), golpe, vibra });
  g.restore();
  // «1956»
  k.pastilla(g, 540, 1530, "1956", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)) * (1 - su(tr(t, Tgol - 0.6, Tgol - 0.3))), 110);
  g.restore();
}

export const momentos = { golpes: GOLPES.map((x) => x[0]) };
