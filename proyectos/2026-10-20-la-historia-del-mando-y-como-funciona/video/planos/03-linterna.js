// «En 1955 llegó uno sin cable: una linterna que apuntabas a la tele… y el sol también te cambiaba de canal.»
// El salón de 1955, con la tele de madera y sus cuatro ojos en las esquinas. Se entra con un corte en «En».
// - «1955»: la cifra; «sin cable»: la linterna-pistola entra por abajo a la derecha.
// - «una linterna que apuntabas a la tele»: dispara su haz a una esquina, que se enciende verde, y la tele cambia de
//   canal; otro disparo, otra esquina, otro canal.
// - «y el sol»: entra el sol por la ventana, se encienden los cuatro ojos y en «cambiaba de canal» la tele cambia
//   sola. Antes del corte, el sol se va.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, ESQUINAS, camara, haz, linterna, mezCam, rayosDeSol, salon, tele } from "../hist.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f3 = v.frase(3);
export const desde = (vz) => vz.frase(3).inicio;
const T0 = f3.inicio, Tano = f3.t("1955"), Tsin = f3.t("sin"), Tlin = f3.t("linterna"), Tapu = f3.t("apuntabas"), Tsol = f3.t("sol"), Tcam = f3.t("cambiaba"), Fin = v.frase(4).inicio;
const GX = 860, GY = 1560, GS = 0.95, GANG = -0.62;
const TIROS = [[Tlin, 1], [Tapu + 0.3, 3]];
const CAMBIOS = [Tlin + 0.2, Tapu + 0.5, Tcam - 0.1, Tcam + 0.3];

export function dibuja(g, t) {
  const cam = mezCam({ Z: 1.08, F: { x: 540, y: 1000 } }, CAM0, su(tr(t, T0, Fin)));
  const sol = su(tr(t, Tsol - 0.2, Tsol + 0.2)) * (1 - su(tr(t, Tcam + 0.5, Fin - 0.2)));
  let al = 0, esq = 1;
  for (const [te, i] of TIROS) { const a = k.pulso(t, te + 0.1, 0.18); if (a > al) { al = a; esq = i; } }
  const ojos = ESQUINAS.map((_, n) => Math.max(n === esq ? al : 0, sol * 0.8));
  const canal = CAMBIOS.reduce((c, te) => c + su(tr(t, te, te + 0.3)), 0);
  g.save(); camara(g, cam);
  salon(g, t, sol);
  tele(g, t, { canal, ojos });
  rayosDeSol(g, t, sol);
  const llega = entra(tr(t, Tsin - 0.3, Tlin - 0.1));
  g.save(); g.translate(GX + 500 * (1 - llega), GY + 300 * (1 - llega)); g.scale(-1, 1);
  const boca = linterna(g, 0, 0, GS, GANG, al);
  g.restore();
  haz(g, { x: GX + 500 * (1 - llega) - boca.x, y: GY + 300 * (1 - llega) + boca.y }, ESQUINAS[esq], al);
  g.restore();
  k.pastilla(g, 540, 640, "1955", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)) * (1 - su(tr(t, Tlin - 0.3, Tlin))), 100);
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,25,24,0.55)"); vg.addColorStop(1, "rgba(10,25,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { tiros: TIROS.map((x) => x[0]), sol: Tsol };
