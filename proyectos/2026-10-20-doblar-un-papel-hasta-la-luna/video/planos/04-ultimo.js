// «Y lo más loco: el último doblez, él solo, hace más de la mitad del camino. Así que no es el papel: es duplicar.»
// El mismo sitio y la misma cámara que el plano de antes (sigue): la Tierra abajo, la Luna, la columna de 42 dobleces.
// - «Y lo más loco»: la columna se desdobla una vez: su mitad de arriba gira hacia la derecha y se queda colgando a su
//   lado. Con 41 dobleces, la punta se queda a medio camino, muy por debajo de la Luna.
// - «el último doblez»: esa mitad vuelve a girar por encima y cae sobre la columna: la punta pasa otra vez la Luna.
// - «hace más de la mitad del camino»: ese último tramo se enciende en naranja: «+220.000 km», más de lo que falta.
// - «Así que no es el papel»: los tramos de cada doblez se encienden de arriba abajo, cada uno la mitad del de encima,
//   cada vez más deprisa, hasta el suelo; «duplicar»: laten todos a la vez y se apagan antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mundo, alto, anchoColumna, camaraPara, yDe } from "../mundo.js";
import { XT, Y_FIN, SUELO_FIN } from "./03-subida.js";

export const desde = (vz) => vz.frase(9).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, entra } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const T0 = f9.inicio, Tloco = f9.t("loco"), Tultimo = f9.t("ultimo"), Tsolo = f9.t("solo"), Thace = f9.t("hace"), Tmitad = f9.t("mitad");
const Tasi = f10.inicio, Tdup = f10.t("duplicar"), Tcorte = v.frase(11).inicio;
const H42 = alto(42), H41 = alto(41);
const cam0 = camaraPara(H42, SUELO_FIN, Y_FIN), cam = cam0;
// el giro de la mitad de arriba: 0 encima de la columna, π colgando a su lado
const DES = [T0 + 0.05, Tloco + 0.45], DOB = [Tultimo - 0.1, Tsolo - 0.1];
const giro = (t) => Math.PI * (su(tr(t, DES[0], DES[1])) - su(tr(t, DOB[0], DOB[1])));
export const golpe = DOB[1];

// los tramos de cada doblez, de arriba abajo: el j es el que puso el doblez 42 − j (la mitad del de encima)
// Se encienden uno detrás de otro y la cámara entra con ellos hacia el suelo, el doble de cerca con cada uno: cada
// tramo nuevo se ve igual de grande que el anterior, aunque sea la mitad.
const BANDAS = Array.from({ length: 16 }, (_, j) => ({ h0: H42 / Math.pow(2, j + 1), h1: H42 / Math.pow(2, j), j, color: j % 2 ? "70,200,255" : "255,140,40" }));
const zoom = (t) => 13 * su(tr(t, Tasi + 0.05, Tdup + 0.3));

// La mitad que gira: un trozo de columna de L px desde su eje (px, py), girado `ang` (con 0, hacia arriba y a la
// izquierda del eje, encima de la columna; con π, colgando a la derecha).
function mitad(g, px, py, L, w, ang, naranja) {
  g.save(); g.translate(px, py); g.rotate(ang);
  // su luz
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createLinearGradient(-w * 3, 0, w * 2, 0);
  hg.addColorStop(0, "rgba(255,236,200,0)"); hg.addColorStop(0.5, "rgba(255,236,200,0.28)"); hg.addColorStop(1, "rgba(255,236,200,0)");
  g.fillStyle = hg; g.fillRect(-w * 3, -L, w * 5, L); g.restore();
  const pg = g.createLinearGradient(-w, 0, 0, 0);
  pg.addColorStop(0, "#fffdf6"); pg.addColorStop(0.5, "#f6f0e2"); pg.addColorStop(1, "#c4c4cf");
  g.fillStyle = pg; g.fillRect(-w, -L, w, L);
  if (naranja > 0.01) { g.globalCompositeOperation = "lighter"; g.globalAlpha = naranja; g.fillStyle = "rgba(255,170,70,0.9)"; g.fillRect(-w, -L, w, L); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; }
  g.restore();
  // la punta brilla
  const tip = [px + Math.sin(ang) * L - Math.cos(ang) * w / 2, py - Math.cos(ang) * L - Math.sin(ang) * w / 2];
  k.brillo(g, tip[0], tip[1], w * 6, "255,244,220", 0.7);
}

export function dibuja(g, t) {
  const cam = { s: cam0.s * Math.pow(2, zoom(t)), y0: cam0.y0 };
  const ang = giro(t), w = anchoColumna(cam), suelta = ang > 0.001;
  // el último tramo en naranja, desde «hace»; y los tramos de todos los dobleces, en «Así que no es el papel»
  const naranja = 0.9 * tr(t, Thace - 0.1, Tmitad) * (1 - tr(t, Tasi, Tasi + 0.3));
  const fin = 1 - su(tr(t, Tdup + 0.35, Tcorte - 0.3));
  const late = k.pulso(t, Tdup + 0.12, 0.2);
  const tramos = suelta ? [] : [
    { h0: H41, h1: H42, color: "255,140,40", al: naranja },
    ...BANDAS.map((b) => ({ ...b, al: (0.75 * tr(zoom(t), b.j - 0.6, b.j - 0.2) + 0.25 * late) * fin })),
  ];
  const { L } = mundo(g, t, cam, XT, suelta ? H41 : H42, w, { tramos });
  if (suelta) mitad(g, XT + w / 2, yDe(cam, H41), (H42 - H41) * cam.s, w, ang, 0);
  // con 41 dobleces: hasta dónde llega
  const al41 = tr(Math.min(t, DOB[0] + 0.2), DES[1] - 0.25, DES[1]) * (1 - tr(t, DOB[0], DOB[0] + 0.2));
  if (al41 > 0.01) k.etiqueta(g, XT + 40, yDe(cam, H41) - 30, "41: 220.000 km", "255,236,170", al41, 46);
  // «+220.000 km», junto al último tramo
  const alM = tr(t, Tmitad - 0.15, Tmitad + 0.1) * (1 - tr(t, Tasi, Tasi + 0.3));
  if (alM > 0.01) k.pastilla(g, 750, (yDe(cam, H41) + yDe(cam, H42)) / 2 + 150, "+220.000", "km", "255,170,80", alM, 96);
  // la Luna late cuando la punta vuelve a pasarla
  const lu = k.pulso(t, DOB[1] - 0.15, 0.25);
  if (lu > 0.02) k.brillo(g, L.x, L.y, L.r * 4, "255,244,220", 0.5 * lu);
  // lo que venía del plano de antes se va: la cifra grande y la distancia de la Luna
  const va = 1 - tr(t, T0, T0 + 0.3);
  if (va > 0.01) {
    k.pastilla(g, 770, 1090, "440.000", "km", "255,236,170", va, 120);
    k.etiqueta(g, L.x - 150, L.y + L.r + 20, "Luna: 384.400 km", "235,235,245", va, 46);
  }
  // el contador
  const N = ang > Math.PI / 2 ? 41 : 42;
  k.pastilla(g, 250, 1300, String(N), "dobleces", "255,236,170", 1, 96);
  void f8; void entra; void mez;
}
