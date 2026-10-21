// «¿Sabías que el mando de la tele ganó un Emmy, como si fuera una serie?»
// El escenario de una gala, con una sola cámara.
// - Fotograma 0: el foco se enciende de golpe sobre el escenario y el mando de la tele entra volando al centro.
// - «ganó un Emmy»: la estatuilla dorada baja a su lado y estalla el confeti.
// - «como si fuera una serie»: delante sube el sobre: «Y el Emmy es para… EL MANDO».
// (El creador eligió esta apertura; la otra, que empezaba con el sobre, se quitó.)
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, camara, confeti, escenario, estatuilla, mandoHoy, mezCam, sobre } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1);
const Tman = f1.t("mando"), Tgan = f1.t("gano"), Temm = f1.t("emmy"), Tcom = f1.t("como"), Fin = v.frase(2).inicio;
export const premio = Temm + 0.05;

// La gala: op = { foco (0-1), llegaMando (0-1), llegaPremio (0-1), abreSobre (0-1), cam }
export function gala(g, t, op) {
  g.save(); camara(g, op.cam);
  escenario(g, t, { foco: op.foco, abre: 1 });
  const lm = op.llegaMando, lp = op.llegaPremio;
  if (lm > 0) mandoHoy(g, mez(-200, 410, lm), 1060, 160, mez(-0.8, -0.06, lm));
  if (lp > 0) estatuilla(g, 720, mez(-300, 1320, lp), 620, t, 0.6 * k.pulso(t, premio, 0.25));
  confeti(g, t, premio - 0.2, su(tr(t, premio - 0.2, premio)) * (1 - su(tr(t, Fin - 0.7, Fin - 0.25))));
  if (op.abreSobre > 0) sobre(g, 540, 1520 + 900 * (op.baja ?? 0), 600, op.abreSobre, "EL MANDO");
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(10,4,12,0.55)"); vg.addColorStop(1, "rgba(10,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
  // el foco al encenderse: un golpe de luz
  k.fogonazo(g, 540, 300, (t - 0.02) * 1.2, 1300, "255,240,200");
}

export function dibuja(g, t) {
  const cam = mezCam({ Z: 1.25, F: { x: 540, y: 1100 } }, { Z: 1.05, F: { x: 560, y: 1040 } }, su(tr(t, 0, Fin - 0.4)));
  gala(g, t, {
    cam, foco: 1,
    llegaMando: entra(tr(t, -0.25, Tman + 0.15)),
    llegaPremio: entra(tr(t, Tgan - 0.1, premio)),
    abreSobre: entra(tr(t, Tcom - 0.15, Tcom + 0.35)),
    baja: k.sale(tr(t, Fin - 0.75, Fin - 0.3)),
  });
}

export const momentos = { premio };
