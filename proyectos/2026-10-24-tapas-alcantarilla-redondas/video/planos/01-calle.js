// «¿Por qué las tapas de alcantarilla suelen ser redondas?»
// Fotograma 0: la tapa llena la pantalla, todavía en el aire, con el agujero naranja debajo.
// En el primer segundo golpea el reborde y se queda. La cámara se abre y enseña la calle.
import * as k from "#kit";
import { v } from "#voz";
import { asfalto, camara, golpe, sinVista, tapaRedonda, velo, vista } from "../mundo.js";

export const desde = 0;

const fin = v.t("cuadrada") - 0.04;
const Tred = v.frase(1).t("redondas");
const golpeT = 0.55;

const cam = camara([
  [-0.35, 1.72, 0, -70],
  [golpeT, 1.55, 0, -20],
  [Tred, 1.28, 0, 10],
  [2.7, 1.2, 0, 16],
  [fin, 1.2, 0, 16],
]);

const liftC = k.claves([
  [-0.25, 168],
  [golpeT, 0],
  [fin, 0],
]);

export function dibuja(g, t) {
  const c = cam(Math.min(t, fin));
  const lift = Math.max(0, liftC(t));
  const ang = k.de(t, 0, golpeT, -0.22, 0.02);
  g.save();
  vista(g, c.z, c.x, c.y);
  asfalto(g, t);
  tapaRedonda(g, lift, ang);
  golpe(g, k.tramo(t, golpeT, golpeT + 0.42));
  g.restore();
  sinVista(g);
  velo(g, 0.78);
}
