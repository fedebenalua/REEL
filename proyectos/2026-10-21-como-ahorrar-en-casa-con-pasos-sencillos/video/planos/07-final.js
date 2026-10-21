// «Envíaselo a ese amigo que pone la lavadora a noventa grados.»
// Vuelta al lavadero. Corte en «Envíaselo». La lavadora en frío, con el agua azul; «noventa»: la rueda gira a 90°, el
// agua se pone al rojo y hierve, y la cámara se acerca a la puerta hasta quedar como en el fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, lavadora, lavadero, vapor, velo, vineta, PUERTA } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio;

const { suave: su, tramo: tr } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tlav = f8.t("lavadora"), Tnov = f8.t("noventa"), Fin = v.duracion;
const cam = camino2D([[T0, [0.85, 0, 40]], [Tlav, [0.95, 120, -150]], [Tnov + 0.3, [1.4, 180, -300]], [Fin, [2.3, 0, 110]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  g.fillStyle = "#101018"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  const c = su(tr(t, Tnov - 0.1, Tnov + 0.6));
  lavadero(g, t, k.mezRgb("150,200,255", "255,170,120", c));
  lavadora(g, t, { calor: c * 1, giro: t * 2.4, vaho: 0.35 * c, rueda: su(tr(t, Tnov - 0.2, Tnov + 0.25)), hierve: c, temblor: 0.15 * c });
  vapor(g, t, PUERTA[0], PUERTA[1] - 260, 520, c, { alto: 900, sem: 4, n: 26, tam: 1.3 });
  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.5);
}
