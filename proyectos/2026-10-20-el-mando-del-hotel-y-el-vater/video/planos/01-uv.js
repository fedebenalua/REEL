// «El mando de la tele de un hotel puede tener tantas bacterias como el váter.»
// La habitación del hotel, a oscuras, con luz ultravioleta. Una sola cámara.
// - Fotograma 0: metidos entre los microbios verdes, enormes, que se mueven y miran; la cámara sale disparada hacia
//   atrás y se ve que están encima del mando, tirado en la colcha, bajo el haz morado; en «hotel», la habitación
//   entera. (El creador eligió esta apertura; la otra, la luz barriendo hasta el mando, se quitó.)
// - «como el váter»: el mando se aparta a la izquierda y entra un váter por la derecha, bajo la misma luz, con los
//   mismos microbios: igual de lleno.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, camara, habitacion, luzUV, mando, mezCam, nube, vater } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1);
const Thot = f1.t("hotel"), Tbac = f1.t("bacterias"), Tcom = f1.t("como"), Tvat = f1.t("vater"), Fin = v.frase(2).inicio;
export const R = { x: 540, y: 1330 };

export function escena(g, t, cam) {
  g.save(); camara(g, cam);
  habitacion(g, t, 1);
  // el mando en la cama y sus microbios
  const aparta = su(tr(t, Tcom - 0.2, Tvat + 0.1));
  const mx = mez(R.x, 290, aparta), my = mez(R.y, 1260, aparta);
  mando(g, mx, my, 150, mez(1.25, 0.15, aparta), { uv: 1 });
  nube(g, mx - 150, my - 260, 300, 520, t, mez(0.15, 1, su(tr(t, 0, Tbac + 0.2))), 7, "120,255,140", 30);
  // el váter, con los suyos
  const entraV = entra(tr(t, Tcom - 0.15, Tvat + 0.15));
  if (entraV > 0) {
    const vx = mez(1500, 770, entraV);
    vater(g, vx, 1250, 380, 1);
    nube(g, vx - 190, 1000, 380, 460, t, su(tr(t, Tvat - 0.1, Tvat + 0.5)), 9, "120,255,140", 30);
  }
  g.restore();
  // la luz ultravioleta: barre y se para en el mando
  const lx = mez(1000, 540, su(tr(t, 0, 0.6))), ly = mez(900, 1250, su(tr(t, 0, 0.6)));
  luzUV(g, lx, ly, 1 - 0.5 * su(tr(t, Thot, Tbac)));
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(10,4,24,0.6)"); vg.addColorStop(1, "rgba(10,4,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export function camaraEn(t, inicio = { Z: 1.7, F: { x: R.x, y: R.y - 60 } }) {
  return mezCam(inicio, { Z: 1.1, F: { x: 540, y: 1150 } }, su(tr(t, 0.2, Thot + 0.2)));
}
export function dibuja(g, t) {
  const cam = mezCam({ Z: 5, F: { x: R.x, y: R.y - 40 } }, { Z: 1.1, F: { x: 540, y: 1150 } }, entra(tr(t, 0.1, Thot)));
  escena(g, t, cam);
}

export const momentos = { vater: Tvat };
