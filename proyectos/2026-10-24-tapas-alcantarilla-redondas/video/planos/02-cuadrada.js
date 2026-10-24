// «Una cuadrada, de canto, puede colarse por la diagonal.»
// La losa está de pie. Gira hasta la diagonal, sobra sitio y se cae.
// Luego la diagonal se queda encendida, más larga que el lado.
import * as k from "#kit";
import { v } from "#voz";
import { asfalto, camara, huecoCuadrado, losa, lucesCuadrado, marcoCuadrado, sinVista, velo, vista } from "../mundo.js";

export const desde = "cuadrada";

const f2 = v.frase(2), f3 = v.frase(3);
const Tcanto = f2.t("canto");
const Tdiag = f2.t("diagonal");
const Tlarga = f3.t("larga");
const fin = v.t("redonda") - 0.04;

const cam = camara([
  [f2.inicio - 0.2, 1.02, 0, 30],
  [Tdiag, 1.18, 0, -10],
  [Tlarga, 0.98, 0, 70],
  [fin - 0.35, 0.96, 0, 80],
  [fin, 0.96, 0, 80],
]);

const yaw = k.claves([
  [f2.inicio - 0.3, 0.04],
  [Tcanto, 0.12],
  [Tdiag, Math.PI / 4],
  [fin, Math.PI / 4],
]);

const hundir = k.claves([
  [Tdiag - 0.05, 0],
  [Tdiag + 0.12, 0],
  [Tlarga - 0.35, 1],
  [fin, 1],
]);

export function dibuja(g, t) {
  const c = cam(Math.min(t, fin));
  const ang = yaw(t);
  const h = hundir(t);
  const diag = k.suave(k.tramo(t, Tcanto, Tdiag + 0.1));
  const lado = k.suave(k.tramo(t, f3.inicio, Tlarga));
  const aviso = (1 - k.suave(k.tramo(t, Tcanto, Tdiag))) * (1 - h);
  g.save();
  vista(g, c.z, c.x, c.y);
  asfalto(g, t);
  huecoCuadrado(g);
  if (h < 0.06) {
    marcoCuadrado(g);
    losa(g, ang, h, aviso);
  } else {
    losa(g, ang, h, 0);
    marcoCuadrado(g);
  }
  lucesCuadrado(g, { diag, lado });
  g.restore();
  sinVista(g);
  velo(g, 0.75);
}
