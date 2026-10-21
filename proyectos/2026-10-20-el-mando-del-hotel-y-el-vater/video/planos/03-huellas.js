// «No quiere decir que te vayas a poner malo, pero el mando lo toca todo el que pasa por esa habitación.»
// La cama del hotel, de día, con el mando grande en la colcha. Se entra con un corte en «No».
// - «No quiere decir que te vayas a poner malo»: la habitación tranquila; el mando en la colcha.
// - «el mando lo toca todo el que pasa»: van apareciendo huellas de dedos de muchos colores, una tras otra, por todo
//   el mando, cada una de alguien distinto.
import * as k from "#kit";
import { v } from "#voz";
import { camara, habitacion, huella, mando, mezCam, CAM0 } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5);
export const desde = (vz) => vz.frase(5).inicio;
const T0 = f5.inicio, Ttoc = f5.t("toca"), Thab = f5.t("habitacion"), Fin = v.frase(6).inicio;
const azH = azar(91);
const COLORES = ["255,90,120", "90,200,255", "255,200,60", "140,255,120", "200,120,255", "255,140,60"];
const HUELLAS = Array.from({ length: 16 }, (_, i) => ({ x: (azH() - 0.5) * 110, y: (azH() - 0.5) * 460, a: azH() * 6.28, c: COLORES[i % 6], t: i / 16 }));

export function dibuja(g, t) {
  const cam = mezCam({ Z: 1.1, F: { x: 540, y: 1150 } }, { Z: 2.0, F: { x: 540, y: 1300 } }, su(tr(t, T0, Ttoc)));
  g.save(); camara(g, cam);
  habitacion(g, t, 0);
  mando(g, 540, 1320, 150, 1.25);
  g.save(); g.translate(540, 1320); g.rotate(1.25);
  for (const h of HUELLAS) huella(g, h.x, h.y, 70, h.a, h.c, su(tr(t, mez(Ttoc - 0.1, Thab + 0.3, h.t), mez(Ttoc - 0.1, Thab + 0.3, h.t) + 0.12)));
  g.restore();
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(40,30,20,0.5)"); vg.addColorStop(1, "rgba(40,30,20,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { toca: Ttoc };
