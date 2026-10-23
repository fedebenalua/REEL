// La puerta del súper, desde el fotograma 0 hasta la sirena.
// 0: ya vas lanzado y las hojas se abren. «cara»: la cara, grande. «quieto»: se paran y se cierran.
// «microondas»: la cajita suelta anillos. «igual»: el rebote vuelve igual. «agudo»: se aprieta. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { puerta, viaje } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Tabren = f1.t("abren"), Tacerca = f1.t("acercas");
const Tcara = f2.t("cara"), Tquieto = f2.t("quieto"), Tenteran = f2.finDe("enteran");
const Tmicro = f3.t("microondas");
const Tigual = f4.t("igual");
const Tcaminas = f5.t("caminas"), Tagudo = f5.t("agudo");
const Tsiena = v.t("sirena");

const pos = viaje([
  [-0.25, [0.2, 1.2, 3.8]],
  [0, [0.1, 1.28, 2.75]],
  [1.05, [0, 1.4, 1.62]],
  [Tabren, [0, 1.42, 1.5]],
  [Tacerca, [0, 1.42, 1.55]],
  [Tcara, [0.06, 1.55, 2.35]],
  [Tquieto, [0.06, 1.55, 2.35]],
  [Tenteran - 0.2, [0.45, 1.4, 3.15]],
  [Tmicro - 0.05, [0, 2.35, 1.55]],
  [Tmicro + 0.85, [0, 2.48, 1.15]],
  [Tigual, [0.3, 1.65, 2.55]],
  [Tcaminas, [0.3, 1.65, 2.55]],
  [Tagudo, [0.4, 1.48, 1.95]],
  [Tsiena - 0.25, [0.4, 1.48, 1.95]],
]);
const mira = viaje([
  [-0.35, [0, 1.45, 0]],
  [Tacerca, [0, 1.5, 0]],
  [Tcara, [0.12, 1.62, 1.55]],
  [Tquieto, [0.12, 1.62, 1.55]],
  [Tenteran - 0.2, [0.1, 1.4, 0.2]],
  [Tmicro + 0.5, [0, 2.72, 0.4]],
  [Tigual, [0.12, 1.55, 0.7]],
  [Tagudo, [0.15, 1.4, 0.55]],
  [Tsiena - 0.25, [0.15, 1.4, 0.55]],
]);
const cam = (t) => k.mira(pos(t), mira(t));

const abertura = k.claves([
  [0, 0.18],
  [0.85, 0.9],
  [Tabren + 0.1, 1],
  [Tquieto, 1],
  [Tenteran - 0.25, 0],
  [Tsiena, 0],
]);

const zPersona = k.claves([
  [0, 1.7],
  [Tacerca, 1.62],
  [Tcaminas, 1.62],
  [Tagudo, 1.05],
  [Tsiena, 1.05],
]);
const xPersona = k.claves([
  [0, 1.15],
  [Tacerca, 0.1],
  [Tsiena, 0.1],
]);

const ondasAl = k.claves([
  [0, 0],
  [Tmicro - 0.05, 0],
  [Tmicro + 0.35, 1],
  [Tsiena, 1],
]);

const apriete = k.claves([
  [0, 0],
  [Tcaminas, 0],
  [Tagudo, 1],
  [Tsiena, 1],
]);

export function dibuja(g, t) {
  const anda = t >= Tcaminas && t < Tagudo + 0.15;
  const faseOnda = Math.min(t, Tsiena - 0.28) * 1.15;
  puerta(g, cam(t), {
    abertura: abertura(t),
    ondas: ondasAl(t),
    apriete: apriete(t),
    fase: faseOnda,
    ir: 0,
    spin: null,
    gente: [{
      x: xPersona(t),
      z: zPersona(t),
      pose: anda || t < Tacerca ? "anda" : "quieto",
      fase: (anda || t < Tacerca) ? t * 8 : 0.4,
      chaqueta: "#ff4d3a",
    }],
  });
}
